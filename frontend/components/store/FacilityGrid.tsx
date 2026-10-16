import Icon from '@/components/Icons';
import OpenBadge from '@/components/store/OpenBadge';
import { formatHours } from '@/lib/openStatus';
import { FACILITIES } from '@/lib/storeInfo';

export default function FacilityGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
      {FACILITIES.map((f) => (
        <li key={f.key} className="flex flex-col rounded-[18px] bg-white p-6 transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-canvas-gray text-ink">
            <Icon name={f.icon} className="h-7 w-7" />
          </span>
          <h3 className="mt-4 text-[19px] font-semibold text-ink">{f.name}</h3>
          <p className="mt-1.5 flex-1 text-[14px] leading-[1.5] text-ink-secondary">{f.desc}</p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-3">
            <span className="text-[12px] text-ink-secondary">
              {f.hours === 'store' ? '店舗の営業時間' : formatHours(f.hours)}
            </span>
            <OpenBadge facility={f.key} size="sm" />
          </div>
        </li>
      ))}
    </ul>
  );
}
