'use client';

import dynamic from 'next/dynamic';
import type { ComponentProps } from 'react';
import type Phone3DType from '@/components/Phone3D';
import { FINISHES } from '@/components/finishes';

const Phone3D = dynamic(() => import('@/components/Phone3D'), { ssr: false });

type Props = Omit<ComponentProps<typeof Phone3DType>, 'finish'> & { finish?: keyof typeof FINISHES };

// 3D は読み込み完了までサイズを確保した空枠を表示し、レイアウトのずれを防ぐ
export default function Phone3DLazy({ className = '', finish = 'natural', ...rest }: Props) {
  return (
    <div className={`relative ${className}`}>
      <Phone3D {...rest} finish={FINISHES[finish]} />
    </div>
  );
}
