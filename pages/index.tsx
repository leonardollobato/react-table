import { useState, useEffect } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import DataTable from '../components/DataTable';
import TableFilters from '../components/TableFilters';
import { TableData, SortState, FixedColumn } from '../types';
import { generateMockData, getAllBrands } from '../utils/mockData';

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
  const [filteredData, setFilteredData] = useState<TableData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filters
  const [brandFilter, setBrandFilter] = useState('');
  const [customerIdFilter, setCustomerIdFilter] = useState('');
  const [sortByColumn, setSortByColumn] = useState<keyof TableData | null>(null);
  
  // Sorting
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: null,
  });
  
  // Fixed columns
  const [fixedColumns, setFixedColumns] = useState<FixedColumn[]>(['id', 'customerId', 'brand']);
  
  // Handle toggling fixed columns
  const handleToggleFixedColumn = (column: FixedColumn) => {
    if (fixedColumns.includes(column)) {
      // Don't allow removing all fixed columns - keep at least one
      if (fixedColumns.length > 1) {
        setFixedColumns(fixedColumns.filter(col => col !== column));
      }
    } else {
      // Limit to maximum 3 fixed columns
      if (fixedColumns.length < 3) {
        setFixedColumns([...fixedColumns, column]);
      } else {
        // Replace the last fixed column
        const newFixedColumns = [...fixedColumns];
        newFixedColumns.pop();
        newFixedColumns.push(column);
        setFixedColumns(newFixedColumns);
      }
    }
  };
  
  // Handle sorting
  const handleSort = (column: keyof TableData) => {
    setSortState(prevState => {
      if (prevState.column === column) {
        // Toggle direction if same column
        return {
          column,
          direction: prevState.direction === 'asc' ? 'desc' : prevState.direction === 'desc' ? null : 'asc',
        };
      } else {
        // New column, start with ascending
        return {
          column,
          direction: 'asc',
        };
      }
    });
  };
  
  // Handle filter changes
  const handleBrandFilterChange = (brand: string) => {
    setBrandFilter(brand);
  };
  
  const handleCustomerIdFilterChange = (customerId: string) => {
    setCustomerIdFilter(customerId);
  };
  
  const handleSortByColumnChange = (column: keyof TableData | null) => {
    setSortByColumn(column);
    if (column) {
      setSortState({
        column,
        direction: 'asc',
      });
    }
  };
  
  // Fetch data
  const fetchData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const newData = generateMockData(50);
      setData(newData);
      setIsLoading(false);
    }, 1000);
  };
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...data];
    
    // Apply brand filter
    if (brandFilter) {
      result = result.filter(item => item.brand === brandFilter);
    }
    
    // Apply customer ID filter
    if (customerIdFilter) {
      result = result.filter(item => 
        item.customerId.toLowerCase().includes(customerIdFilter.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortState.column && sortState.direction) {
      result.sort((a, b) => {
        const aValue = a[sortState.column!];
        const bValue = b[sortState.column!];
        
        // Handle different types of values
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortState.direction === 'asc' ? aValue - bValue : bValue - aValue;
        } else {
          const aString = String(aValue).toLowerCase();
          const bString = String(bValue).toLowerCase();
          
          return sortState.direction === 'asc' 
            ? aString.localeCompare(bString)
            : bString.localeCompare(aString);
        }
      });
    }
    
    setFilteredData(result);
  }, [data, brandFilter, customerIdFilter, sortState]);
  
  return (
    <div className={`min-h-screen bg-gray-50 p-4 md:p-8 ${geistSans.variable} ${geistMono.variable}`}>
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dynamic Data Table</h1>
          <p className="text-gray-600">A responsive table with sorting, filtering, and fixed columns</p>
        </header>
        
        <main>
          <TableFilters 
            brandFilter={brandFilter}
            onBrandFilterChange={handleBrandFilterChange}
            customerIdFilter={customerIdFilter}
            onCustomerIdFilterChange={handleCustomerIdFilterChange}
            sortByColumn={sortByColumn}
            onSortByColumnChange={handleSortByColumnChange}
            availableBrands={getAllBrands()}
            isLoading={isLoading}
            onFetchData={fetchData}
          />
          
          <DataTable 
            data={filteredData}
            isLoading={isLoading}
            fixedColumns={fixedColumns}
            onToggleFixedColumn={handleToggleFixedColumn}
            sortState={sortState}
            onSort={handleSort}
          />
        </main>
        
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p> {new Date().getFullYear()} Dynamic Table Demo</p>
        </footer>
      </div>
    </div>
  );
}
