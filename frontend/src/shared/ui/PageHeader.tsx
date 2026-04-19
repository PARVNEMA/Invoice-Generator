import { Button, Typography } from 'antd';
import type { ReactNode } from 'react';

const { Title, Paragraph } = Typography;

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  actionIcon?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  onActionClick,
  actionIcon,
}: PageHeaderProps) {
  return (
    <div className="panel-surface mb-5 rounded-2xl p-5 lg:p-7">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              {eyebrow}
            </p>
          ) : null}
          <Title level={2} className="!mb-2 !mt-0 !text-slate-900">
            {title}
          </Title>
          {description ? (
            <Paragraph className="!mb-0 !text-slate-600">{description}</Paragraph>
          ) : null}
        </div>

        {actionLabel ? (
          <Button
            type="primary"
            size="large"
            onClick={onActionClick}
            icon={actionIcon}
            className="!h-11 !px-5 !font-semibold"
          >
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
