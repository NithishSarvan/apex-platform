import React, { useState } from 'react';
import { FiSettings, FiSave, FiRefreshCw, FiShield, FiBell, FiGlobe } from 'react-icons/fi';

const Configurations = () => {
    const [config, setConfig] = useState({
        // System Settings
        systemName: 'LLM Orchestration Platform',
        timezone: 'UTC',
        language: 'English',
        dateFormat: 'YYYY-MM-DD',

        // Security Settings
        requireMFA: false,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        ipWhitelist: '',

        // Notification Settings
        emailNotifications: true,
        slackNotifications: false,
        webhookNotifications: true,
        notifyOnError: true,
        notifyOnLimit: true,

        // API Settings
        apiRateLimit: 100,
        apiTimeout: 30,
        enableCORS: true,
        corsOrigin: '*',

        // Model Defaults
        defaultModel: 'gpt-4',
        defaultTemperature: 0.7,
        defaultMaxTokens: 2000,
        autoRetryFailed: true,

        // Data Retention
        keepLogsDays: 30,
        keepAuditLogsDays: 90,
        autoCleanup: true,
    });

    const [activeTab, setActiveTab] = useState('system');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            alert('Configuration saved successfully!');
        }, 1000);
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all configurations to default?')) {
            setConfig({
                systemName: 'LLM Orchestration Platform',
                timezone: 'UTC',
                language: 'English',
                dateFormat: 'YYYY-MM-DD',
                requireMFA: false,
                sessionTimeout: 30,
                maxLoginAttempts: 5,
                ipWhitelist: '',
                emailNotifications: true,
                slackNotifications: false,
                webhookNotifications: true,
                notifyOnError: true,
                notifyOnLimit: true,
                apiRateLimit: 100,
                apiTimeout: 30,
                enableCORS: true,
                corsOrigin: '*',
                defaultModel: 'gpt-4',
                defaultTemperature: 0.7,
                defaultMaxTokens: 2000,
                autoRetryFailed: true,
                keepLogsDays: 30,
                keepAuditLogsDays: 90,
                autoCleanup: true,
            });
        }
    };

    return (
        <div className="page-container">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Configuration</h1>
                    <p className="text-secondary">Configure system-wide settings and defaults</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleReset}
                        className="btn btn-secondary"
                    >
                        <FiRefreshCw /> Reset to Defaults
                    </button>
                    <button
                        onClick={handleSave}
                        className="btn btn-primary"
                        disabled={isSaving}
                    >
                        <FiSave /> {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="card mb-6">
                <div className="flex border-b border-border">
                    <button
                        className={`px-6 py-3 flex items-center gap-2 ${activeTab === 'system' ? 'border-b-2 border-primary text-primary' : 'text-secondary'}`}
                        onClick={() => setActiveTab('system')}
                    >
                        <FiSettings /> System
                    </button>
                    <button
                        className={`px-6 py-3 flex items-center gap-2 ${activeTab === 'security' ? 'border-b-2 border-primary text-primary' : 'text-secondary'}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <FiShield /> Security
                    </button>
                    <button
                        className={`px-6 py-3 flex items-center gap-2 ${activeTab === 'notifications' ? 'border-b-2 border-primary text-primary' : 'text-secondary'}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <FiBell /> Notifications
                    </button>
                    <button
                        className={`px-6 py-3 flex items-center gap-2 ${activeTab === 'api' ? 'border-b-2 border-primary text-primary' : 'text-secondary'}`}
                        onClick={() => setActiveTab('api')}
                    >
                        <FiGlobe /> API
                    </button>
                    <button
                        className={`px-6 py-3 flex items-center gap-2 ${activeTab === 'models' ? 'border-b-2 border-primary text-primary' : 'text-secondary'}`}
                        onClick={() => setActiveTab('models')}
                    >
                        🤖 Model Defaults
                    </button>
                    <button
                        className={`px-6 py-3 flex items-center gap-2 ${activeTab === 'data' ? 'border-b-2 border-primary text-primary' : 'text-secondary'}`}
                        onClick={() => setActiveTab('data')}
                    >
                        <FiSettings /> Data Retention
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {/* System Settings */}
                    {activeTab === 'system' && (
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <div className="input-group">
                                    <label className="label">System Name</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={config.systemName}
                                        onChange={(e) => setConfig({ ...config, systemName: e.target.value })}
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="label">Timezone</label>
                                    <select
                                        className="select"
                                        value={config.timezone}
                                        onChange={(e) => setConfig({ ...config, timezone: e.target.value })}
                                    >
                                        <option value="UTC">UTC</option>
                                        <option value="EST">Eastern Time (EST)</option>
                                        <option value="PST">Pacific Time (PST)</option>
                                        <option value="GMT">GMT</option>
                                        <option value="CET">Central European Time (CET)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div className="input-group">
                                    <label className="label">Language</label>
                                    <select
                                        className="select"
                                        value={config.language}
                                        onChange={(e) => setConfig({ ...config, language: e.target.value })}
                                    >
                                        <option value="English">English</option>
                                        <option value="Spanish">Spanish</option>
                                        <option value="French">French</option>
                                        <option value="German">German</option>
                                        <option value="Japanese">Japanese</option>
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label className="label">Date Format</label>
                                    <select
                                        className="select"
                                        value={config.dateFormat}
                                        onChange={(e) => setConfig({ ...config, dateFormat: e.target.value })}
                                    >
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <div className="input-group">
                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={config.requireMFA}
                                            onChange={(e) => setConfig({ ...config, requireMFA: e.target.checked })}
                                        />
                                        Require Multi-Factor Authentication
                                    </label>
                                </div>

                                <div className="input-group">
                                    <label className="label">Session Timeout (minutes)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={config.sessionTimeout}
                                        onChange={(e) => setConfig({ ...config, sessionTimeout: e.target.value })}
                                        min="1"
                                        max="1440"
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="label">Max Login Attempts</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={config.maxLoginAttempts}
                                        onChange={(e) => setConfig({ ...config, maxLoginAttempts: e.target.value })}
                                        min="1"
                                        max="10"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="input-group">
                                    <label className="label">IP Whitelist (comma-separated)</label>
                                    <textarea
                                        className="input min-h-[120px]"
                                        value={config.ipWhitelist}
                                        onChange={(e) => setConfig({ ...config, ipWhitelist: e.target.value })}
                                        placeholder="192.168.1.1, 10.0.0.1"
                                    />
                                    <p className="text-xs text-secondary mt-1">
                                        Leave empty to allow all IPs. Use CIDR notation for ranges.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notification Settings */}
                    {activeTab === 'notifications' && (
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <div className="input-group">
                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={config.emailNotifications}
                                            onChange={(e) => setConfig({ ...config, emailNotifications: e.target.checked })}
                                        />
                                        Email Notifications
                                    </label>
                                </div>

                                <div className="input-group">
                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={config.slackNotifications}
                                            onChange={(e) => setConfig({ ...config, slackNotifications: e.target.checked })}
                                        />
                                        Slack Notifications
                                    </label>
                                </div>

                                <div className="input-group">
                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={config.webhookNotifications}
                                            onChange={(e) => setConfig({ ...config, webhookNotifications: e.target.checked })}
                                        />
                                        Webhook Notifications
                                    </label>
                                </div>
                            </div>

                            <div>
                                <div className="input-group">
                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={config.notifyOnError}
                                            onChange={(e) => setConfig({ ...config, notifyOnError: e.target.checked })}
                                        />
                                        Notify on System Errors
                                    </label>
                                </div>

                                <div className="input-group">
                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={config.notifyOnLimit}
                                            onChange={(e) => setConfig({ ...config, notifyOnLimit: e.target.checked })}
                                        />
                                        Notify on API Rate Limits
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* API Settings */}
                    {activeTab === 'api' && (
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <div className="input-group">
                                    <label className="label">API Rate Limit (requests/minute)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={config.apiRateLimit}
                                        onChange={(e) => setConfig({ ...config, apiRateLimit: e.target.value })}
                                        min="1"
                                        max="10000"
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="label">API Timeout (seconds)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={config.apiTimeout}
                                        onChange={(e) => setConfig({ ...config, apiTimeout: e.target.value })}
                                        min="1"
                                        max="300"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="input-group">
                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={config.enableCORS}
                                            onChange={(e) => setConfig({ ...config, enableCORS: e.target.checked })}
                                        />
                                        Enable CORS
                                    </label>
                                </div>

                                <div className="input-group">
                                    <label className="label">CORS Origin</label>
                                    <input
                                        type="text"
                                        className="input"
                                        value={config.corsOrigin}
                                        onChange={(e) => setConfig({ ...config, corsOrigin: e.target.value })}
                                        placeholder="* or specific domains"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Model Defaults */}
                    {activeTab === 'models' && (
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <div className="input-group">
                                    <label className="label">Default Model</label>
                                    <select
                                        className="select"
                                        value={config.defaultModel}
                                        onChange={(e) => setConfig({ ...config, defaultModel: e.target.value })}
                                    >
                                        <option value="gpt-4">GPT-4</option>
                                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                        <option value="claude-2">Claude 2</option>
                                        <option value="llama2-70b">Llama 2 70B</option>
                                        <option value="gemini-pro">Gemini Pro</option>
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label className="label">Default Temperature</label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={config.defaultTemperature}
                                        onChange={(e) => setConfig({ ...config, defaultTemperature: parseFloat(e.target.value) })}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-sm text-secondary">
                                        <span>More Focused ({config.defaultTemperature})</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="input-group">
                                    <label className="label">Default Max Tokens</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={config.defaultMaxTokens}
                                        onChange={(e) => setConfig({ ...config, defaultMaxTokens: e.target.value })}
                                        min="1"
                                        max="8000"
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={config.autoRetryFailed}
                                            onChange={(e) => setConfig({ ...config, autoRetryFailed: e.target.checked })}
                                        />
                                        Auto-retry Failed Requests
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Data Retention */}
                    {activeTab === 'data' && (
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <div className="input-group">
                                    <label className="label">Keep Application Logs (days)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={config.keepLogsDays}
                                        onChange={(e) => setConfig({ ...config, keepLogsDays: e.target.value })}
                                        min="1"
                                        max="365"
                                    />
                                </div>

                                <div className="input-group">
                                    <label className="label">Keep Audit Logs (days)</label>
                                    <input
                                        type="number"
                                        className="input"
                                        value={config.keepAuditLogsDays}
                                        onChange={(e) => setConfig({ ...config, keepAuditLogsDays: e.target.value })}
                                        min="30"
                                        max="730"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="input-group">
                                    <label className="checkbox">
                                        <input
                                            type="checkbox"
                                            checked={config.autoCleanup}
                                            onChange={(e) => setConfig({ ...config, autoCleanup: e.target.checked })}
                                        />
                                        Automatic Cleanup
                                    </label>
                                    <p className="text-xs text-secondary mt-1">
                                        Automatically clean up old logs and data
                                    </p>
                                </div>

                                <div className="input-group">
                                    <label className="label">Backup Schedule</label>
                                    <select className="select">
                                        <option>Daily</option>
                                        <option>Weekly</option>
                                        <option>Monthly</option>
                                        <option>Never</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-6">
                <div className="card">
                    <div className="text-center">
                        <div className="text-2xl font-bold mb-2">{config.apiRateLimit}</div>
                        <p className="text-sm text-secondary">API Rate Limit/min</p>
                    </div>
                </div>

                <div className="card">
                    <div className="text-center">
                        <div className="text-2xl font-bold mb-2">{config.sessionTimeout}</div>
                        <p className="text-sm text-secondary">Session Timeout (min)</p>
                    </div>
                </div>

                <div className="card">
                    <div className="text-center">
                        <div className="text-2xl font-bold mb-2">{config.keepLogsDays}</div>
                        <p className="text-sm text-secondary">Log Retention (days)</p>
                    </div>
                </div>

                <div className="card">
                    <div className="text-center">
                        <div className="text-2xl font-bold mb-2">
                            {config.emailNotifications ? 'Enabled' : 'Disabled'}
                        </div>
                        <p className="text-sm text-secondary">Email Notifications</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Configurations;