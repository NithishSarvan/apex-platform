import React, { useState, useRef } from 'react';
import {
    FiUpload,
    FiPlus,
    FiTrash2,
    FiDownload,
    FiFileText,
    FiCheck,
    FiZap,
    FiCpu,
    FiTrendingUp,
    FiSettings,
    FiDatabase,
    FiHardDrive,
    FiClock,
    FiDollarSign,
    FiActivity
} from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import './FineTuning.css';

const FineTuning = ({ data, onUpdate }) => {

    /* ================= STATE ================= */
    const [activeTab, setActiveTab] = useState('Q&A Training');
    const { state } = useLocation();
    const { modelName } = state || {};

    const scrollContainerRef = useRef(null);
    const sectionRefs = useRef({});

    /* ================= SINGLE SOURCE OF TRUTH ================= */
    const tabs = ['Q&A Training', 'File Upload', 'Fine-Tuning Methods', 'Taxonomy'];

    /* ================= DATA STATE ================= */
    const [qaPairs, setQaPairs] = useState([
        { id: 1, question: 'What is your return policy?', answer: '30-day return policy for all products.' },
        { id: 2, question: 'How do I reset my password?', answer: 'Click forgot password on login page.' },
        { id: 3, question: 'What payment methods do you accept?', answer: 'We accept all major credit cards and PayPal.' },
    ]);
    const [trainingData, setTrainingData] = useState([]);
    const [newQA, setNewQA] = useState({ question: '', answer: '' });

    /* ================= FINE-TUNING METHODS CONFIGURATION ================= */
    const [selectedMethod, setSelectedMethod] = useState('sft');
    const [methodConfigs, setMethodConfigs] = useState({
        sft: {
            enabled: true,
            name: 'Supervised Fine-Tuning',
            description: 'Train using labeled examples (input → desired output)',
            parameters: {
                epochs: { value: 3, min: 1, max: 10, step: 1 },
                batchSize: { value: 8, options: [4, 8, 16, 32] },
                learningRate: { value: '2e-5', options: ['1e-5', '2e-5', '5e-5', '1e-4'] },
                validationSplit: { value: 0.2, min: 0.1, max: 0.5, step: 0.05 }
            },
            requirements: {
                minSamples: 100,
                maxSamples: 10000,
                dataType: 'Labeled pairs',
                computeLevel: 'Medium-High'
            }
        },
        peft: {
            enabled: false,
            name: 'Parameter-Efficient Fine-Tuning',
            description: 'LoRA, adapters, or QLoRA for efficient training',
            parameters: {
                adapterType: { value: 'lora', options: ['lora', 'prefix-tuning', 'p-tuning'] },
                rank: { value: 8, min: 4, max: 64, step: 4 },
                alpha: { value: 16, min: 8, max: 32, step: 4 },
                dropout: { value: 0.1, min: 0, max: 0.3, step: 0.05 }
            },
            requirements: {
                minSamples: 50,
                maxSamples: 5000,
                dataType: 'Any structured data',
                computeLevel: 'Low-Medium'
            }
        },
        rft: {
            enabled: false,
            name: 'Reinforcement Fine-Tuning',
            description: 'Reinforce better reasoning paths through grading',
            parameters: {
                rewardModel: { value: 'default', options: ['default', 'custom', 'hybrid'] },
                klPenalty: { value: 0.2, min: 0.1, max: 1.0, step: 0.1 },
                temperature: { value: 1.0, min: 0.1, max: 2.0, step: 0.1 },
                rolloutBatchSize: { value: 4, options: [2, 4, 8] }
            },
            requirements: {
                minSamples: 500,
                maxSamples: 50000,
                dataType: 'Quality-ranked outputs',
                computeLevel: 'High'
            }
        },
        context: {
            enabled: false,
            name: 'In-Context Learning',
            description: 'Dynamic adaptation through example prompts',
            parameters: {
                contextSize: { value: 5, min: 1, max: 20, step: 1 },
                similarityThreshold: { value: 0.7, min: 0.5, max: 0.95, step: 0.05 },
                retrievalMethod: { value: 'semantic', options: ['semantic', 'keyword', 'hybrid'] },
                cacheEnabled: { value: true }
            },
            requirements: {
                minSamples: 10,
                maxSamples: 1000,
                dataType: 'Example prompts',
                computeLevel: 'Low'
            }
        }
    });

    /* ================= GENERAL SETTINGS ================= */
    const [generalSettings, setGeneralSettings] = useState({
        modelBase: 'gpt-3.5-turbo',
        maxTokens: 2048,
        temperature: 0.7,
        saveCheckpoints: true,
        earlyStopping: true,
        evaluationMetrics: ['accuracy', 'f1', 'bleu']
    });

    /* ================= SCROLL SPY ================= */
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

        if (currentTab !== activeTab) setActiveTab(currentTab);
    };

    /* ================= TAB CLICK ================= */
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

    /* ================= HANDLERS ================= */
    const handleAddQA = () => {
        if (!newQA.question || !newQA.answer) return;
        const updated = [...qaPairs, { id: Date.now(), ...newQA }];
        setQaPairs(updated);
        onUpdate?.(updated);
        setNewQA({ question: '', answer: '' });
    };

    const handleDeleteQA = (id) => {
        const updated = qaPairs.filter(q => q.id !== id);
        setQaPairs(updated);
        onUpdate?.(updated);
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.map(file => ({
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            uploadDate: new Date().toLocaleDateString(),
        }));
        const updated = [...trainingData, ...newFiles];
        setTrainingData(updated);
        onUpdate?.(updated);
    };

    const handleDeleteFile = (id) => {
        const updated = trainingData.filter(f => f.id !== id);
        setTrainingData(updated);
        onUpdate?.(updated);
    };

    const handleMethodToggle = (methodId) => {
        setMethodConfigs(prev => ({
            ...prev,
            [methodId]: {
                ...prev[methodId],
                enabled: !prev[methodId].enabled
            }
        }));
    };

    const handleParameterChange = (methodId, paramName, value) => {
        setMethodConfigs(prev => ({
            ...prev,
            [methodId]: {
                ...prev[methodId],
                parameters: {
                    ...prev[methodId].parameters,
                    [paramName]: {
                        ...prev[methodId].parameters[paramName],
                        value: value
                    }
                }
            }
        }));
    };

    const handleGeneralSettingChange = (key, value) => {
        setGeneralSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSaveConfiguration = () => {
        const config = {
            generalSettings,
            methodConfigs,
            dataSummary: {
                qaPairs: qaPairs.length,
                files: trainingData.length,
                totalDataPoints: qaPairs.length + trainingData.length
            },
            timestamp: new Date().toISOString()
        };

        console.log('Saving configuration:', config);
        alert('Configuration saved successfully!');
        // Here you would typically save to backend
    };

    /* ================= METHOD METADATA ================= */
    const methodMetadata = {
        sft: { icon: FiCheck, color: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-700' },
        peft: { icon: FiZap, color: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-700' },
        rft: { icon: FiTrendingUp, color: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-700' },
        context: { icon: FiCpu, color: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-700' }
    };

    return (
        <div className="main-content">
            {/* Header */}

            <div style={{ marginLeft: "0px", marginRight: "auto", width: "90%" }} className='flex flex-col h-full  ' >

                <div className="flex gap-2 items-center ">

                    <div>
                        <h1 className="text-2xl font-bold text-black-500">Fine-Tuning Methods Configuration</h1>

                    </div>
                </div>
                <div className='heighligts my-4' >
                    <p className="text-sm text-gray-600 ">Enable and configure different fine-tuning approaches.</p>
                </div>


                {/* General Settings Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
                    <h5 className="font-semibold mb-4 flex items-center gap-2">
                        <FiSettings /> General Settings
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">


                        <div className="input-group">
                            <label className="label">Max Output Tokens</label>
                            <input
                                type="number"
                                value={generalSettings.maxTokens}
                                onChange={(e) => handleGeneralSettingChange('maxTokens', parseInt(e.target.value))}
                                className="input"
                                min="128"
                                max="4096"
                                step="128"
                            />
                        </div>

                        <div className="input-group">
                            <label className="label">Temperature</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={generalSettings.temperature}
                                    onChange={(e) => handleGeneralSettingChange('temperature', parseFloat(e.target.value))}
                                    className="flex-1"
                                />
                                <span className="text-sm font-medium w-12">{generalSettings.temperature}</span>
                            </div>
                        </div>

                        <div className="input-group">
                            {/* <label className="label">Base Model</label>
                            <select
                                value={generalSettings.modelBase}
                                onChange={(e) => handleGeneralSettingChange('modelBase', e.target.value)}
                                className="input"
                            >
                                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                <option value="gpt-4">GPT-4</option>
                                <option value="llama-2-7b">Llama 2 7B</option>
                                <option value="mistral-7b">Mistral 7B</option>
                            </select> */}
                        </div>

                        <div className="input-group">
                            <label className="checkbox flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={generalSettings.saveCheckpoints}
                                    onChange={(e) => handleGeneralSettingChange('saveCheckpoints', e.target.checked)}
                                />
                                Save Checkpoints
                            </label>
                        </div>

                        <div className="input-group">
                            <label className="checkbox flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={generalSettings.earlyStopping}
                                    onChange={(e) => handleGeneralSettingChange('earlyStopping', e.target.checked)}
                                />
                                Early Stopping
                            </label>
                        </div>
                    </div>
                </div>

                {/* Method Configuration Cards */}
                <div className="space-y-6">
                    {Object.entries(methodConfigs).map(([methodId, config]) => {
                        const metadata = methodMetadata[methodId];
                        const Icon = metadata.icon;

                        return (
                            <div key={methodId} className={`border-2 rounded-lg p-5 ${config.enabled ? metadata.borderColor : 'border-gray-200'}`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${metadata.color}`}>
                                            <Icon className={`text-lg ${metadata.textColor}`} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h5 className="font-semibold">{config.name}</h5>
                                                <span className={`text-xs px-2 py-1 rounded-full ${config.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                                                    {config.enabled ? 'Enabled' : 'Disabled'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleMethodToggle(methodId)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium ${config.enabled ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
                                    >
                                        {config.enabled ? 'Disable' : 'Enable'}
                                    </button>
                                </div>

                                {config.enabled && (
                                    <>
                                        {/* Requirements */}
                                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                            <h6 className="font-medium text-sm mb-2 flex items-center gap-2">
                                                <FiHardDrive /> Requirements
                                            </h6>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="text-center">
                                                    <div className="text-sm font-medium text-gray-700">Min Samples</div>
                                                    <div className="text-lg font-bold">{config.requirements.minSamples}</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-sm font-medium text-gray-700">Max Samples</div>
                                                    <div className="text-lg font-bold">{config.requirements.maxSamples}</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-sm font-medium text-gray-700">Data Type</div>
                                                    <div className="text-sm font-medium">{config.requirements.dataType}</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-sm font-medium text-gray-700">Compute Level</div>
                                                    <div className="text-sm font-medium">{config.requirements.computeLevel}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Parameters */}
                                        <div>
                                            <h6 className="font-medium text-sm mb-3 flex items-center gap-2">
                                                <FiSettings /> Parameters
                                            </h6>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {Object.entries(config.parameters).map(([paramName, paramConfig]) => (
                                                    <div key={paramName} className="input-group">
                                                        <label className="label capitalize">{paramName.replace(/([A-Z])/g, ' $1').trim()}</label>
                                                        {paramConfig.options ? (
                                                            <select
                                                                value={paramConfig.value}
                                                                onChange={(e) => handleParameterChange(methodId, paramName, e.target.value)}
                                                                className="input text-sm"
                                                            >
                                                                {paramConfig.options.map(option => (
                                                                    <option key={option} value={option}>
                                                                        {option}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ) : paramName === 'cacheEnabled' ? (
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={paramConfig.value}
                                                                    onChange={(e) => handleParameterChange(methodId, paramName, e.target.checked)}
                                                                    className="h-4 w-4"
                                                                />
                                                                <span className="text-sm">{paramConfig.value ? 'Enabled' : 'Disabled'}</span>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <input
                                                                    type="range"
                                                                    min={paramConfig.min}
                                                                    max={paramConfig.max}
                                                                    step={paramConfig.step}
                                                                    value={paramConfig.value}
                                                                    onChange={(e) => handleParameterChange(methodId, paramName, parseFloat(e.target.value))}
                                                                    className="w-full"
                                                                />
                                                                <div className="flex justify-between text-xs text-gray-500">
                                                                    <span>{paramConfig.min}</span>
                                                                    <span className="font-medium">{paramConfig.value}</span>
                                                                    <span>{paramConfig.max}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Data Summary & Save */}
                {/* <div className="mt-8">
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                        <h5 className="font-semibold mb-4 flex items-center gap-2">
                            <FiDatabase /> Data Summary
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <FiFileText className="mx-auto text-blue-600 mb-2" />
                                <div className="text-2xl font-bold text-blue-700">{qaPairs.length}</div>
                                <div className="text-xs text-gray-600">Q&A Pairs</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <FiDatabase className="mx-auto text-green-600 mb-2" />
                                <div className="text-2xl font-bold text-green-700">{trainingData.length}</div>
                                <div className="text-xs text-gray-600">Uploaded Files</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <FiActivity className="mx-auto text-purple-600 mb-2" />
                                <div className="text-2xl font-bold text-purple-700">
                                    {Object.values(methodConfigs).filter(m => m.enabled).length}
                                </div>
                                <div className="text-xs text-gray-600">Active Methods</div>
                            </div>
                            <div className="text-center p-4 bg-orange-50 rounded-lg">
                                <FiClock className="mx-auto text-orange-600 mb-2" />
                                <div className="text-2xl font-bold text-orange-700">
                                    {Object.values(methodConfigs).filter(m => m.enabled).length > 0 ? 'Ready' : 'Setup'}
                                </div>
                                <div className="text-xs text-gray-600">Status</div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button className="btn btn-secondary">
                            Export Configuration
                        </button>
                        <button
                            onClick={handleSaveConfiguration}
                            className="check-btn flex items-center gap-2 px-6 py-3"
                        >
                            <FiSettings /> Save Configuration
                        </button>
                    </div>
                </div> */}
            </div>
        </div>


    );
};

export default FineTuning;



