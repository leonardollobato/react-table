import React, { useState, useRef, useEffect } from 'react';
import { TableData, SortDirection, FixedColumn, ColumnVisibility, TablePaginationOptions, EditableCell } from '../types';
import { Card } from './ui/card';
import { ArrowUpDown, ArrowUp, ArrowDown, Loader2, Pin, PinOff, Check, X, Edit } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface DataTableProps {
  data: TableData[];
  isLoading: boolean;
  sortColumn: keyof TableData | null;
  sortDirection: SortDirection;
  onSort: (column: keyof TableData) => void;
  fixedColumns: FixedColumn[];
  onToggleFixedColumn: (column: FixedColumn) => void;
  columnVisibility: ColumnVisibility;
  onToggleColumnVisibility: (column: keyof TableData) => void;
  pagination: TablePaginationOptions;
  onPaginationChange: (pagination: TablePaginationOptions) => void;
  editingCell: EditableCell | null;
  onCellEdit: (cell: EditableCell) => void;
  onCellEditCancel: () => void;
  onCellEditConfirm: () => void;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  isLoading,
  sortColumn,
  sortDirection,
  onSort,
  fixedColumns,
  onToggleFixedColumn,
  columnVisibility,
  onToggleColumnVisibility,
  pagination,
  onPaginationChange,
  editingCell,
  onCellEdit,
  onCellEditCancel,
  onCellEditConfirm,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{rowId: string, column: keyof TableData} | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

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

  const getSortIcon = (column: keyof TableData) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  // Get visible columns and order them with fixed columns first
  const getOrderedVisibleColumns = () => {
    // Get all visible columns
    const allVisibleColumns = columns.filter(col => columnVisibility[col.key as string]);
    
    // Split into fixed and non-fixed columns
    const fixedVisibleColumns = allVisibleColumns.filter(col => 
      fixedColumns.includes(col.key as FixedColumn)
    );
    
    const nonFixedVisibleColumns = allVisibleColumns.filter(col => 
      !fixedColumns.includes(col.key as FixedColumn)
    );
    
    // Return fixed columns first, then non-fixed columns
    return [...fixedVisibleColumns, ...nonFixedVisibleColumns];
  };

  // Calculate column positions for fixed columns
  const getColumnPosition = (columnIndex: number): string => {
    // Each column is 150px wide
    return `left-[${columnIndex * 150}px]`;
  };

  // Get z-index based on column position to prevent overlap
  const getZIndex = (columnIndex: number): string => {
    // Higher z-index for columns further to the left
    return `z-[${100 - columnIndex}]`;
  };

  // Get pagination data
  const getPaginatedData = () => {
    if (!pagination.enabled) return data;
    
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    return data.slice(startIndex, startIndex + pagination.pageSize);
  };

  const paginatedData = getPaginatedData();
  const totalPages = Math.ceil(data.length / pagination.pageSize);

  const handlePageChange = (newPage: number) => {
    onPaginationChange({
      ...pagination,
      currentPage: newPage
    });
  };

  const handleCellClick = (rowId: string, column: keyof TableData, value: string | number) => {
    // Don't allow editing ID column
    if (column === 'id') return;
    
    onCellEdit({
      rowId,
      column,
      value,
      originalValue: value
    });
  };

  const handleCellValueChange = (value: string) => {
    if (!editingCell) return;
    
    onCellEdit({
      ...editingCell,
      value
    });
  };

  if (isLoading) {
    return (
      <Card className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg font-medium">Loading data...</span>
      </Card>
    );
  }

  if (!data.length) {
    return (
      <Card className="flex items-center justify-center h-64">
        <p className="text-lg text-muted-foreground">No data available. Click "Fetch Data" to load data.</p>
      </Card>
    );
  }

  // Get ordered visible columns with fixed columns first
  const orderedVisibleColumns = getOrderedVisibleColumns();
  // Count fixed columns to create proper left padding for scrollable area
  const fixedColumnsCount = orderedVisibleColumns.filter(col => 
    fixedColumns.includes(col.key as FixedColumn)
  ).length;

  return (
    <Card className="overflow-hidden border rounded-lg shadow-sm">
      <div className="relative">
        {/* Fixed columns container */}
        <div className="absolute top-0 left-0 z-20 bg-background shadow-md">
          <table className="border-collapse">
            <thead>
              <tr>
                {orderedVisibleColumns
                  .filter(column => fixedColumns.includes(column.key as FixedColumn))
                  .map((column, columnIndex) => (
                    <th
                      key={column.key}
                      className="px-4 py-3 text-left text-sm font-medium text-foreground border-b border-r border-gray-200 dark:border-gray-700"
                      style={{
                        minWidth: '150px',
                        width: '150px',
                        backgroundColor: 'var(--header-bg)',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <button
                          className="flex items-center font-medium hover:text-primary"
                          onClick={() => onSort(column.key)}
                        >
                          {column.label}
                          {getSortIcon(column.key)}
                        </button>

                        <button
                          onClick={() => onToggleFixedColumn(column.key as FixedColumn)}
                          className={cn(
                            "ml-2 p-1 rounded-sm",
                            "text-primary",
                            "hover:bg-muted/50"
                          )}
                          title="Unpin column"
                        >
                          <Pin className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr
                  key={`fixed-${row.id}`}
                  className={cn(
                    'border-b border-gray-200 dark:border-gray-700',
                    rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
                  )}
                >
                  {orderedVisibleColumns
                    .filter(column => fixedColumns.includes(column.key as FixedColumn))
                    .map((column, columnIndex) => {
                      const value = row[column.key];
                      const isEditing = editingCell?.rowId === row.id && editingCell?.column === column.key;
                      const isHovered = hoveredCell?.rowId === row.id && hoveredCell?.column === column.key;
                      
                      return (
                        <td
                          key={`fixed-${row.id}-${column.key}`}
                          className={cn(
                            'px-4 py-3 text-sm border-r border-gray-200 dark:border-gray-700',
                            column.key !== 'id' ? 'cursor-pointer hover:bg-muted/50' : ''
                          )}
                          style={{
                            minWidth: '150px',
                            width: '150px',
                            backgroundColor: rowIndex % 2 === 0 
                              ? 'var(--even-row-bg)' 
                              : 'var(--odd-row-bg)',
                          }}
                          onClick={() => column.key !== 'id' && handleCellClick(row.id, column.key, value)}
                          onMouseEnter={() => column.key !== 'id' && setHoveredCell({ rowId: row.id, column: column.key })}
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          <div className="relative flex items-center">
                            {isEditing ? (
                              <div className="flex items-center w-full">
                                <Input
                                  ref={inputRef}
                                  value={String(editingCell.value)}
                                  onChange={(e) => handleCellValueChange(e.target.value)}
                                  className="h-8 py-1 px-2 text-sm w-full"
                                />
                                <div className="flex ml-2">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onCellEditConfirm();
                                    }}
                                    className="p-1 text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onCellEditCancel();
                                    }}
                                    className="p-1 text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <span>{value}</span>
                                {isHovered && column.key !== 'id' && (
                                  <Edit className="h-3.5 w-3.5 ml-2 text-muted-foreground" />
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      );
                    })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Scrollable area with non-fixed columns */}
        <div 
          className="overflow-x-auto" 
          style={{ 
            maxWidth: '100%',
            marginLeft: fixedColumnsCount > 0 ? `${fixedColumnsCount * 150}px` : '0' 
          }}
        >
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {orderedVisibleColumns
                  .filter(column => !fixedColumns.includes(column.key as FixedColumn))
                  .map((column, columnIndex) => (
                    <th
                      key={column.key}
                      className="px-4 py-3 text-left text-sm font-medium text-foreground border-b border-r border-gray-200 dark:border-gray-700"
                      style={{
                        minWidth: '150px',
                        backgroundColor: 'var(--header-bg)',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <button
                          className="flex items-center font-medium hover:text-primary"
                          onClick={() => onSort(column.key)}
                        >
                          {column.label}
                          {getSortIcon(column.key)}
                        </button>

                        <button
                          onClick={() => onToggleFixedColumn(column.key as FixedColumn)}
                          className={cn(
                            "ml-2 p-1 rounded-sm",
                            "text-muted-foreground",
                            "hover:bg-muted/50"
                          )}
                          title="Pin column"
                        >
                          <PinOff className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => (
                <tr
                  key={`scrollable-${row.id}`}
                  className={cn(
                    'border-b border-gray-200 dark:border-gray-700',
                    rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
                  )}
                >
                  {orderedVisibleColumns
                    .filter(column => !fixedColumns.includes(column.key as FixedColumn))
                    .map((column, columnIndex) => {
                      const value = row[column.key];
                      const isEditing = editingCell?.rowId === row.id && editingCell?.column === column.key;
                      const isHovered = hoveredCell?.rowId === row.id && hoveredCell?.column === column.key;
                      
                      return (
                        <td
                          key={`scrollable-${row.id}-${column.key}`}
                          className={cn(
                            'px-4 py-3 text-sm border-r border-gray-200 dark:border-gray-700',
                            column.key !== 'id' ? 'cursor-pointer hover:bg-muted/50' : ''
                          )}
                          style={{
                            minWidth: '150px',
                            backgroundColor: rowIndex % 2 === 0 
                              ? 'var(--even-row-bg)' 
                              : 'var(--odd-row-bg)',
                          }}
                          onClick={() => column.key !== 'id' && handleCellClick(row.id, column.key, value)}
                          onMouseEnter={() => column.key !== 'id' && setHoveredCell({ rowId: row.id, column: column.key })}
                          onMouseLeave={() => setHoveredCell(null)}
                        >
                          <div className="relative flex items-center">
                            {isEditing ? (
                              <div className="flex items-center w-full">
                                <Input
                                  ref={inputRef}
                                  value={String(editingCell.value)}
                                  onChange={(e) => handleCellValueChange(e.target.value)}
                                  className="h-8 py-1 px-2 text-sm w-full"
                                />
                                <div className="flex ml-2">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onCellEditConfirm();
                                    }}
                                    className="p-1 text-green-600 hover:text-green-800 dark:text-green-500 dark:hover:text-green-400"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onCellEditCancel();
                                    }}
                                    className="p-1 text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <span>{value}</span>
                                {isHovered && column.key !== 'id' && (
                                  <Edit className="h-3.5 w-3.5 ml-2 text-muted-foreground" />
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      );
                    })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.enabled && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} to {Math.min(pagination.currentPage * pagination.pageSize, data.length)} of {data.length} entries
          </div>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={pagination.currentPage === 1}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              Prev
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.currentPage <= 3) {
                pageNum = i + 1;
              } else if (pagination.currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = pagination.currentPage - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={pagination.currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === totalPages}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={pagination.currentPage === totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      )}

      {/* CSS Variables for consistent colors */}
      <style jsx global>{`
        :root {
          --header-bg: #f3f4f6;
          --even-row-bg: #ffffff;
          --odd-row-bg: #f9fafb;
        }
        
        .dark {
          --header-bg: #1f2937;
          --even-row-bg: #111827;
          --odd-row-bg: #1a202c;
        }
      `}</style>
    </Card>
  );
};

export default DataTable;
