import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  Skeleton,
  Space,
  Statistic,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../shared/ui/PageHeader';
import { SurfaceCard } from '../../../shared/ui/SurfaceCard';
import { formatCurrency, formatDateTime } from '../../../shared/lib/format';
import { itemsApi } from '../../items/api/itemsApi';
import type { Item } from '../../items/types';
import { invoicesApi } from '../api/invoicesApi';
import { InvoiceSummaryCard } from '../components/InvoiceSummaryCard';
import { LineItemsEditor } from '../components/LineItemsEditor';
import { calculateInvoiceTotals } from '../lib/calculations';
import { createEmptyLineItem } from '../lib/lineItemFactory';
import type {
  CreateInvoicePayload,
  CreatedInvoice,
  InvoiceFormValues,
  InvoiceLineItemPayload,
} from '../types';

const createDraftInvoiceNumber = () => {
  const dateChunk = dayjs().format('YYYYMMDD');
  const randomChunk = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DRAFT-${dateChunk}-${randomChunk}`;
};

const initialValues: InvoiceFormValues = {
  customerName: '',
  phone: '',
  email: '',
  billingAddress: '',
  lineItems: [createEmptyLineItem()],
};

export function NewInvoicePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm<InvoiceFormValues>();
  const watchedLineItems = Form.useWatch('lineItems', form);
  const lineItems = useMemo(() => watchedLineItems ?? [], [watchedLineItems]);

  const [items, setItems] = useState<Item[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [draftInvoiceNumber, setDraftInvoiceNumber] = useState(createDraftInvoiceNumber);
  const [lastCreatedInvoice, setLastCreatedInvoice] = useState<CreatedInvoice | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const totals = useMemo(() => calculateInvoiceTotals(lineItems), [lineItems]);
  const today = useMemo(() => dayjs(), []);

  useEffect(() => {
    const loadItems = async () => {
      setItemsLoading(true);
      setItemsError(null);
      try {
        const data = await itemsApi.getAll();
        setItems(data);
      } catch (error) {
        setItemsError(error instanceof Error ? error.message : 'Failed to load items');
      } finally {
        setItemsLoading(false);
      }
    };

    void loadItems();
  }, []);

  const toPayload = (values: InvoiceFormValues): CreateInvoicePayload => {
    const lineItemsPayload: InvoiceLineItemPayload[] = values.lineItems.map((line) => ({
      itemId: line.selectedItemId,
      itemName: line.itemName.trim(),
      variantDescription: line.variantDescription?.trim() || '',
      basePrice: Number(line.basePrice) || 0,
      quantity: Number(line.quantity) || 1,
      gstPercent: line.gstPercent,
      discountType: line.discountType,
      discountValue: Number(line.discountValue) || 0,
    }));

    return {
      customerName: values.customerName.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      billingAddress: values.billingAddress.trim(),
      lineItems: lineItemsPayload,
    };
  };

  const handleSaveInvoice = async () => {
    try {
      const values = await form.validateFields();
      if (!values.lineItems?.length) {
        messageApi.error('Please add at least one line item.');
        return;
      }

      setSaveLoading(true);
      const createdInvoice = await invoicesApi.create(toPayload(values));
      setLastCreatedInvoice(createdInvoice);
      messageApi.success(`Invoice ${createdInvoice.invoiceNumber} created successfully.`);
      form.resetFields();
      form.setFieldValue('lineItems', [createEmptyLineItem()]);
      setDraftInvoiceNumber(createDraftInvoiceNumber());
    } catch (error) {
      if (error && typeof error === 'object' && 'errorFields' in error) return;
      messageApi.error(error instanceof Error ? error.message : 'Failed to create invoice');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDownloadLastInvoicePdf = () => {
    if (!lastCreatedInvoice) return;
    const link = document.createElement('a');
    link.href = invoicesApi.getPdfDownloadUrl(lastCreatedInvoice._id);
    link.download = `${lastCreatedInvoice.invoiceNumber}.pdf`;
    link.rel = 'noopener';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {contextHolder}

      <PageHeader
        eyebrow="Modules 2 & 3"
        title="New Invoice"
        description="Capture invoice metadata, customer details, and line items with live GST and discount calculations."
      />

      <Form form={form} layout="vertical" initialValues={initialValues}>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="space-y-5 xl:col-span-2">
            <SurfaceCard title="Invoice Metadata">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Statistic title="Draft Invoice Number" value={draftInvoiceNumber} />
                <Form.Item label="Current Date" className="!mb-0">
                  <DatePicker value={today} disabled className="!w-full" format="DD MMM YYYY" />
                </Form.Item>
              </div>
            </SurfaceCard>

            <SurfaceCard title="Customer Details">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Form.Item
                  label="Full name"
                  name="customerName"
                  rules={[{ required: true, message: 'Please enter full name' }]}
                  className="!mb-0"
                >
                  <Input size="large" placeholder="Customer full name" />
                </Form.Item>

                <Form.Item
                  label="Phone number"
                  name="phone"
                  rules={[{ required: true, message: 'Please enter phone number' }]}
                  className="!mb-0"
                >
                  <Input size="large" placeholder="+91-XXXXXXXXXX" />
                </Form.Item>

                <Form.Item
                  label="Email ID"
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Please enter a valid email' },
                  ]}
                  className="!mb-0"
                >
                  <Input size="large" placeholder="customer@example.com" />
                </Form.Item>

                <Form.Item
                  label="Billing address"
                  name="billingAddress"
                  rules={[{ required: true, message: 'Please enter billing address' }]}
                  className="!mb-0 md:col-span-2"
                >
                  <Input.TextArea
                    autoSize={{ minRows: 3, maxRows: 5 }}
                    placeholder="Full billing address"
                  />
                </Form.Item>
              </div>
            </SurfaceCard>

            <SurfaceCard title="Line Items">
              {itemsLoading ? (
                <Skeleton active paragraph={{ rows: 8 }} />
              ) : itemsError ? (
                <Alert
                  type="error"
                  message="Unable to load items"
                  description={itemsError}
                  showIcon
                />
              ) : (
                <Form.List name="lineItems">
                  {(fields, { add, remove }) => (
                    <LineItemsEditor
                      form={form}
                      fields={fields}
                      add={add}
                      remove={remove}
                      items={items}
                      lineItemsValues={lineItems}
                    />
                  )}
                </Form.List>
              )}
            </SurfaceCard>
          </div>

          <div className="space-y-5">
            <InvoiceSummaryCard totals={totals} />

            <div className="panel-surface rounded-2xl p-4">
              <Space direction="vertical" className="w-full">
                <Button
                  type="primary"
                  size="large"
                  className="!w-full !font-semibold"
                  loading={saveLoading}
                  onClick={() => void handleSaveInvoice()}
                  disabled={itemsLoading || Boolean(itemsError)}
                >
                  Save Invoice
                </Button>
                <Button
                  type={lastCreatedInvoice ? 'default' : 'dashed'}
                  size="large"
                  className="!w-full"
                  onClick={handleDownloadLastInvoicePdf}
                  disabled={!lastCreatedInvoice}
                >
                  Download Last Saved PDF
                </Button>
                <Button
                  size="large"
                  className="!w-full"
                  onClick={() => navigate('/invoices')}
                >
                  Go to Invoice History
                </Button>
                <Button
                  size="large"
                  className="!w-full"
                  onClick={() => {
                    form.resetFields();
                    form.setFieldValue('lineItems', [createEmptyLineItem()]);
                  }}
                >
                  Reset Form
                </Button>
              </Space>
            </div>

            {lastCreatedInvoice ? (
              <div className="panel-surface rounded-2xl p-4">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Last Saved Invoice
                </div>
                <div className="space-y-2 text-sm text-slate-700">
                  <div>
                    Number: <span className="font-semibold">{lastCreatedInvoice.invoiceNumber}</span>
                  </div>
                  <div>
                    Date: <span className="font-semibold">{formatDateTime(lastCreatedInvoice.invoiceDate)}</span>
                  </div>
                  <div>
                    Grand Total:{' '}
                    <span className="font-semibold">
                      {formatCurrency(lastCreatedInvoice.grandTotal)}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </Form>
    </>
  );
}
