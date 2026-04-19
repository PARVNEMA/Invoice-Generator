import { useEffect, useMemo, useState } from 'react';
import { Alert, Empty, Input, Spin, Statistic, message } from 'antd';
import { itemsApi } from '../api/itemsApi';
import { ItemFormDrawer } from '../components/ItemFormDrawer';
import { ItemsTable } from '../components/ItemsTable';
import type { Item, ItemFormValues } from '../types';
import { PageHeader } from '../../../shared/ui/PageHeader';
import { SurfaceCard } from '../../../shared/ui/SurfaceCard';
import { formatCurrency } from '../../../shared/lib/format';

type DrawerState =
  | { mode: 'create'; item: null }
  | { mode: 'edit'; item: Item }
  | null;

export function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [drawerState, setDrawerState] = useState<DrawerState>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    let active = true;

    const loadItems = async () => {
      try {
        const data = await itemsApi.getAll();
        if (active) {
          setItems(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Failed to load items');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadItems();

    return () => {
      active = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return items;

    return items.filter((item) => {
      const variantText = item.variants
        .map((variant) => `${variant.name} ${variant.value}`)
        .join(' ')
        .toLowerCase();
      return (
        item.name.toLowerCase().includes(normalized) ||
        (item.description || '').toLowerCase().includes(normalized) ||
        variantText.includes(normalized)
      );
    });
  }, [items, search]);

  const totalInventoryValue = filteredItems.reduce(
    (sum, item) => sum + (item.basePrice || 0),
    0,
  );

  const handleSubmit = async (values: ItemFormValues) => {
    if (!drawerState) return;
    setSubmitting(true);

    try {
      if (drawerState.mode === 'create') {
        const createdItem = await itemsApi.create(values);
        setItems((prev) => [createdItem, ...prev]);
        messageApi.success('Item created successfully');
      } else {
        const updatedItem = await itemsApi.update(drawerState.item._id, values);
        setItems((prev) =>
          prev.map((item) => (item._id === updatedItem._id ? updatedItem : item)),
        );
        messageApi.success('Item updated successfully');
      }

      setDrawerState(null);
    } catch (err) {
      messageApi.error(err instanceof Error ? err.message : 'Failed to save item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await itemsApi.remove(id);
      setItems((prev) => prev.filter((item) => item._id !== id));
      messageApi.success('Item deleted successfully');
    } catch (err) {
      messageApi.error(err instanceof Error ? err.message : 'Failed to delete item');
    } finally {
      setDeletingId(null);
    }
  };

  return (
		<>
			{contextHolder}
			<PageHeader
				title="Item & Inventory Management"
				description="Create and manage your item catalog. These items will be reused in invoice line items in upcoming modules."
				actionLabel="Add Item"
				onActionClick={() =>
					setDrawerState({ mode: "create", item: null })
				}
			/>

			<div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
				<SurfaceCard>
					<Statistic
						title="Total items"
						value={items.length}
					/>
				</SurfaceCard>
				<SurfaceCard>
					<Statistic
						title="Visible results"
						value={filteredItems.length}
					/>
				</SurfaceCard>
				<SurfaceCard>
					<Statistic
						title="Visible base value"
						value={formatCurrency(totalInventoryValue)}
					/>
				</SurfaceCard>
			</div>

			<SurfaceCard
				title="Inventory"
				extra={
					<Input.Search
						placeholder="Search by name, description, variant"
						allowClear
						onChange={(event) =>
							setSearch(event.target.value)
						}
						className="w-92 max-w-full"
					/>
				}
			>
				{loading ? (
					<div className="flex min-h-72 items-center justify-center">
						<Spin size="large" />
					</div>
				) : error ? (
					<div className="space-y-4 p-2">
						<Alert
							type="error"
							title="Unable to load items"
							description={error}
							showIcon
						/>
					</div>
				) : filteredItems.length === 0 ? (
					<div className="py-14">
						<Empty
							description={
								search
									? "No items match your search."
									: "No items yet. Start by adding your first item."
							}
						/>
					</div>
				) : (
					<ItemsTable
						data={filteredItems}
						loading={loading}
						deletingId={deletingId}
						onEdit={(item) =>
							setDrawerState({ mode: "edit", item })
						}
						onDelete={handleDelete}
					/>
				)}
			</SurfaceCard>

			<ItemFormDrawer
				open={Boolean(drawerState)}
				mode={drawerState?.mode || "create"}
				item={
					drawerState?.mode === "edit"
						? drawerState.item
						: null
				}
				loading={submitting}
				onClose={() => setDrawerState(null)}
				onSubmit={handleSubmit}
			/>
		</>
	);
}
