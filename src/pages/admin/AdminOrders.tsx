import React, { useState } from 'react';
import { Clock, Truck, CheckCircle2, XCircle, Eye, Download } from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminTable, { type Column } from '../../components/admin/AdminTable';

interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  itemsCount: number;
  itemsSummary: string;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  paymentMethod: string;
}

const MOCK_ORDERS: OrderRecord[] = [
  { id: 'o-1', orderNumber: 'EK-ORD-90812', customerName: 'Alex Johnson', customerEmail: 'alex.j@proto.io', itemsCount: 3, itemsSummary: 'ESP32 DevKit (x2), MQ2 Sensor', total: 1497, status: 'Processing', date: '2026-07-24T14:32:00Z', paymentMethod: 'UPI' },
  { id: 'o-2', orderNumber: 'EK-ORD-90811', customerName: 'Priya Sharma', customerEmail: 'priya@hardwarelab.in', itemsCount: 1, itemsSummary: 'Raspberry Pi Pico W', total: 499, status: 'Shipped', date: '2026-07-24T10:15:00Z', paymentMethod: 'Credit Card' },
  { id: 'o-3', orderNumber: 'EK-ORD-90810', customerName: 'Rahul Verma', customerEmail: 'rahul.v@robotics.net', itemsCount: 3, itemsSummary: '0.96" OLED Display 128x64 (x3)', total: 897, status: 'Delivered', date: '2026-07-23T18:45:00Z', paymentMethod: 'Razorpay' },
  { id: 'o-4', orderNumber: 'EK-ORD-90809', customerName: 'Dev Team Lab', customerEmail: 'hardware@devteam.org', itemsCount: 2, itemsSummary: 'NEMA 17 Stepper Motor, Power Supply', total: 2350, status: 'Delivered', date: '2026-07-23T12:00:00Z', paymentMethod: 'Net Banking' },
  { id: 'o-5', orderNumber: 'EK-ORD-90808', customerName: 'Karan Patel', customerEmail: 'karan@makertech.io', itemsCount: 5, itemsSummary: 'DHT22 Sensor, Jumper Wires Kit', total: 1120, status: 'Processing', date: '2026-07-22T16:20:00Z', paymentMethod: 'UPI' },
  { id: 'o-6', orderNumber: 'EK-ORD-90807', customerName: 'Siddharth Rao', customerEmail: 'sid.rao@embedded.in', itemsCount: 1, itemsSummary: 'Arduino Prototyping Starter Kit', total: 1899, status: 'Cancelled', date: '2026-07-21T09:30:00Z', paymentMethod: 'Card' }
];

export const AdminOrders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const tabs = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = MOCK_ORDERS.filter((ord) => {
    const matchesQuery =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || ord.status === activeTab;
    return matchesQuery && matchesTab;
  });

  const columns: Column<OrderRecord>[] = [
    {
      header: 'Order Reference',
      accessor: (row) => (
        <div>
          <div className="font-mono font-bold text-blue-400">{row.orderNumber}</div>
          <div className="text-[11px] text-slate-400">{new Date(row.date).toLocaleDateString()}</div>
        </div>
      )
    },
    {
      header: 'Customer',
      accessor: (row) => (
        <div>
          <div className="font-semibold text-slate-200">{row.customerName}</div>
          <div className="text-[11px] text-slate-400">{row.customerEmail}</div>
        </div>
      )
    },
    {
      header: 'Purchased Items',
      accessor: (row) => (
        <div>
          <div className="font-medium text-slate-300 max-w-xs truncate">{row.itemsSummary}</div>
          <div className="text-[11px] text-slate-500">{row.itemsCount} item(s)</div>
        </div>
      )
    },
    {
      header: 'Total Price',
      accessor: (row) => (
        <div>
          <div className="font-extrabold text-slate-100">₹{row.total}</div>
          <div className="text-[10px] text-slate-500 font-mono">{row.paymentMethod}</div>
        </div>
      )
    },
    {
      header: 'Fulfillment Status',
      accessor: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            row.status === 'Delivered'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : row.status === 'Shipped'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              : row.status === 'Processing'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}
        >
          {row.status === 'Delivered' && <CheckCircle2 className="w-3 h-3" />}
          {row.status === 'Shipped' && <Truck className="w-3 h-3" />}
          {row.status === 'Processing' && <Clock className="w-3 h-3" />}
          {row.status === 'Cancelled' && <XCircle className="w-3 h-3" />}
          {row.status}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: () => (
        <button
          className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
          title="View Details"
        >
          <Eye className="w-4 h-4 text-blue-400" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Orders Management"
        subtitle="Track customer hardware purchases, order status, and fulfillment workflow."
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Orders' }
        ]}
        actions={
          <button className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors cursor-pointer">
            <Download className="w-4 h-4" />
            Export Invoice Logs
          </button>
        }
      />

      {/* Status Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <AdminTable
        columns={columns}
        data={filteredOrders}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search order #, customer name, email..."
        keyExtractor={(item) => item.id}
        pagination={{
          currentPage: currentPage,
          totalPages: 1,
          totalItems: filteredOrders.length,
          onPageChange: setCurrentPage
        }}
      />
    </div>
  );
};

export default AdminOrders;
