import React from 'react';
import { TableData } from '../types';

interface TableFiltersProps {
  brandFilter: string;
  onBrandFilterChange: (brand: string) => void;
  customerIdFilter: string;
  onCustomerIdFilterChange: (customerId: string) => void;
  sortByColumn: keyof TableData | null;
  onSortByColumnChange: (column: keyof TableData | null) => void;
  availableBrands: string[];
  isLoading: boolean;
  onFetchData: () => void;
}

const TableFilters: React.FC<TableFiltersProps> = ({
  brandFilter,
  onBrandFilterChange,
  customerIdFilter,
  onCustomerIdFilterChange,
  sortByColumn,
  onSortByColumnChange,
  availableBrands,
  isLoading,
  onFetchData,
}) => {
  const columns: { key: keyof TableData; label: string }[] = [
    { key: 'id', label: 'Order ID' },
    { key: 'customerId', label: 'Customer ID' },
    { key: 'brand', label: 'Brand' },
    { key: 'product', label: 'Product' },
    { key: 'price', label: 'Price' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'status', label: 'Status' },
    { key: 'date', label: 'Date' },
    { key: 'location', label: 'Location' },
    { key: 'category', label: 'Category' },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Brand Filter */}
        <div>
          <label htmlFor="brand-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Brand
          </label>
          <select
            id="brand-filter"
            value={brandFilter}
            onChange={(e) => onBrandFilterChange(e.target.value)}
            className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Brands</option>
            {availableBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Customer ID Filter */}
        <div>
          <label htmlFor="customer-id-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Customer ID
          </label>
          <input
            id="customer-id-filter"
            type="text"
            value={customerIdFilter}
            onChange={(e) => onCustomerIdFilterChange(e.target.value)}
            placeholder="Enter Customer ID"
            className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Sort By Filter */}
        <div>
          <label htmlFor="sort-by-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sort-by-filter"
            value={sortByColumn as string || ''}
            onChange={(e) => onSortByColumnChange(e.target.value as keyof TableData || null)}
            className="w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">None</option>
            {columns.map((column) => (
              <option key={column.key} value={column.key}>
                {column.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Fetch Data Button */}
      <div className="mt-4">
        <button
          onClick={onFetchData}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </>
          ) : (
            'Fetch Data'
          )}
        </button>
      </div>
    </div>
  );
};

export default TableFilters;
