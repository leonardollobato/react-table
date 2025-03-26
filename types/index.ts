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

export type SortDirection = 'asc' | 'desc';

export type FixedColumn = keyof TableData;

export interface SortState {
  column: keyof TableData | null;
  direction: SortDirection;
}

export interface ColumnVisibility {
  [key: string]: boolean;
}

export interface TablePaginationOptions {
  enabled: boolean;
  pageSize: number;
  currentPage: number;
}

export interface EditableCell {
  rowId: string;
  column: keyof TableData;
  value: string | number;
  originalValue: string | number;
}
