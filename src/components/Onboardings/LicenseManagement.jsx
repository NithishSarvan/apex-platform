import React, { useState } from 'react';
import { FiSearch, FiPlus, FiCopy, FiEdit, FiTrash2, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';

const LicenseManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const licenses = [
        {
            id: 'LIC-2024-001',
            client: 'TechCorp Inc.',
            type: 'Enterprise',
            status: 'Active',
            issuedDate: '2024-01-15',
            expiryDate: '2025-01-15',
            seats: 50,
            usedSeats: 45,
            key: 'TC-ENT-7X9Y-3Z4A-8B2C'
        },
        {
            id: 'LIC-2024-002',
            client: 'DataFlow Systems',
            type: 'Business',
            status: 'Active',
            issuedDate: '2024-02-10',
            expiryDate: '2025-02-10',
            seats: 30,
            usedSeats: 28,
            key: 'DF-BUS-1P2Q-3R4S-5T6U'
        },
        {
            id: 'LIC-2024-003',
            client: 'CloudNine Solutions',
            type: 'Starter',
            status: 'Expiring',
            issuedDate: '2024-03-05',
            expiryDate: '2024-09-05',
            seats: 15,
            usedSeats: 12,
            key: 'CN-STR-A1B2-C3D4-E5F6'
        },
        {
            id: 'LIC-2024-004',
            client: 'InnovateTech Ltd.',
            type: 'Enterprise',
            status: 'Suspended',
            issuedDate: '2023-12-20',
            expiryDate: '2024-12-20',
            seats: 75,
            usedSeats: 67,
            key: 'IT-ENT-G7H8-I9J0-K1L2'
        }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Expiring': return 'bg-yellow-100 text-yellow-800';
            case 'Suspended': return 'bg-red-100 text-red-800';
            case 'Expired': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Enterprise': return 'bg-purple-100 text-purple-800';
            case 'Business': return 'bg-blue-100 text-blue-800';
            case 'Starter': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
    };

    return (
        <div className="main-content">
            {/* Header */}
            <div className="flex flex-col items-start justify-between gap-3 mb-8 md:flex-row">
                <div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">License Management</h1>
                    <p className="text-gray-600">
                        Manage software licenses, track usage, and handle renewals
                    </p>
                </div>
                <button className="px-4 py-2 bg-[#00d4aa] hover:bg-[#00b894] text-white rounded-lg font-medium flex items-center gap-2">
                    <FiPlus size={16} /> Generate License
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">156</div>
                    <div className="text-xs text-gray-600">Total Licenses</div>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="text-lg font-bold text-green-600">142</div>
                    <div className="text-xs text-gray-600">Active Licenses</div>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="text-lg font-bold text-yellow-600">8</div>
                    <div className="text-xs text-gray-600">Expiring Soon</div>
                </div>
                <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">94%</div>
                    <div className="text-xs text-gray-600">Utilization Rate</div>
                </div>
            </div>

            {/* Search and Actions */}
            <div className="p-4 mb-6 bg-white border border-gray-200 rounded-lg">
                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
                        <div className="relative">
                            <FiSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                            <input
                                type="text"
                                placeholder="Search licenses..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2">
                            <FiRefreshCw size={14} /> Renew All
                        </button>
                        <button className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                            Export
                        </button>
                    </div>
                </div>
            </div>

            {/* Licenses Table */}
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">License ID</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Client</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Type</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Status</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Seats</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Expiry</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {licenses.map(license => (
                                <tr key={license.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-medium text-gray-900">{license.id}</div>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="text-xs text-gray-500 truncate max-w-[120px]">
                                                {license.key}
                                            </span>
                                            <button
                                                onClick={() => copyToClipboard(license.key)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <FiCopy size={12} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-900">{license.client}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(license.type)}`}>
                                            {license.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(license.status)}`}>
                                            {license.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-900">
                                            {license.usedSeats}/{license.seats}
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                            <div
                                                className="bg-green-500 h-1.5 rounded-full"
                                                style={{ width: `${(license.usedSeats / license.seats) * 100}%` }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-900">{license.expiryDate}</div>
                                        <div className="text-xs text-gray-500">
                                            {license.status === 'Expiring' ? 'Expires in 3 months' : 'Active'}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button className="p-1 text-blue-600 hover:text-blue-800">
                                                <FiEdit size={14} />
                                            </button>
                                            <button className="p-1 text-gray-600 hover:text-gray-800">
                                                <FiRefreshCw size={14} />
                                            </button>
                                            <button className="p-1 text-red-600 hover:text-red-800">
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
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

export default LicenseManagement;