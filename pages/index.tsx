import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { TableData, SortDirection, FixedColumn, ColumnVisibility, TablePaginationOptions, EditableCell } from '../types';
import { generateMockData, getAllBrands } from '../utils/mockData';
import TableFilters from '../components/TableFilters';
import DataTable from '../components/DataTable';
import { Geist, Geist_Mono } from 'next/font/google';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function Home() {
  const [data, setData] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [brandFilter, setBrandFilter] = useState('');
  const [customerIdFilter, setCustomerIdFilter] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof TableData | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [fixedColumns, setFixedColumns] = useState<FixedColumn[]>(['id', 'customerId', 'brand']);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [editingCell, setEditingCell] = useState<EditableCell | null>(null);
  
  // Set all 10 columns to be visible by default
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    id: true,
    customerId: true,
    brand: true,
    product: true,
    price: true,
    quantity: true,
    status: true,
    date: true,
    location: true,
    category: true,
  });
  
  const [pagination, setPagination] = useState<TablePaginationOptions>({
    enabled: true,
    pageSize: 10,
    currentPage: 1,
  });

  const fetchData = () => {
    setIsLoading(true);
    // Simulate API call with setTimeout
    setTimeout(() => {
      const mockData = generateMockData(50);
      setData(mockData);
      
      // Extract unique brands for filter
      const brands = [...new Set(mockData.map(item => item.brand))];
      setAvailableBrands(brands);
      
      setIsLoading(false);
    }, 1000);
  };

  // Filter data based on selected filters
  const filteredData = data.filter(item => {
    if (brandFilter && item.brand !== brandFilter) return false;
    if (customerIdFilter && !item.customerId.includes(customerIdFilter)) return false;
    return true;
  });

  // Sort data based on selected column and direction
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    }
    
    return 0;
  });

  const handleSort = (column: keyof TableData) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleToggleFixedColumn = (column: FixedColumn) => {
    if (fixedColumns.includes(column)) {
      if (fixedColumns.length > 1) {
        setFixedColumns(fixedColumns.filter(col => col !== column));
      }
    } else {
      setFixedColumns([...fixedColumns, column]);
    }
  };

  const handleToggleColumnVisibility = (column: keyof TableData) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column as string]
    }));
  };

  const handleCellEdit = (editableCell: EditableCell) => {
    setEditingCell(editableCell);
  };

  const handleCellEditCancel = () => {
    setEditingCell(null);
  };

  const handleCellEditConfirm = () => {
    if (!editingCell) return;

    // Update the data with the edited value
    const updatedData = data.map(item => {
      if (item.id === editingCell.rowId) {
        return {
          ...item,
          [editingCell.column]: editingCell.value
        };
      }
      return item;
    });

    // Mock API call
    console.log('Updating cell:', {
      rowId: editingCell.rowId,
      column: editingCell.column,
      oldValue: editingCell.originalValue,
      newValue: editingCell.value
    });

    // Update the state
    setData(updatedData);
    setEditingCell(null);
  };

  return (
    <div className={`min-h-screen bg-background p-4 md:p-8 ${geistSans.variable} ${geistMono.variable}`}>
      <Head>
        <title>Dynamic Table</title>
        <meta name="description" content="Dynamic table with sorting and filtering" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">Dynamic Data Table</CardTitle>
            <p className="text-muted-foreground">A responsive table with sorting, filtering, and fixed columns</p>
          </CardHeader>
        </Card>
        
        <main>
          <TableFilters
            brandFilter={brandFilter}
            onBrandFilterChange={setBrandFilter}
            customerIdFilter={customerIdFilter}
            onCustomerIdFilterChange={setCustomerIdFilter}
            sortByColumn={sortColumn}
            onSortByColumnChange={setSortColumn}
            availableBrands={availableBrands}
            isLoading={isLoading}
            onFetchData={fetchData}
            columnVisibility={columnVisibility}
            onToggleColumnVisibility={handleToggleColumnVisibility}
            pagination={pagination}
            onPaginationChange={setPagination}
          />
          
          <DataTable
            data={sortedData}
            isLoading={isLoading}
            fixedColumns={fixedColumns}
            onToggleFixedColumn={handleToggleFixedColumn}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            columnVisibility={columnVisibility}
            onToggleColumnVisibility={handleToggleColumnVisibility}
            pagination={pagination}
            onPaginationChange={setPagination}
            editingCell={editingCell}
            onCellEdit={handleCellEdit}
            onCellEditCancel={handleCellEditCancel}
            onCellEditConfirm={handleCellEditConfirm}
          />
        </main>
        
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p> {new Date().getFullYear()} Dynamic Table Demo</p>
        </footer>
      </div>
    </div>
  );
}
