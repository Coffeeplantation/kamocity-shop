'use client';

import { useEffect, useState } from 'react';
import { KAMO } from '@/lib/kamo';

// 加茂市の天気（Open-Meteo：無料・API キー不要）。取得できないときは null のまま
export type KamoWeather = {
  temp: number;
  code: number;
  snowDepthCm: number;
  days: { date: string; code: number; max: number; min: number; rain: number }[];
};

const URL =
  `https://api.open-meteo.com/v1/forecast?latitude=${KAMO.lat}&longitude=${KAMO.lon}` +
  '&current=temperature_2m,weather_code,snow_depth' +
  '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
  '&timezone=Asia%2FTokyo&forecast_days=3';

// WMO 天気コード → 日本語
export function weatherLabel(code: number) {
  if (code === 0) return '快晴';
  if (code <= 2) return '晴れ';
  if (code === 3) return 'くもり';
  if (code <= 48) return '霧';
  if (code <= 57) return '霧雨';
  if (code <= 67) return '雨';
  if (code <= 77) return '雪';
  if (code <= 82) return 'にわか雨';
  if (code <= 86) return 'にわか雪';
  return '雷雨';
}

export function weatherIcon(code: number) {
  if (code <= 1) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67 || (code >= 80 && code <= 82)) return '☔';
  if (code <= 77 || code === 85 || code === 86) return '❄️';
  return '⛈️';
}

export function useKamoWeather() {
  const [data, setData] = useState<KamoWeather | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(URL)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j) => {
        if (!alive) return;
        setData({
          temp: j.current.temperature_2m,
          code: j.current.weather_code,
          snowDepthCm: Math.round((j.current.snow_depth ?? 0) * 100),
          days: j.daily.time.map((date: string, i: number) => ({
            date,
            code: j.daily.weather_code[i],
            max: j.daily.temperature_2m_max[i],
            min: j.daily.temperature_2m_min[i],
            rain: j.daily.precipitation_probability_max[i],
          })),
        });
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  return { data, failed };
}
