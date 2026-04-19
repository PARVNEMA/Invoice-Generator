import { Button, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { formatCurrency, formatDateTime } from '../../../shared/lib/format';
import type { Item } from '../types';

const { Text } = Typography;

type ItemsTableProps = {
  data: Item[];
  loading?: boolean;
  deletingId?: string | null;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => Promise<void>;
};

const getColumns = ({
  deletingId,
  onEdit,
  onDelete,
}: Omit<ItemsTableProps, 'data' | 'loading'>): ColumnsType<Item> => [
  {
    title: 'Item',
    dataIndex: 'name',
    key: 'name',
    render: (_, record) => (
      <div className="space-y-1">
        <Text strong className="!text-slate-900">
          {record.name}
        </Text>
        <div className="text-xs text-slate-500">
          {record.description || 'No description'}
        </div>
      </div>
    ),
  },
  {
    title: 'Variants',
    key: 'variants',
    render: (_, record) => (
      <Space size={[6, 6]} wrap>
        {record.variants?.length ? (
          record.variants.map((variant, index) => (
            <Tag key={`${variant.name}-${variant.value}-${index}`} color="blue">
              {variant.name}: {variant.value}
            </Tag>
          ))
        ) : (
          <Text type="secondary">No variants</Text>
        )}
      </Space>
    ),
  },
  {
    title: 'Base Price',
    dataIndex: 'basePrice',
    key: 'basePrice',
    align: 'right',
    render: (value: number) => (
      <Text strong className="!text-slate-800">
        {formatCurrency(value)}
      </Text>
    ),
  },
  {
    title: 'Updated',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
    render: (value: string) => <Text className="text-slate-600">{formatDateTime(value)}</Text>,
  },
  {
    title: 'Actions',
    key: 'actions',
    width: 170,
    render: (_, record) => (
      <Space>
        <Button onClick={() => onEdit(record)}>Edit</Button>
        <Popconfirm
          title="Delete this item?"
          description="This action cannot be undone."
          okText="Delete"
          okButtonProps={{ danger: true, loading: deletingId === record._id }}
          onConfirm={() => onDelete(record._id)}
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      </Space>
    ),
  },
];

export function ItemsTable({
  data,
  loading,
  deletingId,
  onEdit,
  onDelete,
}: ItemsTableProps) {
  return (
    <Table
      rowKey="_id"
      dataSource={data}
      loading={loading}
      columns={getColumns({ deletingId, onEdit, onDelete })}
      pagination={{ pageSize: 8, showSizeChanger: false }}
      scroll={{ x: 920 }}
    />
  );
}
