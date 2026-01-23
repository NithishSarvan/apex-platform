import React, { useState } from 'react';
import { FiDownload, FiFilter, FiCalendar, FiTrendingUp, FiTrendingDown, FiPieChart, FiBarChart2 } from 'react-icons/fi';

const UtilizationReport = () => {
    const [timeRange, setTimeRange] = useState('monthly');
    const [selectedMetric, setSelectedMetric] = useState('overall');

    const timeRanges = [
        { id: 'weekly', label: 'Weekly' },
        { id: 'monthly', label: 'Monthly' },
        { id: 'quarterly', label: 'Quarterly' },
        { id: 'yearly', label: 'Yearly' }
    ];

    const metrics = [
        { id: 'overall', label: 'Overall Utilization', value: '89%', change: '+2.5%', trend: 'up' },
        { id: 'api', label: 'API Calls', value: '1.2M', change: '+15%', trend: 'up' },
        { id: 'storage', label: 'Storage Used', value: '245 GB', change: '-3%', trend: 'down' },
        { id: 'compute', label: 'Compute Hours', value: '1,850', change: '+8%', trend: 'up' }
    ];

    const reports = [
        {
            id: 1,
            client: 'TechCorp Inc.',
            period: 'Q1 2024',
            utilization: '92%',
            apiCalls: '450K',
            storage: '78 GB',
            compute: '520 hrs',
            status: 'Completed'
        },
        {
            id: 2,
            client: 'DataFlow Systems',
            period: 'Q1 2024',
            utilization: '85%',
            apiCalls: '320K',
            storage: '45 GB',
            compute: '380 hrs',
            status: 'Completed'
        },
        {
            id: 3,
            client: 'CloudNine Solutions',
            period: 'Q1 2024',
            utilization: '78%',
            apiCalls: '210K',
            storage: '32 GB',
            compute: '290 hrs',
            status: 'In Progress'
        },
        {
            id: 4,
            client: 'InnovateTech Ltd.',
            period: 'Q1 2024',
            utilization: '96%',
            apiCalls: '580K',
            storage: '90 GB',
            compute: '660 hrs',
            status: 'Completed'
        }
    ];

    const generateReport = () => {
        // Report generation logic
        console.log('Generating report...');
    };

    return (
        <div className="main-content">
            {/* Header */}
            <div className="flex flex-col items-start justify-between gap-3 mb-8 md:flex-row">
                <div>
                    <h1 className="mb-2 text-2xl font-bold text-gray-900">Utilization Report</h1>
                    <p className="text-gray-600">
                        Monitor resource usage, generate reports, and analyze performance metrics
                    </p>
                </div>
                <button
                    onClick={generateReport}
                    className="px-4 py-2 bg-[#00d4aa] hover:bg-[#00b894] text-white rounded-lg font-medium flex items-center gap-2"
                >
                    <FiDownload size={16} /> Generate Report
                </button>
            </div>

            {/* Time Range Selector */}
            <div className="p-4 mb-6 bg-white border border-gray-200 rounded-lg">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex items-center gap-2">
                        <FiCalendar className="text-gray-400" size={18} />
                        <h3 className="font-medium text-gray-700">Select Time Range</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {timeRanges.map(range => (
                            <button
                                key={range.id}
                                onClick={() => setTimeRange(range.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium ${timeRange === range.id
                                    ? 'bg-[#00d4aa] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map(metric => (
                    <div
                        key={metric.id}
                        className={`bg-white rounded-lg border border-gray-200 p-4 cursor-pointer transition-all ${selectedMetric === metric.id ? 'ring-2 ring-[#00d4aa]' : ''}`}
                        onClick={() => setSelectedMetric(metric.id)}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <div className="text-sm text-gray-600">{metric.label}</div>
                                <div className="mt-1 text-xl font-bold text-gray-900">{metric.value}</div>
                            </div>
                            <div className={`flex items-center gap-1 ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                {metric.trend === 'up' ? <FiTrendingUp /> : <FiTrendingDown />}
                                <span className="text-sm">{metric.change}</span>
                            </div>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div
                                className={`h-2 rounded-full ${metric.trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{ width: metric.id === 'overall' ? '89%' : metric.id === 'api' ? '75%' : metric.id === 'storage' ? '65%' : '82%' }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-2">
                {/* Utilization Chart */}
                <div className="p-5 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="flex items-center gap-2 font-semibold text-gray-800">
                            <FiPieChart /> Utilization Trends
                        </h3>
                        <select className="px-3 py-1.5 border border-gray-300 rounded text-sm">
                            <option>Last 30 days</option>
                            <option>Last 90 days</option>
                            <option>Last year</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-center h-64 border border-gray-300 border-dashed rounded-lg">
                        <div className="text-center">
                            <FiBarChart2 className="mx-auto mb-2 text-3xl text-gray-400" />
                            <p className="text-sm text-gray-500">Utilization chart visualization</p>
                        </div>
                    </div>
                </div>

                {/* Top Clients */}
                <div className="p-5 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-gray-800">Top Clients by Utilization</h3>
                        <span className="text-sm text-gray-500">Q1 2024</span>
                    </div>
                    <div className="space-y-4">
                        {reports.slice(0, 4).map((report, index) => (
                            <div key={report.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 text-sm font-bold text-blue-600 bg-blue-100 rounded-lg">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{report.client}</div>
                                        <div className="text-xs text-gray-500">{report.period}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-gray-900">{report.utilization}</div>
                                    <div className="text-xs text-gray-500">utilization</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Reports List */}
            <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
                <div className="p-5 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Generated Reports</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Client</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Period</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Utilization</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">API Calls</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Storage</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Compute</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Status</th>
                                <th className="px-4 py-3 text-xs font-medium text-left text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {reports.map(report => (
                                <tr key={report.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-medium text-gray-900">{report.client}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-900">{report.period}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm font-bold text-gray-900">{report.utilization}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-900">{report.apiCalls}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-900">{report.storage}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-sm text-gray-900">{report.compute}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${report.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                                View
                                            </button>
                                            <button className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                                <FiDownload size={12} /> PDF
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

export default UtilizationReport;