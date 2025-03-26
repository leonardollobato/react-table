import { TableData } from '../types';

const brands = ['Apple', 'Samsung', 'Google', 'Microsoft', 'Sony', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer'];
const products = ['Laptop', 'Smartphone', 'Tablet', 'Desktop', 'Monitor', 'Keyboard', 'Mouse', 'Headphones', 'Speaker', 'Camera'];
const statuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled', 'Returned'];
const locations = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
const categories = ['Electronics', 'Computers', 'Accessories', 'Audio', 'Video', 'Gaming', 'Office', 'Networking', 'Storage', 'Components'];

export const generateMockData = (count: number): TableData[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    customerId: `CUST-${Math.floor(10000 + Math.random() * 90000)}`,
    brand: brands[Math.floor(Math.random() * brands.length)],
    product: products[Math.floor(Math.random() * products.length)],
    price: parseFloat((Math.random() * 1000 + 50).toFixed(2)),
    quantity: Math.floor(Math.random() * 10) + 1,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    location: locations[Math.floor(Math.random() * locations.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
  }));
};

export const getAllBrands = () => brands;
