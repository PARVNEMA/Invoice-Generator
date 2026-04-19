import { API_BASE_URL } from '../../../shared/config/env';
import type { ApiResponse } from '../../../shared/types/api';
import type { CreateInvoicePayload, CreatedInvoice, InvoiceListItem } from '../types';

const INVOICES_ENDPOINT = `${API_BASE_URL}/invoices`;

export const invoicesApi = {
  getPdfDownloadUrl(id: string) {
    return `${INVOICES_ENDPOINT}/${id}/pdf`;
  },
  async create(payload: CreateInvoicePayload) {
    const response = await fetch(INVOICES_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const body = (await response.json()) as ApiResponse<CreatedInvoice>;

    if (!response.ok || !body.success) {
      throw new Error('message' in body ? body.message : 'Failed to create invoice');
    }

    return body.data;
  },
  async getAll() {
    const response = await fetch(INVOICES_ENDPOINT);
    const body = (await response.json()) as ApiResponse<InvoiceListItem[]>;

    if (!response.ok || !body.success) {
      throw new Error('message' in body ? body.message : 'Failed to load invoices');
    }

    return body.data;
  },
  async remove(id: string) {
    const response = await fetch(`${INVOICES_ENDPOINT}/${id}`, {
      method: 'DELETE',
    });
    const body = (await response.json()) as { success: boolean; message?: string };

    if (!response.ok || !body.success) {
      throw new Error(body.message || 'Failed to delete invoice');
    }
  },
};
