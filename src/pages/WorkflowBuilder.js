import React, { useState } from 'react';
import {
    FiPlus, FiTrash2, FiMove, FiLink, FiMail, FiClock, FiCpu, FiDatabase, FiChevronUp,
    FiSettings, FiChevronDown, FiCopy
} from 'react-icons/fi';

const WorkflowBuilder = ({ data, onUpdate }) => {
    const [workflow, setWorkflow] = useState({
        nodes: [
            { id: 1, type: 'trigger', title: 'Email Trigger', icon: <FiMail />, x: 50, y: 50 },
            { id: 2, type: 'action', title: 'AI Analysis', icon: <FiCpu />, x: 250, y: 50 },
            { id: 3, type: 'action', title: 'Save to Database', icon: <FiDatabase />, x: 450, y: 50 },
            { id: 4, type: 'action', title: 'Send Response', icon: <FiMail />, x: 650, y: 50 },
        ],
        connections: [
            { from: 1, to: 2 },
            { from: 2, to: 3 },
            { from: 3, to: 4 },
        ],
    });

    const [selectedNode, setSelectedNode] = useState(null);
    const [draggingNode, setDraggingNode] = useState(null);

    const nodeTypes = [
        { type: 'trigger', name: 'Email Trigger', icon: <FiMail />, color: 'bg-blue-500' },
        { type: 'trigger', name: 'Schedule', icon: <FiClock />, color: 'bg-purple-500' },
        { type: 'trigger', name: 'Webhook', icon: <FiLink />, color: 'bg-green-500' },
        { type: 'action', name: 'AI Inference', icon: <FiCpu />, color: 'bg-yellow-500' },
        { type: 'action', name: 'Database', icon: <FiDatabase />, color: 'bg-indigo-500' },
        { type: 'action', name: 'API Call', icon: <FiLink />, color: 'bg-pink-500' },
        { type: 'action', name: 'Condition', icon: <FiSettings />, color: 'bg-gray-500' },
    ];

    const [nodes, setNodes] = useState([
        {
            id: 1,
            type: 'trigger',
            title: 'Email Trigger',
            icon: <FiMail />,
            x: 100,
            y: 100,
            isDragging: false,
            config: {
                triggerType: 'email',
                emailAddress: 'inbox@example.com',
                description: 'When an email is received'
            }
        },
        {
            id: 2,
            type: 'action',
            title: 'AI Inference',
            icon: <FiCpu />,
            x: 350,
            y: 100,
            isDragging: false,
            config: {
                model: 'gpt-4',
                temperature: 0.7,
                maxTokens: 1000,
                description: 'Run AI model on the input'
            }
        },
        {
            id: 3,
            type: 'action',
            title: 'API Call',
            icon: <FiLink />,
            x: 600,
            y: 100,
            isDragging: false,
            config: {
                url: 'https://api.example.com',
                method: 'GET',
                headers: {},
                description: 'Call external API'
            }
        },
        {
            id: 4,
            type: 'action',
            title: 'Database',
            icon: <FiDatabase />,
            x: 350,
            y: 250,
            isDragging: false,
            config: {
                operation: 'query',
                query: '',
                description: 'Database read/write operation'
            }
        },
    ]);

    const addNode = (nodeType) => {
        const newNode = {
            id: Date.now(),
            type: nodeType.type,
            title: nodeType.name,
            icon: nodeType.icon,
            x: 50 + (workflow.nodes.length * 200) % 600,
            y: 50 + Math.floor(workflow.nodes.length / 3) * 150,
        };

        const updatedWorkflow = {
            ...workflow,
            nodes: [...workflow.nodes, newNode],
        };

        setWorkflow(updatedWorkflow);
        // onUpdate(updatedWorkflow);
        setSelectedNode(newNode.id);
    };

    const deleteNode = (nodeId) => {
        const updatedNodes = workflow.nodes.filter(node => node.id !== nodeId);
        const updatedConnections = workflow.connections.filter(
            conn => conn.from !== nodeId && conn.to !== nodeId
        );

        const updatedWorkflow = {
            ...workflow,
            nodes: updatedNodes,
            connections: updatedConnections,
        };

        setWorkflow(updatedWorkflow);
        // onUpdate(updatedWorkflow);

        if (selectedNode === nodeId) {
            setSelectedNode(null);
        }
    };

    const handleNodeDragStart = (e, nodeId) => {
        setDraggingNode(nodeId);
        e.dataTransfer.setData('nodeId', nodeId.toString());
    };

    const handleNodeDragEnd = (e) => {
        setDraggingNode(null);
    };

    const handleCanvasDrop = (e) => {
        e.preventDefault();
        const canvas = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - canvas.left - 100;
        const y = e.clientY - canvas.top - 50;

        if (draggingNode) {
            // Move existing node
            const updatedNodes = workflow.nodes.map(node => {
                if (node.id === draggingNode) {
                    return { ...node, x, y };
                }
                return node;
            });

            const updatedWorkflow = { ...workflow, nodes: updatedNodes };
            setWorkflow(updatedWorkflow);
            // onUpdate(updatedWorkflow);
        }
    };

    const [expandedSections, setExpandedSections] = useState({
        configuration: true,
        description: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const renderNodeConfiguration = () => {
        if (!selectedNodeData) return null;

        switch (selectedNodeData.title) {
            case 'API Call':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">HTTP Method</label>
                                <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm">
                                    <option>GET</option>
                                    <option>POST</option>
                                    <option>PUT</option>
                                    <option>DELETE</option>
                                    <option>PATCH</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Timeout (seconds)</label>
                                <input
                                    type="number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                    defaultValue="30"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">API URL</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                placeholder="https://api.example.com/endpoint"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Headers (JSON)</label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                                rows="3"
                                placeholder='{"Content-Type": "application/json", "Authorization": "Bearer token"}'
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Request Body (JSON)</label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                                rows="4"
                                placeholder='{"key": "value"}'
                            />
                        </div>
                    </div>
                );

            case 'AI Inference':
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Model Selection</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded text-sm">
                                <option>GPT-4</option>
                                <option>GPT-3.5 Turbo</option>
                                <option>Claude 2</option>
                                <option>Llama 2 70B</option>
                                <option>Gemini Pro</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Temperature</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    className="w-full"
                                    defaultValue="0.7"
                                />
                                <div className="text-xs text-gray-500 text-center">0.7</div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">Max Tokens</label>
                                <input
                                    type="number"
                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                    defaultValue="1000"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">System Prompt</label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                rows="3"
                                placeholder="You are a helpful assistant..."
                            />
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Configuration</label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                rows="4"
                                placeholder="Configure this node..."
                            />
                        </div>
                    </div>
                );
        }
    };

    const selectedNodeData = workflow.nodes.find(node => node.id === selectedNode);

    return (
        <div className='main-content'>
            <div className="mb-6">
                <h3 className="font-semibold mb-4">Workflow Builder</h3>
                <p className="text-sm text-gray-600 mb-6">Drag and drop nodes to create your automation workflow. Connect them to define the execution flow.</p>
            </div>

            <div className="grid grid-cols-4 gap-6">
                {/* Node Library */}
                <div className="col-span-1">
                    <div className="card">
                        <h4 className="font-semibold mb-4">Node Library</h4>

                        <div className="space-y-3">
                            <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-2">Triggers</h5>
                                <div className="space-y-2">
                                    {nodeTypes.filter(n => n.type === 'trigger').map((node, index) => (
                                        <div
                                            key={index}
                                            className="node-item"
                                            onClick={() => addNode(node)}
                                            draggable
                                            onDragStart={(e) => {
                                                e.dataTransfer.setData('nodeType', JSON.stringify(node));
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded flex items-center justify-center ${node.color} text-white`}>
                                                    {node.icon}
                                                </div>
                                                <div className="text-sm font-medium">{node.name}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h5 className="text-sm font-medium text-gray-700 mb-2">Actions</h5>
                                <div className="space-y-2">
                                    {nodeTypes.filter(n => n.type === 'action').map((node, index) => (
                                        <div
                                            key={index}
                                            className="node-item"
                                            onClick={() => addNode(node)}
                                            draggable
                                            onDragStart={(e) => {
                                                e.dataTransfer.setData('nodeType', JSON.stringify(node));
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded flex items-center justify-center ${node.color} text-white`}>
                                                    {node.icon}
                                                </div>
                                                <div className="text-sm font-medium">{node.name}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Selected Node Configuration */}
                    {/* {selectedNodeData && (
                        <div className="card mt-4">
                            <h4 className="font-semibold mb-4">Configure Node</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="label">Node Name</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={selectedNodeData.title}
                                        onChange={(e) => {
                                            const updatedNodes = workflow.nodes.map(node => {
                                                if (node.id === selectedNode) {
                                                    return { ...node, title: e.target.value };
                                                }
                                                return node;
                                            });
                                            const updatedWorkflow = { ...workflow, nodes: updatedNodes };
                                            setWorkflow(updatedWorkflow);
                                            onUpdate(updatedWorkflow);
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="label">Description</label>
                                    <textarea
                                        className="input"
                                        rows="3"
                                        placeholder="Describe what this node does..."
                                    />
                                </div>

                                <button
                                    onClick={() => deleteNode(selectedNode)}
                                    className="btn btn-secondary w-full"
                                >
                                    <FiTrash2 /> Delete Node
                                </button>
                            </div>
                        </div>
                    )} */}


                    {selectedNodeData ? (
                        <>
                            {/* Configure Node Section */}
                            <div className="border-b pb-4">
                                <div
                                    className="flex items-center justify-between cursor-pointer mb-3"
                                    onClick={() => toggleSection('configuration')}
                                >
                                    <h3 className="font-semibold text-gray-800">
                                        Configure Node: {selectedNodeData.title}
                                    </h3>
                                    {expandedSections.configuration ?
                                        <FiChevronUp className="text-gray-500" /> :
                                        <FiChevronDown className="text-gray-500" />
                                    }
                                </div>

                                {expandedSections.configuration && (
                                    <div className="space-y-4">
                                        {renderNodeConfiguration()}

                                        <div className="flex gap-2 pt-4">
                                            <button className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium">
                                                Save Changes
                                            </button>
                                            <button className="py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded text-sm">
                                                Test
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description Section */}
                            <div>
                                <div
                                    className="flex items-center justify-between cursor-pointer mb-3"
                                    onClick={() => toggleSection('description')}
                                >
                                    <h3 className="font-semibold text-gray-800">Description</h3>
                                    {expandedSections.description ?
                                        <FiChevronUp className="text-gray-500" /> :
                                        <FiChevronDown className="text-gray-500" />
                                    }
                                </div>

                                {expandedSections.description && (
                                    <div>
                                        <textarea
                                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                            rows="5"
                                            placeholder="Describe what this node does..."
                                            value={selectedNodeData.config?.description || ''}
                                            onChange={(e) => {
                                                setNodes(nodes.map(n =>
                                                    n.id === selectedNodeData.id ? {
                                                        ...n,
                                                        config: { ...n.config, description: e.target.value }
                                                    } : n
                                                ));
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Quick Actions */}
                            <div className="pt-4 border-t">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h4>
                                <div className="space-y-2">
                                    {/* <button
                                        className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded text-sm text-left flex items-center gap-2"
                                        onClick={() => duplicateNode(selectedNodeData.id)}
                                    >
                                        <FiCopy size={14} /> Duplicate Node
                                    </button> */}
                                    <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded text-sm text-left">
                                        Export Configuration
                                    </button>
                                    <button
                                        className="w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded text-sm text-left flex items-center gap-2"
                                        onClick={() => deleteNode(selectedNodeData.id)}
                                    >
                                        <FiTrash2 size={14} /> Delete Node
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <div className="text-4xl mb-4">⚙️</div>
                            <h3 className="text-lg font-medium mb-2">Select a Node</h3>
                            <p className="text-sm">Click on any node to configure it</p>
                        </div>
                    )}
                </div>

                {/* Workflow Canvas */}
                <div className="col-span-3">
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold">Workflow Canvas</h4>
                            <div className="flex gap-2">
                                <button className="btn btn-secondary btn-sm">
                                    Auto Layout
                                </button>
                                <button className="btn btn-secondary btn-sm">
                                    Clear All
                                </button>
                            </div>
                        </div>

                        <div
                            className="workflow-canvas"
                            onDrop={handleCanvasDrop}
                            onDragOver={(e) => e.preventDefault()}
                            style={{ height: '500px' }}
                        >
                            {/* Connection Lines */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                {workflow.connections.map((conn, index) => {
                                    const fromNode = workflow.nodes.find(n => n.id === conn.from);
                                    const toNode = workflow.nodes.find(n => n.id === conn.to);

                                    if (!fromNode || !toNode) return null;

                                    const startX = fromNode.x + 200;
                                    const startY = fromNode.y + 40;
                                    const endX = toNode.x;
                                    const endY = toNode.y + 40;

                                    return (
                                        <line
                                            key={index}
                                            x1={startX}
                                            y1={startY}
                                            x2={endX}
                                            y2={endY}
                                            stroke="#4f46e5"
                                            strokeWidth="2"
                                            strokeDasharray="5,5"
                                            markerEnd="url(#arrowhead)"
                                        />
                                    );
                                })}

                                <defs>
                                    <marker
                                        id="arrowhead"
                                        markerWidth="10"
                                        markerHeight="7"
                                        refX="9"
                                        refY="3.5"
                                        orient="auto"
                                    >
                                        <polygon points="0 0, 10 3.5, 0 7" fill="#4f46e5" />
                                    </marker>
                                </defs>
                            </svg>

                            {/* Nodes */}
                            {workflow.nodes.map((node) => (
                                <div
                                    key={node.id}
                                    className={`workflow-node ${selectedNode === node.id ? 'selected' : ''}`}
                                    style={{ left: `${node.x}px`, top: `${node.y}px` }}
                                    draggable
                                    onDragStart={(e) => handleNodeDragStart(e, node.id)}
                                    onDragEnd={handleNodeDragEnd}
                                    onClick={() => setSelectedNode(node.id)}
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                                            {node.icon}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-sm">{node.title}</div>
                                            <div className="text-xs text-gray-500">
                                                {node.type === 'trigger' ? 'Trigger' : 'Action'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Click to configure • Drag to move
                                    </div>
                                </div>
                            ))}

                            {/* Empty State */}
                            {workflow.nodes.length === 0 && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                    <FiPlus className="text-4xl mb-4" />
                                    <h4 className="font-medium mb-2">No nodes added</h4>
                                    <p className="text-sm">Drag nodes from the library or click to add them</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Workflow Summary */}
                    <div className="mt-4 grid grid-cols-3 gap-4">
                        <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="text-sm text-gray-600">Total Nodes</div>
                            <div className="text-2xl font-bold">{workflow.nodes.length}</div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="text-sm text-gray-600">Connections</div>
                            <div className="text-2xl font-bold">{workflow.connections.length}</div>
                        </div>
                        <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="text-sm text-gray-600">Status</div>
                            <div className="text-2xl font-bold text-green-600">Ready</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkflowBuilder;