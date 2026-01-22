import React, { useState } from 'react';
import { FiDollarSign, FiDownload, FiFilter, FiCalendar, FiCheck, FiClock, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';

const BillingSummary = () => {
    const [timePeriod, setTimePeriod] = useState('this-month');
    const [selectedView, setSelectedView] = useState('overview');

    const billingData = {
        totalRevenue: 42580,
        pendingPayments: 12850,
        collected: 29730,
        growth: 12.5,
        invoices: 156,
        paidInvoices: 142
    };

    const invoices = [
        {
            id: 'INV-2024-001',
            client: 'TechCorp Inc.',
            date: '2024-03-01',
            dueDate: '2024-03-15',
            amount: 12500,
            status: 'Paid',
            plan: 'Enterprise'
        },
        {
            id: 'INV-2024-002',
            client: 'DataFlow Systems',
            date: '2024-03-01',
            dueDate: '2024-03-15',
            amount: 8500,
            status: 'Paid',
            plan: 'Business'
        },
        {
            id: 'INV-2024-003',
            client: 'CloudNine Solutions',
            date: '2024-03-01',
            dueDate: '2024-03-15',
            amount: 3200,
            status: 'Pending',
            plan: 'Starter'
        },
        {
            id: 'INV-2024-004',
            client: 'InnovateTech Ltd.',
            date: '2024-03-01',
            dueDate: '2024-03-15',
            amount: 17800,
            status: 'Overdue',
            plan: 'Enterprise'
        }
    ];

    const timePeriods = [
        { id: 'this-month', label: 'This Month' },
        { id: 'last-month', label: 'Last Month' },
        { id: 'this-quarter', label: 'This Quarter' },
        { id: 'this-year', label: 'This Year' }
    ];

    const views = [
        { id: 'overview', label: 'Overview' },
        { id: 'invoices', label: 'Invoices' },
        { id: 'revenue', label: 'Revenue' },
        { id: 'clients', label: 'Clients' }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Paid': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Overdue': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="main-content">
            {/* Header */}
            <div className="flex flex-col items-start justify-between gap-2 mb-8 md:flex-row md:gap-0">
                <div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">Billing Summary</h1>
                    <p className="text-gray-600">
                        Track billing, manage invoices, and monitor revenue streams
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <FiDownload size={16} /> Export
                    </button>
                    <button className="px-4 py-2 bg-[#00d4aa] hover:bg-[#00b894] text-white rounded-lg font-medium">
                        Send Reminders
                    </button>
                </div>
            </div>

            {/* Time Period Selector */}
            <div className="p-4 mb-6 bg-white border border-gray-200 rounded-lg">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-2">
                        <FiCalendar className="text-gray-400" size={18} />
                        <h3 className="font-medium text-gray-700">Billing Period</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {timePeriods.map(period => (
                            <button
                                key={period.id}
                                onClick={() => setTimePeriod(period.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${timePeriod === period.id
                                    ? 'bg-[#00d4aa] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* View Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
                {views.map(view => (
                    <button
                        key={view.id}
                        onClick={() => setSelectedView(view.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedView === view.id
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {view.label}
                    </button>
                ))}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-5 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                            <FiDollarSign className="text-green-600" size={20} />
                        </div>
                        <div className="flex items-center gap-1 text-green-500">
                            <FiTrendingUp />
                            <span className="text-sm">+{billingData.growth}%</span>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(billingData.totalRevenue)}</div>
                    <div className="mt-1 text-sm text-gray-600">Total Revenue</div>
                </div>

                <div className="p-5 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg">
                            <FiClock className="text-yellow-600" size={20} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(billingData.pendingPayments)}</div>
                    <div className="mt-1 text-sm text-gray-600">Pending Payments</div>
                </div>

                <div className="p-5 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                            <FiCheck className="text-blue-600" size={20} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(billingData.collected)}</div>
                    <div className="mt-1 text-sm text-gray-600">Collected</div>
                </div>

                <div className="p-5 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
                            <FiAlertCircle className="text-purple-600" size={20} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{billingData.invoices}</div>
                    <div className="mt-1 text-sm text-gray-600">Total Invoices</div>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between p-5 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Recent Invoices</h3>
                    <div className="flex items-center gap-2">
                        <FiFilter className="text-gray-400" size={16} />
                        <select className="px-3 py-1.5 border border-gray-300 rounded text-sm">
                            <option>All Status</option>
                            <option>Paid</option>
                            <option>Pending</option>
                            <option>Overdue</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Invoice ID</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Client</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Date</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Due Date</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Amount</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Plan</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Status</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {invoices.map(invoice => (
                                <tr key={invoice.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-medium text-gray-900">{invoice.id}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-900">{invoice.client}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-900">{invoice.date}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className={`text-sm ${invoice.status === 'Overdue' ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                                            {invoice.dueDate}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-bold text-gray-900">{formatCurrency(invoice.amount)}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded">
                                            {invoice.plan}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(invoice.status)}`}>
                                            {invoice.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                                View
                                            </button>
                                            <button className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                                <FiDownload size={12} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment Summary */}
            <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
                <div className="p-5 bg-white border border-gray-200 rounded-lg">
                    <h3 className="mb-4 font-semibold text-gray-800">Payment Summary</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Total Invoices</div>
                            <div className="text-sm font-medium text-gray-900">{billingData.invoices}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Paid Invoices</div>
                            <div className="text-sm font-medium text-gray-900">{billingData.paidInvoices}</div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">Pending Invoices</div>
                            <div className="text-sm font-medium text-gray-900">{billingData.invoices - billingData.paidInvoices}</div>
                        </div>
                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-medium text-gray-900">Collection Rate</div>
                                <div className="text-sm font-bold text-green-600">
                                    {Math.round((billingData.paidInvoices / billingData.invoices) * 100)}%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 bg-white border border-gray-200 rounded-lg">
                    <h3 className="mb-4 font-semibold text-gray-800">Upcoming Payments</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                            <div>
                                <div className="text-sm font-medium text-gray-900">TechCorp Inc.</div>
                                <div className="text-xs text-gray-500">Due in 5 days</div>
                            </div>
                            <div className="text-sm font-bold text-gray-900">{formatCurrency(12500)}</div>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50">
                            <div>
                                <div className="text-sm font-medium text-gray-900">DataFlow Systems</div>
                                <div className="text-xs text-gray-500">Due in 10 days</div>
                            </div>
                            <div className="text-sm font-bold text-gray-900">{formatCurrency(8500)}</div>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                            <div>
                                <div className="text-sm font-medium text-gray-900">CloudNine Solutions</div>
                                <div className="text-xs text-gray-500">Due in 15 days</div>
                            </div>
                            <div className="text-sm font-bold text-gray-900">{formatCurrency(3200)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingSummary;