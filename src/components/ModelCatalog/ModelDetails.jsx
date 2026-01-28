import React, { useMemo, useState, useRef, useEffect } from 'react';
import { AiFillAccountBook, AiFillAndroid, AiFillBell, AiFillStar } from 'react-icons/ai';
import { CiImageOn, CiText } from 'react-icons/ci';
import { FiCheck, FiDatabase } from 'react-icons/fi';
import { useLocation, useParams } from 'react-router-dom';
import TextIcon from "../../assets/svg-cons/text.svg";
import ConLengthIcon from "../../assets/svg-cons/con-length.svg";
import OptokenIcon from "../../assets/svg-cons/optoken.svg";
import { useNavigate } from 'react-router-dom';
import gpt from "../../assets/gpt-JRKBi7sz.svg";
import meta from "../../assets/meta-svg.svg";
import mbzuai from "../../assets/mbzuai.svg";
import inception from "../../assets/inception.svg";
import mistral from "../../assets/mistral.svg";
import stablediffusion from "../../assets/stablediffusion.png";
import anthropicCalude from "../../assets/anthropicCalude.svg";
import deepseek from "../../assets/deepseek.svg";
import qwen from "../../assets/qwen.svg";
import cohere from "../../assets/cohere.svg";
import xai from "../../assets/xai.svg";
import { TextField, Select, MenuItem, Checkbox, ListItemText, InputLabel, FormControl, Typography, FormGroup, FormControlLabel } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../../api/client';
import { useMutation } from '@tanstack/react-query';
import { apiPut } from '../../api/client';

const ModelDetails = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const { state } = useLocation();
    const { id } = useParams();
    const stateModelId = state?.modelId;

    const modelId = id || stateModelId;
    const { data: modelData } = useQuery({
        queryKey: ["model", modelId],
        queryFn: async () => apiGet(`/api/models/${modelId}`),
        enabled: Boolean(modelId),
    });

    const modelName = modelData?.name || state?.modelName;
    const overview = state?.overview || modelData?.endpointUrl || modelData?.modelKey || "No overview available yet.";
    const logo = modelData?.providerLogoUrl || state?.logo;
    const providerName = modelData?.providerName;

    const savedConfig = useMemo(() => {
        try {
            return modelData?.configJson ? JSON.parse(modelData.configJson) : null;
        } catch {
            return null;
        }
    }, [modelData?.configJson]);

    const scrollContainerRef = useRef(null);
    const sectionRefs = useRef({});
    const tabs = ['overview', 'configuration'];


    // Scroll spy
    const handleScroll = () => {
        if (!scrollContainerRef.current) return;

        const containerTop = scrollContainerRef.current.scrollTop;
        let currentTab = 'overview';

        for (const tab of tabs) {
            const section = sectionRefs.current[tab];
            if (section) {
                const sectionTop = section.offsetTop - 100; // Offset for better detection
                if (containerTop >= sectionTop) {
                    currentTab = tab;
                }
            }
        }
        setActiveTab(currentTab);
    };



    const handleTabClick = (tab) => {
        setActiveTab(tab);
        const section = sectionRefs.current[tab];
        if (section && scrollContainerRef.current) {
            const sectionTop = section.offsetTop;
            scrollContainerRef.current.scrollTo({
                top: sectionTop,
                behavior: 'smooth',
            });
        }
    };
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, []);

    useEffect(() => {
        handleScroll();
    }, []);

    // Config is persisted to `models.config_json` (jsonb). Keep values clean so backend adapters can parse them.
    const [config, setConfig] = useState({
        inputModalities: [],
        outputModalities: [],
        // store as string for controlled inputs; normalize to number|null on save
        contextLength: '',
        maxOutputTokens: ''
    });
    const [uiMessage, setUiMessage] = useState(null); // { type: 'success'|'error', text: string }

    const sanitizePositiveInt = (value) => {
        if (value == null) return '';
        const s = String(value);
        // allow pastes like "128,000 tokens" by stripping non-digits
        const digits = s.replace(/[^\d]/g, '');
        return digits;
    };

    const toPositiveIntOrNull = (value, { min = 1, max = null } = {}) => {
        const digits = sanitizePositiveInt(value);
        if (!digits) return null;
        const n = Number.parseInt(digits, 10);
        if (Number.isNaN(n) || n < min) return null;
        if (typeof max === 'number' && n > max) return max;
        return n;
    };

    // Initialize config from backend once loaded
    useEffect(() => {
        if (!savedConfig) return;
        setConfig({
            inputModalities: savedConfig.inputModalities || [],
            outputModalities: savedConfig.outputModalities || [],
            contextLength: sanitizePositiveInt(savedConfig.contextLength ?? ''),
            maxOutputTokens: sanitizePositiveInt(savedConfig.maxOutputTokens ?? '')
        });
    }, [savedConfig]);

    const saveConfig = useMutation({
        mutationFn: async () => {
            if (!modelId) throw new Error("Missing model id");

            const normalized = {
                inputModalities: Array.isArray(config.inputModalities) ? config.inputModalities : [],
                outputModalities: Array.isArray(config.outputModalities) ? config.outputModalities : [],
                // contextLength is informational today; keep clean for future orchestration.
                contextLength: toPositiveIntOrNull(config.contextLength, { min: 1, max: 2_000_000 }),
                // backend adapters currently read `maxOutputTokens`
                maxOutputTokens: toPositiveIntOrNull(config.maxOutputTokens, { min: 1, max: 32768 }),
            };

            return apiPut(`/api/models/${modelId}`, {
                configJson: JSON.stringify(normalized)
            });
        },
        onSuccess: () => setUiMessage({ type: 'success', text: 'Configuration saved.' }),
        onError: (e) => setUiMessage({ type: 'error', text: e?.message || 'Failed to save configuration.' }),
    });

    const clearConfig = useMutation({
        mutationFn: async () => {
            if (!modelId) throw new Error("Missing model id");
            // Backend treats blank as NULL (clears jsonb column)
            return apiPut(`/api/models/${modelId}`, { configJson: "" });
        },
        onSuccess: () => {
            setConfig({
                inputModalities: [],
                outputModalities: [],
                contextLength: '',
                maxOutputTokens: ''
            });
            setUiMessage({ type: 'success', text: 'Configuration cleared.' });
        },
        onError: (e) => setUiMessage({ type: 'error', text: e?.message || 'Failed to clear configuration.' }),
    });

    const isSaving = saveConfig.isPending || clearConfig.isPending;

    const ctxLenNum = toPositiveIntOrNull(config.contextLength, { min: 1, max: 2_000_000 });
    const maxOutNum = toPositiveIntOrNull(config.maxOutputTokens, { min: 1, max: 32768 });
    const hasInvalidNumbers =
        (config.contextLength && ctxLenNum == null) ||
        (config.maxOutputTokens && maxOutNum == null);

    return (
        <div className="main-content-model flex  gap-16 px-10   ">


            <div className='flex flex-col h-screen overflow-hidden' >
                <div className="flex gap-2 items-center ">
                    <div className="card-icon-wrapper ">
                        {/* <AiFillStar size={30} /> */}
                        <img
                            src={logo}
                            alt={modelName}
                            width={30}
                            height={30}
                            // className="mr-4"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/default-model-logo.png';
                            }}
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-black-500">{modelName}</h1>
                        <div className="flex space-x-3 mt-1">

                            <button className="try-btn" onClick={() => navigate('/chat', {
                                state: {
                                    modelName: modelName,
                                    providerName,
                                    modelId,
                                    modelLogo: logo,
                                },
                            })}>Try it out</button>

                            <button
                                className="save-conf-btn"
                                onClick={() => saveConfig.mutate()}
                                disabled={isSaving || !modelId || hasInvalidNumbers}
                                title={hasInvalidNumbers ? "Fix invalid numeric values before saving" : undefined}
                            >
                                {saveConfig.isPending ? (
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                                        <CircularProgress size={16} sx={{ color: "#ffffff" }} />
                                        Saving...
                                    </span>
                                ) : "Save Configuration"}
                            </button>

                            <button
                                className="save-conf-btn"
                                onClick={() => clearConfig.mutate()}
                                disabled={isSaving || !modelId}
                                style={{ backgroundColor: "#e0e0e0", color: "#222" }}
                                title="Clear saved configuration (sets config_json to NULL)"
                            >
                                {clearConfig.isPending ? (
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                                        <CircularProgress size={16} sx={{ color: "#222" }} />
                                        Clearing...
                                    </span>
                                ) : "Clear Configuration"}
                            </button>
                        </div>
                        {uiMessage && (
                            <div style={{ marginTop: 8, fontSize: 13, color: uiMessage.type === 'success' ? '#02b499' : '#c62828' }}>
                                {uiMessage.text}
                            </div>
                        )}
                    </div>
                </div>
                <div className='heighligts my-4  font-md' >
                    <p>The model details below will update automatically based on the Region, Compute, and Version filters you select.</p>
                </div>

                <div className="flex flex-1  overflow-hidden">
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto overflow-x-auto  hide-scrollbar"
                    >
                        {/* ================= Overview ================= */}
                        <div ref={(el) => (sectionRefs.current['overview'] = el)}>
                            <h2 className="text-xl font-bold mb-6">Overview</h2>
                            <p className=" mb-6 font-md" >{overview}</p>


                        </div>

                        <div
                            ref={(el) => (sectionRefs.current['configuration'] = el)}
                            className="mb-8"
                        >
                            <h2 className="text-xl font-bold mb-8">Configuration</h2>
                            <div className="mb-6">
                                <p className="font-md">
                                    Configure the technical specifications and capabilities of your AI model.
                                    These settings determine how the model processes inputs and generates outputs,
                                    affecting performance, compatibility, and use case suitability.
                                </p>
                            </div>


                            <div className="space-y-8">
                                {/* Input Modalities */}
                                <div className="space-y-4">
                                    <h3 className="text-base font-semibold text-black">Input modalities</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['Text', 'Images', 'Audio', 'Embeddings'].map((modality) => (
                                            <div
                                                key={modality}
                                                className={`
                            flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer
                            transition-all duration-200 text-sm
                            ${config.inputModalities.includes(modality.toLowerCase())
                                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                                    }
                        `}
                                                style={{ opacity: isSaving ? 0.6 : 1, pointerEvents: isSaving ? 'none' : 'auto' }}
                                                onClick={() => {
                                                    const newModalities = config.inputModalities.includes(modality.toLowerCase())
                                                        ? config.inputModalities.filter(m => m !== modality.toLowerCase())
                                                        : [...config.inputModalities, modality.toLowerCase()];
                                                    setConfig({ ...config, inputModalities: newModalities });
                                                }}
                                            >
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center
                            ${config.inputModalities.includes(modality.toLowerCase())
                                                        ? 'border-blue-500 bg-blue-500'
                                                        : 'border-gray-300'
                                                    }
                        `}>
                                                    {config.inputModalities.includes(modality.toLowerCase()) && (
                                                        <span className="text-white text-xs">✓</span>
                                                    )}
                                                </div>
                                                <span className="font-medium">{modality}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Output Modalities */}
                                <div className="space-y-4">
                                    <h3 className="text-base font-semibold text-black">Output modalities</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['Text', 'Images', 'Audio'].map((modality) => (
                                            <div
                                                key={modality}
                                                className={`
                            flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer
                            transition-all duration-200 text-sm
                            ${config.outputModalities.includes(modality.toLowerCase())
                                                        ? 'border-green-500 bg-green-50 text-green-700'
                                                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                                    }
                        `}
                                                style={{ opacity: isSaving ? 0.6 : 1, pointerEvents: isSaving ? 'none' : 'auto' }}
                                                onClick={() => {
                                                    const newModalities = config.outputModalities.includes(modality.toLowerCase())
                                                        ? config.outputModalities.filter(m => m !== modality.toLowerCase())
                                                        : [...config.outputModalities, modality.toLowerCase()];
                                                    setConfig({ ...config, outputModalities: newModalities });
                                                }}
                                            >
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center
                            ${config.outputModalities.includes(modality.toLowerCase())
                                                        ? 'border-green-500 bg-green-500'
                                                        : 'border-gray-300'
                                                    }
                        `}>
                                                    {config.outputModalities.includes(modality.toLowerCase()) && (
                                                        <span className="text-white text-xs">✓</span>
                                                    )}
                                                </div>
                                                <span className="font-medium">{modality}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Context Length & Max Output Tokens */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Context Length */}
                                    <div className="space-y-3">
                                        <h3 className="text-base font-semibold text-black">Context length</h3>
                                        <div className="relative">
                                            <input
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                type="text"
                                                value={config.contextLength}
                                                onChange={(e) => setConfig({ ...config, contextLength: sanitizePositiveInt(e.target.value) })}
                                                placeholder="e.g. 128000"
                                                disabled={isSaving}
                                                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280" }}>
                                            Total context window (input + output). Informational today; will be enforced in orchestration later.
                                        </div>
                                        </div>
                                    </div>

                                    {/* Max Output Tokens */}
                                    <div className="space-y-3">
                                        <h3 className="text-base font-semibold text-black">Max output tokens</h3>
                                        <div className="relative">
                                            <input
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                type="text"
                                                value={config.maxOutputTokens}
                                                onChange={(e) => setConfig({ ...config, maxOutputTokens: sanitizePositiveInt(e.target.value) })}
                                                placeholder="e.g. 16384"
                                                disabled={isSaving}
                                                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        <div style={{ marginTop: 6, fontSize: 12, color: hasInvalidNumbers ? "#c62828" : "#6b7280" }}>
                                            {config.maxOutputTokens && maxOutNum == null
                                                ? "Enter a valid positive integer (max 32768)."
                                                : "Controls response length. This is applied by the backend adapters."}
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                {/* <div className='scroll-nav' > */}
                <div style={{ marginTop: "45%" }}  >
                    <nav className=" flex flex-col w-40  border-gray-200 overflow-y-auto">
                        {['Overview', 'Configuration'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleTabClick(tab.toLowerCase())}
                                className={`py-3 px-3 text-left  text-sm
                            border-l transition-all duration-300
                            ${activeTab === tab.toLowerCase()
                                        ? 'border-l-4 border-[#02b499]'
                                        : 'border-l-4 border-[#d0d7df]'
                                    }`}

                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

        </div>
    );
};

export default ModelDetails;
