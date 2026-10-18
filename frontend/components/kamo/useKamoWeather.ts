'use client';

import { useEffect, useState } from 'react';
import { fetchKamoWeather, type KamoWeather } from '@/lib/kamoWeather';

export { weatherIcon, weatherLabel, type KamoWeather } from '@/lib/kamoWeather';

// 同じページの複数の部品から呼ばれても、取得は 1 回にまとめる（10 分間は使い回す）
let cache: { at: number; promise: Promise<KamoWeather> } | null = null;

function loadWeather(): Promise<KamoWeather> {
  if (cache && Date.now() - cache.at < 10 * 60_000) return cache.promise;
  const promise = fetchKamoWeather();
  cache = { at: Date.now(), promise };
  promise.catch(() => {
    cache = null; // 失敗したら次回は取り直す
  });
  return promise;
}

export function useKamoWeather() {
  const [data, setData] = useState<KamoWeather | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    loadWeather()
      .then((d) => alive && setData(d))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, []);

  return { data, failed };
}
