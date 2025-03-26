import React, { useState, useEffect, useRef } from 'react';
import { TableData, SortState, FixedColumn } from '../types';

interface DataTableProps {
  data: TableData[];
  isLoading: boolean;
  fixedColumns: FixedColumn[];
  onToggleFixedColumn: (column: FixedColumn) => void;
  sortState: SortState;
  onSort: (column: keyof TableData) => void;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  isLoading,
  fixedColumns,
  onToggleFixedColumn,
  sortState,
  onSort,
}) => {
  const tableRef = useRef<HTMLDivElement>(null);
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

  const [scrollLeft, setScrollLeft] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-500">Loading data...</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center p-6">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No data available</h3>
          <p className="mt-1 text-sm text-gray-500">Click the "Fetch Data" button to load data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden border border-gray-200 rounded-lg shadow-sm">
      <div
        ref={tableRef}
        className="w-full overflow-x-auto max-h-[calc(100vh-280px)] overflow-y-auto"
        onScroll={handleScroll}
      >
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {columns.map((column) => {
                const isFixed = fixedColumns.includes(column.key as FixedColumn);
                const isSorted = sortState.column === column.key;
                return (
                  <th
                    key={column.key}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap cursor-pointer group ${isFixed ? 'sticky bg-gray-50 z-20' : ''}`}
                    style={{
                      left: isFixed
                        ? `${columns.findIndex((c) => c.key === column.key) * 150}px`
                        : 'auto',
                      minWidth: '150px',
                      boxShadow: isFixed ? '2px 0 5px rgba(0,0,0,0.1)' : 'none',
                    }}
                    onClick={() => onSort(column.key)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{column.label}</span>
                      <div className="flex items-center">
                        {isSorted && (
                          <span className="ml-2">
                            {sortState.direction === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <input
                            type="checkbox"
                            checked={isFixed}
                            onChange={() => onToggleFixedColumn(column.key as FixedColumn)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-3 w-3"
                          />
                        </div>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {columns.map((column) => {
                  const isFixed = fixedColumns.includes(column.key as FixedColumn);
                  const value = row[column.key];
                  let displayValue = value;
                  
                  // Format values based on column type
                  if (column.key === 'price') {
                    displayValue = `$${Number(value).toFixed(2)}`;
                  }
                  
                  return (
                    <td
                      key={`${rowIndex}-${column.key}`}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${isFixed ? 'sticky bg-inherit z-10' : ''}`}
                      style={{
                        left: isFixed
                          ? `${columns.findIndex((c) => c.key === column.key) * 150}px`
                          : 'auto',
                        boxShadow: isFixed ? '2px 0 5px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      {displayValue as React.ReactNode}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
