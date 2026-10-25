'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

// 加茂駅の東口から、穀町商店街を通って加茂山公園までを 1 枚に収めた地図（OpenStreetMap）。
// 位置は OpenStreetMap のデータ（2026 年 10 月時点）による。道の駅は架空の施設なので地図には載せない。
const PLACES = [
  { name: '加茂駅 東口', lat: 37.65895, lon: 139.04975, color: '#1d1d1f' },
  { name: '穀町商店街', lat: 37.6595, lon: 139.0525, color: '#e8590c' },
  { name: '青海神社', lat: 37.65664, lon: 139.05383, color: '#d7432f' },
  { name: '加茂山公園', lat: 37.65576, lon: 139.05399, color: '#1a7f37' },
];

const pin = (name: string, color: string) =>
  `<span style="display:inline-flex;align-items:center;gap:6px;transform:translate(-8px,-50%);white-space:nowrap;border-radius:999px;background:#fff;padding:3px 10px 3px 6px;font:600 13px/1.4 system-ui,sans-serif;color:#1d1d1f;box-shadow:0 2px 8px rgba(0,0,0,.25)"><span style="width:10px;height:10px;border-radius:999px;background:${color}"></span>${name}</span>`;

export default function KamoMap() {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import('leaflet').Map | undefined;
    let cancelled = false;
    // Leaflet は window を使うので、ブラウザで読み込んでから地図を作る
    import('leaflet').then((L) => {
      if (cancelled || !box.current) return;
      map = L.map(box.current, { scrollWheelZoom: false, attributionControl: true });
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      }).addTo(map);
      for (const p of PLACES) {
        L.marker([p.lat, p.lon], { icon: L.divIcon({ className: '', html: pin(p.name, p.color), iconSize: [0, 0] }), title: p.name, keyboard: false }).addTo(map);
      }
      map.fitBounds(L.latLngBounds(PLACES.map((p) => [p.lat, p.lon])), { padding: [48, 48] });
    });
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  return (
    <figure className="overflow-hidden rounded-card border border-line/[0.08] bg-surface">
      <div ref={box} className="h-[320px] w-full md:h-[400px]" role="img" aria-label="加茂駅の東口から穀町商店街、青海神社、加茂山公園までの地図" />
      <figcaption className="px-5 py-3 text-[12px] text-ink-secondary">
        加茂駅の東口から穀町商店街を抜けると、加茂山公園まで歩いて 10 分ほど。道の駅（架空）は地図に載っていません。
      </figcaption>
    </figure>
  );
}
