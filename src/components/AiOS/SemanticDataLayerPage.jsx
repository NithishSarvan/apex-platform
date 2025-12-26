// ==================== COMPONENT 3: SEMANTIC DATA LAYER PAGE ====================
import React, { useState, useEffect, useRef } from 'react';
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
    FiMap,
    FiLayers,
    FiX,
    FiUsers,
    FiCreditCard,
    FiFile,
    FiPackage,
    FiDollarSign,
    FiCalendar,
    FiMail,
    FiPhone
} from 'react-icons/fi';
import { AiOutlineDatabase, AiOutlineQuestionCircle } from 'react-icons/ai';
import { useLocation } from 'react-router-dom';
import DOMAIN_TEMPLATES from './DOMAIN_TEMPLATES';
import { useNavigate } from 'react-router-dom';

const DataMappingTable = ({ source, entity, onMap, existingMappings }) => {


    const [selectedTable, setSelectedTable] = useState(source.tables[0]);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h6 className="font-semibold">Table: {selectedTable.name}</h6>
                    <p className="text-sm text-gray-500">{selectedTable.columns.length} columns available</p>
                </div>
                <div className="flex gap-2">
                    {source.tables.map(table => (
                        <button
                            key={table.name}
                            onClick={() => setSelectedTable(table)}
                            className={`px-3 py-1 text-sm rounded-full border ${selectedTable.name === table.name
                                ? 'bg-[#02b499] text-white border-[#02b499]'
                                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            {table.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 border-b">Column Name</th>
                            <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 border-b">Type</th>
                            <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 border-b">Map to Field</th>
                            <th className="py-2 px-3 text-left text-sm font-semibold text-gray-700 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedTable.columns.map(column => {
                            const existingMapping = existingMappings.find(m =>
                                m.source === `${selectedTable.name}.${column.name}`
                            );

                            return (
                                <tr key={column.name} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-3">
                                        <div className="flex items-center gap-2">
                                            <FiDatabase className="text-gray-400" />
                                            <span className="font-medium">{column.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                            {column.type}
                                        </span>
                                    </td>
                                    <td className="py-3 px-3">
                                        <select
                                            value={existingMapping?.semanticField || ''}
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    onMap(
                                                        `${selectedTable.name}.${column.name}`,
                                                        entity.id,
                                                        e.target.value
                                                    );
                                                }
                                            }}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                        >
                                            <option value="">Select field...</option>
                                            {entity.fields.map(field => (
                                                <option key={field.id} value={field.id}>
                                                    {field.name} ({field.type})
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="py-3 px-3">
                                        {existingMapping ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                                <FiCheck className="text-xs" />
                                                Mapped
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                                                Unmapped
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const SemanticDataLayerPage = ({ domain = 'insurance' }) => {
    const navigate = useNavigate();
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [activeTab, setActiveTab] = useState('Purpose & Overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateEntityModal, setShowCreateEntityModal] = useState(false);
    const [showCreateDataSourceModal, setShowCreateDataSourceModal] = useState(false);
    const [dataSources, setDataSources] = useState([
        {
            id: 'postgres_1',
            name: 'Customer Database',
            type: 'postgres',
            connection: 'postgresql://user:pass@localhost:5432/customers',
            tables: [
                {
                    name: 'policy_master',
                    columns: [
                        { name: 'policy_no', type: 'string' },
                        { name: 'cust_name', type: 'string' },
                        { name: 'premium_amt', type: 'decimal' },
                        { name: 'expiry_dt', type: 'date' }
                    ]
                },
                {
                    name: 'claims_data',
                    columns: [
                        { name: 'claim_id', type: 'string' },
                        { name: 'policy_no', type: 'string' },
                        { name: 'claim_amount', type: 'decimal' },
                        { name: 'claim_date', type: 'date' },
                        { name: 'status', type: 'string' }
                    ]
                }
            ]
        },

    ]);

    const [mappings, setMappings] = useState([]);
    const [newDataSource, setNewDataSource] = useState({
        name: '',
        type: '',
        connection: '',
        description: ''
    });

    const [newEntity, setNewEntity] = useState({
        name: '',
        description: '',
        fields: [{
            id: `field_${Date.now()}_1`,
            name: '',
            type: 'string',
            description: '',
            required: false
        }]
    });

    const { state } = useLocation();
    const { modelName } = state || {};

    const scrollContainerRef = useRef(null);
    const sectionRefs = useRef({});

    // Tabs configuration
    const tabs = ['Purpose & Overview', 'Semantic Entities', 'Data Sources', 'Field Mapping', 'Mapping Validation'];

    const [availableFieldTypes] = useState([
        'string', 'number', 'boolean', 'date', 'datetime', 'decimal', 'integer',
        'email', 'phone', 'url', 'json', 'array', 'object'
    ]);

    const [semanticEntities, setSemanticEntities] = useState([]);

    useEffect(() => {
        // Load domain-specific intents
        if (DOMAIN_TEMPLATES[domain]) {
            const loadedEntities = DOMAIN_TEMPLATES[domain]?.semanticEntities || [];
            setSemanticEntities(loadedEntities);
            if (loadedEntities.length > 0) {
                setSelectedEntity(loadedEntities[0]);
            }
        }
    }, [domain]);

    const handleCreateMapping = (sourcePath, entityId, fieldId) => {
        const newMapping = {
            id: `map_${Date.now()}`,
            source: sourcePath,
            semanticEntity: entityId,
            semanticField: fieldId,
            transformation: null,
            qualityScore: 0.9,
            createdAt: new Date().toISOString()
        };

        setMappings([...mappings, newMapping]);
    };

    const getEntityMappings = (entityId) => {
        return mappings.filter(m => m.semanticEntity === entityId);
    };

    const handleAddDataSource = () => {
        if (!newDataSource.name.trim()) {
            alert('Data source name is required');
            return;
        }
        if (!newDataSource.type.trim()) {
            alert('Data source type is required');
            return;
        }

        const newSource = {
            id: `source_${Date.now()}`,
            name: newDataSource.name,
            type: newDataSource.type,
            connection: newDataSource.connection,
            description: newDataSource.description,
            tables: [],
            status: 'connected',
            createdAt: new Date().toISOString()
        };

        setDataSources([...dataSources, newSource]);
        setNewDataSource({ name: '', type: '', connection: '', description: '' });
        setShowCreateDataSourceModal(false);
    };

    const handleDeleteDataSource = (id) => {
        const updatedSources = dataSources.filter(source => source.id !== id);
        setDataSources(updatedSources);
    };

    const handleCreateEntity = () => {
        if (!newEntity.name.trim()) {
            alert('Entity name is required');
            return;
        }

        // Validate fields
        const invalidFields = newEntity.fields.filter(f => !f.name.trim());
        if (invalidFields.length > 0) {
            alert('All field names are required');
            return;
        }

        // Create new entity
        const newEntityObj = {
            id: `entity_${Date.now()}`,
            name: newEntity.name,
            description: newEntity.description,
            fields: newEntity.fields.map(f => ({
                ...f,
                id: f.id.startsWith('field_') ? f.id : `field_${Date.now()}_${Math.random()}`
            })),
            domain: domain,
            createdAt: new Date().toISOString()
        };

        // Add to semantic entities
        const updatedEntities = [...semanticEntities, newEntityObj];
        setSemanticEntities(updatedEntities);
        setSelectedEntity(newEntityObj);

        // Reset and close
        setShowCreateEntityModal(false);
        setNewEntity({
            name: '',
            description: '',
            fields: [{
                id: `field_${Date.now()}_1`,
                name: '',
                type: 'string',
                description: '',
                required: false
            }]
        });
    };

    const handleAddField = () => {
        const newFieldId = `field_${Date.now()}_${newEntity.fields.length + 1}`;
        setNewEntity({
            ...newEntity,
            fields: [
                ...newEntity.fields,
                {
                    id: newFieldId,
                    name: '',
                    type: 'string',
                    description: '',
                    required: false
                }
            ]
        });
    };

    const handleRemoveField = (index) => {
        const updatedFields = newEntity.fields.filter((_, i) => i !== index);
        setNewEntity({ ...newEntity, fields: updatedFields });
    };

    const handleUpdateField = (index, field, value) => {
        const updatedFields = [...newEntity.fields];
        updatedFields[index] = { ...field, ...value };
        setNewEntity({ ...newEntity, fields: updatedFields });
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

    const getMappingStatus = (entityId) => {
        const entity = semanticEntities.find(e => e.id === entityId);
        if (!entity) return 0;

        const entityMappings = getEntityMappings(entityId);
        return Math.round((entityMappings.length / entity.fields.length) * 100);
    };

    const getDomainExamples = () => {
        if (domain === 'insurance') {
            return {
                entities: [
                    { name: 'Policy', fields: ['policyNumber', 'premiumAmount', 'coverageType', 'expiryDate'] },
                    { name: 'Claim', fields: ['claimId', 'claimAmount', 'status', 'dateFiled'] },
                    { name: 'Customer', fields: ['customerId', 'fullName', 'email', 'phoneNumber'] }
                ]
            };
        }
        // else if (domain === 'banking') {
        //     return {
        //         entities: [
        //             { name: 'Account', fields: ['accountNumber', 'balance', 'accountType', 'openedDate'] },
        //             { name: 'Transaction', fields: ['transactionId', 'amount', 'type', 'timestamp'] },
        //             { name: 'Loan', fields: ['loanId', 'principal', 'interestRate', 'term'] }
        //         ]
        //     };
        // } else if (domain === 'ecommerce') {
        //     return {
        //         entities: [
        //             { name: 'Product', fields: ['productId', 'name', 'price', 'category'] },
        //             { name: 'Order', fields: ['orderId', 'customerId', 'totalAmount', 'status'] },
        //             { name: 'Customer', fields: ['customerId', 'email', 'phone', 'shippingAddress'] }
        //         ]
        //     };
        // }
        return { entities: [] };
    };

    const getIconForEntity = (entityName) => {
        const lowerName = entityName.toLowerCase();
        if (lowerName.includes('customer') || lowerName.includes('user')) return <FiUsers />;
        if (lowerName.includes('policy') || lowerName.includes('product')) return <FiPackage />;
        if (lowerName.includes('claim') || lowerName.includes('transaction')) return <FiDollarSign />;
        if (lowerName.includes('account')) return <FiCreditCard />;
        if (lowerName.includes('loan')) return <FiFile />;
        return <FiLayers />;
    };

    return (
        <div className="main-content">

            <div style={{ marginLeft: "0px", marginRight: "auto", width: "90%" }} className='flex flex-col h-full'>
                <div className="flex gap-2 items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-black-500">Semantic Data Layer Configuration</h1>
                    </div>
                </div>
                <div className='heighligts my-4'>
                    <p className="text-sm text-gray-600">Semantic data mapping creates a unified business layer that sits between your applications and physical data sources. It translates technical database schemas into business-friendly entities that applications can understand consistently.</p>
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
                                    <p className="text-sm text-gray-600">Understand how semantic data mapping works</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <AiOutlineQuestionCircle className="text-blue-500 text-xl mt-1" />
                                        <div>
                                            <h5 className="font-semibold text-blue-800 mb-2">What is Semantic Data Mapping?</h5>
                                            <p className="text-blue-700 text-sm">
                                                Semantic data mapping creates a unified business layer that sits between your applications
                                                and physical data sources. It translates technical database schemas into business-friendly
                                                entities that applications can understand consistently.
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
                                            <h6 className="font-semibold">Define Entities</h6>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Create semantic business entities that represent real-world concepts like "Customer" or "Policy".
                                        </p>
                                    </div>

                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 bg-[#02b499]/10 rounded-full flex items-center justify-center">
                                                <span className="text-[#02b499] font-semibold">2</span>
                                            </div>
                                            <h6 className="font-semibold">Connect Sources</h6>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Connect to various data sources (databases, APIs, files) containing raw data.
                                        </p>
                                    </div>

                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-8 h-8 bg-[#02b499]/10 rounded-full flex items-center justify-center">
                                                <span className="text-[#02b499] font-semibold">3</span>
                                            </div>
                                            <h6 className="font-semibold">Map Fields</h6>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            Map physical data columns to semantic entity fields with transformations.
                                        </p>
                                    </div>
                                </div>

                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h6 className="font-semibold mb-3">Benefits of Semantic Data Layer</h6>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                <FiCheck className="text-green-600" />
                                            </div>
                                            <span className="text-sm">Decouples applications from underlying data schemas</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                <FiCheck className="text-green-600" />
                                            </div>
                                            <span className="text-sm">Provides consistent business terminology across applications</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                <FiCheck className="text-green-600" />
                                            </div>
                                            <span className="text-sm">Simplifies data source migrations and changes</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                                <FiCheck className="text-green-600" />
                                            </div>
                                            <span className="text-sm">Enables better data governance and quality control</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                    <h6 className="font-semibold mb-2">Best Practices</h6>
                                    <ul className="text-sm text-gray-600 space-y-2">
                                        <li className="flex items-start gap-2">
                                            <FiCheck className="text-green-500 mt-0.5" />
                                            Start with 5-10 core business entities for your domain
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FiCheck className="text-green-500 mt-0.5" />
                                            Use consistent naming conventions across entities
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FiCheck className="text-green-500 mt-0.5" />
                                            Document transformation rules for complex mappings
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <FiCheck className="text-green-500 mt-0.5" />
                                            Regularly validate data quality in mapped fields
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div> */}

                        {/* ================= Semantic Entities ================= */}
                        <div ref={(el) => (sectionRefs.current['Semantic Entities'] = el)} className="bg-white my-4 p-6 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h4 className="font-semibold text-lg">Semantic Entities ({semanticEntities.length})</h4>
                                    <p className="text-sm text-gray-600">Business entities for {domain} domain</p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search entities..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <button
                                        className="check-btn flex items-center gap-2"
                                        onClick={() => setShowCreateEntityModal(true)}
                                    >
                                        <FiPlus /> Create Entity
                                    </button>
                                </div>
                            </div>

                            {/* Create Entity Modal */}
                            {showCreateEntityModal && (
                                <div className="fixed inset-x-0 top-[64px] bottom-0 bg-black bg-opacity-50 
             flex justify-center z-50 p-4">


                                    <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="font-semibold text-lg">Create New Semantic Entity</h3>
                                            <button
                                                onClick={() => {
                                                    setShowCreateEntityModal(false);
                                                    setNewEntity({
                                                        name: '',
                                                        description: '',
                                                        fields: [{
                                                            id: `field_${Date.now()}_1`,
                                                            name: '',
                                                            type: 'string',
                                                            description: '',
                                                            required: false
                                                        }]
                                                    });
                                                }}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <FiX size={24} />
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Entity Basic Info */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="label block mb-2 font-medium text-gray-700">Entity Name *</label>
                                                    <input
                                                        type="text"
                                                        value={newEntity.name}
                                                        onChange={(e) => setNewEntity({ ...newEntity, name: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#02b499] focus:border-transparent"
                                                        placeholder="e.g., Policy, Customer, Claim"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Use singular, PascalCase naming (e.g., "CustomerProfile" not "customer_profile")
                                                    </p>
                                                </div>
                                                <div>
                                                    <label className="label block mb-2 font-medium text-gray-700">Description</label>
                                                    <input
                                                        type="text"
                                                        value={newEntity.description}
                                                        onChange={(e) => setNewEntity({ ...newEntity, description: e.target.value })}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#02b499] focus:border-transparent"
                                                        placeholder="Brief description of this entity"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Describe what this entity represents in business terms
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Domain Examples */}
                                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                                                <h5 className="font-semibold text-blue-800 mb-2">Examples for {domain} domain:</h5>
                                                <div className="text-sm text-blue-700 space-y-2">
                                                    {getDomainExamples().entities.map((example, idx) => (
                                                        <div key={idx} className="flex items-start gap-2">
                                                            <FiChevronRight className="mt-0.5 flex-shrink-0" />
                                                            <div>
                                                                <span className="font-medium">{example.name}:</span>
                                                                <span className="ml-2">{example.fields.join(', ')}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Fields Section */}
                                            <div>
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="font-semibold">Entity Fields</h4>
                                                    <button
                                                        type="button"
                                                        onClick={handleAddField}
                                                        className="text-sm text-[#02b499] hover:text-[#02987d] flex items-center gap-1"
                                                    >
                                                        <FiPlus /> Add Field
                                                    </button>
                                                </div>

                                                <div className="space-y-4">
                                                    {newEntity.fields.map((field, index) => (
                                                        <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                                                {/* Field Name */}
                                                                <div className="md:col-span-4">
                                                                    <label className="label block mb-2 text-sm font-medium text-gray-700">Field Name *</label>
                                                                    <input
                                                                        type="text"
                                                                        value={field.name}
                                                                        onChange={(e) => handleUpdateField(index, field, { name: e.target.value })}
                                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#02b499] focus:border-transparent"
                                                                        placeholder="e.g., policyNumber, premiumAmount"
                                                                    />
                                                                    <p className="text-xs text-gray-500 mt-1">
                                                                        Use camelCase naming
                                                                    </p>
                                                                </div>

                                                                {/* Field Type */}
                                                                <div className="md:col-span-3">
                                                                    <label className="label block mb-2 text-sm font-medium text-gray-700">Type *</label>
                                                                    <select
                                                                        value={field.type}
                                                                        onChange={(e) => handleUpdateField(index, field, { type: e.target.value })}
                                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#02b499] focus:border-transparent"
                                                                    >
                                                                        <option value="">Select type</option>
                                                                        {availableFieldTypes.map(type => (
                                                                            <option key={type} value={type}>
                                                                                {type}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </div>

                                                                {/* Required */}
                                                                <div className="md:col-span-3">
                                                                    <label className="label block mb-2 text-sm font-medium text-gray-700">Required</label>
                                                                    <div className="mt-2">
                                                                        <label className="inline-flex items-center">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={field.required}
                                                                                onChange={(e) => handleUpdateField(index, field, { required: e.target.checked })}
                                                                                className="rounded border-gray-300 text-[#02b499] focus:ring-[#02b499]"
                                                                            />
                                                                            <span className="ml-2 text-sm">Required Field</span>
                                                                        </label>
                                                                    </div>
                                                                </div>

                                                                {/* Delete Button */}
                                                                <div className="md:col-span-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveField(index)}
                                                                        className="mt-6 text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                                                                        disabled={newEntity.fields.length <= 1}
                                                                    >
                                                                        <FiTrash2 /> Remove
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Field Description */}
                                                            <div className="mt-3">
                                                                <label className="label block mb-2 text-sm font-medium text-gray-700">Description</label>
                                                                <input
                                                                    type="text"
                                                                    value={field.description}
                                                                    onChange={(e) => handleUpdateField(index, field, { description: e.target.value })}
                                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#02b499] focus:border-transparent"
                                                                    placeholder="What this field represents"
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex justify-end gap-3 pt-4 border-t">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setShowCreateEntityModal(false);
                                                        setNewEntity({
                                                            name: '',
                                                            description: '',
                                                            fields: [{
                                                                id: `field_${Date.now()}_1`,
                                                                name: '',
                                                                type: 'string',
                                                                description: '',
                                                                required: false
                                                            }]
                                                        });
                                                    }}
                                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleCreateEntity}
                                                    className="check-btn px-4 py-2"
                                                >
                                                    Create Entity
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Entities Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {semanticEntities
                                    .filter(entity =>
                                        !searchQuery ||
                                        entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        entity.description?.toLowerCase().includes(searchQuery.toLowerCase())
                                    )
                                    .map(entity => {
                                        const mappingPercentage = getMappingStatus(entity.id);
                                        const isFullyMapped = mappingPercentage === 100;

                                        return (
                                            <div
                                                key={entity.id}
                                                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${selectedEntity?.id === entity.id
                                                    ? 'border-[#02b499] border-2 bg-[#02b499]/5'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                onClick={() => setSelectedEntity(entity)}
                                            >
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="text-[#02b499]">
                                                            {getIconForEntity(entity.name)}
                                                        </div>
                                                        <div>
                                                            <h5 className="font-semibold">{entity.name}</h5>
                                                            <p className="text-xs text-gray-500">{entity.domain}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className={`text-xs px-2 py-1 rounded ${isFullyMapped ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {mappingPercentage}% mapped
                                                        </span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{entity.description}</p>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-500">
                                                        {entity.fields?.length || 0} fields
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className={`h-2 rounded-full transition-all duration-300 ${isFullyMapped ? 'bg-green-500' : 'bg-yellow-500'
                                                                    }`}
                                                                style={{ width: `${mappingPercentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <FiChevronRight className="text-gray-400" />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>

                            {semanticEntities.length === 0 && (
                                <div className="text-center py-12">
                                    <FiLayers className="mx-auto text-4xl text-gray-400 mb-4" />
                                    <h4 className="font-semibold text-gray-700 mb-2">No Semantic Entities</h4>
                                    <p className="text-gray-500 mb-4">Create your first semantic entity to get started</p>
                                    <button
                                        className="check-btn flex items-center gap-2 mx-auto"
                                        onClick={() => setShowCreateEntityModal(true)}
                                    >
                                        <FiPlus /> Create First Entity
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* ================= Data Sources ================= */}
                        <div ref={(el) => (sectionRefs.current['Data Sources'] = el)} className="bg-white my-4 p-6 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h4 className="font-semibold text-lg">Data Sources ({dataSources.length})</h4>
                                    <p className="text-sm text-gray-600">Connected databases and APIs</p>
                                </div>
                                {/* <button
                                    className="check-btn flex items-center gap-2"
                                    onClick={() => navigate('/data-training')}
                                >
                                    <FiPlus /> Add Data Source
                                </button> */}
                            </div>



                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {dataSources.map(source => (
                                    <div key={source.id} className="border border-gray-200 rounded-lg p-4 hover:border-[#02b499] transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-[#02b499]/10 rounded-lg">
                                                    <FiDatabase className="text-xl text-[#02b499]" />
                                                </div>
                                                <div>
                                                    <h5 className="font-semibold">{source.name}</h5>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                                                            {source.type}
                                                        </span>
                                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                                            Connected
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteDataSource(source.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>

                                        {source.description && (
                                            <p className="text-sm text-gray-600 mb-3">{source.description}</p>
                                        )}

                                        <div className="space-y-2">
                                            <div className="text-sm flex items-center gap-2">
                                                <FiLink className="text-gray-400" />
                                                <span className="font-mono text-xs bg-gray-100 p-1 rounded truncate">
                                                    {source.connection}
                                                </span>
                                            </div>
                                            <div className="text-sm flex items-center gap-2">
                                                <FiDatabase className="text-gray-400" />
                                                <span>{source.tables.length} table(s)</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ================= Field Mapping ================= */}
                        <div ref={(el) => (sectionRefs.current['Field Mapping'] = el)} className="bg-white my-4 p-6 rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-lg mb-6">Field Mapping</h4>

                            {selectedEntity ? (
                                <div className="space-y-6">
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="text-[#02b499]">
                                                        {getIconForEntity(selectedEntity.name)}
                                                    </div>
                                                    <div>
                                                        <h5 className="font-semibold">{selectedEntity.name}</h5>
                                                        <p className="text-sm text-gray-600">{selectedEntity.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-[#02b499]">{getMappingStatus(selectedEntity.id)}%</div>
                                                <div className="text-sm text-gray-500">Mapping Complete</div>
                                            </div>
                                        </div>

                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${getMappingStatus(selectedEntity.id) === 100 ? 'bg-green-500' : 'bg-yellow-500'
                                                    }`}
                                                style={{ width: `${getMappingStatus(selectedEntity.id)}%` }}
                                            ></div>
                                        </div>

                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>0%</span>
                                            <span>50%</span>
                                            <span>100%</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h5 className="font-semibold">Entity Fields</h5>
                                            <span className="text-sm text-gray-500">
                                                {getEntityMappings(selectedEntity.id).length} of {selectedEntity.fields?.length || 0} fields mapped
                                            </span>
                                        </div>
                                        <div className="space-y-3">
                                            {selectedEntity.fields?.map(field => {
                                                const mapping = mappings.find(m =>
                                                    m.semanticEntity === selectedEntity.id &&
                                                    m.semanticField === field.id
                                                );

                                                return (
                                                    <div key={field.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                                        <div className="flex items-center justify-between mb-3">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="font-semibold">{field.name}</span>
                                                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                                                        {field.type}
                                                                    </span>
                                                                    {field.required && (
                                                                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                                                            Required
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-500">{field.description}</p>
                                                            </div>

                                                            {mapping ? (
                                                                <div className="flex items-center gap-3">
                                                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                                                        <FiCheck className="text-xs" />
                                                                        Mapped
                                                                    </span>
                                                                    <button className="text-blue-500 hover:text-blue-700">
                                                                        <FiEdit />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                                                                    Unmapped
                                                                </span>
                                                            )}
                                                        </div>

                                                        {mapping && (
                                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                                <div className="text-sm flex items-center gap-2">
                                                                    <FiLink className="text-gray-400" />
                                                                    <span className="text-gray-500">Mapped to:</span>
                                                                    <span className="font-mono text-xs bg-gray-100 p-1 rounded">
                                                                        {mapping.source}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs text-gray-500 mt-1">
                                                                    Mapped on {new Date(mapping.createdAt).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <h5 className="font-semibold">Available Data Sources</h5>
                                            <span className="text-sm text-gray-500">
                                                {dataSources.length} source(s) available
                                            </span>
                                        </div>
                                        <div className="space-y-4">
                                            {dataSources.map(source => (
                                                <div key={source.id} className="border border-gray-200 rounded-lg p-4">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <FiDatabase className="text-[#02b499]" />
                                                            <h6 className="font-semibold">{source.name}</h6>
                                                        </div>
                                                    </div>
                                                    <DataMappingTable
                                                        source={source}
                                                        entity={selectedEntity}
                                                        onMap={handleCreateMapping}
                                                        existingMappings={mappings.filter(m => m.semanticEntity === selectedEntity.id)}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FiMap className="mx-auto text-4xl text-gray-400 mb-4" />
                                    <h4 className="font-semibold text-gray-700 mb-2">No Entity Selected</h4>
                                    <p className="text-gray-500">Select a semantic entity to start mapping fields</p>
                                </div>
                            )}
                        </div>

                        {/* ================= Mapping Validation ================= */}
                        {/* <div ref={(el) => (sectionRefs.current['Mapping Validation'] = el)} className="bg-white my-4 p-6 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h4 className="font-semibold text-lg">Mapping Validation</h4>
                                    <p className="text-sm text-gray-600">Verify and validate your data mappings</p>
                                </div>
                                <button className="check-btn flex items-center gap-2">
                                    <FiCheck /> Run Validation
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h5 className="font-semibold mb-4">Validation Summary</h5>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div>
                                                <div className="font-medium">Total Entities</div>
                                                <div className="text-sm text-gray-500">{semanticEntities.length} semantic entities</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold">{semanticEntities.length}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div>
                                                <div className="font-medium">Total Mappings</div>
                                                <div className="text-sm text-gray-500">{mappings.length} field mappings</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold">{mappings.length}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                            <div>
                                                <div className="font-medium">Overall Coverage</div>
                                                <div className="text-sm text-gray-500">Percentage of fields mapped</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold">
                                                    {Math.round(
                                                        (mappings.length /
                                                            (semanticEntities.reduce((acc, entity) => acc + (entity.fields?.length || 0), 0)) * 100) || 0
                                                    )}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h5 className="font-semibold mb-4">Entity Mapping Status</h5>
                                    <div className="space-y-3 max-h-60 overflow-y-auto">
                                        {semanticEntities.map(entity => {
                                            const percentage = getMappingStatus(entity.id);
                                            return (
                                                <div key={entity.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        {getIconForEntity(entity.name)}
                                                        <div>
                                                            <div className="font-medium">{entity.name}</div>
                                                            <div className="text-sm text-gray-500">
                                                                {getEntityMappings(entity.id).length} of {entity.fields?.length || 0} fields
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-semibold">{percentage}%</div>
                                                        <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                                                            <div
                                                                className={`h-1.5 rounded-full ${percentage === 100 ? 'bg-green-500' : percentage > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                                    }`}
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h5 className="font-semibold mb-4">Validation Tests</h5>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FiCheck className="text-green-500" />
                                            <div>
                                                <div className="font-medium">Data Type Compatibility</div>
                                                <div className="text-sm text-gray-500">All mapped fields have compatible data types</div>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Passed</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FiCheck className="text-green-500" />
                                            <div>
                                                <div className="font-medium">Required Field Coverage</div>
                                                <div className="text-sm text-gray-500">All required fields are mapped</div>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Passed</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FiCheck className="text-yellow-500" />
                                            <div>
                                                <div className="font-medium">Data Quality Score</div>
                                                <div className="text-sm text-gray-500">Some mappings need data quality rules</div>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">Warning</span>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <FiCheck className="text-gray-400" />
                                            <div>
                                                <div className="font-medium">Performance Test</div>
                                                <div className="text-sm text-gray-500">Query performance validation pending</div>
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">Pending</span>
                                    </div>
                                </div>
                            </div>
                        </div> */}


                    </div>
                </div>
            </div>
        </div>
    );
};