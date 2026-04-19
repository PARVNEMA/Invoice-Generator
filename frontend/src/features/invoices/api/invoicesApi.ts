import { API_BASE_URL } from '../../../shared/config/env';
import type { ApiResponse } from '../../../shared/types/api';
import type { CreateInvoicePayload, CreatedInvoice } from '../types';

const INVOICES_ENDPOINT = `${API_BASE_URL}/invoices`;

export const invoicesApi = {
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
};
