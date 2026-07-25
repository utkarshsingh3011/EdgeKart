import React, { useState } from 'react';
import { Mail, User, Inbox, Send } from 'lucide-react';
import AdminHeader from '../../components/admin/AdminHeader';

interface SupportMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  content: string;
  date: string;
  status: 'Unread' | 'Replied' | 'Closed';
  category: 'Technical Inquiry' | 'Bulk Order' | 'Warranty & Return' | 'General';
}

const MOCK_MESSAGES: SupportMessage[] = [
  {
    id: 'msg-1',
    senderName: 'Dr. Anita Roy',
    senderEmail: 'anita.roy@iiit.ac.in',
    subject: 'Bulk Procurement Inquiry for ESP32 Boards (50 units)',
    snippet: 'We are setting up an IoT laboratory at IIIT and require 50 units of ESP32 DevKit V1...',
    content: 'Dear EdgeKart Sales Team,\n\nWe are looking to procure 50 units of ESP32 DevKit V1 boards along with MQ2 sensors for our upcoming IoT lab semester project. Could you provide a GST educational discount quotation and estimated shipping timeframe to Bangalore?\n\nBest regards,\nDr. Anita Roy',
    date: '2026-07-24T15:10:00Z',
    status: 'Unread',
    category: 'Bulk Order'
  },
  {
    id: 'msg-2',
    senderName: 'Venkatesh Rao',
    senderEmail: 'venky@embeddedworks.com',
    subject: 'Pinout Diagram query for 0.96 OLED Display Module',
    snippet: 'Is the SSD1306 driver chip on this display compatible with 3.3V logic supply?',
    content: 'Hi Team,\n\nI purchased order EK-ORD-90810. Can you confirm if the 0.96 OLED Display logic pins support 3.3V directly from Raspberry Pi Pico W without step-down level shifters?\n\nThanks,\nVenkatesh',
    date: '2026-07-23T11:40:00Z',
    status: 'Replied',
    category: 'Technical Inquiry'
  },
  {
    id: 'msg-3',
    senderName: 'Manish Kumar',
    senderEmail: 'manish@roboticsclub.org',
    subject: 'Replacement request for defective Stepper Motor Driver',
    snippet: 'One of the stepper motor driver chips from my recent package failed on arrival test...',
    content: 'Hello EdgeKart Support,\n\nOrder EK-ORD-90809 arrived yesterday. During testing, driver channel B on one of the stepper motor boards was unresponsive. Requesting warranty replacement.\n\nThank you,\nManish',
    date: '2026-07-22T09:15:00Z',
    status: 'Unread',
    category: 'Warranty & Return'
  }
];

export const AdminMessages: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(MOCK_MESSAGES[0]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [replyText, setReplyText] = useState('');

  const filteredMessages = MOCK_MESSAGES.filter((msg) => {
    if (filterStatus === 'All') return true;
    return msg.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Messages & Inquiries"
        subtitle="Customer support tickets, hardware procurement requests, and technical inquiries."
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Messages' }
        ]}
      />

      {/* Messages Inbox Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px]">
        {/* Left List Pane (4 cols on lg) */}
        <div className="lg:col-span-5 glass rounded-2xl border border-slate-800/80 p-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center space-x-2 text-slate-200">
              <Inbox className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Support Inbox ({filteredMessages.length})</h3>
            </div>
            <div className="flex items-center space-x-1">
              {['All', 'Unread'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    filterStatus === st ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto pr-1">
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => setSelectedMessage(msg)}
                className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                  selectedMessage?.id === msg.id
                    ? 'bg-blue-600/15 border-blue-500/40 shadow-sm shadow-blue-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-slate-100">{msg.senderName}</span>
                  <span className="text-[10px] text-slate-500">
                    {new Date(msg.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="text-xs font-medium text-slate-300 truncate">{msg.subject}</div>
                <div className="text-[11px] text-slate-400 truncate mt-1">{msg.snippet}</div>
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700">
                    {msg.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      msg.status === 'Unread'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Message Preview & Reply Pane (7 cols on lg) */}
        <div className="lg:col-span-7 glass rounded-2xl border border-slate-800/80 p-6 flex flex-col justify-between">
          {selectedMessage ? (
            <>
              <div>
                {/* Header info */}
                <div className="border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {selectedMessage.category}
                    </span>
                    <span className="text-xs text-slate-400">{new Date(selectedMessage.date).toLocaleString()}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-100 mb-2">{selectedMessage.subject}</h2>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span className="font-semibold text-slate-200">{selectedMessage.senderName}</span>
                    <span>({selectedMessage.senderEmail})</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed min-h-[160px]">
                  {selectedMessage.content}
                </div>
              </div>

              {/* Reply Box */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Compose Reply
                </label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type response to customer..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500"
                />
                <div className="mt-3 flex justify-end">
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-colors cursor-pointer">
                    <Send className="w-3.5 h-3.5" />
                    Send Response
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 py-12">
              <Mail className="w-10 h-10 text-slate-600 mb-2" />
              <p className="font-medium text-slate-300">Select a message to read details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminMessages;
