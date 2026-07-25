import React, { useState } from 'react';
import { Shield, User, CheckCircle2, UserPlus } from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';
import AdminTable, { type Column } from '../../components/admin/AdminTable';

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'Active' | 'Inactive';
  ordersCount: number;
  totalSpent: number;
  joinedDate: string;
  avatar: string;
}

const MOCK_USERS: UserAccount[] = [
  { id: 'u-1', name: 'System Administrator', email: 'admin@edgekart.com', role: 'admin', status: 'Active', ordersCount: 12, totalSpent: 18450, joinedDate: '2026-01-15', avatar: '👑' },
  { id: 'u-2', name: 'Alex Johnson', email: 'alex.j@proto.io', role: 'user', status: 'Active', ordersCount: 5, totalSpent: 4290, joinedDate: '2026-03-22', avatar: '👨‍💻' },
  { id: 'u-3', name: 'Priya Sharma', email: 'priya@hardwarelab.in', role: 'user', status: 'Active', ordersCount: 8, totalSpent: 6890, joinedDate: '2026-04-10', avatar: '👩‍🔬' },
  { id: 'u-4', name: 'Rahul Verma', email: 'rahul.v@robotics.net', role: 'user', status: 'Active', ordersCount: 3, totalSpent: 2150, joinedDate: '2026-05-18', avatar: '🤖' },
  { id: 'u-5', name: 'Dev Team Lab', email: 'hardware@devteam.org', role: 'user', status: 'Active', ordersCount: 14, totalSpent: 24800, joinedDate: '2026-02-01', avatar: '💻' },
  { id: 'u-6', name: 'Karan Patel', email: 'karan@makertech.io', role: 'user', status: 'Inactive', ordersCount: 1, totalSpent: 649, joinedDate: '2026-06-30', avatar: '⚙️' }
];

export const AdminUsers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredUsers = MOCK_USERS.filter((usr) => {
    const matchesQuery =
      usr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      usr.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || usr.role === roleFilter.toLowerCase();
    return matchesQuery && matchesRole;
  });

  const columns: Column<UserAccount>[] = [
    {
      header: 'User Account',
      accessor: (row) => (
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-lg">
            {row.avatar}
          </div>
          <div>
            <div className="font-semibold text-slate-100">{row.name}</div>
            <div className="text-[11px] text-slate-400">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Role',
      accessor: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            row.role === 'admin'
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}
        >
          {row.role === 'admin' ? <Shield className="w-3 h-3 text-blue-400" /> : <User className="w-3 h-3" />}
          {row.role}
        </span>
      )
    },
    {
      header: 'Account Status',
      accessor: (row) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            row.status === 'Active' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3 h-3" />
          {row.status}
        </span>
      )
    },
    {
      header: 'Purchases',
      accessor: (row) => (
        <div>
          <div className="font-bold text-slate-200">₹{row.totalSpent}</div>
          <div className="text-[10px] text-slate-500">{row.ordersCount} total order(s)</div>
        </div>
      )
    },
    {
      header: 'Registered Date',
      accessor: (row) => <span className="text-slate-400 font-mono text-[11px]">{row.joinedDate}</span>
    }
  ];

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Users & Roles"
        subtitle="Manage customer accounts, administrative permissions, and account status."
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Users' }
        ]}
        actions={
          <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all cursor-pointer">
            <UserPlus className="w-4 h-4" />
            Add User Account
          </button>
        }
      />

      {/* Role Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        {['All', 'Admin', 'User'].map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              roleFilter === role
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {role} Accounts
          </button>
        ))}
      </div>

      <AdminTable
        columns={columns}
        data={filteredUsers}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search users by name or email..."
        keyExtractor={(item) => item.id}
        pagination={{
          currentPage: currentPage,
          totalPages: 1,
          totalItems: filteredUsers.length,
          onPageChange: setCurrentPage
        }}
      />
    </div>
  );
};

export default AdminUsers;
