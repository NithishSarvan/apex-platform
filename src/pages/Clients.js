import React, { useState } from 'react';
import { FiUsers, FiUserPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

const Clients = () => {
    const [clients, setClients] = useState([
        { id: 1, name: 'Acme Corp', email: 'contact@acme.com', models: 3, workflows: 5, status: 'active' },
        { id: 2, name: 'TechStart Inc', email: 'info@techstart.com', models: 2, workflows: 3, status: 'active' },
        { id: 3, name: 'Global Retail', email: 'support@globalretail.com', models: 1, workflows: 2, status: 'pending' },
    ]);

    const [selectedClient, setSelectedClient] = useState(1);
    const [showAddModal, setShowAddModal] = useState(false);

    const selectedClientData = clients.find(c => c.id === selectedClient);

    return (
        <div className="page-container">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Clients</h1>
                    <p className="text-secondary">Manage multi-tenant clients and configurations</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary"
                >
                    <FiUserPlus /> Add Client
                </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Client List */}
                <div className="col-span-2">
                    <div className="card">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Client Name</th>
                                    <th>Contact</th>
                                    <th>Models</th>
                                    <th>Workflows</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map((client) => (
                                    <tr
                                        key={client.id}
                                        className={`cursor-pointer ${selectedClient === client.id ? 'bg-primary-light' : ''}`}
                                        onClick={() => setSelectedClient(client.id)}
                                    >
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                                                    {client.name.charAt(0)}
                                                </div>
                                                <span className="font-medium">{client.name}</span>
                                            </div>
                                        </td>
                                        <td>{client.email}</td>
                                        <td>{client.models}</td>
                                        <td>{client.workflows}</td>
                                        <td>
                                            <span className={`status-badge ${client.status === 'active' ? 'status-active' : 'status-inactive'
                                                }`}>
                                                {client.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button className="btn-icon">
                                                    <FiEdit />
                                                </button>
                                                <button className="btn-icon">
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Client Details */}
                <div className="col-span-1">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Client Details</h3>
                        </div>

                        {selectedClientData ? (
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-lg">
                                        {selectedClientData.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{selectedClientData.name}</h3>
                                        <p className="text-secondary">{selectedClientData.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                                        <span>Active Models</span>
                                        <span className="font-semibold">{selectedClientData.models}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                                        <span>Workflows</span>
                                        <span className="font-semibold">{selectedClientData.workflows}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                                        <span>API Usage</span>
                                        <span className="font-semibold">1.2K calls</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <button className="btn btn-secondary w-full justify-start">
                                        Configure Client
                                    </button>
                                    <button className="btn btn-secondary w-full justify-start">
                                        Edit Details
                                    </button>
                                    <button className="btn btn-secondary w-full justify-start">
                                        Reset API Keys
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto bg-background rounded-full flex items-center justify-center mb-4">
                                    <FiUsers className="text-2xl text-secondary" />
                                </div>
                                <p className="text-secondary">Select a client to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Client Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="card w-full max-w-md">
                        <div className="card-header">
                            <h3 className="card-title">Add New Client</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="btn-icon"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="input-group">
                                <label className="label">Company Name</label>
                                <input type="text" className="input" placeholder="Enter company name" />
                            </div>

                            <div className="input-group">
                                <label className="label">Contact Email</label>
                                <input type="email" className="input" placeholder="contact@company.com" />
                            </div>

                            <div className="input-group">
                                <label className="label">Plan</label>
                                <select className="select">
                                    <option>Starter</option>
                                    <option>Professional</option>
                                    <option>Enterprise</option>
                                </select>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        // Add client logic here
                                        setShowAddModal(false);
                                    }}
                                    className="btn btn-primary flex-1"
                                >
                                    Create Client
                                </button>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="btn btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Clients;