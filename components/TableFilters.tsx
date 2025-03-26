import React, { useState } from 'react';
import { TableData, ColumnVisibility, TablePaginationOptions } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RefreshCw, Columns, ChevronDown, ArrowUpDown } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { cn } from '../lib/utils';

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
  columnVisibility: ColumnVisibility;
  onToggleColumnVisibility: (column: keyof TableData) => void;
  pagination: TablePaginationOptions;
  onPaginationChange: (pagination: TablePaginationOptions) => void;
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
  columnVisibility,
  onToggleColumnVisibility,
  pagination,
  onPaginationChange,
}) => {
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [showSortSelector, setShowSortSelector] = useState(false);

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

  // Simple dropdown component to avoid React 19 compatibility issues
  const SimpleSelect = ({ 
    id, 
    value, 
    onChange, 
    options, 
    placeholder 
  }: { 
    id: string; 
    value: string; 
    onChange: (value: string) => void; 
    options: {value: string; label: string}[];
    placeholder: string;
  }) => (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  const handlePaginationToggle = () => {
    onPaginationChange({
      ...pagination,
      enabled: !pagination.enabled,
      currentPage: 1
    });
  };

  const handlePageSizeChange = (size: number) => {
    onPaginationChange({
      ...pagination,
      pageSize: size,
      currentPage: 1
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl">Table Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brand Filter */}
          <div className="space-y-2">
            <label htmlFor="brand-filter" className="text-sm font-medium">
              Brand
            </label>
            <SimpleSelect
              id="brand-filter"
              value={brandFilter}
              onChange={onBrandFilterChange}
              options={[
                ...availableBrands.map(brand => ({ value: brand, label: brand }))
              ]}
              placeholder="All Brands"
            />
          </div>

          {/* Customer ID Filter */}
          <div className="space-y-2">
            <label htmlFor="customer-id-filter" className="text-sm font-medium">
              Customer ID
            </label>
            <Input
              id="customer-id-filter"
              type="text"
              value={customerIdFilter}
              onChange={(e) => onCustomerIdFilterChange(e.target.value)}
              placeholder="Enter Customer ID"
            />
          </div>
        </div>

        {/* Column Visibility, Sort By, and Pagination Controls */}
        <div className="mt-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Column Visibility Button */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowColumnSelector(!showColumnSelector)}
                className="flex items-center gap-1"
              >
                <Columns className="h-4 w-4" />
                <span>Columns</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              
              {showColumnSelector && (
                <div className="absolute z-50 mt-2 w-64 p-4 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium mb-2">Toggle Columns</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {columns.map((column) => (
                      <div key={column.key} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`col-${column.key}`}
                          checked={columnVisibility[column.key as string]}
                          onCheckedChange={() => onToggleColumnVisibility(column.key)}
                        />
                        <label 
                          htmlFor={`col-${column.key}`}
                          className="text-sm cursor-pointer"
                        >
                          {column.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sort By Dropdown - Now styled like the Columns dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setShowSortSelector(!showSortSelector)}
                className="flex items-center gap-1"
              >
                <ArrowUpDown className="h-4 w-4" />
                <span>Sort By</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              
              {showSortSelector && (
                <div className="absolute z-50 mt-2 w-64 p-4 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                  <h4 className="font-medium mb-2">Sort By Column</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sort-none"
                        checked={!sortByColumn}
                        onCheckedChange={() => onSortByColumnChange(null)}
                      />
                      <label 
                        htmlFor="sort-none"
                        className="text-sm cursor-pointer"
                      >
                        None
                      </label>
                    </div>
                    {columns.map((column) => (
                      <div key={column.key} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`sort-${column.key}`}
                          checked={sortByColumn === column.key}
                          onCheckedChange={() => onSortByColumnChange(column.key)}
                        />
                        <label 
                          htmlFor={`sort-${column.key}`}
                          className="text-sm cursor-pointer"
                        >
                          {column.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pagination Toggle */}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="pagination-toggle"
                checked={pagination.enabled}
                onCheckedChange={handlePaginationToggle}
              />
              <label 
                htmlFor="pagination-toggle"
                className="text-sm cursor-pointer"
              >
                Enable Pagination
              </label>
            </div>

            {/* Page Size Selector (only shown when pagination is enabled) */}
            {pagination.enabled && (
              <div className="flex items-center space-x-2">
                <span className="text-sm">Show</span>
                <select
                  value={pagination.pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="h-8 rounded-md border border-input bg-background px-2 py-1 text-sm"
                >
                  {[5, 10, 25, 50, 100].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                <span className="text-sm">entries</span>
              </div>
            )}
          </div>

          {/* Fetch Data Button */}
          <Button
            onClick={onFetchData}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Fetch Data'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableFilters;
