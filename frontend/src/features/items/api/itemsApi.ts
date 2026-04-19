import { API_BASE_URL } from '../../../shared/config/env';
import type { ApiResponse } from '../../../shared/types/api';
import type { Item, ItemFormValues } from '../types';

const ITEMS_ENDPOINT = `${API_BASE_URL}/items`;

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });

  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !body.success) {
    throw new Error('message' in body ? body.message : 'Request failed');
  }

  return body.data;
}

export const itemsApi = {
  getAll() {
    return request<Item[]>(ITEMS_ENDPOINT);
  },
  create(payload: ItemFormValues) {
    return request<Item>(ITEMS_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  update(id: string, payload: ItemFormValues) {
    return request<Item>(`${ITEMS_ENDPOINT}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  async remove(id: string) {
    const response = await fetch(`${ITEMS_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });

    const body = (await response.json()) as { success: boolean; message?: string };

    if (!response.ok || !body.success) {
      throw new Error(body.message || 'Failed to delete item');
    }
  },
};
