import { Descriptions, Typography } from 'antd';
import type { InvoiceTotals } from '../lib/calculations';
import { formatCurrency } from '../../../shared/lib/format';

const { Title } = Typography;

type InvoiceSummaryCardProps = {
  totals: InvoiceTotals;
};

export function InvoiceSummaryCard({ totals }: InvoiceSummaryCardProps) {
  return (
    <div className="panel-surface rounded-2xl p-5 lg:p-6">
      <Title level={4} className="!mb-4 !mt-0">
        Live Invoice Summary
      </Title>
      <Descriptions column={1} size="small">
        <Descriptions.Item label="Subtotal">
          {formatCurrency(totals.subtotal)}
        </Descriptions.Item>
        <Descriptions.Item label="Total Discount">
          {formatCurrency(totals.totalDiscount)}
        </Descriptions.Item>
        <Descriptions.Item label="Total GST">
          {formatCurrency(totals.totalGST)}
        </Descriptions.Item>
        <Descriptions.Item label={<span className="font-semibold">Grand Total</span>}>
          <span className="text-lg font-bold text-slate-900">
            {formatCurrency(totals.grandTotal)}
          </span>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
