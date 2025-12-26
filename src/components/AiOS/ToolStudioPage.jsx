// ==================== COMPONENT 6: TOOL STUDIO PAGE ====================
import React, { useState, useRef } from 'react';
import {
    FiPlus,
    FiTrash2,
    FiEdit,
    FiSearch,
    FiFilter,
    FiDatabase,
    FiLink,
    FiFileText,
    FiChevronRight,
    FiSettings,
    FiInfo,
    FiCheck,
    FiCopy,
    FiUpload,
    FiDownload,
    FiCode,
    FiTerminal,
    FiPlay,
    FiTool,
    FiList,
    FiBox,
    FiGlobe,
    FiActivity
} from 'react-icons/fi';
import { AiOutlineApi, AiOutlineFunction, AiOutlineQuestionCircle } from 'react-icons/ai';
import { useLocation } from 'react-router-dom';

export const ToolStudioPage = ({ industry = 'Insurance' }) => {
    const [tools, setTools] = useState([
        {
            id: 1,
            name: 'get_policy_details',
            description: 'Fetch policy expiry, nominee, premium amount',
            type: 'sql',
            sql: 'SELECT policy_number, expiry_date, nominee_name, premium_amount, due_date FROM policies WHERE policy_number = {{policy_number}}',
            parameters: [{ name: 'policy_number', type: 'string', required: true }],
            category: 'policy',
            status: 'active',
            createdAt: '2024-01-15'
        },
        {
            id: 2,
            name: 'calculate_premium',
            description: 'Calculate insurance premium based on coverage',
            type: 'function',
            code: 'function calculatePremium(age, coverageAmount, term) { /* logic */ }',
            parameters: [
                { name: 'age', type: 'number', required: true },
                { name: 'coverageAmount', type: 'number', required: true },
                { name: 'term', type: 'number', required: false }
            ],
            category: 'calculation',
            status: 'active',
            createdAt: '2024-01-10'
        },
        {
            id: 3,
            name: 'customer_lookup_api',
            description: 'Fetch customer details from CRM API',
            type: 'api',
            endpoint: 'GET /api/v1/customers/{{customerId}}',
            parameters: [{ name: 'customerId', type: 'string', required: true }],
            category: 'customer',
            status: 'draft',
            createdAt: '2024-01-05'
        }
    ]);

    const [activeTab, setActiveTab] = useState('Purpose & Overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTool, setSelectedTool] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showTestModal, setShowTestModal] = useState(false);
    const [newTool, setNewTool] = useState({
        name: '',
        description: '',
        type: 'sql',
        sql: '',
        apiEndpoint: '',
        code: '',
        parameters: [{ id: Date.now(), name: '', type: 'string', required: true, description: '' }],
        category: '',
        tags: []
    });
    const [testInputs, setTestInputs] = useState({});
    const [testResults, setTestResults] = useState(null);

    const { state } = useLocation();
    const { modelName } = state || {};

    const scrollContainerRef = useRef(null);
    const sectionRefs = useRef({});

    // Tabs configuration
    const tabs = ['Purpose & Overview', 'Tool Gallery', 'Create Tool', 'Tool Testing', 'Industry Templates'];

    // Industry-specific templates
    const industryTemplates = {
        Insurance: [
            {
                name: 'policy_lookup',
                displayName: 'Policy Lookup',
                description: 'Fetch policy details including expiry, premium, and coverage',
                type: 'sql',
                sql: 'SELECT policy_number, expiry_date, premium_amount, coverage_type FROM policies WHERE policy_number = {{policy_number}}',
                parameters: [{ name: 'policy_number', type: 'string', required: true, description: 'Policy number to lookup' }],
                category: 'policy'
            },
            {
                name: 'claim_submission',
                displayName: 'Claim Submission',
                description: 'Submit new insurance claim with documents',
                type: 'api',
                endpoint: 'POST /api/v1/claims',
                parameters: [
                    { name: 'policy_number', type: 'string', required: true },
                    { name: 'claim_amount', type: 'number', required: true },
                    { name: 'description', type: 'string', required: true }
                ],
                category: 'claims'
            },
            {
                name: 'premium_calculator',
                displayName: 'Premium Calculator',
                description: 'Calculate insurance premium based on risk factors',
                type: 'function',
                code: 'function calculatePremium(age, coverage, location) {\n  let baseRate = 1000;\n  // Premium calculation logic\n  return baseRate * riskFactor;\n}',
                parameters: [
                    { name: 'age', type: 'number', required: true },
                    { name: 'coverage_amount', type: 'number', required: true },
                    { name: 'location', type: 'string', required: false }
                ],
                category: 'calculation'
            }
        ],
        Banking: [
            {
                name: 'balance_check',
                displayName: 'Balance Check',
                description: 'Check account balance and available funds',
                type: 'sql',
                sql: 'SELECT account_number, current_balance, available_balance FROM accounts WHERE account_number = {{account_number}}',
                parameters: [{ name: 'account_number', type: 'string', required: true }],
                category: 'accounts'
            },
            {
                name: 'transaction_history',
                displayName: 'Transaction History',
                description: 'Get recent transactions for an account',
                type: 'api',
                endpoint: 'GET /api/v1/accounts/{{account_number}}/transactions',
                parameters: [
                    { name: 'account_number', type: 'string', required: true },
                    { name: 'start_date', type: 'date', required: false },
                    { name: 'end_date', type: 'date', required: false }
                ],
                category: 'transactions'
            }
        ],
        Ecommerce: [
            {
                name: 'product_search',
                displayName: 'Product Search',
                description: 'Search products by keyword and filters',
                type: 'api',
                endpoint: 'GET /api/v1/products/search?q={{query}}',
                parameters: [
                    { name: 'query', type: 'string', required: true },
                    { name: 'category', type: 'string', required: false },
                    { name: 'min_price', type: 'number', required: false },
                    { name: 'max_price', type: 'number', required: false }
                ],
                category: 'products'
            },
            {
                name: 'order_status',
                displayName: 'Order Status',
                description: 'Check order status and tracking information',
                type: 'sql',
                sql: 'SELECT order_id, status, tracking_number, estimated_delivery FROM orders WHERE order_id = {{order_id}}',
                parameters: [{ name: 'order_id', type: 'string', required: true }],
                category: 'orders'
            }
        ]
    };

    const handleCreateTool = () => {
        if (!newTool.name.trim()) {
            alert('Tool name is required');
            return;
        }

        const invalidParams = newTool.parameters.filter(p => !p.name.trim());
        if (invalidParams.length > 0) {
            alert('All parameters must have names');
            return;
        }

        const toolData = {
            id: `tool_${Date.now()}`,
            name: newTool.name,
            description: newTool.description,
            type: newTool.type,
            category: newTool.category,
            parameters: newTool.parameters,
            status: 'draft',
            createdAt: new Date().toISOString()
        };

        // Add type-specific data
        if (newTool.type === 'sql') {
            toolData.sql = newTool.sql;
        } else if (newTool.type === 'api') {
            toolData.endpoint = newTool.apiEndpoint;
        } else if (newTool.type === 'function') {
            toolData.code = newTool.code;
        }

        const updatedTools = [...tools, toolData];
        setTools(updatedTools);
        setSelectedTool(toolData);
        setShowCreateModal(false);
        resetNewTool();
    };

    const handleDeleteTool = (id) => {
        const updatedTools = tools.filter(tool => tool.id !== id);
        setTools(updatedTools);

        if (selectedTool?.id === id) {
            setSelectedTool(updatedTools.length > 0 ? updatedTools[0] : null);
        }
    };

    const handleApplyTemplate = (template) => {
        const params = template.parameters.map(p => ({
            id: Date.now() + Math.random(),
            ...p
        }));

        setNewTool({
            name: template.name,
            description: template.description,
            type: template.type,
            sql: template.sql || '',
            apiEndpoint: template.endpoint || '',
            code: template.code || '',
            parameters: params,
            category: template.category,
            tags: []
        });
        setShowCreateModal(true);
    };

    const handleTestTool = () => {
        // Simulate tool execution
        const results = {
            success: true,
            executionTime: '125ms',
            data: {
                policy_number: testInputs.policy_number || 'POL123456',
                expiry_date: '2024-12-31',
                premium_amount: 1500.00,
                coverage_type: 'Comprehensive',
                status: 'Active'
            },
            logs: [
                'Tool execution started',
                'Parameters validated',
                'Query executed successfully',
                'Results formatted'
            ]
        };
        setTestResults(results);
    };

    const resetNewTool = () => {
        setNewTool({
            name: '',
            description: '',
            type: 'sql',
            sql: '',
            apiEndpoint: '',
            code: '',
            parameters: [{ id: Date.now(), name: '', type: 'string', required: true, description: '' }],
            category: '',
            tags: []
        });
    };

    const handleAddParameter = () => {
        const newParam = {
            id: Date.now(),
            name: '',
            type: 'string',
            required: true,
            description: ''
        };
        setNewTool({
            ...newTool,
            parameters: [...newTool.parameters, newParam]
        });
    };

    const handleRemoveParameter = (index) => {
        const updatedParams = newTool.parameters.filter((_, i) => i !== index);
        setNewTool({ ...newTool, parameters: updatedParams });
    };

    const handleUpdateParameter = (index, updates) => {
        const updatedParams = [...newTool.parameters];
        updatedParams[index] = { ...updatedParams[index], ...updates };
        setNewTool({ ...newTool, parameters: updatedParams });
    };

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;

        const containerTop = scrollContainerRef.current.getBoundingClientRect().top;
        let currentTab = activeTab;

        tabs.forEach(tab => {
            const section = sectionRefs.current[tab];
            if (!section) return;

            const offset = section.getBoundingClientRect().top - containerTop;
            if (offset <= 80) currentTab = tab;
        });

        if (currentTab !== activeTab) {
            setActiveTab(currentTab);
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        const section = sectionRefs.current[tab];
        if (!section || !scrollContainerRef.current) return;

        const containerTop = scrollContainerRef.current.getBoundingClientRect().top;
        const sectionTop = section.getBoundingClientRect().top;

        scrollContainerRef.current.scrollBy({
            top: sectionTop - containerTop,
            behavior: 'smooth',
        });
    };

    const getToolIcon = (type) => {
        switch (type) {
            case 'sql': return <FiDatabase className="text-blue-500" />;
            case 'api': return <AiOutlineApi className="text-green-500" />;
            case 'function': return <AiOutlineFunction className="text-purple-500" />;
            default: return <FiTool className="text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800';
            case 'draft': return 'bg-yellow-100 text-yellow-800';
            case 'inactive': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'policy': return 'bg-blue-100 text-blue-800';
            case 'calculation': return 'bg-purple-100 text-purple-800';
            case 'customer': return 'bg-green-100 text-green-800';
            case 'claims': return 'bg-orange-100 text-orange-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="main-content">
            <div style={{ marginLeft: "0px", marginRight: "auto", width: "90%" }} className='flex flex-col h-full'>
                <div className="flex gap-2 items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-black-500">Data Model Configuration</h1>
                    </div>
                </div>
                <div className='heighligts my-4'>
                    <p className="text-sm text-gray-600"> AI Tools are specialized functions that enable your AI assistant to interact with external systems,
                        retrieve data, perform calculations, and execute business logic. They bridge the gap between AI
                        conversation and actionable business operations.</p>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Tabs */}


                    {/* Scrollable content */}
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto overflow-x-auto hide-scrollbar"
                    >
                        {/* ================= Purpose & Overview ================= */}
                        {/* <div ref={(el) => (sectionRefs.current['Purpose & Overview'] = el)} className="bg-white my-4 p-6 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h4 className="font-semibold text-lg flex items-center gap-2">
                                        <FiInfo className="text-[#02b499]" />
                                        Purpose & Overview
                                    </h4>
                                    <p className="text-sm text-gray-600">Understand how AI tools work and their applications</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <AiOutlineQuestionCircle className="text-blue-500 text-xl mt-1" />
                                        <div>
                                            <h5 className="font-semibold text-blue-800 mb-2">What are AI Tools?</h5>
                                            <p className="text-blue-700 text-sm">

                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 bg-[#02b499]/10 rounded-full flex items-center justify-center">
                                                <FiDatabase className="text-[#02b499]" />
                                            </div>
                                            <h6 className="font-semibold">SQL Tools</h6>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Execute database queries to fetch or update data. Use variables for dynamic parameters.
                                        </p>
                                    </div>

                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 bg-[#02b499]/10 rounded-full flex items-center justify-center">
                                                <AiOutlineApi className="text-[#02b499]" />
                                            </div>
                                            <h6 className="font-semibold">API Tools</h6>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Make HTTP requests to external APIs. Define endpoints, methods, and authentication.
                                        </p>
                                    </div>

                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 bg-[#02b499]/10 rounded-full flex items-center justify-center">
                                                <FiCode className="text-[#02b499]" />
                                            </div>
                                            <h6 className="font-semibold">Function Tools</h6>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Write custom JavaScript functions for calculations, transformations, or business logic.
                                        </p>
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h6 className="font-semibold mb-3">How Tools Work</h6>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                <FiCheck className="text-green-600" />
                                            </div>
                                            <span className="text-sm">AI assistant detects when a tool is needed based on user query</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                <FiCheck className="text-green-600" />
                                            </div>
                                            <span className="text-sm">Tool parameters are extracted from conversation context</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                <FiCheck className="text-green-600" />
                                            </div>
                                            <span className="text-sm">Tool executes with provided parameters</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                <FiCheck className="text-green-600" />
                                            </div>
                                            <span className="text-sm">Results are formatted and returned to user</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <h6 className="font-semibold mb-2">Best Practices</h6>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li className="flex items-start gap-2">
                                            <FiCheck className="text-green-500 mt-0.5" />
                                            Give tools descriptive names that indicate their purpose
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FiCheck className="text-green-500 mt-0.5" />
                                            Include clear parameter descriptions and examples
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FiCheck className="text-green-500 mt-0.5" />
                                            Test tools thoroughly with different input scenarios
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FiCheck className="text-green-500 mt-0.5" />
                                            Document any prerequisites or setup requirements
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div> */}

                        {/* ================= Tool Gallery ================= */}
                        <div ref={(el) => (sectionRefs.current['Tool Gallery'] = el)} className="bg-white my-4 p-6 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h4 className="font-semibold text-lg">Tool Gallery ({tools.length})</h4>
                                    <p className="text-sm text-gray-600">Browse and manage your AI tools</p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search tools..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <button
                                        className="check-btn flex items-center gap-2"
                                        onClick={() => setShowCreateModal(true)}
                                    >
                                        <FiPlus /> Create Tool
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {tools
                                    .filter(tool =>
                                        !searchQuery ||
                                        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map(tool => (
                                        <div
                                            key={tool.id}
                                            className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${selectedTool?.id === tool.id
                                                ? 'border-[#02b499] border-2 bg-[#02b499]/5'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            onClick={() => setSelectedTool(tool)}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-2">
                                                    {getToolIcon(tool.type)}
                                                    <h5 className="font-semibold">{tool.name}</h5>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteTool(tool.id);
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tool.description}</p>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                <span className={`px-2 py-1 text-xs rounded ${getCategoryColor(tool.category)}`}>
                                                    {tool.category}
                                                </span>
                                                <span className={`px-2 py-1 text-xs rounded ${getStatusColor(tool.status)}`}>
                                                    {tool.status}
                                                </span>
                                                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                                                    {tool.type}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">
                                                    {tool.parameters?.length || 0} parameter(s)
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        className="text-sm text-[#02b499] hover:text-[#02987d]"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedTool(tool);
                                                            setShowTestModal(true);
                                                        }}
                                                    >
                                                        <FiPlay className="inline mr-1" /> Test
                                                    </button>
                                                    <FiChevronRight className="text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {tools.length === 0 && (
                                <div className="text-center py-12">
                                    <FiTool className="mx-auto text-4xl text-gray-400 mb-4" />
                                    <h4 className="font-semibold text-gray-700 mb-2">No Tools Created</h4>
                                    <p className="text-gray-500 mb-4">Create your first tool to get started</p>
                                    <button
                                        className="check-btn flex items-center gap-2 mx-auto"
                                        onClick={() => setShowCreateModal(true)}
                                    >
                                        <FiPlus /> Create First Tool
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* ================= Create Tool ================= */}
                        {showCreateModal && (
                            <div className="fixed inset-x-0 top-[64px] bottom-0 bg-black bg-opacity-50 
             flex justify-center z-50 p-4">
                                <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-semibold text-lg">Create New AI Tool</h3>
                                        <button
                                            onClick={() => {
                                                setShowCreateModal(false);
                                                resetNewTool();
                                            }}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Tool Basic Info */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="label block mb-2 font-medium text-gray-700">Tool Name *</label>
                                                <input
                                                    type="text"
                                                    value={newTool.name}
                                                    onChange={(e) => setNewTool({ ...newTool, name: e.target.value })}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#02b499] focus:border-transparent"
                                                    placeholder="e.g., get_policy_details, calculate_premium"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Use snake_case naming (e.g., "get_customer_info")
                                                </p>
                                            </div>
                                            <div>
                                                <label className="label block mb-2 font-medium text-gray-700">Tool Type *</label>
                                                <select
                                                    value={newTool.type}
                                                    onChange={(e) => setNewTool({ ...newTool, type: e.target.value })}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#02b499] focus:border-transparent"
                                                >
                                                    <option value="sql">SQL Query</option>
                                                    <option value="api">API Call</option>
                                                    <option value="function">JavaScript Function</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="label block mb-2 font-medium text-gray-700">Description *</label>
                                            <textarea
                                                value={newTool.description}
                                                onChange={(e) => setNewTool({ ...newTool, description: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#02b499] focus:border-transparent"
                                                rows="2"
                                                placeholder="Describe what this tool does and when to use it..."
                                            />
                                        </div>


                                        {newTool.type === 'sql' && (
                                            <div>
                                                <label className="label block mb-2 font-medium text-gray-700">SQL Query *</label>
                                                <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 mb-2">
                                                    <div className="text-sm text-gray-500 mb-2">
                                                        Use for dynamic values. Example: WHERE id = userId
                                                    </div>
                                                    <textarea
                                                        value={newTool.sql}
                                                        onChange={(e) => setNewTool({ ...newTool, sql: e.target.value })}
                                                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#02b499] focus:border-transparent"
                                                        rows="4"
                                                        placeholder="SELECT * FROM table WHERE condition = {{parameter}}"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {newTool.type === 'api' && (
                                            <div>
                                                <label className="label block mb-2 font-medium text-gray-700">API Endpoint *</label>
                                                <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 mb-2">
                                                    <div className="text-sm text-gray-500 mb-2">
                                                        Include method and full URL. Use parameter  for dynamic values.
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={newTool.apiEndpoint}
                                                        onChange={(e) => setNewTool({ ...newTool, apiEndpoint: e.target.value })}
                                                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#02b499] focus:border-transparent"
                                                        placeholder="GET https://api.example.com/data/{{id}}"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {newTool.type === 'function' && (
                                            <div>
                                                <label className="label block mb-2 font-medium text-gray-700">JavaScript Function *</label>
                                                <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 mb-2">
                                                    <div className="text-sm text-gray-500 mb-2">
                                                        Write the function body. Parameters will be automatically passed.
                                                    </div>
                                                    <textarea
                                                        value={newTool.code}
                                                        onChange={(e) => setNewTool({ ...newTool, code: e.target.value })}
                                                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#02b499] focus:border-transparent"
                                                        rows="6"
                                                        placeholder="function calculate(parameter1, parameter2) {\n  // Your logic here\n  return result;\n}"
                                                    />
                                                </div>
                                            </div>
                                        )}


                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <h5 className="font-semibold">Parameters</h5>
                                                <button
                                                    type="button"
                                                    onClick={handleAddParameter}
                                                    className="text-sm text-[#02b499] hover:text-[#02987d] flex items-center gap-1"
                                                >
                                                    <FiPlus /> Add Parameter
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                {newTool.parameters.map((param, index) => (
                                                    <div key={param.id} className="border border-gray-200 rounded-lg p-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                                            {/* Parameter Name */}
                                                            <div className="md:col-span-3">
                                                                <label className="label block mb-2 text-sm font-medium text-gray-700">Name *</label>
                                                                <input
                                                                    type="text"
                                                                    value={param.name}
                                                                    onChange={(e) => handleUpdateParameter(index, { name: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#02b499] focus:border-transparent"
                                                                    placeholder="e.g., user_id, amount"
                                                                />
                                                            </div>

                                                            {/* Parameter Type */}
                                                            <div className="md:col-span-2">
                                                                <label className="label block mb-2 text-sm font-medium text-gray-700">Type</label>
                                                                <select
                                                                    value={param.type}
                                                                    onChange={(e) => handleUpdateParameter(index, { type: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#02b499] focus:border-transparent"
                                                                >
                                                                    <option value="string">String</option>
                                                                    <option value="number">Number</option>
                                                                    <option value="boolean">Boolean</option>
                                                                    <option value="date">Date</option>
                                                                    <option value="array">Array</option>
                                                                    <option value="object">Object</option>
                                                                </select>
                                                            </div>


                                                            <div className="md:col-span-2">
                                                                <label className="label block mb-2 text-sm font-medium text-gray-700">Required</label>
                                                                <div className="mt-2">
                                                                    <label className="inline-flex items-center">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={param.required}
                                                                            onChange={(e) => handleUpdateParameter(index, { required: e.target.checked })}
                                                                            className="rounded border-gray-300 text-[#02b499] focus:ring-[#02b499]"
                                                                        />
                                                                        <span className="ml-2 text-sm">Required</span>
                                                                    </label>
                                                                </div>
                                                            </div>

                                                            {/* Delete Button */}
                                                            <div className="md:col-span-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveParameter(index)}
                                                                    className="mt-6 text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                                                    disabled={newTool.parameters.length <= 1}
                                                                >
                                                                    <FiTrash2 /> Remove
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Parameter Description */}
                                                        <div className="mt-3">
                                                            <label className="label block mb-2 text-sm font-medium text-gray-700">Description</label>
                                                            <input
                                                                type="text"
                                                                value={param.description}
                                                                onChange={(e) => handleUpdateParameter(index, { description: e.target.value })}
                                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#02b499] focus:border-transparent"
                                                                placeholder="Describe this parameter..."
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Category */}
                                        <div>
                                            <label className="label block mb-2 font-medium text-gray-700">Category</label>
                                            <input
                                                type="text"
                                                value={newTool.category}
                                                onChange={(e) => setNewTool({ ...newTool, category: e.target.value })}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#02b499] focus:border-transparent"
                                                placeholder="e.g., policy, calculation, customer"
                                            />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-end gap-3 pt-4 border-t">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowCreateModal(false);
                                                    resetNewTool();
                                                }}
                                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleCreateTool}
                                                className="check-btn px-4 py-2"
                                            >
                                                Create Tool
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ================= Tool Testing ================= */}
                        <div ref={(el) => (sectionRefs.current['Tool Testing'] = el)} className="bg-white my-4 p-6 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h4 className="font-semibold text-lg">Tool Testing</h4>
                                    <p className="text-sm text-gray-600">Test and validate your tools before deployment</p>
                                </div>
                                {selectedTool && (
                                    <button
                                        className="check-btn flex items-center gap-2"
                                        onClick={() => setShowTestModal(true)}
                                    >
                                        <FiPlay /> Test Selected Tool
                                    </button>
                                )}
                            </div>

                            {selectedTool ? (
                                <div className="space-y-6">
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                {getToolIcon(selectedTool.type)}
                                                <div>
                                                    <h5 className="font-semibold">{selectedTool.name}</h5>
                                                    <p className="text-sm text-gray-600">{selectedTool.description}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <span className={`px-3 py-1 text-sm rounded ${getStatusColor(selectedTool.status)}`}>
                                                    {selectedTool.status}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Test Tool Modal */}
                                        {showTestModal && (
                                            <div className="fixed inset-x-0 top-[64px] bottom-0 bg-black bg-opacity-50 
             flex justify-center z-50 p-4">
                                                <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                                                    <div className="flex justify-between items-center mb-6">
                                                        <h3 className="font-semibold text-lg">Test Tool: {selectedTool.name}</h3>
                                                        <button
                                                            onClick={() => {
                                                                setShowTestModal(false);
                                                                setTestInputs({});
                                                                setTestResults(null);
                                                            }}
                                                            className="text-gray-500 hover:text-gray-700"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>

                                                    <div className="space-y-6">
                                                        {/* Input Parameters */}
                                                        <div>
                                                            <h5 className="font-semibold mb-4">Input Parameters</h5>
                                                            <div className="space-y-4">
                                                                {selectedTool.parameters?.map((param, index) => (
                                                                    <div key={index} className="space-y-2">
                                                                        <label className="block text-sm font-medium text-gray-700">
                                                                            {param.name} {param.required && <span className="text-red-500">*</span>}
                                                                            <span className="text-xs text-gray-500 ml-2">({param.type})</span>
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            value={testInputs[param.name] || ''}
                                                                            onChange={(e) => setTestInputs({
                                                                                ...testInputs,
                                                                                [param.name]: e.target.value
                                                                            })}
                                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#02b499] focus:border-transparent"
                                                                            placeholder={`Enter ${param.type} value...`}
                                                                        />
                                                                        {param.description && (
                                                                            <p className="text-xs text-gray-500">{param.description}</p>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Execution Button */}
                                                        <div>
                                                            <button
                                                                onClick={handleTestTool}
                                                                className="check-btn w-full flex items-center justify-center gap-2 py-3"
                                                            >
                                                                <FiPlay /> Execute Tool
                                                            </button>
                                                        </div>

                                                        {/* Test Results */}
                                                        {testResults && (
                                                            <div>
                                                                <h5 className="font-semibold mb-4">Test Results</h5>
                                                                <div className="border border-gray-200 rounded-lg p-4">
                                                                    <div className="flex justify-between items-center mb-4">
                                                                        <div className="flex items-center gap-2">
                                                                            <FiCheck className="text-green-500" />
                                                                            <span className="font-medium">Execution Successful</span>
                                                                        </div>
                                                                        <span className="text-sm text-gray-500">
                                                                            Time: {testResults.executionTime}
                                                                        </span>
                                                                    </div>

                                                                    <div className="mb-4">
                                                                        <h6 className="font-medium mb-2">Output Data:</h6>
                                                                        <div className="bg-gray-50 border border-gray-200 rounded p-3">
                                                                            <pre className="text-sm overflow-auto">
                                                                                {JSON.stringify(testResults.data, null, 2)}
                                                                            </pre>
                                                                        </div>
                                                                    </div>

                                                                    <div>
                                                                        <h6 className="font-medium mb-2">Execution Logs:</h6>
                                                                        <div className="space-y-1">
                                                                            {testResults.logs.map((log, idx) => (
                                                                                <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                                                                                    <FiChevronRight className="text-gray-400" />
                                                                                    {log}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <h5 className="font-semibold mb-4">Tool Details</h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h6 className="font-medium mb-2">Parameters</h6>
                                                <div className="space-y-2">
                                                    {selectedTool.parameters?.map((param, index) => (
                                                        <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                                                            <div>
                                                                <span className="font-medium">{param.name}</span>
                                                                <span className="text-sm text-gray-500 ml-2">({param.type})</span>
                                                            </div>
                                                            <span className={`px-2 py-1 text-xs rounded ${param.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {param.required ? 'Required' : 'Optional'}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h6 className="font-medium mb-2">Implementation</h6>
                                                <div className="bg-gray-50 border border-gray-200 rounded p-3">
                                                    <pre className="text-sm overflow-auto">
                                                        {selectedTool.type === 'sql' && selectedTool.sql}
                                                        {selectedTool.type === 'api' && selectedTool.endpoint}
                                                        {selectedTool.type === 'function' && selectedTool.code}
                                                    </pre>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FiPlay className="mx-auto text-4xl text-gray-400 mb-4" />
                                    <h4 className="font-semibold text-gray-700 mb-2">No Tool Selected</h4>
                                    <p className="text-gray-500">Select a tool from the gallery to test it</p>
                                </div>
                            )}
                        </div>

                        {/* ================= Industry Templates ================= */}
                        <div ref={(el) => (sectionRefs.current['Industry Templates'] = el)} className="bg-white my-4 p-6 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h4 className="font-semibold text-lg flex items-center gap-2">
                                        <FiCopy className="text-[#02b499]" />
                                        Industry Templates
                                    </h4>
                                    <p className="text-sm text-gray-600">Pre-built templates for {industry} industry</p>
                                </div>
                                <div className="flex gap-2">
                                    <select
                                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                        value={industry}
                                        onChange={(e) => window.location.reload()}
                                    >
                                        <option value="Insurance">Insurance</option>
                                        <option value="Banking">Banking</option>
                                        <option value="Ecommerce">Ecommerce</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {industryTemplates[industry]?.map((template, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-[#02b499] transition-colors">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    {getToolIcon(template.type)}
                                                    <h5 className="font-semibold">{template.displayName}</h5>
                                                </div>
                                                <p className="text-sm text-gray-600">{template.description}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            <div className="text-sm flex items-center gap-2">
                                                <FiBox className="text-gray-400" />
                                                <span className="text-gray-500">Type:</span>
                                                <span className="font-medium">{template.type.toUpperCase()}</span>
                                            </div>
                                            <div className="text-sm flex items-center gap-2">
                                                <FiList className="text-gray-400" />
                                                <span className="text-gray-500">Parameters:</span>
                                                <span>{template.parameters.length}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApplyTemplate(template)}
                                                className="flex-1 check-btn flex items-center justify-center gap-2 py-2"
                                            >
                                                <FiCopy /> Use Template
                                            </button>
                                            <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                                                <FiInfo />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <h6 className="font-semibold mb-3 flex items-center gap-2">
                                    <FiInfo className="text-gray-500" />
                                    Using Templates
                                </h6>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li>• Templates provide pre-configured tools for common use cases</li>
                                    <li>• Customize templates to fit your specific requirements</li>
                                    <li>• Test template-based tools before making them active</li>
                                    <li>• Combine multiple templates for complex workflows</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};