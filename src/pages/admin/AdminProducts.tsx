import React, { useState } from 'react';
import { Plus, Download, Tag, AlertCircle, CheckCircle, Package } from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminTable, { type Column } from '../../components/admin/AdminTable';

interface ProductItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  sales: number;
}

const MOCK_PRODUCTS: ProductItem[] = [
  { id: 'p-1', sku: 'EK-MCU-001', name: 'ESP32 DevKit V1 Wi-Fi + Bluetooth', category: 'Microcontrollers', price: 649, stock: 4, status: 'Low Stock', sales: 342 },
  { id: 'p-2', sku: 'EK-MCU-002', name: 'Raspberry Pi Pico W RP2040', category: 'Microcontrollers', price: 499, stock: 48, status: 'In Stock', sales: 512 },
  { id: 'p-3', sku: 'EK-SEN-001', name: 'MQ2 Gas & Smoke Sensor Module', category: 'Sensors', price: 199, stock: 2, status: 'Low Stock', sales: 189 },
  { id: 'p-4', sku: 'EK-DSP-001', name: '0.96" I2C OLED Display 128x64 Blue', category: 'Displays', price: 299, stock: 0, status: 'Out of Stock', sales: 275 },
  { id: 'p-5', sku: 'EK-MOT-001', name: 'NEMA 17 Stepper Motor 1.8 Deg', category: 'Motors & Actuators', price: 950, stock: 24, status: 'In Stock', sales: 98 },
  { id: 'p-6', sku: 'EK-PWR-001', name: '5V 3A Type-C Power Adapter', category: 'Power Supplies', price: 349, stock: 65, status: 'In Stock', sales: 430 },
  { id: 'p-7', sku: 'EK-SEN-002', name: 'DHT22 Temperature & Humidity Sensor', category: 'Sensors', price: 279, stock: 18, status: 'In Stock', sales: 210 },
  { id: 'p-8', sku: 'EK-KIT-001', name: 'Arduino Starter Prototyping Kit', category: 'Kits', price: 1899, stock: 12, status: 'In Stock', sales: 86 }
];

export const AdminProducts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const categories = ['All', 'Microcontrollers', 'Sensors', 'Displays', 'Motors & Actuators', 'Power Supplies', 'Kits'];

  const filteredProducts = MOCK_PRODUCTS.filter((prod) => {
    const matchesQuery =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || prod.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  const columns: Column<ProductItem>[] = [
    {
      header: 'Product Details',
      accessor: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 font-bold flex-shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-slate-100">{row.name}</div>
            <div className="text-[11px] font-mono text-slate-400">{row.sku}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: (row) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-300 bg-slate-900 border border-slate-800">
          <Tag className="w-3 h-3 text-blue-400" />
          {row.category}
        </span>
      )
    },
    {
      header: 'Price',
      accessor: (row) => <span className="font-bold text-slate-100">₹{row.price}</span>
    },
    {
      header: 'Inventory Stock',
      accessor: (row) => (
        <div>
          <span className="font-semibold text-slate-200">{row.stock} units</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            row.status === 'In Stock'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : row.status === 'Low Stock'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}
        >
          {row.status === 'In Stock' ? (
            <CheckCircle className="w-3 h-3" />
          ) : (
            <AlertCircle className="w-3 h-3" />
          )}
          {row.status}
        </span>
      )
    },
    {
      header: 'Units Sold',
      accessor: (row) => <span className="text-slate-400">{row.sales} orders</span>
    }
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Products Management"
        subtitle="Catalog inventory, pricing, stock levels, and category breakdown."
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Products' }
        ]}
        actions={
          <div className="flex items-center space-x-2">
            <button className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors cursor-pointer">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all cursor-pointer">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        }
      />

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Reusable Admin Table */}
      <AdminTable
        columns={columns}
        data={filteredProducts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search product by title, SKU, or tag..."
        keyExtractor={(item) => item.id}
        pagination={{
          currentPage: currentPage,
          totalPages: 1,
          totalItems: filteredProducts.length,
          onPageChange: setCurrentPage
        }}
      />
    </div>
  );
};

export default AdminProducts;
