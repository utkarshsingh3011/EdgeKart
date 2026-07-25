import React from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  Package,
  Zap,
  CheckCircle2,
  Clock
} from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminStatCard from '../../components/admin/AdminStatCard';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminHeader
        title="Admin Dashboard"
        subtitle="Overview metrics, real-time store stats, and inventory performance."
        actions={
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Package className="w-4 h-4" />
            Manage Inventory
          </Link>
        }
      />

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          title="Total Revenue"
          value="₹1,84,950"
          change="+18.4%"
          isPositive={true}
          icon={DollarSign}
          description="vs. previous 30 days"
          iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
        <AdminStatCard
          title="Total Orders"
          value="482"
          change="+12.5%"
          isPositive={true}
          icon={ShoppingBag}
          description="5 pending dispatch"
          iconColor="text-blue-400 bg-blue-500/10 border-blue-500/20"
        />
        <AdminStatCard
          title="Active Customers"
          value="1,248"
          change="+8.2%"
          isPositive={true}
          icon={Users}
          description="84 new this week"
          iconColor="text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
        />
        <AdminStatCard
          title="Conversion Rate"
          value="4.65%"
          change="-0.4%"
          isPositive={false}
          icon={TrendingUp}
          description="Avg. order value ₹383"
          iconColor="text-amber-400 bg-amber-500/10 border-amber-500/20"
        />
      </div>

      {/* Main Grid: Revenue Overview & Low Stock Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Performance Visualization Card */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-100">Sales Overview</h3>
              <p className="text-xs text-slate-400">Monthly breakdown of hardware component orders</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              July 2026
            </span>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-56 flex items-end justify-between gap-2 pt-6 pb-2 px-2">
            {[
              { month: 'Jan', val: 40 },
              { month: 'Feb', val: 55 },
              { month: 'Mar', val: 48 },
              { month: 'Apr', val: 70 },
              { month: 'May', val: 65 },
              { month: 'Jun', val: 85 },
              { month: 'Jul', val: 95 }
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-slate-900 rounded-t-lg h-44 flex items-end p-1 relative">
                  <div
                    style={{ height: `${bar.val}%` }}
                    className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-md group-hover:from-blue-500 group-hover:to-indigo-400 transition-all duration-300 relative"
                  >
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-700 text-slate-200 text-[10px] px-1.5 py-0.5 rounded shadow">
                      ₹{bar.val * 1200}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-200">{bar.month}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800/80 pt-4 mt-2 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Microcontrollers & IoT
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Sensors & Modules
              </span>
            </div>
            <Link to="/admin/orders" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium">
              View Detailed Report <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Low Stock Alerts & Quick Status */}
        <div className="space-y-6">
          <div className="glass p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-amber-400">
                <AlertTriangle className="w-5 h-5" />
                <h4 className="text-sm font-bold">Low Stock Warning</h4>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                3 Items
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              The following hardware components are running below minimum inventory thresholds:
            </p>

            <div className="space-y-2.5">
              {[
                { name: 'ESP32 DevKit V1', stock: 4, min: 10 },
                { name: 'MQ2 Gas Sensor Module', stock: 2, min: 15 },
                { name: '0.96" OLED Display 128x64', stock: 1, min: 8 }
              ].map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-200">{item.name}</div>
                    <div className="text-[11px] text-slate-400">Min limit: {item.min} units</div>
                  </div>
                  <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">
                    {item.stock} left
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-5 rounded-2xl border border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">System Health</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Database Sync
                </span>
                <span className="font-mono text-emerald-400 font-semibold">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <Zap className="w-4 h-4 text-blue-400" /> Payment Gateways
                </span>
                <span className="font-mono text-emerald-400 font-semibold">Healthy</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4 text-indigo-400" /> Dispatch Queue
                </span>
                <span className="font-mono text-blue-400 font-semibold">5 Pending</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="glass p-6 rounded-2xl border border-slate-800/80">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100">Recent Customer Orders</h3>
            <p className="text-xs text-slate-400">Latest orders placed on EdgeKart hardware catalog</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            View All Orders <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {[
                { id: 'EK-ORD-90812', name: 'Alex Johnson', date: 'Jul 24, 2026', items: 'ESP32 (x2), MQ2 Sensor', total: '₹1,497', status: 'Processing' },
                { id: 'EK-ORD-90811', name: 'Priya Sharma', date: 'Jul 24, 2026', items: 'Raspberry Pi Pico W', total: '₹499', status: 'Shipped' },
                { id: 'EK-ORD-90810', name: 'Rahul Verma', date: 'Jul 23, 2026', items: '0.96" OLED Display (x3)', total: '₹897', status: 'Delivered' },
                { id: 'EK-ORD-90809', name: 'Dev Team Lab', date: 'Jul 23, 2026', items: 'Stepper Motor Driver Kit', total: '₹2,350', status: 'Delivered' }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-semibold text-blue-400">{row.id}</td>
                  <td className="px-4 py-3.5 font-medium">{row.name}</td>
                  <td className="px-4 py-3.5 text-slate-400">{row.date}</td>
                  <td className="px-4 py-3.5 text-slate-300">{row.items}</td>
                  <td className="px-4 py-3.5 font-bold text-slate-100">{row.total}</td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        row.status === 'Delivered'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : row.status === 'Shipped'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
