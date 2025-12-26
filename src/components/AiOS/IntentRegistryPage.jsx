// ==================== COMPONENT 2: INTENT REGISTRY PAGE ====================
import React, { useState, useEffect, useRef } from 'react';
import {
    FiPlus,
    FiTrash2,
    FiEdit,
    FiSearch,
    FiFilter,
    FiUpload,
    FiDownload,
    FiFileText,
    FiChevronRight,
    FiSettings,
    FiInfo,
    FiCopy,
    FiCheckCircle,
    FiAlertCircle,
    FiLink,
    FiTool,
    FiPlay,
    FiExternalLink,

    FiDatabase,
    FiGlobe,
    FiCode

} from 'react-icons/fi';
import { AiOutlineRobot, AiOutlineQuestionCircle } from 'react-icons/ai';
import { useLocation } from 'react-router-dom';
import DOMAIN_TEMPLATES from './DOMAIN_TEMPLATES';

// Mock tool data - in real app, this would come from props or API
const AVAILABLE_TOOLS = [
    {
        id: 'tool_1',
        name: 'get_policy_details',
        displayName: 'Get Policy Details',
        description: 'Fetch policy expiry, nominee, premium amount',
        type: 'sql',
        category: 'policy'
    },
    {
        id: 'tool_2',
        name: 'calculate_premium',
        displayName: 'Calculate Premium',
        description: 'Calculate insurance premium based on coverage',
        type: 'function',
        category: 'calculation'
    },
    {
        id: 'tool_3',
        name: 'customer_lookup_api',
        displayName: 'Customer Lookup',
        description: 'Fetch customer details from CRM API',
        type: 'api',
        category: 'customer'
    },
    {
        id: 'tool_4',
        name: 'claim_status_check',
        displayName: 'Check Claim Status',
        description: 'Get status of insurance claims',
        type: 'api',
        category: 'claims'
    },
    {
        id: 'tool_5',
        name: 'document_upload',
        displayName: 'Upload Document',
        description: 'Upload documents for claims or applications',
        type: 'api',
        category: 'documents'
    }
];

export const IntentRegistryPage = ({ domain = 'insurance', availableTools = AVAILABLE_TOOLS }) => {
    const [intents, setIntents] = useState([]);
    const [activeIntent, setActiveIntent] = useState(null);
    const [newPhrase, setNewPhrase] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('Purpose & Overview');
    const [newIntent, setNewIntent] = useState({ name: '', description: '' });
    const [testQuery, setTestQuery] = useState('');
    const [testResults, setTestResults] = useState(null);
    const [showPurpose, setShowPurpose] = useState(true);
    const [showLinkToolModal, setShowLinkToolModal] = useState(false);
    const [toolSearchQuery, setToolSearchQuery] = useState('');
    const [linkedTools, setLinkedTools] = useState([]);

    const { state } = useLocation();
    const { modelName } = state || {};

    const scrollContainerRef = useRef(null);
    const sectionRefs = useRef({});

    // Tabs configuration
    const tabs = ['Purpose & Overview', 'Intent List', 'Intent Configuration', 'Tool Linking', 'Test Recognition', 'Sample Configurations'];

    useEffect(() => {
        // Load domain-specific intents
        if (DOMAIN_TEMPLATES[domain]) {
            const loadedIntents = DOMAIN_TEMPLATES[domain].intents || [];
            setIntents(loadedIntents);
            if (loadedIntents.length > 0) {
                setActiveIntent(loadedIntents[0]);
                // Load linked tools for active intent
                if (loadedIntents[0].linkedTools) {
                    setLinkedTools(loadedIntents[0].linkedTools);
                }
            }
        }
    }, [domain]);

    // Update linkedTools when activeIntent changes
    useEffect(() => {
        if (activeIntent?.linkedTools) {
            setLinkedTools(activeIntent.linkedTools);
        } else {
            setLinkedTools([]);
        }
    }, [activeIntent]);

    const handleAddPhrase = () => {
        if (!newPhrase.trim() || !activeIntent) return;

        const updatedIntents = intents.map(intent => {
            if (intent.id === activeIntent.id) {
                return {
                    ...intent,
                    userPhrases: [...intent.userPhrases, newPhrase.trim()]
                };
            }
            return intent;
        });

        setIntents(updatedIntents);
        setActiveIntent(updatedIntents.find(i => i.id === activeIntent.id));
        setNewPhrase('');
    };

    const handleAddIntent = () => {
        if (!newIntent.name.trim()) return;

        const newIntentObj = {
            id: `intent_${Date.now()}`,
            name: newIntent.name,
            description: newIntent.description || 'Describe this intent',
            userPhrases: [],
            requiredParameters: [],
            confidenceThreshold: 0.8,
            capabilities: [],
            domain: domain,
            linkedTools: [] // Initialize empty linked tools array
        };

        const updatedIntents = [...intents, newIntentObj];
        setIntents(updatedIntents);
        setActiveIntent(newIntentObj);
        setNewIntent({ name: '', description: '' });
    };

    const handleDeleteIntent = (id) => {
        const updatedIntents = intents.filter(intent => intent.id !== id);
        setIntents(updatedIntents);

        if (activeIntent?.id === id) {
            setActiveIntent(updatedIntents.length > 0 ? updatedIntents[0] : null);
        }
    };

    const handleDeletePhrase = (phraseIndex) => {
        if (!activeIntent) return;

        const updatedIntent = {
            ...activeIntent,
            userPhrases: activeIntent.userPhrases.filter((_, index) => index !== phraseIndex)
        };

        const updatedIntents = intents.map(intent =>
            intent.id === activeIntent.id ? updatedIntent : intent
        );

        setIntents(updatedIntents);
        setActiveIntent(updatedIntent);
    };

    const handleUpdateIntent = (field, value) => {
        if (!activeIntent) return;

        const updatedIntent = {
            ...activeIntent,
            [field]: value
        };

        const updatedIntents = intents.map(intent =>
            intent.id === activeIntent.id ? updatedIntent : intent
        );

        setIntents(updatedIntents);
        setActiveIntent(updatedIntent);
    };

    // ================= TOOL LINKING FUNCTIONS =================
    const handleLinkTool = (tool) => {
        if (!activeIntent) return;

        // Check if tool is already linked
        if (linkedTools.some(linkedTool => linkedTool.id === tool.id)) {
            alert('This tool is already linked to this intent');
            return;
        }

        const toolToLink = {
            ...tool,
            mappingConfig: {
                parameterMappings: {}, // Will map intent params to tool params
                conditions: [],
                postProcessing: null
            }
        };

        const updatedLinkedTools = [...linkedTools, toolToLink];
        setLinkedTools(updatedLinkedTools);

        // Update the intent with linked tools
        const updatedIntent = {
            ...activeIntent,
            linkedTools: updatedLinkedTools
        };

        const updatedIntents = intents.map(intent =>
            intent.id === activeIntent.id ? updatedIntent : intent
        );

        setIntents(updatedIntents);
        setActiveIntent(updatedIntent);
        setShowLinkToolModal(false);
    };

    const handleUnlinkTool = (toolId) => {
        if (!activeIntent) return;

        const updatedLinkedTools = linkedTools.filter(tool => tool.id !== toolId);
        setLinkedTools(updatedLinkedTools);

        const updatedIntent = {
            ...activeIntent,
            linkedTools: updatedLinkedTools
        };

        const updatedIntents = intents.map(intent =>
            intent.id === activeIntent.id ? updatedIntent : intent
        );

        setIntents(updatedIntents);
        setActiveIntent(updatedIntent);
    };

    const handleConfigureToolMapping = (toolId) => {
        // This would open a modal for configuring parameter mappings
        alert(`Configure parameter mappings for tool ${toolId}`);
    };

    const getToolIcon = (type) => {
        switch (type) {
            case 'sql': return <FiDatabase className="text-blue-500" />;
            case 'api': return <FiGlobe className="text-green-500" />;
            case 'function': return <FiCode className="text-purple-500" />;
            default: return <FiTool className="text-gray-500" />;
        }
    };

    const handleTestIntent = () => {
        if (!testQuery.trim()) return;

        const results = intents.map(intent => {
            const score = calculateIntentScore(intent, testQuery);
            return {
                intent,
                score: Math.min(score, 1.0),
                matched: score >= (intent.confidenceThreshold || 0.8),
                matchedPhrases: intent.userPhrases.filter(phrase =>
                    testQuery.toLowerCase().includes(phrase.toLowerCase())
                ),
                wouldTriggerTools: intent.linkedTools || []
            };
        }).sort((a, b) => b.score - a.score);

        setTestResults({
            query: testQuery,
            results: results,
            topIntent: results[0],
            timestamp: new Date().toLocaleTimeString()
        });
    };

    const calculateIntentScore = (intent, userInput) => {
        const inputLower = userInput.toLowerCase();
        let score = 0;
        const phrases = intent.userPhrases;

        phrases.forEach(phrase => {
            const phraseLower = phrase.toLowerCase();
            if (inputLower.includes(phraseLower)) {
                score += 0.4;
            } else if (phraseLower.split(' ').some(word =>
                word.length > 3 && inputLower.includes(word)
            )) {
                score += 0.2;
            }
        });

        const keywords = intent.name.toLowerCase().split(' ');
        keywords.forEach(keyword => {
            if (keyword.length > 3 && inputLower.includes(keyword)) {
                score += 0.1;
            }
        });

        return Math.min(score, 1.0);
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

    return (
        <div className="main-content">
            <div style={{ marginLeft: "0px", marginRight: "auto", width: "90%" }} className='flex flex-col h-full'>
                {/* ... existing header code ... */}


                <div style={{ marginLeft: "0px", marginRight: "auto", width: "90%" }} className='flex flex-col h-full'>
                    <div className="flex gap-2 items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-black-500">Intent Registry Configuration</h1>
                        </div>
                    </div>
                    <div className='heighligts my-4'>
                        <p className="text-sm text-gray-600">Intent recognition identifies what a user wants to achieve from their input (questions, commands, statements). This system maps user phrases to specific capabilities with confidence scoring to determine the most likely intent.</p>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        {/* Sidebar Tabs */}
                        {/* <div style={{ marginTop: "45%" }}>
                        <nav className="flex flex-col w-40 border-gray-200 overflow-y-auto">
                            {tabs.map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => handleTabClick(tab)}
                                    className={`py-3 px-3 text-left text-sm border-l transition-all duration-300
                    ${activeTab === tab
                                            ? 'border-l-4 border-[#02b499] bg-[#02b499]/5'
                                            : 'border-l-4 border-[#d0d7df] hover:bg-gray-50'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div> */}

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
                                    <p className="text-sm text-gray-600">Understand how intent recognition works</p>
                                </div>
                                <button
                                    onClick={() => setShowPurpose(!showPurpose)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    {showPurpose ? 'Collapse' : 'Expand'}
                                </button>
                            </div>

                            {showPurpose && (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <AiOutlineQuestionCircle className="text-blue-500 text-xl mt-1" />
                                            <div>
                                                <h5 className="font-semibold text-blue-800 mb-2">What is Intent Recognition?</h5>
                                                <p className="text-blue-700 text-sm">
                                                    Intent recognition identifies what a user wants to achieve from their input (questions, commands, statements).
                                                    This system maps user phrases to specific capabilities with confidence scoring to determine the most likely intent.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 bg-[#02b499]/10 rounded-full flex items-center justify-center">
                                                    <span className="text-[#02b499] font-semibold">1</span>
                                                </div>
                                                <h6 className="font-semibold">Define Intents</h6>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Create intent categories that represent different user goals or requests.
                                            </p>
                                        </div>

                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 bg-[#02b499]/10 rounded-full flex items-center justify-center">
                                                    <span className="text-[#02b499] font-semibold">2</span>
                                                </div>
                                                <h6 className="font-semibold">Add Training Phrases</h6>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Provide example phrases users might say for each intent to train the recognition model.
                                            </p>
                                        </div>

                                        <div className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-8 h-8 bg-[#02b499]/10 rounded-full flex items-center justify-center">
                                                    <span className="text-[#02b499] font-semibold">3</span>
                                                </div>
                                                <h6 className="font-semibold">Set Confidence</h6>
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Configure confidence thresholds to control when intents are triggered.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h6 className="font-semibold mb-3">How It Works</h6>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                    <FiCheckCircle className="text-green-600" />
                                                </div>
                                                <span className="text-sm">User input is analyzed against all intent phrases</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                    <FiCheckCircle className="text-green-600" />
                                                </div>
                                                <span className="text-sm">Confidence scores are calculated for each intent</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                    <FiCheckCircle className="text-green-600" />
                                                </div>
                                                <span className="text-sm">Intent with highest score above threshold is selected</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                    <FiCheckCircle className="text-green-600" />
                                                </div>
                                                <span className="text-sm">Corresponding action or response is triggered</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        <h6 className="font-semibold mb-2">Best Practices</h6>
                                        <ul className="text-sm text-gray-600 space-y-2">
                                            <li className="flex items-start gap-2">
                                                <FiCheckCircle className="text-green-500 mt-0.5" />
                                                Provide 10-20 varied example phrases per intent
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <FiCheckCircle className="text-green-500 mt-0.5" />
                                                Start with 80% confidence threshold and adjust based on testing
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <FiCheckCircle className="text-green-500 mt-0.5" />
                                                Test with real user queries regularly
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <FiCheckCircle className="text-green-500 mt-0.5" />
                                                Review and update intents based on user feedback
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div> */}

                            {/* ================= Intent List ================= */}
                            <div ref={(el) => (sectionRefs.current['Intent List'] = el)} className="bg-white my-4 p-6 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h4 className="font-semibold text-lg">Intent List ({intents.length})</h4>
                                        <p className="text-sm text-gray-600">Manage and organize your intents</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="relative">
                                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search intents..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <button className="btn btn-primary flex items-center gap-2">
                                            <FiFilter /> Filter
                                        </button>
                                    </div>
                                </div>

                                {/* Add New Intent Form */}
                                <div className="grid grid-cols-2 gap-6 mb-8">
                                    <div>
                                        <div className="input-group">
                                            <label className="label">Intent Name</label>
                                            <input
                                                type="text"
                                                value={newIntent.name}
                                                onChange={(e) => setNewIntent({ ...newIntent, name: e.target.value })}
                                                className="input"
                                                placeholder="e.g., Check Balance"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="input-group">
                                            <label className="label">Description</label>
                                            <input
                                                type="text"
                                                value={newIntent.description}
                                                onChange={(e) => setNewIntent({ ...newIntent, description: e.target.value })}
                                                className="input"
                                                placeholder="Brief description of the intent"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2">
                                        <button
                                            onClick={handleAddIntent}
                                            className="check-btn flex items-center gap-2"
                                            disabled={!newIntent.name.trim()}
                                        >
                                            <FiPlus /> Add New Intent
                                        </button>
                                    </div>
                                </div>

                                {/* Intent Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {intents
                                        .filter(intent =>
                                            !searchQuery ||
                                            intent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            intent.description.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map(intent => (
                                            <div
                                                key={intent.id}
                                                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${activeIntent?.id === intent.id
                                                    ? 'border-[#02b499] border-2 bg-[#02b499]/5'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                onClick={() => setActiveIntent(intent)}
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <AiOutlineRobot className="text-[#02b499]" />
                                                        <h5 className="font-semibold">{intent.name}</h5>
                                                        {intent.isSample && (
                                                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                                                Sample
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteIntent(intent.id);
                                                        }}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-3">{intent.description}</p>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500">
                                                        {intent.userPhrases.length} phrases
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                                            {(intent.confidenceThreshold || 0.8) * 100}% conf
                                                        </span>
                                                        <FiChevronRight className="text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                {intents.length === 0 && (
                                    <div className="text-center py-12">
                                        <AiOutlineRobot className="mx-auto text-4xl text-gray-400 mb-4" />
                                        <h4 className="font-semibold text-gray-700 mb-2">No Intents Created</h4>
                                        <p className="text-gray-500 mb-4">Start by adding your first intent</p>
                                    </div>
                                )}
                            </div>

                            {/* ================= Intent Configuration ================= */}
                            <div ref={(el) => (sectionRefs.current['Intent Configuration'] = el)} className="bg-white my-4 p-6 rounded-lg border border-gray-200">

                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h4 className="font-semibold text-lg">Intent Configuration</h4>
                                    </div>
                                    <button
                                        onClick={() => setShowLinkToolModal(true)}
                                        className="check-btn flex items-center gap-2"
                                    >
                                        <FiLink /> Link New Tool
                                    </button>
                                </div>

                                {activeIntent ? (
                                    <div className="space-y-6">
                                        {/* Intent Details */}
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <div className="input-group">
                                                    <label className="label">Intent Name</label>
                                                    <input
                                                        type="text"
                                                        value={activeIntent.name}
                                                        onChange={(e) => handleUpdateIntent('name', e.target.value)}
                                                        className="input"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="input-group">
                                                    <label className="label">Description</label>
                                                    <input
                                                        type="text"
                                                        value={activeIntent.description}
                                                        onChange={(e) => handleUpdateIntent('description', e.target.value)}
                                                        className="input"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* User Phrases */}
                                        <div>
                                            <h5 className="font-semibold mb-4">User Phrases & Examples</h5>
                                            <div className="mb-4">
                                                <div className="input-group">
                                                    <label className="label">Add New Phrase</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={newPhrase}
                                                            onChange={(e) => setNewPhrase(e.target.value)}
                                                            className="input flex-1"
                                                            placeholder="Type a user phrase that triggers this intent..."
                                                        />
                                                        <button
                                                            onClick={handleAddPhrase}
                                                            className="check-btn flex items-center gap-2"
                                                            disabled={!newPhrase.trim()}
                                                        >
                                                            <FiPlus /> Add
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                                {activeIntent.userPhrases.map((phrase, index) => (
                                                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                                        <div className="flex items-center gap-3">
                                                            <FiFileText className="text-gray-400" />
                                                            <span>{phrase}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeletePhrase(index)}
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <FiTrash2 />
                                                        </button>
                                                    </div>
                                                ))}

                                                {activeIntent.userPhrases.length === 0 && (
                                                    <div className="text-center py-6 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                                                        <p>No phrases added yet. Add some user phrases to train the intent.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Confidence Threshold */}
                                        <div>
                                            <h5 className="font-semibold mb-4">Confidence Settings</h5>
                                            <div className="input-group">
                                                <label className="label">
                                                    Threshold: {Math.round((activeIntent.confidenceThreshold || 0.8) * 100)}%
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={(activeIntent.confidenceThreshold || 0.8) * 100}
                                                    onChange={(e) => handleUpdateIntent('confidenceThreshold', e.target.value / 100)}
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                                />
                                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                                    <span>50%</span>
                                                    <span>75%</span>
                                                    <span>90%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <AiOutlineRobot className="mx-auto text-4xl text-gray-400 mb-4" />
                                        <h4 className="font-semibold text-gray-700 mb-2">No Intent Selected</h4>
                                        <p className="text-gray-500">Select an intent from the list to configure it</p>
                                    </div>
                                )}
                            </div>

                            {/* ================= Test Recognition ================= */}
                            <div ref={(el) => (sectionRefs.current['Test Recognition'] = el)} className="bg-white my-4 p-6 rounded-lg border border-gray-200">
                                <h4 className="font-semibold text-lg mb-6">Test Intent Recognition</h4>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <div className="input-group">
                                            <label className="label">Test User Query</label>
                                            <textarea
                                                value={testQuery}
                                                onChange={(e) => setTestQuery(e.target.value)}
                                                className="input"
                                                rows="4"
                                                placeholder="Type a user query to test intent recognition..."
                                            />
                                        </div>
                                        <button
                                            onClick={handleTestIntent}
                                            className="check-btn mt-4 flex items-center gap-2"
                                            disabled={!testQuery.trim()}
                                        >
                                            <FiSearch /> Test Recognition
                                        </button>
                                    </div>

                                    <div>
                                        <div className="input-group">
                                            <label className="label">Test Results</label>
                                            <div className="p-4 border border-gray-200 rounded-lg min-h-[150px] bg-gray-50">
                                                {testResults ? (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-500">Query:</span>
                                                            <span className="font-medium">{testResults.query}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-500">Top Intent:</span>
                                                            <span className="font-medium text-[#02b499]">
                                                                {testResults.topIntent.intent.name} ({Math.round(testResults.topIntent.score * 100)}%)
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-500">Confidence:</span>
                                                            <span className={`font-medium ${testResults.topIntent.matched ? 'text-green-600' : 'text-red-600'}`}>
                                                                {testResults.topIntent.matched ? 'Above threshold ✓' : 'Below threshold ✗'}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Tested at {testResults.timestamp}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-sm">Test results will appear here...</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {testResults && testResults.results && (
                                    <div className="mt-8">
                                        <h5 className="font-semibold mb-4">All Intent Scores</h5>
                                        <div className="space-y-2">
                                            {testResults.results.map((result, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        {result.matched ? (
                                                            <FiCheckCircle className="text-green-500" />
                                                        ) : (
                                                            <FiAlertCircle className="text-gray-400" />
                                                        )}
                                                        <div>
                                                            <div className="font-medium">{result.intent.name}</div>
                                                            <div className="text-xs text-gray-500">
                                                                {result.matchedPhrases.length} phrase(s) matched
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-semibold">{Math.round(result.score * 100)}%</div>
                                                        <div className="text-xs text-gray-500">
                                                            Threshold: {Math.round((result.intent.confidenceThreshold || 0.8) * 100)}%
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ================= Sample Configurations ================= */}
                            {/* <div ref={(el) => (sectionRefs.current['Sample Configurations'] = el)} className="bg-white my-4 p-6 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h4 className="font-semibold text-lg flex items-center gap-2">
                                        <FiCopy className="text-[#02b499]" />
                                        Sample Configurations
                                    </h4>
                                    <p className="text-sm text-gray-600">Quick-start templates for different domains</p>
                                </div>
                                <button className="text-sm text-gray-500 hover:text-gray-700">
                                    View all samples →
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {Object.entries(sampleConfigurations).map(([key, config]) => (
                                    <div key={key} className="border border-gray-200 rounded-lg p-4 hover:border-[#02b499] transition-colors">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h5 className="font-semibold">{config.name}</h5>
                                                <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                                            </div>
                                            {key === domain && (
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                    Current Domain
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-2 mb-4">
                                            {config.intents.slice(0, 3).map((intent, index) => (
                                                <div key={index} className="text-sm flex items-center justify-between">
                                                    <span>{intent.name}</span>
                                                    <span className="text-gray-500">{intent.phrases.length} phrases</span>
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => handleApplySample(config)}
                                            className="w-full check-btn flex items-center justify-center gap-2"
                                        >
                                            <FiCopy /> Apply Sample
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                                <h6 className="font-semibold mb-3 flex items-center gap-2">
                                    <FiInfo className="text-gray-500" />
                                    Using Sample Configurations
                                </h6>
                                <ul className="text-sm text-gray-600 space-y-2">
                                    <li>• Samples provide pre-configured intents with example phrases</li>
                                    <li>• Applied intents appear in your Intent List</li>
                                    <li>• You can modify sample intents after applying</li>
                                    <li>• Good starting point for common use cases</li>
                                </ul>
                            </div>
                        </div> */}
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Scrollable content */}
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto overflow-x-auto hide-scrollbar"
                    >

                        {/* ================= Link Tool Modal ================= */}

                        {showLinkToolModal && (
                            <div className="fixed inset-x-0 top-[64px] bottom-0 bg-black bg-opacity-50 flex justify-center z-50 p-4">
                                <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-semibold text-lg">Link Tool to Intent: {activeIntent?.name}</h3>
                                        <button
                                            onClick={() => setShowLinkToolModal(false)}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Tool Search */}
                                        <div>
                                            <div className="relative mb-4">
                                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search tools by name, description, or category..."
                                                    value={toolSearchQuery}
                                                    onChange={(e) => setToolSearchQuery(e.target.value)}
                                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
                                                />
                                            </div>

                                            {/* Available Tools Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-2">
                                                {availableTools
                                                    .filter(tool =>
                                                        !toolSearchQuery ||
                                                        tool.name.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
                                                        tool.displayName.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
                                                        tool.description.toLowerCase().includes(toolSearchQuery.toLowerCase()) ||
                                                        tool.category.toLowerCase().includes(toolSearchQuery.toLowerCase())
                                                    )
                                                    .filter(tool => !linkedTools.some(linked => linked.id === tool.id))
                                                    .map(tool => (
                                                        <div
                                                            key={tool.id}
                                                            className="border border-gray-200 rounded-lg p-4 hover:border-[#02b499] hover:bg-[#02b499]/5 transition-all cursor-pointer"
                                                            onClick={() => handleLinkTool(tool)}
                                                        >
                                                            <div className="flex items-start gap-3">
                                                                {getToolIcon(tool.type)}
                                                                <div className="flex-1">
                                                                    <div className="flex justify-between items-start">
                                                                        <div>
                                                                            <h6 className="font-semibold">{tool.displayName}</h6>
                                                                            <p className="text-sm text-gray-600 mt-1">{tool.description}</p>
                                                                        </div>
                                                                        <span className={`px-2 py-1 text-xs rounded ${tool.category === 'policy' ? 'bg-blue-100 text-blue-800' :
                                                                            tool.category === 'claims' ? 'bg-orange-100 text-orange-800' :
                                                                                tool.category === 'customer' ? 'bg-green-100 text-green-800' :
                                                                                    'bg-gray-100 text-gray-800'
                                                                            }`}>
                                                                            {tool.category}
                                                                        </span>
                                                                    </div>
                                                                    <div className="mt-3 flex items-center justify-between">
                                                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                                                            <span className="flex items-center gap-1">
                                                                                <FiTool /> {tool.type.toUpperCase()}
                                                                            </span>
                                                                            <span>ID: {tool.name}</span>
                                                                        </div>
                                                                        <button className="check-btn text-sm px-3 py-1">
                                                                            Link Tool
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>

                                            {availableTools.filter(tool =>
                                                !linkedTools.some(linked => linked.id === tool.id)
                                            ).length === 0 && (
                                                    <div className="text-center py-8 text-gray-500">
                                                        <p>All available tools are already linked to this intent</p>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}


                    </div>
                </div>



            </div>
        </div>
    );
};