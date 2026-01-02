// ==================== COMPONENT: DYNAMIC API DESIGNER ====================
import React, { useState, useEffect, useRef } from 'react';
import {
    FiPlay,
    FiCode,
    FiSettings,
    FiCopy,
    FiDownload,
    FiUpload,
    FiSave,
    FiRefreshCw,
    FiGlobe,
    FiKey,
    FiTerminal,
    FiEye,
    FiEyeOff,
    FiHelpCircle,
    FiChevronDown,
    FiChevronUp,
    FiExternalLink,
    FiShare2,
    FiPlus,
    FiTrash2,
    FiEdit,
    FiList,
    FiGrid,
    FiDatabase,
    FiType,
    FiHash,
    FiCalendar,
    FiCheckSquare,
    FiChevronsRight,
    FiLink,
    FiX,
    FiSliders


} from 'react-icons/fi';
import { MdHttp, MdOutlineDragIndicator } from 'react-icons/md';
import { TbApi, TbSelector, TbBinary } from 'react-icons/tb';
import { LuTextCursor } from "react-icons/lu";


import gpt from "../../assets/gpt-JRKBi7sz.svg"
import meta from "../../assets/meta-svg.svg"
import mbzuai from "../../assets/mbzuai.svg"
import inception from "../../assets/inception.svg"
import mistral from "../../assets/mistral.svg"
import stablediffusion from "../../assets/stablediffusion.png"
import anthropicCalude from "../../assets/anthropicCalude.svg"
import deepseek from "../../assets/deepseek.svg"
import qwen from "../../assets/qwen.svg"
import cohere from "../../assets/cohere.svg"
import xai from "../../assets/xai.svg"
import dataset from "../../assets/dataset.svg"
import { Box, Typography, } from "@mui/material";
export const ApiPlaygroundPage = () => {
    // API Configuration
    const [apiConfig, setApiConfig] = useState({
        name: 'Policy Expiry API',
        baseUrl: 'https://api.yourdomain.com',
        endpoint: '/v1/policies/expiry',
        method: 'POST',
        authType: 'bearer',
        description: 'Extract policy expiry date from documents',
        version: '1.0.0'
    });

    // Request Structure
    const [requestStructure, setRequestStructure] = useState([
        {
            id: '1',
            name: 'clientId',
            displayName: 'Client ID',
            type: 'string',
            required: true,
            defaultValue: '10037',
            description: 'Client identifier',
            location: 'body',
            nestedFields: []
        },
        {
            id: '2',
            name: 'refreshKey',
            displayName: 'Refresh Key',
            type: 'string',
            required: false,
            defaultValue: '',
            description: 'Authentication key',
            location: 'body',
            nestedFields: []
        },
        {
            id: '3',
            name: 'chatId',
            displayName: 'Chat ID',
            type: 'string',
            required: true,
            defaultValue: `UDID_${Date.now()}`,
            description: 'Unique conversation ID',
            location: 'body',
            nestedFields: []
        },
        {
            id: '4',
            name: 'data',
            displayName: 'Data',
            type: 'object',
            required: true,
            description: 'Processing data',
            location: 'body',
            nestedFields: [
                {
                    id: '4-1',
                    name: 'prompt',
                    displayName: 'Prompt',
                    type: 'string',
                    required: true,
                    defaultValue: 'Extract policy expiry date...',
                    description: 'Processing instructions'
                },
                {
                    id: '4-2',
                    name: 'input1',
                    displayName: 'Document',
                    type: 'binary',
                    required: true,
                    description: 'Base64 encoded document'
                },
                {
                    id: '4-3',
                    name: 'input2',
                    displayName: 'Context',
                    type: 'string',
                    required: false,
                    defaultValue: '',
                    description: 'Additional context text'
                }
            ]
        }
    ]);

    // Response Structure
    const [responseStructure, setResponseStructure] = useState([
        {
            id: 'r1',
            name: 'status',
            displayName: 'Status',
            type: 'string',
            required: true,
            defaultValue: 'Found',
            description: 'Extraction status',
            sampleValue: 'Found'
        },
        {
            id: 'r2',
            name: 'expiry_date',
            displayName: 'Expiry Date',
            type: 'date',
            required: true,
            description: 'Policy expiry date',
            sampleValue: '15-Dec-28'
        },
        {
            id: 'r3',
            name: 'confidence',
            displayName: 'Confidence',
            type: 'number',
            required: false,
            description: 'Extraction confidence score',
            sampleValue: 0.95
        },
        {
            id: 'r4',
            name: 'metadata',
            displayName: 'Metadata',
            type: 'object',
            required: false,
            description: 'Additional metadata',
            nestedFields: [
                {
                    id: 'r4-1',
                    name: 'processing_time',
                    displayName: 'Processing Time',
                    type: 'number',
                    sampleValue: 1250
                },
                {
                    id: 'r4-2',
                    name: 'model_version',
                    displayName: 'Model Version',
                    type: 'string',
                    sampleValue: '1.2.0'
                }
            ]
        }
    ]);

    // Request/Response Data
    const [requestData, setRequestData] = useState({});
    const [responseData, setResponseData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('modelselection');

    // UI State
    const [showApiKey, setShowApiKey] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [selectedEndpoint, setSelectedEndpoint] = useState(null);
    const [fieldMapping, setFieldMapping] = useState([]);

    // Sample endpoints
    const [savedEndpoints, setSavedEndpoints] = useState([
        {
            id: 'ep1',
            name: 'Policy Expiry',
            endpoint: '/v1/policies/expiry',
            method: 'POST',
            requestStructure: [],
            responseStructure: []
        },
        {
            id: 'ep2',
            name: 'Premium Calculator',
            endpoint: '/v1/policies/premium',
            method: 'POST',
            requestStructure: [],
            responseStructure: []
        }
    ]);

    // Handle adding new endpoint
    const handleAddNewEndpoint = () => {
        if (!newEndpoint.name.trim() || !newEndpoint.endpoint.trim()) {
            alert('Please provide endpoint name and path');
            return;
        }

        // Validate endpoint path starts with /
        if (!newEndpoint.endpoint.startsWith('/')) {
            alert('Endpoint path must start with /');
            return;
        }

        const endpointId = `ep_${Date.now()}`;
        const newEndpointData = {
            id: endpointId,
            name: newEndpoint.name,
            endpoint: newEndpoint.endpoint,
            method: newEndpoint.method,
            baseUrl: newEndpoint.baseUrl,
            description: newEndpoint.description,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0],
            requestStructure: [...requestStructure], // Copy current structure
            responseStructure: [...responseStructure], // Copy current structure
            categoryId: newEndpoint.categoryId || 'cat4'
        };

        setSavedEndpoints([...savedEndpoints, newEndpointData]);

        // Reset form
        setNewEndpoint({
            name: '',
            endpoint: '',
            method: 'POST',
            baseUrl: 'https://api.apex.com',
            description: '',
            requestStructure: [],
            responseStructure: []
        });

        setShowNewEndpointModal(false);

        // Switch to endpoints tab and select new endpoint
        setActiveTab('endpoints');
        setSelectedEndpoint(newEndpointData);
    };

    const [endpointCategories, setEndpointCategories] = useState([
        { id: 'cat1', name: 'Policy APIs', color: 'blue' },
        { id: 'cat2', name: 'Customer APIs', color: 'green' },
        { id: 'cat3', name: 'Document APIs', color: 'purple' },
        { id: 'cat4', name: 'General', color: 'gray' }
    ]);


    // Method options
    const methodOptions = [
        { value: 'GET', label: 'GET', color: 'bg-green-100 text-green-800' },
        { value: 'POST', label: 'POST', color: 'bg-blue-100 text-blue-800' },
        { value: 'PUT', label: 'PUT', color: 'bg-yellow-100 text-yellow-800' },
        { value: 'DELETE', label: 'DELETE', color: 'bg-red-100 text-red-800' },
        { value: 'PATCH', label: 'PATCH', color: 'bg-purple-100 text-purple-800' },
        { value: 'OPTIONS', label: 'OPTIONS', color: 'bg-gray-100 text-gray-800' }
    ];

    // Data types with icons
    const dataTypes = [
        { value: 'string', label: 'String', icon: <LuTextCursor className="text-blue-500" /> },
        { value: 'number', label: 'Number', icon: <FiHash className="text-green-500" /> },
        { value: 'boolean', label: 'Boolean', icon: <FiCheckSquare className="text-red-500" /> },
        { value: 'date', label: 'Date', icon: <FiCalendar className="text-purple-500" /> },
        { value: 'binary', label: 'Binary', icon: <TbBinary className="text-orange-500" /> },
        { value: 'array', label: 'Array', icon: <FiList className="text-indigo-500" /> },
        { value: 'object', label: 'Object', icon: <FiGrid className="text-teal-500" /> }
    ];

    // Initialize request data from structure
    useEffect(() => {
        const initialData = {};
        const populateData = (fields, prefix = '') => {
            fields.forEach(field => {
                const key = prefix ? `${prefix}.${field.name}` : field.name;
                if (field.nestedFields && field.nestedFields.length > 0) {
                    initialData[key] = {};
                    populateData(field.nestedFields, key);
                } else if (field.defaultValue !== undefined) {
                    initialData[key] = field.defaultValue;
                } else {
                    // Set default based on type
                    switch (field.type) {
                        case 'string': initialData[key] = ''; break;
                        case 'number': initialData[key] = 0; break;
                        case 'boolean': initialData[key] = false; break;
                        case 'array': initialData[key] = []; break;
                        case 'object': initialData[key] = {}; break;
                        default: initialData[key] = '';
                    }
                }
            });
        };
        populateData(requestStructure);
        setRequestData(initialData);
    }, [requestStructure]);


    const [showNewEndpointModal, setShowNewEndpointModal] = useState(false);
    const [newEndpoint, setNewEndpoint] = useState({
        name: '',
        endpoint: '',
        method: 'POST',
        baseUrl: 'https://api.apex.com',
        description: '',
        requestStructure: [],
        responseStructure: []
    });

    // Handle adding new field
    const handleAddField = (isRequest = true, parentId = null) => {
        const newField = {
            id: `field_${Date.now()}`,
            name: 'new_field',
            displayName: 'New Field',
            type: 'string',
            required: false,
            description: '',
            sampleValue: '',
            nestedFields: []
        };

        if (isRequest) {
            if (parentId) {
                // Add to nested fields
                const updateNestedFields = (fields) => {
                    return fields.map(field => {
                        if (field.id === parentId) {
                            return {
                                ...field,
                                nestedFields: [...(field.nestedFields || []), newField]
                            };
                        }
                        if (field.nestedFields) {
                            return {
                                ...field,
                                nestedFields: updateNestedFields(field.nestedFields)
                            };
                        }
                        return field;
                    });
                };
                setRequestStructure(updateNestedFields(requestStructure));
            } else {
                setRequestStructure([...requestStructure, newField]);
            }
        } else {
            if (parentId) {
                const updateNestedFields = (fields) => {
                    return fields.map(field => {
                        if (field.id === parentId) {
                            return {
                                ...field,
                                nestedFields: [...(field.nestedFields || []), newField]
                            };
                        }
                        if (field.nestedFields) {
                            return {
                                ...field,
                                nestedFields: updateNestedFields(field.nestedFields)
                            };
                        }
                        return field;
                    });
                };
                setResponseStructure(updateNestedFields(responseStructure));
            } else {
                setResponseStructure([...responseStructure, newField]);
            }
        }
    };

    // Handle updating field
    const handleUpdateField = (fieldId, updates, isRequest = true, parentId = null) => {
        const updateFields = (fields) => {
            return fields.map(field => {
                if (field.id === fieldId) {
                    return { ...field, ...updates };
                }
                if (field.nestedFields && field.nestedFields.length > 0) {
                    return {
                        ...field,
                        nestedFields: updateFields(field.nestedFields)
                    };
                }
                return field;
            });
        };

        if (isRequest) {
            setRequestStructure(updateFields(requestStructure));
        } else {
            setResponseStructure(updateFields(responseStructure));
        }
    };

    // Handle deleting field
    const handleDeleteField = (fieldId, isRequest = true, parentId = null) => {
        const removeField = (fields) => {
            return fields.filter(field => field.id !== fieldId)
                .map(field => {
                    if (field.nestedFields && field.nestedFields.length > 0) {
                        return {
                            ...field,
                            nestedFields: removeField(field.nestedFields)
                        };
                    }
                    return field;
                });
        };

        if (isRequest) {
            setRequestStructure(removeField(requestStructure));
        } else {
            setResponseStructure(removeField(responseStructure));
        }
    };

    // Generate request payload from structure and data
    const generateRequestPayload = () => {
        const buildObject = (fields, data) => {
            const result = {};

            fields.forEach(field => {
                const value = data[field.name] || data[`${field.parentId}.${field.name}`];

                if (field.nestedFields && field.nestedFields.length > 0) {
                    result[field.name] = buildObject(field.nestedFields, data);
                } else {
                    result[field.name] = value !== undefined ? value :
                        field.defaultValue !== undefined ? field.defaultValue :
                            getDefaultValue(field.type);
                }
            });

            return result;
        };

        return buildObject(requestStructure, requestData);
    };

    const getDefaultValue = (type) => {
        switch (type) {
            case 'string': return '';
            case 'number': return 0;
            case 'boolean': return false;
            case 'array': return [];
            case 'object': return {};
            default: return '';
        }
    };

    // Handle API test
    const handleTestApi = async () => {
        setLoading(true);
        setError(null);

        try {
            const payload = generateRequestPayload();
            console.log('Generated payload:', payload);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Generate response based on response structure
            const generateResponse = (fields) => {
                const result = {};
                fields.forEach(field => {
                    if (field.nestedFields && field.nestedFields.length > 0) {
                        result[field.name] = generateResponse(field.nestedFields);
                    } else {
                        result[field.name] = field.sampleValue !== undefined ?
                            field.sampleValue :
                            getSampleValue(field.type);
                    }
                });
                return result;
            };

            const mockResponse = generateResponse(responseStructure);
            setResponseData(mockResponse);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getSampleValue = (type) => {
        switch (type) {
            case 'string': return 'sample';
            case 'number': return 123;
            case 'boolean': return true;
            case 'date': return new Date().toISOString();
            default: return 'sample';
        }
    };

    // Generate JSON Schema
    const generateJsonSchema = (fields, isResponse = false) => {
        const buildSchema = (field) => {
            const schema = {
                type: field.type === 'binary' ? 'string' : field.type,
                description: field.description
            };

            if (field.type === 'object' && field.nestedFields) {
                schema.properties = {};
                field.nestedFields.forEach(nested => {
                    schema.properties[nested.name] = buildSchema(nested);
                });
                schema.required = field.nestedFields
                    .filter(f => f.required)
                    .map(f => f.name);
            }

            if (field.type === 'array') {
                schema.items = { type: 'string' }; // Default, can be customized
            }

            return schema;
        };

        const schema = {
            $schema: "http://json-schema.org/draft-07/schema#",
            title: isResponse ? "Response Schema" : "Request Schema",
            type: "object",
            properties: {},
            required: []
        };

        fields.forEach(field => {
            schema.properties[field.name] = buildSchema(field);
            if (field.required) {
                schema.required.push(field.name);
            }
        });

        return schema;
    };

    // Render field editor
    const renderFieldEditor = (field, isRequest = true, depth = 0, parentId = null) => {
        const isEditing = editingField === field.id;

        return (
            <div key={field.id} className={`mb-3 ${depth > 0 ? 'ml-6' : ''}`}>
                <div className={`flex items-center gap-3 p-3 border rounded-lg ${isEditing ? 'border-[#02b499] bg-[#02b499]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <MdOutlineDragIndicator className="text-gray-400 cursor-move" />

                    {isEditing ? (
                        <div className="flex-1 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-600 mb-1">Field Name</label>
                                    <input
                                        type="text"
                                        value={field.name}
                                        onChange={(e) => handleUpdateField(field.id, { name: e.target.value }, isRequest, parentId)}
                                        className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                                        placeholder="field_name"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600 mb-1">Display Name</label>
                                    <input
                                        type="text"
                                        value={field.displayName}
                                        onChange={(e) => handleUpdateField(field.id, { displayName: e.target.value }, isRequest, parentId)}
                                        className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                                        placeholder="Field Name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs text-gray-600 mb-1">Data Type</label>
                                    <select
                                        value={field.type}
                                        onChange={(e) => handleUpdateField(field.id, { type: e.target.value }, isRequest, parentId)}
                                        className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                                    >
                                        {dataTypes.map(dt => (
                                            <option key={dt.value} value={dt.value}>
                                                {dt.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-600 mb-1">Required</label>
                                    <div className="mt-1">
                                        <input
                                            type="checkbox"
                                            checked={field.required}
                                            onChange={(e) => handleUpdateField(field.id, { required: e.target.checked }, isRequest, parentId)}
                                            className="rounded border-gray-300"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-600 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={field.description}
                                    onChange={(e) => handleUpdateField(field.id, { description: e.target.value }, isRequest, parentId)}
                                    className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                                    placeholder="Field description"
                                />
                            </div>

                            {!isRequest && (
                                <div>
                                    <label className="text-xs text-gray-600 mb-1">Sample Value</label>
                                    <input
                                        type="text"
                                        value={field.sampleValue || ''}
                                        onChange={(e) => handleUpdateField(field.id, { sampleValue: e.target.value }, isRequest, parentId)}
                                        className="w-full text-sm border border-gray-300 rounded px-2 py-1"
                                        placeholder="Sample value for testing"
                                    />
                                </div>
                            )}

                            <div className="flex justify-between">
                                <button
                                    onClick={() => setEditingField(null)}
                                    className="text-sm text-gray-600 hover:text-gray-800"
                                >
                                    Done
                                </button>
                                <button
                                    onClick={() => handleDeleteField(field.id, isRequest, parentId)}
                                    className="text-sm text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    {dataTypes.find(dt => dt.value === field.type)?.icon}
                                    <div>
                                        <div className="font-medium">{field.displayName}</div>
                                        <div className="text-xs text-gray-500">
                                            {field.name} • {field.type} • {field.required ? 'Required' : 'Optional'}
                                        </div>
                                    </div>
                                </div>
                                {field.description && (
                                    <div className="text-xs text-gray-600 mt-1">{field.description}</div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setEditingField(field.id)}
                                    className="text-sm text-[#02b499] hover:text-[#02987d]"
                                >
                                    <FiEdit />
                                </button>
                                {field.type === 'object' && (
                                    <button
                                        onClick={() => handleAddField(isRequest, field.id)}
                                        className="text-sm text-blue-500 hover:text-blue-700"
                                    >
                                        <FiPlus /> Add Nested
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Render nested fields */}
                {field.nestedFields && field.nestedFields.length > 0 && (
                    <div className="mt-2">
                        {field.nestedFields.map(nestedField =>
                            renderFieldEditor(nestedField, isRequest, depth + 1, field.id)
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Render data input form
    const renderDataInput = () => {
        const renderInput = (field, prefix = '') => {
            const fieldKey = prefix ? `${prefix}.${field.name}` : field.name;
            const value = requestData[fieldKey] || '';

            if (field.nestedFields && field.nestedFields.length > 0) {
                return (
                    <div key={field.id} className="mb-4 p-4 border border-gray-200 rounded-lg">
                        <label className="font-medium mb-3 block">{field.displayName}</label>
                        <div className="space-y-3">
                            {field.nestedFields.map(nested =>
                                renderInput(nested, fieldKey)
                            )}
                        </div>
                    </div>
                );
            }

            return (
                <div key={field.id} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {field.displayName} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="text-xs text-gray-500 mb-2">
                        {field.name} • {field.type}
                    </div>

                    {field.type === 'string' && (
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setRequestData({ ...requestData, [fieldKey]: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            placeholder={field.description}
                        />
                    )}

                    {field.type === 'number' && (
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => setRequestData({ ...requestData, [fieldKey]: parseFloat(e.target.value) || 0 })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                            placeholder={field.description}
                        />
                    )}

                    {field.type === 'boolean' && (
                        <select
                            value={value}
                            onChange={(e) => setRequestData({ ...requestData, [fieldKey]: e.target.value === 'true' })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        >
                            <option value="true">True</option>
                            <option value="false">False</option>
                        </select>
                    )}

                    {field.type === 'date' && (
                        <input
                            type="date"
                            value={value}
                            onChange={(e) => setRequestData({ ...requestData, [fieldKey]: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        />
                    )}

                    {field.type === 'binary' && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <input
                                type="file"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        // Convert to base64
                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                            const base64 = e.target.result.split(',')[1];
                                            setRequestData({ ...requestData, [fieldKey]: base64 });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="w-full"
                            />
                            <div className="text-sm text-gray-500 mt-2">
                                Upload file for binary data
                            </div>
                        </div>
                    )}

                    {field.description && (
                        <div className="text-xs text-gray-500 mt-1">{field.description}</div>
                    )}
                </div>
            );
        };

        return (
            <div className="space-y-4">
                {requestStructure.map(field => renderInput(field))}
            </div>
        );
    };

    const tabs = [
        { id: 'modelselection', name: 'Models', icon: <FiSliders /> },
        { id: 'endpoints', name: 'Endpoints', icon: <FiDatabase /> },
        { id: 'designer', name: 'API', icon: <FiSettings /> },
        { id: 'test', name: 'API Test', icon: <FiPlay /> },
        { id: 'schema', name: 'JSON Schema', icon: <FiCode /> },

    ];


    const [providers, setProviders] = useState([
        {
            name: 'OpenAI',
            logo: gpt,
            description: 'Advanced AI models including GPT-4'
        },
        {
            name: 'Anthropic',
            logo: anthropicCalude,
            description: 'Claude series models'
        },
        {
            name: 'Google',
            logo: xai,
            description: 'Gemini and PaLM models'
        },
        {
            name: 'Meta',
            logo: meta,
            description: 'Llama series models'
        },
        {
            name: 'Microsoft',
            logo: cohere,
            description: 'Azure AI models'
        },
        {
            name: 'Amazon',
            logo: deepseek,
            description: 'Bedrock models'
        }
    ]);


    const [models, setModels] = useState([
        {
            id: 'gpt-4',
            name: 'GPT-4o',
            desc: `GPT-4o is OpenAI's latest model, offering faster, more efficient, and skillful multimodal reasoning for text inputs while maintaining improved accuracy, coherence, and responsiveness.`,
            sector: 'Insurance',
            subDomain: 'Finance',
            modelType: 'API',
            maxToken: '32768',
            useCase: "Policy Inquiry & Claims Assistance",
            logo: gpt
        },
        {
            id: 'gpt-41', name: 'GPT-4o mini', desc: `OpenAI's most advanced model in the small models category supports text inputs and generates text outputs, making it ideal for smaller tasks.`,
            sector: 'Insurance',
            subDomain: 'Policy Quotation',
            modelType: 'API',
            maxToken: '32768',
            useCase: "Workflow Automation",
            logo: gpt
        },
        {
            id: 'gpt-42', name: 'K2 Think Cerebras', desc: `K2 Think is a reasoning model that achieves state-of-the-art performance with 32B parameters. It was developed in the UAE by Mohamed bin Zayed University of Artificial Intelligence (MBZUAI). The model is deployed and running on the Cerebras clusters.`,
            sector: 'Insurance',
            subDomain: 'Finance',
            modelType: 'Self',
            maxToken: '32768',
            useCase: "Claims Assistance",
            logo: mistral
        },
        {
            id: 'gpt-43', name: 'gpt-oss-120b Cerebras', desc: `K2 Think is a reasoning model that achieves state-of-the-art performance with 32B parameters. It was developed in the UAE by Mohamed bin Zayed University of Artificial Intelligence (MBZUAI). The model is deployed and running on the Core42 cloud located in the UAE region.`,
            sector: 'Insurance',
            subDomain: 'Agent',
            modelType: 'API',
            maxToken: '32768',
            useCase: "Fraud Detection",
            logo: gpt
        },
        {
            id: 'gpt-44', name: 'Whisper', desc: `Whisper is a general-purpose speech recognition model. It is trained on a large dataset of diverse audio and is also a multitask model that can perform multilingual speech recognition as well as speech translation and language identification.`,
            sector: 'Others',
            subDomain: 'Customer',
            modelType: 'Self',
            maxToken: '32768',
            useCase: "Policy Renewal & Alerts",
            logo: gpt
        },
        {
            id: 'gpt-45', name: 'Llama 3 70B', desc: `Llama 3 is an auto-regressive language model, part of the Llama 3 family, and the next generation of Meta's open-source LLMs. It is one of the most capable openly available LLMs with improved reasoning capabilities compared to its previous models.`,
            sector: 'Others',
            subDomain: 'Finance',
            modelType: 'Self',
            maxToken: '32768',
            useCase: "Policy Inquiry & Customer Support",
            logo: qwen
        },

    ]);


    const [selectedProvider, setSelectedProvider] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);

    const handleProviderSelect = (provider) => {
        setSelectedProvider(provider);
        setSelectedModel(null); // Clear model selection
    };

    const handleModelSelect = (modelId) => {
        setSelectedModel(modelId);
        setSelectedProvider(null); // Clear provider selection
        setSelectedModelId(prevId => prevId === modelId ? null : modelId);
    };

    const handleApplySelection = () => {
        // if (selectedModel) {
        //     console.log("Selected Model:", selectedModel);

        // } else if (selectedProvider) {
        //     console.log("Selected Provider:", selectedProvider);

        // }

    };

    const handleLoadEndpoint = (endpoint) => {
        setSelectedEndpoint(endpoint);
        setApiConfig({
            name: endpoint.name,
            baseUrl: endpoint.baseUrl,
            endpoint: endpoint.endpoint,
            method: endpoint.method,
            authType: 'bearer',
            description: endpoint.description,
            version: '1.0.0'
        });
        setRequestStructure(endpoint.requestStructure || []);
        setResponseStructure(endpoint.responseStructure || []);

        // Switch to designer tab
        setActiveTab('designer');
    };

    // Handle deleting an endpoint
    const handleDeleteEndpoint = (endpointId, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this endpoint?')) {
            const updatedEndpoints = savedEndpoints.filter(ep => ep.id !== endpointId);
            setSavedEndpoints(updatedEndpoints);

            // If current endpoint is deleted, clear selection
            if (selectedEndpoint?.id === endpointId) {
                setSelectedEndpoint(null);
                setApiConfig({
                    name: 'New API',
                    baseUrl: 'https://api.apex.com',
                    endpoint: '/v1/new-endpoint',
                    method: 'POST',
                    authType: 'bearer',
                    description: '',
                    version: '1.0.0'
                });
                setRequestStructure([]);
                setResponseStructure([]);
            }
        }
    };

    const handleDuplicateEndpoint = (endpoint, e) => {
        e.stopPropagation();
        const duplicate = {
            ...endpoint,
            id: `ep_${Date.now()}`,
            name: `${endpoint.name} (Copy)`,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };

        setSavedEndpoints([...savedEndpoints, duplicate]);
    };

    const [selectedModelId, setSelectedModelId] = useState(null);



    const [activeModelTab, setActiveModelTab] = useState('trained');

    return (
        <div className="main-content">
            <div style={{ marginLeft: "0px", marginRight: "auto", width: "90%" }} className='flex flex-col h-full'>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-black-500">API Designer</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="save-conf-btn align-right">
                            Save
                        </button>
                    </div>
                </div>

                <div className='heighligts my-4'>
                    <p className="text-sm text-gray-600">Design custom API endpoints with dynamic request/response structures</p>
                </div>



                {/* Main Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === tab.id
                                ? 'border-[#000] text-[#000]'
                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                } flex items-center gap-2`}
                        >
                            {tab.icon}
                            {tab.name}
                        </button>
                    ))}
                </div>

                {activeTab === 'modelselection' && (

                    <div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between ">

                                <div className="flex items-center px-5"> {/* Added wrapper for left side content */}
                                    <h1 className="font-semibold text-lg ">{activeModelTab === 'trained' ? "Select from trained models " : "Select from standard models"}</h1>
                                </div>

                                <div className="flex items-center gap-0  bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setActiveModelTab('trained')}
                                        className={`px-8 py-2 rounded-md text-sm font-medium transition-all ${activeModelTab === 'trained' ? 'bg-white text-[#02b499] shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                                        Trained Models
                                    </button>
                                    <button
                                        onClick={() => setActiveModelTab('standard')}
                                        className={`px-8 py-2 rounded-md text-sm font-medium transition-all ${activeModelTab === 'standard' ? 'bg-white text-[#02b499] shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                                        Standard Models
                                    </button>
                                </div>

                            </div>
                        </div>


                        <Box sx={{
                            display: "flex",
                            flex: 1,
                            minHeight: 0,
                            overflow: "hidden"
                        }}>

                            <Box
                                sx={{
                                    flex: 1,
                                    p: 0,
                                    overflowY: "auto",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {/* Trained Models Section */}
                                {activeModelTab === 'trained' && (
                                    <Box>

                                        <Box sx={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                                            gap: 0
                                        }}>
                                            {models.map((model) => (
                                                <Box
                                                    key={model.id}
                                                    onClick={() => handleModelSelect(model)}
                                                    sx={{
                                                        border: selectedModel?.id === model.id ? "2px solid #00d4aa" : "1px solid #e0e0e0",
                                                        borderRadius: 0,
                                                        p: 2.5,
                                                        cursor: "pointer",
                                                        backgroundColor: selectedModel?.id === model.id ? "rgba(0, 212, 170, 0.05)" : "white",
                                                        transition: "all 0.2s ease",
                                                        "&:hover": {
                                                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                                                            transform: "translateY(-2px)",
                                                        },
                                                        position: "relative",
                                                    }}
                                                >
                                                    {/* Selection Indicator */}
                                                    {selectedModel?.id === model.id && (
                                                        <Box sx={{
                                                            position: "absolute",
                                                            top: 10,
                                                            right: 10,
                                                            backgroundColor: "#00d4aa",
                                                            color: "white",
                                                            borderRadius: "50%",
                                                            width: 20,
                                                            height: 20,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontSize: "12px",
                                                        }}>
                                                            ✓
                                                        </Box>
                                                    )}

                                                    {/* Model Header */}
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                                        <img
                                                            src={model.logo}
                                                            alt={model.name}
                                                            style={{ width: 40, height: 40, objectFit: "contain" }}
                                                        />
                                                        <Box>
                                                            <Typography fontWeight="bold" fontSize="16px">
                                                                {model.name}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {model.useCase}
                                                            </Typography>
                                                        </Box>
                                                    </Box>

                                                    {/* Model Description */}
                                                    <Typography className="model-desc line-clamp-3" >
                                                        {model.desc}
                                                    </Typography>

                                                    {/* Model Details Grid */}
                                                    <Box sx={{
                                                        display: "grid",
                                                        gridTemplateColumns: "repeat(2, 1fr)",
                                                        gap: 1.5,
                                                        mt: 2
                                                    }}>
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Sector
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight="500">
                                                                {model.sector}
                                                            </Typography>
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Sub-domain
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight="500">
                                                                {model.subDomain}
                                                            </Typography>
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Model Type
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight="500">
                                                                {model.modelType}
                                                            </Typography>
                                                        </Box>
                                                        <Box>
                                                            <Typography variant="caption" color="text.secondary">
                                                                Max Tokens
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight="500">
                                                                {model.maxToken}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                )}

                                {/* Standard Models Section */}
                                {activeModelTab === 'standard' && (
                                    <Box>

                                        <Box sx={{
                                            display: "grid",
                                            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                                            gap: 0
                                        }}>
                                            {providers.map((provider) => (
                                                <Box
                                                    key={provider.name}
                                                    onClick={() => handleProviderSelect(provider)}
                                                    sx={{
                                                        border: selectedProvider?.name === provider.name ? "2px solid #00d4aa" : "1px solid #e0e0e0",
                                                        borderRadius: 0,
                                                        p: 3,
                                                        cursor: "pointer",
                                                        backgroundColor: selectedProvider?.name === provider.name ? "rgba(0, 212, 170, 0.05)" : "white",
                                                        transition: "all 0.2s ease",
                                                        "&:hover": {
                                                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                                                            transform: "translateY(-2px)",
                                                        },
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        textAlign: "center",
                                                        position: "relative",
                                                        minHeight: "140px",
                                                    }}
                                                >
                                                    {/* Selection Indicator */}
                                                    {selectedProvider?.name === provider.name && (
                                                        <Box sx={{
                                                            position: "absolute",
                                                            top: 10,
                                                            right: 10,
                                                            backgroundColor: "#00d4aa",
                                                            color: "white",
                                                            borderRadius: "50%",
                                                            width: 20,
                                                            height: 20,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontSize: "12px",
                                                        }}>
                                                            ✓
                                                        </Box>
                                                    )}

                                                    <img
                                                        src={provider.logo}
                                                        alt={provider.name}
                                                        style={{ width: 60, height: 60, objectFit: "contain", marginBottom: 12 }}
                                                    />
                                                    <Typography fontWeight="bold" fontSize="18px">
                                                        {provider.name}
                                                    </Typography>
                                                    {provider.description && (
                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: "13px" }}>
                                                            {provider.description}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </div>
                )}

                {/* Designer Tab */}
                {activeTab === 'designer' && (
                    <div className="grid grid-cols-2 gap-6">

                        {/* Endpoint Selection Header */}
                        <div className="col-span-2">
                            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            <FiSettings className="text-[#02b499]" />
                                            Select end point
                                        </h3>
                                        <p className="text-sm text-gray-600">Design request and response structures for your endpoints</p>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* Endpoint Selector */}
                                        <div className="flex items-center gap-2">

                                            <select
                                                value={selectedEndpoint?.id || 'new'}
                                                onChange={(e) => {
                                                    const endpointId = e.target.value;
                                                    if (endpointId === 'new') {
                                                        // Create new endpoint
                                                        setSelectedEndpoint(null);
                                                        setApiConfig({
                                                            name: 'New API Endpoint',
                                                            baseUrl: 'https://api.apex.com',
                                                            endpoint: '/v1/new-endpoint',
                                                            method: 'POST',
                                                            authType: 'bearer',
                                                            description: 'New endpoint',
                                                            version: '1.0.0'
                                                        });
                                                        setRequestStructure([]);
                                                        setResponseStructure([]);
                                                    } else {
                                                        // Load existing endpoint
                                                        const endpoint = savedEndpoints.find(ep => ep.id === endpointId);
                                                        if (endpoint) {
                                                            handleLoadEndpoint(endpoint);
                                                        }
                                                    }
                                                }}
                                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm min-w-[250px]"
                                            >
                                                {/* <option value="new">+ Create New Endpoint</option> */}
                                                <optgroup label="Existing Endpoints">
                                                    {savedEndpoints.map(endpoint => {
                                                        const methodOption = methodOptions.find(m => m.value === endpoint.method);
                                                        return (
                                                            <option key={endpoint.id} value={endpoint.id}>
                                                                {endpoint.name} ({endpoint.method} {endpoint.endpoint})
                                                            </option>
                                                        );
                                                    })}
                                                </optgroup>
                                            </select>

                                        </div>


                                    </div>

                                </div>

                                {/* Current Endpoint Info */}
                                {selectedEndpoint && (
                                    <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium">{selectedEndpoint.name}</div>
                                                <div className="text-sm text-gray-600 flex items-center gap-3 mt-1">
                                                    <code className="bg-white px-2 py-1 rounded border">
                                                        {selectedEndpoint.method} {selectedEndpoint.baseUrl}{selectedEndpoint.endpoint}
                                                    </code>
                                                    {/* <span>Last updated: {selectedEndpoint.updatedAt}</span> */}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Request Structure */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <FiChevronsRight className="text-blue-500" />
                                    Request Structure
                                </h3>
                                <button
                                    onClick={() => handleAddField(true)}
                                    className="check-btn flex items-center gap-2 text-sm"
                                >
                                    <FiPlus /> Add Field
                                </button>
                            </div>

                            <div className="space-y-4">
                                {requestStructure.map(field => renderFieldEditor(field, true))}

                                {requestStructure.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        <FiPlus className="text-3xl mx-auto mb-3 opacity-50" />
                                        <p>Add fields to define your request structure</p>
                                    </div>
                                )}
                            </div>

                            {/* Generated JSON Preview */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h4 className="font-medium mb-3">Generated Request Payload</h4>
                                <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm overflow-auto max-h-60">
                                    {JSON.stringify(generateRequestPayload(), null, 2)}
                                </pre>
                            </div>
                        </div>

                        {/* Response Structure */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <FiChevronsRight className="text-green-500 rotate-180" />
                                    Response Structure
                                </h3>
                                <button
                                    onClick={() => handleAddField(false)}
                                    className="check-btn flex items-center gap-2 text-sm"
                                >
                                    <FiPlus /> Add Field
                                </button>
                            </div>

                            <div className="space-y-4">
                                {responseStructure.map(field => renderFieldEditor(field, false))}

                                {responseStructure.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">
                                        <FiPlus className="text-3xl mx-auto mb-3 opacity-50" />
                                        <p>Add fields to define your response structure</p>
                                    </div>
                                )}
                            </div>

                            {/* Field Mapping */}
                            {/* <div className="mt-8 pt-6 border-t border-gray-200">
                                <h4 className="font-medium mb-3">Field Mapping</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Request → Response Mapping</span>
                                        <button className="text-[#02b499] hover:text-[#02987d] text-sm">
                                            <FiLink /> Configure Mapping
                                        </button>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                )}

                {/* Test Tab */}
                {activeTab === 'test' && (
                    <div className="grid grid-cols-2 gap-6">
                        {/* Request Input */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-semibold text-lg">Request Data</h3>
                                <button
                                    onClick={handleTestApi}
                                    disabled={loading}
                                    className="check-btn flex items-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <FiRefreshCw className="animate-spin" />
                                            Testing...
                                        </>
                                    ) : (
                                        <>
                                            <FiPlay />
                                            Test API
                                        </>
                                    )}
                                </button>
                            </div>

                            {renderDataInput()}

                            {/* Generated Request Preview */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h4 className="font-medium mb-3">Request Payload Preview</h4>
                                <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm overflow-auto max-h-60">
                                    {JSON.stringify(generateRequestPayload(), null, 2)}
                                </pre>
                            </div>
                        </div>

                        {/* Response Output */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-semibold text-lg">API Response</h3>
                                <div className="flex gap-2">
                                    {responseData && (
                                        <button
                                            onClick={() => navigator.clipboard.writeText(JSON.stringify(responseData, null, 2))}
                                            className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
                                        >
                                            <FiCopy /> Copy
                                        </button>
                                    )}
                                </div>
                            </div>

                            {error ? (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="text-red-600 font-medium">Error</div>
                                    <div className="text-sm text-red-700 mt-1">{error}</div>
                                </div>
                            ) : responseData ? (
                                <>
                                    <div className="mb-6">
                                        <h4 className="font-medium mb-3">Response Data</h4>
                                        <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm overflow-auto max-h-96">
                                            {JSON.stringify(responseData, null, 2)}
                                        </pre>
                                    </div>

                                    {/* Response Validation */}
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <h4 className="font-medium text-green-800 mb-2">Response Validation</h4>
                                        <div className="space-y-2">
                                            {responseStructure.map(field => (
                                                <div key={field.id} className="flex items-center justify-between">
                                                    <span className="text-sm">{field.displayName}</span>
                                                    <span className={`text-sm ${responseData[field.name] !== undefined ? 'text-green-600' : 'text-red-600'}`}>
                                                        {responseData[field.name] !== undefined ? '✓ Present' : '✗ Missing'}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <FiPlay className="text-3xl mx-auto mb-3 opacity-50" />
                                    <p>Enter request data and click "Test API" to see response</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Schema Tab */}
                {activeTab === 'schema' && (
                    <div className="grid grid-cols-2 gap-6">
                        {/* Request Schema */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="font-semibold text-lg mb-6">Request JSON Schema</h3>
                            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-auto max-h-[600px]">
                                {JSON.stringify(generateJsonSchema(requestStructure, false), null, 2)}
                            </pre>
                        </div>

                        {/* Response Schema */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="font-semibold text-lg mb-6">Response JSON Schema</h3>
                            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-sm overflow-auto max-h-[600px]">
                                {JSON.stringify(generateJsonSchema(responseStructure, true), null, 2)}
                            </pre>
                        </div>
                    </div>
                )}

                {/* Endpoints Tab */}
                {activeTab === 'endpoints' && (
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-semibold text-lg">Saved Endpoints</h3>
                            <button onClick={() => setShowNewEndpointModal(true)} className="check-btn flex items-center gap-2">

                                <FiPlus /> New Endpoint
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {savedEndpoints.map(endpoint => (
                                <div key={endpoint.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#02b499] transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h4 className="font-semibold">{endpoint.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={`px-2 py-1 text-xs rounded ${endpoint.method === 'POST' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {endpoint.method}
                                                </span>
                                                <code className="text-xs text-gray-600">{endpoint.endpoint}</code>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedEndpoint(endpoint)}
                                            className="flex-1 check-btn text-sm py-1"
                                        >
                                            Load
                                        </button>
                                        <button className="px-3 py-1 border border-gray-300 rounded text-gray-700 hover:bg-gray-50">
                                            <FiEdit />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Export Options */}
                        {/* <div className="mt-8 pt-6 border-t border-gray-200">
                            <h4 className="font-medium mb-4">Export Configuration</h4>
                            <div className="grid grid-cols-4 gap-4">
                                <button className="p-4 border border-gray-200 rounded-lg hover:border-[#02b499] hover:bg-[#02b499]/5 text-center">
                                    <FiDownload className="mx-auto mb-2 text-xl" />
                                    <div className="text-sm">OpenAPI Spec</div>
                                </button>
                                <button className="p-4 border border-gray-200 rounded-lg hover:border-[#02b499] hover:bg-[#02b499]/5 text-center">
                                    <FiCode className="mx-auto mb-2 text-xl" />
                                    <div className="text-sm">Postman Collection</div>
                                </button>
                                <button className="p-4 border border-gray-200 rounded-lg hover:border-[#02b499] hover:bg-[#02b499]/5 text-center">
                                    <FiDatabase className="mx-auto mb-2 text-xl" />
                                    <div className="text-sm">Database Schema</div>
                                </button>
                                <button className="p-4 border border-gray-200 rounded-lg hover:border-[#02b499] hover:bg-[#02b499]/5 text-center">
                                    <FiShare2 className="mx-auto mb-2 text-xl" />
                                    <div className="text-sm">Share API</div>
                                </button>
                            </div>
                        </div> */}
                    </div>
                )}

                {showNewEndpointModal && (
                    <div className="fixed inset-x-0 top-[64px] bottom-0 bg-black bg-opacity-50 
             flex justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-semibold text-lg">Create New API Endpoint</h3>
                                <button
                                    onClick={() => setShowNewEndpointModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FiX />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Basic Information */}
                                <div>
                                    <h4 className="font-medium mb-4">Basic Information</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="label block mb-2">Endpoint Name *</label>
                                            <input
                                                type="text"
                                                value={newEndpoint.name}
                                                onChange={(e) => setNewEndpoint({ ...newEndpoint, name: e.target.value })}
                                                className="input"
                                                placeholder="e.g., Policy Expiry API"
                                            />
                                        </div>
                                        <div>
                                            <label className="label block mb-2">Category</label>
                                            <select
                                                value={newEndpoint.categoryId || 'cat4'}
                                                onChange={(e) => setNewEndpoint({ ...newEndpoint, categoryId: e.target.value })}
                                                className="input"
                                            >
                                                {endpointCategories.map(category => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="label block mb-2">Description</label>
                                        <textarea
                                            value={newEndpoint.description}
                                            onChange={(e) => setNewEndpoint({ ...newEndpoint, description: e.target.value })}
                                            className="input"
                                            rows="2"
                                            placeholder="Describe what this endpoint does..."
                                        />
                                    </div>
                                </div>

                                {/* API Configuration */}
                                <div>
                                    <h4 className="font-medium mb-4">API Configuration</h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="label block mb-2">Base URL</label>
                                            <input
                                                type="text"
                                                value={newEndpoint.baseUrl}
                                                onChange={(e) => setNewEndpoint({ ...newEndpoint, baseUrl: e.target.value })}
                                                className="input"
                                                placeholder="https://api.example.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="label block mb-2">Method</label>
                                            <select
                                                value={newEndpoint.method}
                                                onChange={(e) => setNewEndpoint({ ...newEndpoint, method: e.target.value })}
                                                className="input"
                                            >
                                                {methodOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="label block mb-2">Endpoint Path *</label>
                                            <input
                                                type="text"
                                                value={newEndpoint.endpoint}
                                                onChange={(e) => setNewEndpoint({ ...newEndpoint, endpoint: e.target.value })}
                                                className="input font-mono text-sm"
                                                placeholder="/v1/path/{param}"
                                            />
                                            <div className="text-xs text-gray-500 mt-1">
                                                Must start with /
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Structure Preview */}
                                <div>
                                    <h4 className="font-medium mb-4">Structure Preview</h4>
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between mb-3">
                                            <div>
                                                <span className="text-sm font-medium">Current Request Structure:</span>
                                                <span className="text-sm text-gray-600 ml-2">
                                                    {requestStructure.length} fields
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-sm font-medium">Response Structure:</span>
                                                <span className="text-sm text-gray-600 ml-2">
                                                    {responseStructure.length} fields
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-sm text-gray-600">
                                            This endpoint will include the current request and response structures.
                                            You can modify them after creation.
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setShowNewEndpointModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleAddNewEndpoint}
                                        className="check-btn px-4 py-2 flex items-center gap-2"
                                    >
                                        <FiSave /> Create Endpoint
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};