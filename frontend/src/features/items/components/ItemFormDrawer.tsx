import { Button, Drawer, Form, Input, InputNumber, Space } from 'antd';
import type { Item, ItemFormValues } from '../types';

type ItemFormDrawerProps = {
  open: boolean;
  mode: 'create' | 'edit';
  loading?: boolean;
  item?: Item | null;
  onClose: () => void;
  onSubmit: (values: ItemFormValues) => Promise<void>;
};

const toFormValues = (item?: Item | null): ItemFormValues => ({
  name: item?.name ?? '',
  description: item?.description ?? '',
  basePrice: item?.basePrice ?? 0,
  variants: item?.variants?.length ? item.variants : [{ name: '', value: '' }],
});

export function ItemFormDrawer({
  open,
  mode,
  loading,
  item,
  onClose,
  onSubmit,
}: ItemFormDrawerProps) {
  const [form] = Form.useForm<ItemFormValues>();

  return (
		<Drawer
			title={mode === "create" ? "Add item" : "Edit item"}
			open={open}
			size={560}
			onClose={onClose}
			destroyOnHidden
			afterOpenChange={(isOpen) => {
				if (!isOpen) {
					form.resetFields();
					return;
				}

				form.setFieldsValue(toFormValues(item));
			}}
			extra={
				<Space>
					<Button onClick={onClose}>Cancel</Button>
					<Button
						type="primary"
						loading={loading}
						onClick={() => form.submit()}
						className="!font-semibold"
					>
						{mode === "create"
							? "Create item"
							: "Save changes"}
					</Button>
				</Space>
			}
		>
			<Form
				form={form}
				layout="vertical"
				initialValues={toFormValues(item)}
				onFinish={(values) =>
					onSubmit({
						...values,
						variants: values.variants.filter(
							(variant) =>
								variant.name.trim() && variant.value.trim(),
						),
					})
				}
			>
				<Form.Item
					label="Item name"
					name="name"
					rules={[
						{
							required: true,
							message: "Please enter the item name",
						},
					]}
				>
					<Input
						placeholder="e.g. Brown Jeera Rice"
						size="large"
					/>
				</Form.Item>

				<Form.Item label="Description" name="description">
					<Input.TextArea
						placeholder="Short description of the item"
						autoSize={{ minRows: 3, maxRows: 5 }}
					/>
				</Form.Item>

				<Form.Item
					label="Base price"
					name="basePrice"
					rules={[
						{
							required: true,
							message: "Please enter the base price",
						},
						{
							type: "number",
							min: 0,
							message: "Base price cannot be negative",
						},
					]}
				>
					<InputNumber
						size="large"
						className="w-full!"
						min={0}
						precision={2}
						placeholder="0.00"
						addonBefore="INR"
						datatype="number"
						type="number"
					/>
				</Form.Item>

				<div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
					<div className="mb-3 text-sm font-semibold text-slate-700">
						Variants
					</div>

					<Form.List name="variants">
						{(fields, { add, remove }) => (
							<Space
								direction="vertical"
								size="middle"
								className="w-full"
							>
								{fields.map(
									({ key, name, ...restField }, index) => (
										<div
											key={key}
											className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 lg:flex-row"
										>
											<Form.Item
												{...restField}
												name={[name, "name"]}
												className="!mb-0 !flex-1"
												rules={[
													{
														validator: (_, value) => {
															const valueField =
																form.getFieldValue([
																	"variants",
																	index,
																	"value",
																]);
															if (!valueField && !value)
																return Promise.resolve();
															if (value)
																return Promise.resolve();
															return Promise.reject(
																new Error(
																	"Variant name is required when value is set",
																),
															);
														},
													},
												]}
											>
												<Input placeholder="Type (Size, Color, Weight)" />
											</Form.Item>

											<Form.Item
												{...restField}
												name={[name, "value"]}
												className="!mb-0 !flex-1"
												rules={[
													{
														validator: (_, value) => {
															const nameField =
																form.getFieldValue([
																	"variants",
																	index,
																	"name",
																]);
															if (!nameField && !value)
																return Promise.resolve();
															if (value)
																return Promise.resolve();
															return Promise.reject(
																new Error(
																	"Variant value is required when name is set",
																),
															);
														},
													},
												]}
											>
												<Input placeholder="Value (Large, Red, 200g)" />
											</Form.Item>

											<Button
												danger
												type="text"
												onClick={() => remove(name)}
												className="!px-0 lg:!px-3"
											>
												Remove
											</Button>
										</div>
									),
								)}

								<Button
									type="dashed"
									onClick={() =>
										add({ name: "", value: "" })
									}
								>
									Add variant
								</Button>
							</Space>
						)}
					</Form.List>
				</div>
			</Form>
		</Drawer>
	);
}
