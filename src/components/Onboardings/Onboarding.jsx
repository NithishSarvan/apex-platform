import React from 'react';

const Onboarding = () => {
    return (
        <div className="main-content">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Onboarding</h1>
                <p className="text-gray-600">
                    Manage client onboarding, licenses, utilization reports, and billing summaries
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-lg font-bold text-gray-900">24</div>
                    <div className="text-xs text-gray-600">Active Clients</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-lg font-bold text-gray-900">156</div>
                    <div className="text-xs text-gray-600">Total Licenses</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-lg font-bold text-gray-900">89%</div>
                    <div className="text-xs text-gray-600">Utilization Rate</div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="text-lg font-bold text-gray-900">$42,580</div>
                    <div className="text-xs text-gray-600">Monthly Revenue</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-5 mb-8">
                <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors text-left">
                        <div className="font-medium text-gray-900 mb-1">Add New Client</div>
                        <div className="text-sm text-gray-600">Register a new client account</div>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors text-left">
                        <div className="font-medium text-gray-900 mb-1">Issue License</div>
                        <div className="text-sm text-gray-600">Generate new license keys</div>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors text-left">
                        <div className="font-medium text-gray-900 mb-1">Generate Report</div>
                        <div className="text-sm text-gray-600">Create utilization report</div>
                    </button>
                    <button className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors text-left">
                        <div className="font-medium text-gray-900 mb-1">Send Invoices</div>
                        <div className="text-sm text-gray-600">Process monthly billing</div>
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <div>
                                <div className="text-sm font-medium">TechCorp Inc. onboarded</div>
                                <div className="text-xs text-gray-500">2 hours ago</div>
                            </div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">Client</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <div>
                                <div className="text-sm font-medium">License renewed for DataFlow Systems</div>
                                <div className="text-xs text-gray-500">Yesterday</div>
                            </div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">License</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <div>
                                <div className="text-sm font-medium">Q3 Utilization report generated</div>
                                <div className="text-xs text-gray-500">2 days ago</div>
                            </div>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Report</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;