import React, { useState } from 'react';
import { FiCheck, FiPlus, FiEdit, FiTrash2, FiExternalLink } from 'react-icons/fi';

const ModelSelection = () => {
    const [models, setModels] = useState([
        { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', type: 'API', status: 'active' },
        { id: 'claude-2', name: 'Claude 2', provider: 'Anthropic', type: 'API', status: 'active' },
        { id: 'llama2-70b', name: 'Llama 2 70B', provider: 'Meta', type: 'Self-Hosted', status: 'active' },
        { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', type: 'API', status: 'active' },
    ]);

    const [selectedModel, setSelectedModel] = useState('gpt-4');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newModel, setNewModel] = useState({
        name: '',
        provider: '',
        type: 'API',
        endpoint: '',
        apiKey: ''
    });

    const handleAddModel = () => {
        const newModelObj = {
            id: `model-${Date.now()}`,
            name: newModel.name,
            provider: newModel.provider,
            type: newModel.type,
            type: newModel.type,
            status: 'inactive'
        };
        setModels([...models, newModelObj]);
        setSelectedModel(newModelObj.id);
        setShowAddModal(false);
        setNewModel({ name: '', provider: '', type: 'API', endpoint: '', apiKey: '' });
    };

    const selectedModelData = models.find(model => model.id === selectedModel);

    return (
        <div className="page-container">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Model Selection</h1>
                    <p className="text-secondary">Select and configure LLM models for your workflows</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="btn btn-primary"
                >
                    <FiPlus /> Add Model
                </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Model List */}
                <div className="col-span-1">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Available Models</h3>
                            <span className="text-sm text-secondary">{models.length} models</span>
                        </div>
                        <div className="space-y-3">
                            {models.map((model) => (
                                <div
                                    key={model.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedModel === model.id
                                        ? 'border-primary bg-primary-light'
                                        : 'border-border hover:border-primary'
                                        }`}
                                    onClick={() => setSelectedModel(model.id)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-semibold">{model.name}</h4>
                                                <span className={`status-badge ${model.status === 'active' ? 'status-active' : 'status-inactive'
                                                    }`}>
                                                    {model.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-secondary mb-2">
                                                Provider: {model.provider}
                                            </p>
                                            <p className="text-xs text-secondary">
                                                Type: {model.type}
                                            </p>
                                        </div>
                                        {selectedModel === model.id && (
                                            <FiCheck className="text-primary" size={20} />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Model Configuration */}
                <div className="col-span-2">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">
                                {selectedModelData ? `Configure ${selectedModelData.name}` : 'Model Configuration'}
                            </h3>
                            <div className="flex gap-2">
                                <button className="btn btn-secondary">
                                    <FiExternalLink /> Test
                                </button>
                                <button className="btn btn-primary">Save</button>
                            </div>
                        </div>

                        {selectedModelData ? (
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="input-group">
                                        <label className="label">Model Behavior</label>
                                        <select className="select">
                                            <option>Standard</option>
                                            <option>Creative</option>
                                            <option>Precise</option>
                                        </select>
                                    </div>

                                    <div className="input-group">
                                        <label className="label">Temperature</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            defaultValue="0.7"
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-sm text-secondary mt-1">
                                            <span>More Focused</span>
                                            <span>More Creative</span>
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label className="label">Max Tokens</label>
                                        <input
                                            type="number"
                                            defaultValue="2000"
                                            className="input"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="input-group">
                                        <label className="label">Guardrails</label>
                                        <div className="space-y-2">
                                            <label className="checkbox">
                                                <input type="checkbox" defaultChecked />
                                                Content filtering
                                            </label>
                                            <label className="checkbox">
                                                <input type="checkbox" defaultChecked />
                                                PII detection
                                            </label>
                                            <label className="checkbox">
                                                <input type="checkbox" />
                                                Toxicity filter
                                            </label>
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label className="label">Request Limits</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-sm text-secondary">Per Minute</label>
                                                <input type="number" defaultValue="60" className="input" />
                                            </div>
                                            <div>
                                                <label className="text-sm text-secondary">Per Day</label>
                                                <input type="number" defaultValue="10000" className="input" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label className="label">Overthinking Restriction</label>
                                        <input
                                            type="number"
                                            defaultValue="5"
                                            className="input"
                                            placeholder="Max reasoning steps"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-secondary">Select a model to configure</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Model Modal */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="card w-full max-w-md">
                        <div className="card-header">
                            <h3 className="card-title">Add New Model</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="btn-icon"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="input-group">
                                <label className="label">Model Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={newModel.name}
                                    onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                                    placeholder="e.g., GPT-4 Custom"
                                />
                            </div>

                            <div className="input-group">
                                <label className="label">Provider</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={newModel.provider}
                                    onChange={(e) => setNewModel({ ...newModel, provider: e.target.value })}
                                    placeholder="e.g., OpenAI"
                                />
                            </div>

                            <div className="input-group">
                                <label className="label">Model Type</label>
                                <select
                                    className="select"
                                    value={newModel.type}
                                    onChange={(e) => setNewModel({ ...newModel, type: e.target.value })}
                                >
                                    <option value="API">API Hosted</option>
                                    <option value="Self-Hosted">Self Hosted</option>
                                </select>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddModel}
                                    className="btn btn-primary flex-1"
                                >
                                    Add Model
                                </button>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="btn btn-secondary flex-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModelSelection;