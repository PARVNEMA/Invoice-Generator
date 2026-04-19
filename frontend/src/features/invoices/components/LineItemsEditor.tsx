import { Button, Card, Form, Input, InputNumber, Select, Space, Typography } from 'antd';
import type { FormListFieldData, FormInstance } from 'antd';
import type { Item } from '../../items/types';
import { calculateLineTotals } from '../lib/calculations';
import { createEmptyLineItem } from '../lib/lineItemFactory';
import type { InvoiceFormValues, InvoiceLineItemForm } from '../types';
import { formatCurrency } from '../../../shared/lib/format';

const { Text } = Typography;

type LineItemsEditorProps = {
  form: FormInstance<InvoiceFormValues>;
  fields: FormListFieldData[];
  add: (defaultValue?: InvoiceLineItemForm) => void;
  remove: (index: number | number[]) => void;
  items: Item[];
  lineItemsValues: InvoiceLineItemForm[];
};

const toVariantSummary = (item: Item) =>
  item.variants.length
    ? item.variants.map((variant) => `${variant.name}: ${variant.value}`).join(' | ')
    : '';

export function LineItemsEditor({
  form,
  fields,
  add,
  remove,
  items,
  lineItemsValues,
}: LineItemsEditorProps) {
  return (
    <div className="space-y-4">
      {fields.map((field, index) => {
        const line = lineItemsValues?.[field.name];
        const lineTotals = calculateLineTotals(line || createEmptyLineItem());

        return (
          <Card
            key={field.key}
            className="panel-surface !mb-5 !rounded-xl !border-0 shadow-none"
            styles={{ body: { padding: 14 } }}
            title={`Line Item ${index + 1}`}
            extra={
              <Button danger type="text" onClick={() => remove(field.name)}>
                Remove
              </Button>
            }
          >
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-12">
              <Form.Item
                label="Item"
                name={[field.name, 'selectedItemId']}
                className="xl:col-span-4 !mb-0"
              >
                <Select
                  showSearch
                  placeholder="Select an item"
                  optionFilterProp="label"
                  options={items.map((item) => ({
                    value: item._id,
                    label: `${item.name} (${formatCurrency(item.basePrice)})`,
                  }))}
                  onChange={(selectedId) => {
                    const selectedItem = items.find((item) => item._id === selectedId);
                    if (!selectedItem) return;

                    const currentLines = form.getFieldValue('lineItems') || [];
                    currentLines[field.name] = {
                      ...currentLines[field.name],
                      selectedItemId: selectedItem._id,
                      itemName: selectedItem.name,
                      basePrice: selectedItem.basePrice,
                      variantDescription:
                        currentLines[field.name]?.variantDescription ||
                        toVariantSummary(selectedItem),
                    };
                    form.setFieldValue('lineItems', currentLines);
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Item name"
                name={[field.name, 'itemName']}
                rules={[{ required: true, message: 'Required' }]}
                className="xl:col-span-3 !mb-0"
              >
                <Input placeholder="Snapshot name" />
              </Form.Item>

              <Form.Item
                label="Variant details"
                name={[field.name, 'variantDescription']}
                className="xl:col-span-5 !mb-0"
              >
                <Input placeholder="Size: Large | Color: Blue" />
              </Form.Item>

              <Form.Item
                label="Base price"
                name={[field.name, 'basePrice']}
                rules={[
                  { required: true, message: 'Required' },
                  { type: 'number', min: 0, message: 'Must be >= 0' },
                ]}
                className="xl:col-span-2 !mb-0"
              >
                <InputNumber
                  min={0}
                  precision={2}
                  className="!w-full"
                  addonBefore="INR"
                />
              </Form.Item>

              <Form.Item
                label="Quantity"
                name={[field.name, 'quantity']}
                rules={[
                  { required: true, message: 'Required' },
                  { type: 'number', min: 1, message: 'Min 1' },
                ]}
                className="xl:col-span-2 !mb-0"
              >
                <InputNumber min={1} className="!w-full" />
              </Form.Item>

              <Form.Item
                label="GST %"
                name={[field.name, 'gstPercent']}
                className="xl:col-span-2 !mb-0"
              >
                <Select
                  options={[
                    { value: 5, label: '5%' },
                    { value: 12, label: '12%' },
                    { value: 18, label: '18%' },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Discount type"
                name={[field.name, 'discountType']}
                className="xl:col-span-3 !mb-0"
              >
                <Select
                  options={[
                    { value: 'percent', label: 'Percent (%)' },
                    { value: 'absolute', label: 'Absolute (INR)' },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="Discount value"
                name={[field.name, 'discountValue']}
                className="xl:col-span-3 !mb-0"
                rules={[
                  { required: true, message: 'Required' },
                  { type: 'number', min: 0, message: 'Must be >= 0' },
                ]}
              >
                <InputNumber
                  min={0}
                  precision={2}
                  className="!w-full"
                  addonAfter={
                    line?.discountType === 'percent' || !line?.discountType ? '%' : 'INR'
                  }
                />
              </Form.Item>
            </div>

            <Space
              size={20}
              wrap
              className="mt-4 rounded-lg border border-slate-200/70 bg-white/65 px-3 py-2"
            >
              <Text type="secondary">
                Subtotal: <Text strong>{formatCurrency(lineTotals.subtotalBeforeDiscount)}</Text>
              </Text>
              <Text type="secondary">
                Discount: <Text strong>{formatCurrency(lineTotals.discountAmount)}</Text>
              </Text>
              <Text type="secondary">
                GST: <Text strong>{formatCurrency(lineTotals.gstAmount)}</Text>
              </Text>
              <Text>
                Row Total: <Text strong>{formatCurrency(lineTotals.rowTotal)}</Text>
              </Text>
            </Space>
          </Card>
        );
      })}

      <Button type="dashed" onClick={() => add(createEmptyLineItem())}>
        Add Line Item
      </Button>
    </div>
  );
}
