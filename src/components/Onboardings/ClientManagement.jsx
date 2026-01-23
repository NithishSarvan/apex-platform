import React, { useState } from 'react';
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiUser, FiMail, FiX, FiSave, FiHome, FiPhone, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const ClientManagement = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedClient, setExpandedClient] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newClient, setNewClient] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        plan: 'Starter',
        status: 'Pending'
    });

    const [clients, setClients] = useState([
        {
            id: 1,
            name: 'TechCorp Inc.',
            email: 'contact@techcorp.com',
            phone: '+1 (555) 123-4567',
            status: 'Active',
            plan: 'Enterprise',
            joinDate: '2024-01-15',
            users: 45,
            location: 'San Francisco, CA'
        },
        {
            id: 2,
            name: 'DataFlow Systems',
            email: 'info@dataflow.com',
            phone: '+1 (555) 987-6543',
            status: 'Active',
            plan: 'Business',
            joinDate: '2024-02-10',
            users: 28,
            location: 'New York, NY'
        },
        {
            id: 3,
            name: 'CloudNine Solutions',
            email: 'support@cloudnine.com',
            phone: '+1 (555) 456-7890',
            status: 'Pending',
            plan: 'Starter',
            joinDate: '2024-03-05',
            users: 12,
            location: 'Austin, TX'
        },
        {
            id: 4,
            name: 'InnovateTech Ltd.',
            email: 'hello@innovatetech.com',
            phone: '+1 (555) 321-0987',
            status: 'Active',
            plan: 'Enterprise',
            joinDate: '2023-12-20',
            users: 67,
            location: 'Seattle, WA'
        }
    ]);

    const toggleExpand = (clientId) => {
        setExpandedClient(expandedClient === clientId ? null : clientId);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800';
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Suspended': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleAddClient = () => {
        if (!newClient.name || !newClient.email) {
            alert('Please fill in required fields');
            return;
        }

        const newClientData = {
            id: Date.now(),
            ...newClient,
            joinDate: new Date().toISOString().split('T')[0],
            users: 0,
            location: `${newClient.city}, ${newClient.state}`
        };

        setClients([newClientData, ...clients]);
        setShowAddModal(false);
        resetNewClientForm();
    };

    const resetNewClientForm = () => {
        setNewClient({
            name: '',
            email: '',
            phone: '',
            company: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            plan: 'Starter',
            status: 'Pending'
        });
    };

    const handleDeleteClient = (clientId) => {
        if (window.confirm('Are you sure you want to delete this client?')) {
            setClients(clients.filter(client => client.id !== clientId));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewClient(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="main-content">
            {/* Header */}
            <div className="flex flex-col items-start justify-between gap-3 mb-8 md:flex-row">
                <div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">Client Management</h1>
                    <p className="text-gray-600">
                        Manage client accounts, track activities, and oversee client relationships
                    </p>
                </div>
                <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-[#00d4aa] hover:bg-[#00b894] text-white rounded-lg font-medium flex items-center gap-2">
                    <FiPlus size={16} /> Add Client
                </button>
            </div>

            {/* Search and Filter */}
            <div className="p-4 mb-6 bg-white border border-gray-200 rounded-lg">
                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
                        <div className="relative">
                            <FiSearch className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" size={18} />
                            <input
                                type="text"
                                placeholder="Search clients..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <select className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm">
                            <option>All Status</option>
                            <option>Active</option>
                            <option>Pending</option>
                            <option>Suspended</option>
                        </select>
                        <select className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm">
                            <option>All Plans</option>
                            <option>Starter</option>
                            <option>Business</option>
                            <option>Enterprise</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Clients List */}
            <div className="space-y-4">
                {clients.map(client => (
                    <div key={client.id} className="p-5 bg-white border border-gray-200 rounded-lg">
                        <div className="flex flex-col justify-between md:flex-row md:items-center">
                            <div className="flex items-center gap-3 mb-4 md:mb-0">
                                <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                                    <FiUser className="text-blue-600" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{client.name}</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(client.status)}`}>
                                            {client.status}
                                        </span>
                                        <span className="text-sm text-gray-500">{client.plan} Plan</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50">
                                    <FiEdit size={14} />
                                </button>
                                <button className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50">
                                    <FiTrash2 size={14} />
                                </button>
                                <button
                                    onClick={() => toggleExpand(client.id)}
                                    className="px-3 py-1.5 border border-gray-300 rounded text-sm hover:bg-gray-50"
                                >
                                    {expandedClient === client.id ? <FiChevronUp /> : <FiChevronDown />}
                                </button>
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-3">
                            <div className="flex items-center gap-2 text-sm">
                                <FiMail className="text-gray-400" size={16} />
                                <span className="text-gray-600">{client.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <FiPhone className="text-gray-400" size={16} />
                                <span className="text-gray-600">{client.phone}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                                Joined: {client.joinDate}
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedClient === client.id && (
                            <div className="pt-4 mt-4 border-t border-gray-100">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <div className="mb-1 text-sm font-medium text-gray-700">Location</div>
                                        <div className="text-sm text-gray-600">{client.location}</div>
                                    </div>
                                    <div>
                                        <div className="mb-1 text-sm font-medium text-gray-700">Active Users</div>
                                        <div className="text-sm text-gray-600">{client.users} users</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Client Modal */}
            {showAddModal && (
                <div className="fixed inset-x-0 top-[64px] bottom-0 bg-black bg-opacity-50 
             flex justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Add New Client</h2>
                                <p className="mt-1 text-sm text-gray-600">Fill in the client details below</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    resetNewClientForm();
                                }}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* Basic Information */}
                                <div className="md:col-span-2">
                                    <h3 className="flex items-center gap-2 mb-4 font-medium text-gray-700">
                                        <FiUser /> Basic Information
                                    </h3>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newClient.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00d4aa] focus:border-[#00d4aa]"
                                        placeholder="John Smith"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={newClient.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00d4aa] focus:border-[#00d4aa]"
                                        placeholder="john@company.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={newClient.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00d4aa] focus:border-[#00d4aa]"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={newClient.company}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00d4aa] focus:border-[#00d4aa]"
                                        placeholder="Company Inc."
                                    />
                                </div>

                                {/* Address Information */}
                                <div className="mt-4 md:col-span-2">
                                    <h3 className="flex items-center gap-2 mb-4 font-medium text-gray-700">
                                        <FiHome /> Address Information
                                    </h3>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Street Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={newClient.address}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00d4aa] focus:border-[#00d4aa]"
                                        placeholder="123 Main Street"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={newClient.city}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00d4aa] focus:border-[#00d4aa]"
                                        placeholder="San Francisco"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={newClient.state}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00d4aa] focus:border-[#00d4aa]"
                                        placeholder="CA"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        ZIP Code
                                    </label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        value={newClient.zipCode}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00d4aa] focus:border-[#00d4aa]"
                                        placeholder="94107"
                                    />
                                </div>

                                {/* Account Settings */}
                                <div className="mt-4 md:col-span-2">
                                    <h3 className="mb-4 font-medium text-gray-700">Account Settings</h3>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Plan Type
                                    </label>
                                    <select
                                        name="plan"
                                        value={newClient.plan}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00d4aa] focus:border-[#00d4aa]"
                                    >
                                        <option value="Starter">Starter</option>
                                        <option value="Business">Business</option>
                                        <option value="Enterprise">Enterprise</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Initial Status
                                    </label>
                                    <select
                                        name="status"
                                        value={newClient.status}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#00d4aa] focus:border-[#00d4aa]"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Active">Active</option>
                                        <option value="Suspended">Suspended</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    setShowAddModal(false);
                                    resetNewClientForm();
                                }}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddClient}
                                className="px-4 py-2 bg-[#00d4aa] hover:bg-[#00b894] text-white rounded-lg font-medium flex items-center gap-2"
                            >
                                <FiSave size={16} /> Add Client
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientManagement;