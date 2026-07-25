import React, { useState } from 'react';
import { Mail, Users, CheckCircle2, TrendingUp, Download, SendHorizontal } from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminStatCard from '../../components/admin/AdminStatCard';
import AdminTable, { type Column } from '../../components/admin/AdminTable';

interface Subscriber {
  id: string;
  email: string;
  subscribedDate: string;
  status: 'Subscribed' | 'Unsubscribed';
  interests: string;
}

const MOCK_SUBSCRIBERS: Subscriber[] = [
  { id: 'sub-1', email: 'alex.j@proto.io', subscribedDate: '2026-07-20', status: 'Subscribed', interests: 'Microcontrollers, IoT' },
  { id: 'sub-2', email: 'priya@hardwarelab.in', subscribedDate: '2026-07-18', status: 'Subscribed', interests: 'Sensors & Displays' },
  { id: 'sub-3', email: 'rahul.v@robotics.net', subscribedDate: '2026-07-15', status: 'Subscribed', interests: 'Motors & Actuators' },
  { id: 'sub-4', email: 'hardware@devteam.org', subscribedDate: '2026-06-28', status: 'Subscribed', interests: 'All Hardware Updates' },
  { id: 'sub-5', email: 'karan@makertech.io', subscribedDate: '2026-05-10', status: 'Unsubscribed', interests: 'Prototyping Kits' }
];

export const AdminNewsletter: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSubscribers = MOCK_SUBSCRIBERS.filter((sub) =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: Column<Subscriber>[] = [
    {
      header: 'Subscriber Email',
      accessor: (row) => (
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Mail className="w-4 h-4" />
          </div>
          <span className="font-semibold text-slate-200">{row.email}</span>
        </div>
      )
    },
    {
      header: 'Interests Tag',
      accessor: (row) => (
        <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-300">
          {row.interests}
        </span>
      )
    },
    {
      header: 'Subscribed On',
      accessor: (row) => <span className="text-slate-400 font-mono text-xs">{row.subscribedDate}</span>
    },
    {
      header: 'Status',
      accessor: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            row.status === 'Subscribed'
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
          }`}
        >
          <CheckCircle2 className="w-3 h-3" />
          {row.status}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Newsletter & Subscribers"
        subtitle="Manage email subscriber lists, product release alerts, and hardware newsletters."
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Newsletter' }
        ]}
        actions={
          <div className="flex items-center space-x-2">
            <button className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors cursor-pointer">
              <Download className="w-4 h-4" />
              Export Subscribers
            </button>
            <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all cursor-pointer">
              <SendHorizontal className="w-4 h-4" />
              New Broadcast
            </button>
          </div>
        }
      />

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AdminStatCard
          title="Total Subscribers"
          value="1,840"
          change="+14.2%"
          isPositive={true}
          icon={Users}
          description="Active mailing list"
        />
        <AdminStatCard
          title="Avg. Open Rate"
          value="42.8%"
          change="+3.1%"
          isPositive={true}
          icon={Mail}
          description="Hardware release emails"
          iconColor="text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        />
        <AdminStatCard
          title="Click-Through Rate"
          value="18.5%"
          change="+1.4%"
          isPositive={true}
          icon={TrendingUp}
          description="Catalog links clicked"
          iconColor="text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
        />
      </div>

      {/* Subscribers Table */}
      <AdminTable
        columns={columns}
        data={filteredSubscribers}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search subscriber by email..."
        keyExtractor={(item) => item.id}
        pagination={{
          currentPage: currentPage,
          totalPages: 1,
          totalItems: filteredSubscribers.length,
          onPageChange: setCurrentPage
        }}
      />
    </div>
  );
};

export default AdminNewsletter;
