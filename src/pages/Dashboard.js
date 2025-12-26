import React from 'react';
import { FiActivity, FiCpu, FiDatabase, FiUsers, FiTrendingUp, FiGitMerge } from 'react-icons/fi';

const Dashboard = () => {
    const stats = [
        { icon: <FiCpu />, label: 'Active Models', value: '8', change: '+2' },
        { icon: <FiGitMerge />, label: 'Workflows', value: '24', change: '+5' },
        { icon: <FiUsers />, label: 'Active Clients', value: '12', change: '+3' },
        { icon: <FiDatabase />, label: 'Data Sources', value: '18', change: '+4' },
    ];

    const recentActivities = [
        { id: 1, client: 'Acme Corp', action: 'Workflow executed', time: '2 min ago', status: 'success' },
        { id: 2, client: 'TechStart', action: 'Model trained', time: '15 min ago', status: 'success' },
        { id: 3, client: 'Global Retail', action: 'API limit reached', time: '1 hour ago', status: 'warning' },
        { id: 4, client: 'HealthPlus', action: 'New client added', time: '2 hours ago', status: 'success' },
    ];

    return (
        <div className="page-container">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
                <p className="text-secondary">Welcome to LLM Orchestration Platform</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="card">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 rounded-lg bg-primary-light text-primary">
                                {stat.icon}
                            </div>
                            <span className="text-sm font-semibold text-success">{stat.change}</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                        <p className="text-sm text-secondary">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Recent Activities */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Recent Activities</h3>
                        <button className="text-sm text-primary">View All</button>
                    </div>
                    <div className="space-y-4">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-success"></div>
                                        <h4 className="font-medium">{activity.action}</h4>
                                    </div>
                                    <p className="text-sm text-secondary">{activity.client}</p>
                                </div>
                                <span className="text-sm text-secondary">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Quick Actions</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex flex-col items-center justify-center p-4 border border-border rounded-lg hover:border-primary hover:bg-primary-light transition-all">
                            <FiCpu className="text-xl mb-2 text-primary" />
                            <span className="text-sm font-medium">Add Model</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-4 border border-border rounded-lg hover:border-primary hover:bg-primary-light transition-all">
                            <FiGitMerge className="text-xl mb-2 text-primary" />
                            <span className="text-sm font-medium">Create Workflow</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-4 border border-border rounded-lg hover:border-primary hover:bg-primary-light transition-all">
                            <FiDatabase className="text-xl mb-2 text-primary" />
                            <span className="text-sm font-medium">Add Data Source</span>
                        </button>
                        <button className="flex flex-col items-center justify-center p-4 border border-border rounded-lg hover:border-primary hover:bg-primary-light transition-all">
                            <FiUsers className="text-xl mb-2 text-primary" />
                            <span className="text-sm font-medium">Add Client</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;