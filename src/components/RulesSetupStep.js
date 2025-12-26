import React, { useState } from 'react';
import { FiShield, FiCpu, FiDatabase, FiFilter, FiAlertCircle, FiGlobe, FiCheck, FiMessageSquare } from 'react-icons/fi';

const RulesSetupStep = ({ data }) => {
    const [rules, setRules] = useState({
        // Model Behavior Settings
        behaviorSettings: {
            temperature: 0.7,
            maxTokens: 2048,
            topP: 0.9,
            frequencyPenalty: 0.0,
            presencePenalty: 0.0,
        },

        // Guardrails Configuration
        guardrails: [
            { id: 1, name: 'Toxicity Filter', enabled: true, description: 'Block toxic or harmful language' },
            { id: 2, name: 'Fact Verification', enabled: false, description: 'Cross-check factual claims' },
            { id: 3, name: 'Bias Detection', enabled: true, description: 'Identify and mitigate bias' },
            { id: 4, name: 'Hallucination Control', enabled: false, description: 'Reduce fabricated information' },
            { id: 5, name: 'PII Protection', enabled: true, description: 'Protect personal information' },
            { id: 6, name: 'Content Safety', enabled: true, description: 'Block unsafe content' },
        ],

        // Overthinking Restrictions
        overthinkingRestrictions: {
            enableChainOfThought: false,
            maxReasoningSteps: 5,
            reasoningTimeout: 30,
            allowSelfCorrection: true,
            confidenceThreshold: 0.8,
        },

        // Data Access Controls
        dataAccess: [
            { id: 1, name: 'Internal Knowledge Base', allowed: true, scope: 'read-only' },
            { id: 2, name: 'Customer Data', allowed: false, scope: 'none' },
            { id: 3, name: 'Sensitive Documents', allowed: false, scope: 'none' },
            { id: 4, name: 'Public Web Search', allowed: true, scope: 'restricted' },
            { id: 5, name: 'API Integrations', allowed: true, scope: 'full' },
            { id: 6, name: 'Training Data', allowed: false, scope: 'none' },
        ],

        // Response Controls
        responseControls: {
            requireCitations: true,
            maxResponseLength: 500,
            allowMultimodal: false,
            structuredOutput: false,
            responseFormat: 'natural',
            restrictDomains: ['health', 'finance', 'legal'],
        },

        // Default Response Configuration
        defaultResponses: {
            noAccessResponse: "I don't have access to that information to provide a complete answer.",
            restrictedContentResponse: "I cannot provide information on this topic due to content restrictions.",
            errorFallbackResponse: "I encountered an issue processing your request. Please try again or rephrase your question.",
            unclearQueryResponse: "I'm not sure I understand. Could you please clarify your question?",
            confidenceThresholdResponse: "I'm not confident enough to provide a reliable answer to this question.",
        },

        // Custom Rules
        customRules: '',
    });

    const handleToggleGuardrail = (id) => {
        const updatedGuardrails = rules.guardrails.map(guardrail =>
            guardrail.id === id ? { ...guardrail, enabled: !guardrail.enabled } : guardrail
        );
        const updatedRules = { ...rules, guardrails: updatedGuardrails };
        setRules(updatedRules);
        // onUpdate(updatedRules);
    };

    const handleToggleDataAccess = (id) => {
        const updatedDataAccess = rules.dataAccess.map(access =>
            access.id === id ? { ...access, allowed: !access.allowed } : access
        );
        const updatedRules = { ...rules, dataAccess: updatedDataAccess };
        setRules(updatedRules);
        // onUpdate(updatedRules);
    };

    const handleBehaviorChange = (key, value) => {
        const updatedBehavior = { ...rules.behaviorSettings, [key]: parseFloat(value) || 0 };
        const updatedRules = { ...rules, behaviorSettings: updatedBehavior };
        setRules(updatedRules);
        // onUpdate(updatedRules);
    };

    const handleOverthinkingChange = (key, value) => {
        const updatedOverthinking = { ...rules.overthinkingRestrictions, [key]: key === 'enableChainOfThought' || key === 'allowSelfCorrection' ? value === 'true' : parseFloat(value) || 0 };
        const updatedRules = { ...rules, overthinkingRestrictions: updatedOverthinking };
        setRules(updatedRules);
        // onUpdate(updatedRules);
    };

    const handleResponseControlChange = (key, value) => {
        const updatedControls = { ...rules.responseControls, [key]: key === 'requireCitations' || key === 'allowMultimodal' || key === 'structuredOutput' ? value === 'true' : value };
        const updatedRules = { ...rules, responseControls: updatedControls };
        setRules(updatedRules);
        // onUpdate(updatedRules);
    };

    const handleDefaultResponseChange = (key, value) => {
        const updatedResponses = { ...rules.defaultResponses, [key]: value };
        const updatedRules = { ...rules, defaultResponses: updatedResponses };
        setRules(updatedRules);
        // onUpdate(updatedRules);
    };

    const getScopeColor = (scope) => {
        switch (scope) {
            case 'full': return 'bg-green-100 text-green-800';
            case 'read-only': return 'bg-blue-100 text-blue-800';
            case 'restricted': return 'bg-yellow-100 text-yellow-800';
            case 'none': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className='main-content'>

            <div style={{ marginLeft: "0px", marginRight: "auto", width: "90%" }} className='flex flex-col h-full ' >

                <div className="flex gap-2 items-center ">

                    <div>
                        <h1 className="text-2xl font-bold text-black-500">Model Behavior Configuration</h1>

                    </div>
                </div>
                <div className='heighligts my-4' >
                    <p className="text-sm text-gray-600 ">Configure how the model behaves including guardrails, overthinking restrictions, data access controls, and response formatting..</p>
                </div>



                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column: Model Behavior & Guardrails */}
                    <div className="space-y-8">


                        {/* Guardrails */}
                        <div className="border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FiShield className="text-green-500" />
                                <h4 className="font-semibold">Safety Guardrails</h4>
                            </div>

                            <div className="space-y-3">
                                {rules.guardrails.map((guardrail) => (
                                    <div key={guardrail.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={guardrail.enabled}
                                                onChange={() => handleToggleGuardrail(guardrail.id)}
                                                className="custom-checkbox"
                                            />
                                            <div>
                                                <div className="font-medium">{guardrail.name}</div>
                                                <div className="text-xs text-gray-500">{guardrail.description}</div>
                                            </div>
                                        </div>
                                        {guardrail.enabled && <FiCheck className="text-green-500" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Default Responses */}
                        <div className="border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FiMessageSquare className="text-purple-500" />
                                <h4 className="font-semibold">Default Responses</h4>
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">When model has no access or must follow rules</span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="label">No Access Response</label>
                                    <textarea
                                        value={rules.defaultResponses.noAccessResponse}
                                        onChange={(e) => handleDefaultResponseChange('noAccessResponse', e.target.value)}
                                        className="input text-sm"
                                        rows="2"
                                        placeholder="What the model should say when it doesn't have access to requested information"
                                    />
                                </div>

                                <div>
                                    <label className="label">Restricted Content Response</label>
                                    <textarea
                                        value={rules.defaultResponses.restrictedContentResponse}
                                        onChange={(e) => handleDefaultResponseChange('restrictedContentResponse', e.target.value)}
                                        className="input text-sm"
                                        rows="2"
                                        placeholder="Response when content is blocked by safety filters"
                                    />
                                </div>

                                <div>
                                    <label className="label">Unclear Query Response</label>
                                    <textarea
                                        value={rules.defaultResponses.unclearQueryResponse}
                                        onChange={(e) => handleDefaultResponseChange('unclearQueryResponse', e.target.value)}
                                        className="input text-sm"
                                        rows="2"
                                        placeholder="Response when the query is unclear or ambiguous"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Confidence Threshold</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="1"
                                            value={rules.overthinkingRestrictions.confidenceThreshold}
                                            onChange={(e) => handleOverthinkingChange('confidenceThreshold', e.target.value)}
                                            className="input"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Low Confidence Response</label>
                                        <textarea
                                            value={rules.defaultResponses.confidenceThresholdResponse}
                                            onChange={(e) => handleDefaultResponseChange('confidenceThresholdResponse', e.target.value)}
                                            className="input text-sm"
                                            rows="2"
                                            placeholder="Response when confidence is below threshold"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Data Access & Response Controls */}
                    <div className="space-y-8">
                        {/* Data Access Controls */}
                        <div className="border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FiDatabase className="text-blue-500" />
                                <h4 className="font-semibold">Data Access Controls</h4>
                            </div>

                            <div className="space-y-3">
                                {rules.dataAccess.map((access) => (
                                    <div key={access.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={access.allowed}
                                                onChange={() => handleToggleDataAccess(access.id)}
                                                className="custom-checkbox"
                                            />
                                            <div>
                                                <div className="font-medium">{access.name}</div>
                                                <div className="text-xs text-gray-500">Access scope: {access.scope}</div>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getScopeColor(access.scope)}`}>
                                            {access.scope}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Overthinking Restrictions & Response Controls */}
                        <div className="border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FiGlobe className="text-purple-500" />
                                <h4 className="font-semibold">Response Configuration</h4>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Response Format</label>
                                        <select
                                            value={rules.responseControls.responseFormat}
                                            onChange={(e) => handleResponseControlChange('responseFormat', e.target.value)}
                                            className="input"
                                        >
                                            <option value="natural">Natural Language</option>
                                            <option value="structured">Structured</option>
                                            <option value="bullet">Bullet Points</option>
                                            <option value="markdown">Markdown</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label">Max Response Length</label>
                                        <input
                                            type="number"
                                            value={rules.responseControls.maxResponseLength}
                                            onChange={(e) => handleResponseControlChange('maxResponseLength', e.target.value)}
                                            className="input"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={rules.responseControls.requireCitations}
                                            onChange={(e) => handleResponseControlChange('requireCitations', e.target.checked.toString())}
                                            className="w-4 h-4 rounded"
                                        />
                                        <span className="text-sm">Require citations for factual claims</span>
                                    </label>

                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={rules.responseControls.allowMultimodal}
                                            onChange={(e) => handleResponseControlChange('allowMultimodal', e.target.checked.toString())}
                                            className="w-4 h-4 rounded"
                                        />
                                        <span className="text-sm">Allow multimodal responses</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Overthinking Restrictions */}
                        <div className="border border-gray-200 rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FiFilter className="text-yellow-500" />
                                <h4 className="font-semibold">Reasoning Controls</h4>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={rules.overthinkingRestrictions.enableChainOfThought}
                                        onChange={(e) => handleOverthinkingChange('enableChainOfThought', e.target.checked.toString())}
                                        className="w-4 h-4 rounded"
                                    />
                                    <span className="text-sm">Enable chain-of-thought reasoning</span>
                                </label>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Max Reasoning Steps</label>
                                        <input
                                            type="number"
                                            value={rules.overthinkingRestrictions.maxReasoningSteps}
                                            onChange={(e) => handleOverthinkingChange('maxReasoningSteps', e.target.value)}
                                            className="input"
                                            min="1"
                                            max="20"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Reasoning Timeout (seconds)</label>
                                        <input
                                            type="number"
                                            value={rules.overthinkingRestrictions.reasoningTimeout}
                                            onChange={(e) => handleOverthinkingChange('reasoningTimeout', e.target.value)}
                                            className="input"
                                            min="5"
                                            max="120"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Custom Rules */}
                <div className="mt-8 border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold mb-4">Custom Behavior Rules (JSON)</h4>
                    <textarea
                        className="w-full font-mono text-sm border border-gray-300 rounded p-3"
                        rows="4"
                        placeholder='{"behavior_rules": {"max_retries": 3, "fallback_strategy": "safe_mode", "context_window": 8192}}'
                        value={rules.customRules}
                        onChange={(e) => {
                            const updatedRules = { ...rules, customRules: e.target.value };
                            setRules(updatedRules);
                            // onUpdate(updatedRules);
                        }}
                    />
                    <div className="text-xs text-gray-500 mt-2">
                        Define custom model behavior rules in JSON format. These will override default settings.
                    </div>
                </div>

                {/* Recommendations */}
                <div className="mt-8 p-4 bg-[#a4fdeb] border border-[#00d4aa] rounded-lg">
                    <div className="flex items-start gap-3">
                        <FiAlertCircle className="text-black-600 mt-1" />
                        <div>
                            <h4 className="font-semibold text-black-800">Configuration Recommendations</h4>
                            <ul className="text-sm ext-black-600 mt-2 space-y-1">
                                <li>• Set temperature between 0.5-0.8 for balanced creativity and focus</li>
                                <li>• Enable PII Protection when handling user data</li>
                                <li>• Limit data access to only necessary sources for security</li>
                                <li>• Configure clear default responses for when the model lacks access</li>
                                <li>• Use chain-of-thought reasoning for complex problem-solving</li>
                                <li>• Set response length limits to prevent excessive outputs</li>
                                <li>• Define fallback responses for unclear queries and restricted content</li>
                            </ul>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default RulesSetupStep;