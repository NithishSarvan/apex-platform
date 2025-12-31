import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiSearch,
    FiFilter,
    FiPlus,
    FiPlay,
    FiCopy,
    FiDownload,
    FiClock,
    FiUsers,
    FiChevronDown,
    FiChevronUp,
    FiChevronRight,
    FiGrid, FiList

} from 'react-icons/fi';
import './PreDefineWFcss.css';

const PredefinedWorkflows = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedWorkflow, setExpandedWorkflow] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);


    // Tabs configuration
    const tabs = [
        { id: 'all', label: 'All Workflows', count: 12 },
        { id: 'customer-support', label: 'Customer Support', count: 4 },
        { id: 'data-processing', label: 'Data Processing', count: 3 },
        { id: 'marketing', label: 'Marketing', count: 2 },
        { id: 'document', label: 'Document', count: 3 },
    ];

    // Workflow templates data - simplified to match screenshot
    // Predefined workflow templates
    const workflowTemplates = [
        {
            id: 1,
            name: 'Customer Email Support',
            description: 'Automated email response system using AI for customer inquiries',
            category: 'customer-support',
            // icon: '📧',
            color: 'bg-blue-100 text-blue-600',
            nodes: 5,
            estimatedTime: '15 min',
            complexity: 'Beginner',
            usage: 'High',
            popularity: 95,
            tags: ['AI', 'Email', 'Support', 'Automation'],
            author: 'Sales Team',
            lastUpdated: '2 days ago',
            stars: 4.8,
            reviews: 42,
            steps: [
                'Email trigger setup',
                'AI intent recognition',
                'Response generation',
                'Database logging',
                'Email delivery'
            ]
        },
        {
            id: 2,
            name: 'Document Analysis Pipeline',
            description: 'Extract and analyze information from uploaded documents using OCR and AI',
            category: 'document',
            // icon: '📄',
            color: 'bg-green-100 text-green-600',
            nodes: 7,
            estimatedTime: '25 min',
            complexity: 'Intermediate',
            usage: 'Medium',
            popularity: 87,
            tags: ['Document', 'OCR', 'AI', 'Processing'],
            author: 'Operations',
            lastUpdated: '1 week ago',
            stars: 4.6,
            reviews: 28,
            steps: [
                'Document upload',
                'OCR processing',
                'Data extraction',
                'AI analysis',
                'Validation',
                'Database storage',
                'Report generation'
            ]
        },
        {
            id: 3,
            name: 'Real-time Chat Assistant',
            description: 'AI-powered chat assistant for instant customer query resolution',
            category: 'customer-support',
            // icon: '💬',
            color: 'bg-purple-100 text-purple-600',
            nodes: 6,
            estimatedTime: '20 min',
            complexity: 'Intermediate',
            usage: 'High',
            popularity: 92,
            tags: ['Chat', 'Real-time', 'AI', 'Support'],
            author: 'Tech Team',
            lastUpdated: 'Yesterday',
            stars: 4.9,
            reviews: 56,
            steps: [
                'Chat interface setup',
                'Intent detection',
                'Context management',
                'Response generation',
                'Fallback handling',
                'Session logging'
            ]
        },
        {
            id: 4,
            name: 'Data Cleaning Pipeline',
            description: 'Automated data cleaning and enrichment workflow',
            category: 'data-processing',
            icon: '🗃️',
            color: 'bg-orange-100 text-orange-600',
            nodes: 8,
            estimatedTime: '30 min',
            complexity: 'Advanced',
            usage: 'Medium',
            popularity: 78,
            tags: ['Data', 'ETL', 'Cleaning', 'AI'],
            author: 'Data Team',
            lastUpdated: '3 days ago',
            stars: 4.4,
            reviews: 19,
            steps: [
                'Data ingestion',
                'Validation rules',
                'Duplicate removal',
                'Format standardization',
                'AI enrichment',
                'Quality check',
                'Error handling',
                'Output generation'
            ]
        },
        {
            id: 5,
            name: 'Lead Qualification Bot',
            description: 'Automated lead scoring and qualification system',
            category: 'marketing',
            // icon: '🎯',
            color: 'bg-teal-100 text-teal-600',
            nodes: 5,
            estimatedTime: '12 min',
            complexity: 'Beginner',
            usage: 'High',
            popularity: 89,
            tags: ['Marketing', 'Leads', 'AI', 'Scoring'],
            author: 'Marketing',
            lastUpdated: 'Today',
            stars: 4.7,
            reviews: 34,
            steps: [
                'Lead data collection',
                'Scoring rules',
                'AI prediction',
                'Priority assignment',
                'CRM integration'
            ]
        },
        {
            id: 6,
            name: 'Invoice Processing',
            description: 'Extract and process invoice data automatically',
            category: 'document',
            // icon: '🧾',
            color: 'bg-lime-100 text-lime-600',
            nodes: 6,
            estimatedTime: '20 min',
            complexity: 'Intermediate',
            usage: 'High',
            popularity: 91,
            tags: ['Invoice', 'Finance', 'OCR', 'Automation'],
            author: 'Finance',
            lastUpdated: 'Yesterday',
            stars: 4.8,
            reviews: 41,
            steps: [
                'Invoice upload',
                'Data extraction',
                'Validation',
                'Approval workflow',
                'ERP integration',
                'Payment processing'
            ]
        }
    ];

    // Filter workflows
    const filteredWorkflows = workflowTemplates.filter(workflow => {
        const matchesTab = activeTab === 'all' || workflow.category === activeTab;
        const matchesSearch = workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            workflow.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            workflow.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTab && matchesSearch;
    });

    const toggleExpand = (workflowId) => {
        setExpandedWorkflow(expandedWorkflow === workflowId ? null : workflowId);
    };

    const handleUseTemplate = (workflowId) => {
        navigate(`/workf-builder?template=${workflowId}`);
    };

    const getComplexityColor = (complexity) => {
        switch (complexity.toLowerCase()) {
            case 'beginner': return 'bg-green-100 text-green-800';
            case 'intermediate': return 'bg-yellow-100 text-yellow-800';
            case 'advanced': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="main-content">
            {/* Header Section - Clean minimal header */}
            {/* Header Section */}

            <div className="mb-6">
                <div className="flex justify-between items-start ">
                    <h1 className="text-2xl font-bold text-black-500">Predefined Workflows</h1>
                    {/* <button className="px-4 py-2 bg-[#00d4aa] hover:bg-[#00b894] text-white rounded-lg font-medium transition-colors">
                        Configure AI
                    </button> */}
                    <button className="request-model-btn" onClick={() => navigate('/workflows')}
                    >Create Custom</button>
                </div>
                <div className='heighligts my-4'>
                    <p className="text-sm text-gray-600">Ready-to-use workflow templates for common automation scenarios</p>
                </div>
            </div>

            <div className="mb-8">




                {/* Top Navigation Bar with Search and Filters */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Search Bar */}
                        <div className="flex-1">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search workflows..."
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Filter Controls */}
                        <div className="flex items-center gap-3">
                            {/* View Toggle */}
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                                >
                                    <FiGrid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                                >
                                    <FiList size={18} />
                                </button>
                            </div>

                            {/* Filter Button */}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors ${showFilters ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                            >
                                <FiFilter size={16} />
                                Filter
                                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                                    {activeTab !== 'all' ? '1' : '0'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Filter Categories - Dropdown/Pill Style */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex flex-wrap gap-2">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === tab.id
                                            ? 'bg-[#00d4aa] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {tab.label}
                                        <span className={`text-xs px-1.5 py-0.5 rounded ${activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200'}`}>
                                            {tab.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Active Filter Tabs - Always Visible */}
                    <div className="mt-4">
                        <div className="flex flex-wrap gap-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-[#00d4aa] text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {tab.label}
                                    <span className="ml-1 text-xs opacity-90">({tab.count})</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>





            {/* Main Container */}
            {/* Workflow Cards */}
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}`}>
                {filteredWorkflows.map(workflow => (
                    <div
                        key={workflow.id}
                        className="bg-white rounded-lg border border-gray-200 p-5"
                    >
                        {/* Title with badge */}
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-gray-900">{workflow.name}</h3>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {workflow.nodes} nodes
                            </span>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getComplexityColor(workflow.complexity)}`}>
                                {workflow.complexity}
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">
                                <FiClock className="inline mr-1" size={10} />
                                {workflow.estimatedTime}
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                            {workflow.description}
                        </p>

                        {/* Tags - Simple */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {workflow.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded border border-gray-200">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Expand button */}
                        <div className="mb-4">
                            <button
                                onClick={() => toggleExpand(workflow.id)}
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                            >
                                {expandedWorkflow === workflow.id ? 'Show Less' : 'View Details'}
                                {expandedWorkflow === workflow.id ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                            </button>
                        </div>

                        {/* Expanded content */}
                        {expandedWorkflow === workflow.id && (
                            <div className="mb-4 pt-3 border-t border-gray-100">
                                <div className="text-xs text-gray-500 mb-2">Steps:</div>
                                <div className="space-y-1.5">
                                    {workflow.steps.map((step, index) => (
                                        <div key={index} className="text-sm text-gray-600">
                                            {index + 1}. {step}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Use Template Button */}
                        <button
                            onClick={() => handleUseTemplate(workflow.id)}
                            className="w-full py-2.5 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded text-sm font-medium"
                        >
                            Use Template
                        </button>
                    </div>
                ))}
            </div>


            {/* Empty State */}
            {filteredWorkflows.length === 0 && (
                <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No workflows found</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                        Try adjusting your search terms or select a different category
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setActiveTab('all');
                        }}
                        className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                        Clear All Filters
                    </button>
                </div>
            )}


        </div>
    );
};

export default PredefinedWorkflows;

