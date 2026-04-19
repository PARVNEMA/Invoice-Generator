import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Empty, Popconfirm, Space, Spin, Statistic, Table, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PageHeader } from '../../../shared/ui/PageHeader';
import { SurfaceCard } from '../../../shared/ui/SurfaceCard';
import { formatCurrency, formatDateTime } from '../../../shared/lib/format';
import { invoicesApi } from '../api/invoicesApi';
import type { InvoiceListItem } from '../types';

const { Text } = Typography;

const triggerPdfDownload = (invoiceId: string, invoiceNumber: string) => {
  const link = document.createElement('a');
  link.href = invoicesApi.getPdfDownloadUrl(invoiceId);
  link.download = `${invoiceNumber}.pdf`;
  link.rel = 'noopener';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export function InvoiceHistoryPage() {
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    let active = true;

    const loadInvoices = async () => {
      try {
        const data = await invoicesApi.getAll();
        if (active) {
          setInvoices(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to load invoices');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadInvoices();

    return () => {
      active = false;
    };
  }, []);

  const totalRevenue = useMemo(
    () => invoices.reduce((sum, invoice) => sum + invoice.grandTotal, 0),
    [invoices],
  );

  const columns: ColumnsType<InvoiceListItem> = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      render: (value: string) => <Text strong>{value}</Text>,
    },
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      render: (value: string) => formatDateTime(value),
    },
    {
      title: 'Grand Total',
      dataIndex: 'grandTotal',
      key: 'grandTotal',
      align: 'right',
      render: (value: number) => <Text strong>{formatCurrency(value)}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 220,
      render: (_, record) => (
        <Space>
          <Button onClick={() => triggerPdfDownload(record._id, record.invoiceNumber)}>
            Download PDF
          </Button>
          <Popconfirm
            title="Delete this invoice?"
            description="This action cannot be undone."
            okText="Delete"
            okButtonProps={{ danger: true, loading: deletingId === record._id }}
            onConfirm={async () => {
              setDeletingId(record._id);
              try {
                await invoicesApi.remove(record._id);
                setInvoices((prev) => prev.filter((invoice) => invoice._id !== record._id));
                messageApi.success('Invoice deleted successfully');
              } catch (err) {
                messageApi.error(
                  err instanceof Error ? err.message : 'Failed to delete invoice',
                );
              } finally {
                setDeletingId(null);
              }
            }}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
		<>
			{contextHolder}
			<PageHeader
				title="Invoice History"
				description="Track all generated invoices with quick PDF download and cleanup actions."
			/>

			<div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
				<SurfaceCard>
					<Statistic
						title="Total Invoices"
						value={invoices.length}
					/>
				</SurfaceCard>
				<SurfaceCard>
					<Statistic
						title="Total Revenue"
						value={formatCurrency(totalRevenue)}
					/>
				</SurfaceCard>
			</div>

			<SurfaceCard title="Generated Invoices">
				{loading ? (
					<div className="flex min-h-64 items-center justify-center">
						<Spin size="large" />
					</div>
				) : error ? (
					<Alert
						type="error"
						message="Unable to load invoices"
						description={error}
						showIcon
					/>
				) : invoices.length === 0 ? (
					<div className="py-14">
						<Empty description="No invoices generated yet." />
					</div>
				) : (
					<Table
						rowKey="_id"
						dataSource={invoices}
						columns={columns}
						pagination={{
							pageSize: 8,
							showSizeChanger: false,
						}}
						scroll={{ x: 880 }}
					/>
				)}
			</SurfaceCard>
		</>
	);
}
