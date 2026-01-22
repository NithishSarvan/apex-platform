import React, { useState, useRef, useEffect } from 'react';
import { AiFillAccountBook, AiFillAndroid, AiFillBell, AiFillStar } from 'react-icons/ai';
import { CiImageOn, CiText } from 'react-icons/ci';
import { FiCheck, FiDatabase } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
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

const ModelDetails = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const { state } = useLocation();
    const { modelName, overview, logo } = state || {};

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

    const [config, setConfig] = useState({
        inputModalities: [],
        outputModalities: [],
        contextLength: '',
        maxOutputTokens: ''
    });

    return (
        <div className="flex gap-16 px-10 main-content main-content-model ">


            <div className='flex flex-col h-screen overflow-hidden' >
                <div className="flex items-center gap-2 ">
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
                        <div className="flex mt-1 space-x-3">

                            <button className="try-btn" onClick={() => navigate('/chat', {
                                state: {
                                    modelName: modelName,
                                },
                            })}>Try it out</button>
                        </div>
                    </div>
                </div>
                <div className='my-4 heighligts font-md' >
                    <p>The model details below will update automatically based on the Region, Compute, and Version filters you select.</p>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-x-auto overflow-y-auto hide-scrollbar"
                    >
                        {/* ================= Overview ================= */}
                        <div ref={(el) => (sectionRefs.current['overview'] = el)}>
                            <h2 className="mb-6 text-xl font-bold">Overview</h2>
                            <p className="mb-6 font-md" >{overview}</p>


                        </div>

                        <div
                            ref={(el) => (sectionRefs.current['configuration'] = el)}
                            className="mb-8"
                        >
                            <h2 className="mb-8 text-xl font-bold">Configuration</h2>
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
                                                        <span className="text-xs text-white">✓</span>
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
                                                        <span className="text-xs text-white">✓</span>
                                                    )}
                                                </div>
                                                <span className="font-medium">{modality}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Context Length & Max Output Tokens */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Context Length */}
                                    <div className="space-y-3">
                                        <h3 className="text-base font-semibold text-black">Context length</h3>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={config.contextLength}
                                                onChange={(e) => setConfig({ ...config, contextLength: e.target.value })}
                                                placeholder="eg. 128,000 tokens"
                                                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>

                                    {/* Max Output Tokens */}
                                    <div className="space-y-3">
                                        <h3 className="text-base font-semibold text-black">Max output tokens</h3>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={config.maxOutputTokens}
                                                onChange={(e) => setConfig({ ...config, maxOutputTokens: e.target.value })}
                                                placeholder="eg. 16,384 tokens"
                                                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
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
                    <nav className="flex flex-col w-40 overflow-y-auto border-gray-200 ">
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
