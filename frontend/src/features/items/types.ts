export type ItemVariant = {
  name: string;
  value: string;
};

export type Item = {
  _id: string;
  name: string;
  description?: string;
  variants: ItemVariant[];
  basePrice: number;
  createdAt: string;
  updatedAt: string;
};

export type ItemFormValues = {
  name: string;
  description?: string;
  basePrice: number;
  variants: ItemVariant[];
};
