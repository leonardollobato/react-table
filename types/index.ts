export interface TableData {
  id: string;
  customerId: string;
  brand: string;
  product: string;
  price: number;
  quantity: number;
  status: string;
  date: string;
  location: string;
  category: string;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: keyof TableData | null;
  direction: SortDirection;
}

export type FixedColumn = keyof Pick<TableData, 'id' | 'customerId' | 'brand' | 'product' | 'price' | 'quantity' | 'status' | 'date' | 'location' | 'category'>;
