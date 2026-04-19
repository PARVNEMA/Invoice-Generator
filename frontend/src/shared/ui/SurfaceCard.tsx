import { Card } from 'antd';
import type { PropsWithChildren, ReactNode } from 'react';

type SurfaceCardProps = PropsWithChildren<{
  title?: ReactNode;
  extra?: ReactNode;
  className?: string;
}>;

export function SurfaceCard({ title, extra, className, children }: SurfaceCardProps) {
  return (
    <Card
      title={title}
      extra={extra}
      className={`panel-surface rounded-2xl border-0 shadow-none ${className || ''}`}
      styles={{ body: { padding: '1rem' } }}
    >
      {children}
    </Card>
  );
}
