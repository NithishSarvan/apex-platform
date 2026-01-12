import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { FiDatabase, FiSliders, FiCheck } from 'react-icons/fi';
import DataTraining from '../../pages/DataTraining';
import FineTuning from '../../components/FineTuningForTab/FineTuning';
import RulesSetupStep from '../../components/RulesSetupStep';


import { Button, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Divider, IconButton, Slider, Menu, MenuItem } from "@mui/material";
import { PiPaintBrushHouseholdLight } from "react-icons/pi";
import { VscGitCompare } from "react-icons/vsc";
import { FaBarsProgress } from "react-icons/fa6";
import { IoMdPlay } from "react-icons/io";
import { CiCirclePlus } from "react-icons/ci"
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
import { FaQuestion } from "react-icons/fa";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import OnboardingWizardDialog from '../AiOS/OnboardingWizardDialog';
import { IntentRegistryPage } from '../../components/AiOS/IntentRegistryPage';
import { ToolStudioPage } from '../../components/AiOS/ToolStudioPage';
import { SemanticDataLayerPage } from '../../components/AiOS/SemanticDataLayerPage';
import {
    Settings as SettingsIcon,
    Psychology as PsychologyIcon,
    Schema as SchemaIcon,
    Storage as StorageIcon,
    AutoFixHigh as AutoFixHighIcon,
    Security as SecurityIcon,
    Timeline as TimelineIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
// TabPanel Component for content switching
const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`model-training-tabpanel-${index}`}
            aria-labelledby={`model-training-tab-${index}`}
            {...other}
            className="hide-scrollbar"
            style={{
                height: '100%',
                overflowY: 'auto',
            }}
        >
            {value === index && (
                <Box sx={{ p: 0, height: '100%' }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

const ModelTrainingTab = () => {
    const [value, setValue] = useState(0);
    const navigate = useNavigate();
    const { state } = useLocation();
    const { modelName, useCase, sector, subDOmain } = state || {};
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const [aiModel, setAiModel] = useState(false)
    const providers = [
        { name: "OpenAI", logo: gpt },
        { name: "Meta", logo: meta },
        { name: "MBZUAI", logo: mbzuai },
        { name: "Inception", logo: inception },
        { name: "Mistral AI", logo: mistral },
        { name: "Stability AI", logo: stablediffusion },
        { name: "Anthropic Claude", logo: anthropicCalude },
        { name: "DeepSeek", logo: deepseek },
        { name: "Qwen", logo: qwen },
        { name: "Cohere", logo: cohere },
        { name: "xAI", logo: xai },
    ];

    const [showWizard, setShowWizard] = useState(false);


    return (
        <div className='main-content' >
            {/* Header Section */}
            <div className="px-10 pt-6 pb-4 bg-white border-b border-gray-200">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-3"> {/* Changed from gap-3 to justify-between */}
                            <div className="flex items-center gap-3"> {/* Added wrapper for left side content */}
                                <h1 className="text-2xl font-bold text-gray-900">Model Training</h1>
                                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                    {modelName}
                                </span>
                            </div>

                            <div className="flex items-center gap-2"> {/* Added wrapper for right side buttons */}
                                <button
                                    className="try-btn align-right"
                                    onClick={() => navigate('/chat', {
                                        state: {
                                            modelName: modelName,
                                        },
                                    })}
                                >
                                    Try it out
                                </button>
                                <button className="save-conf-btn align-right">
                                    Save Configuration
                                </button>
                            </div>
                        </div>

                        {/* <p className="text-sm text-gray-600 mt-1">Configure and train your AI model with data, fine-tuning, and rules</p> */}

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            <div className="flex items-center">
                                <span className="text-sm font-semibold text-gray-900 mr-2">Use Case:</span>
                                <span className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
                                    {useCase || "Policy Inquiry & Claims Assistance"}
                                </span>
                            </div>
                            <div className="w-px h-4 bg-gray-300"></div>
                            <div className="flex items-center">
                                <span className="text-sm font-semibold text-gray-900 mr-2">Sector:</span>
                                <span className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
                                    {sector || "Insurance"}
                                </span>
                            </div>
                            <div className="w-px h-4 bg-gray-300"></div>
                            <div className="flex items-center">
                                <span className="text-sm font-semibold text-gray-900 mr-2">Subdomain:</span>
                                <span className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-md">
                                    {subDOmain || "General"}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Horizontal Tabs */}
            <Box sx={{
                width: '100%',
                borderBottom: 1,
                borderColor: 'divider',
                px: 10
            }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    // variant="fullWidth"
                    // textColor="#14e2b9ff"
                    // indicatorColor="#1fe4bcff"
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                        '& .MuiTab-root': {
                            fontSize: '14px',
                            fontWeight: 500,
                            textTransform: 'none',
                            minHeight: '60px',
                            whiteSpace: 'nowrap',
                            color: '#807e7eff',
                            '&.Mui-selected': {
                                color: '#000000ff',
                                fontWeight: 600,
                            },
                            '&:hover': {
                                color: '#000000ff',
                            },
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#000000ff',
                        },
                    }}
                >

                    <Tab
                        icon={<FiDatabase size={20} />}
                        iconPosition="start"
                        label="Data Model Setup"
                    />
                    <Tab
                        icon={<PsychologyIcon size={20} />}
                        iconPosition="start"
                        label="Intent Registry"
                    />
                    <Tab
                        icon={<FaQuestion size={18} />}
                        iconPosition="start"
                        label="Q&A Training"
                    />


                    <Tab
                        icon={<FiCheck size={20} />}
                        iconPosition="start"
                        label="Rules Setup"
                    />
                    <Tab
                        icon={<FiSliders size={20} />}
                        iconPosition="start"
                        label="Fine Tuning"
                    />
                </Tabs>
            </Box>

            {/* Scrollable Content Area - Hidden Scrollbars */}
            <div className="hide-scrollbar" style={{
                flex: 1,
                overflow: 'auto',
                padding: '0 40px'
            }}>
                <TabPanel value={value} index={0}>
                    <ToolStudioPage />
                </TabPanel>

                <TabPanel value={value} index={1}>
                    <IntentRegistryPage />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <DataTraining />
                </TabPanel>
                <TabPanel value={value} index={3}>
                    <RulesSetupStep />
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <FineTuning />
                </TabPanel>
            </div>

            <OnboardingWizardDialog
                open={showWizard}
                onClose={() => setShowWizard(false)}
                onComplete={(formData) => {
                    console.log('Configuration completed:', formData);
                }}
            />

            <Dialog
                open={aiModel}
                maxWidth="md"
                fullWidth
            >
                {/* Header */}
                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold">Select Model</Typography>
                </DialogTitle>

                <Divider />

                {/* Body */}
                <Box sx={{ display: "flex", height: "400px" }}>

                    {/* Left Sidebar */}
                    <Box className="chat-pop-left"
                    // sx={{
                    //   width: 220,
                    //   borderRight: "1px solid #e0e0e0",
                    //   backgroundColor: "#F4F5F6",
                    //   p: 2,
                    //   gap: 2
                    // }}
                    >
                        {[
                            { step: "01", label: "Provider", active: true },
                            { step: "02", label: "Models" },
                            { step: "03", label: "Compute" },
                            { step: "04", label: "Billing type" }
                        ].map((item) => (
                            <Box
                                key={item.step}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 2,
                                    color: item.active ? "#00bfa5" : "#666",
                                    fontWeight: item.active ? "bold" : "normal",


                                }}
                            >
                                <Typography sx={{ width: 30 }}>
                                    {item.step}
                                </Typography>
                                <Typography fontWeight="bold" >{item.label}</Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Right Content */}
                    <Box
                        sx={{
                            flex: 1,
                            p: 3,
                            overflowY: "auto"
                        }}
                    >
                        {providers.map((provider) => (
                            <Box
                                key={provider.name}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 3,
                                    px: 6,
                                    // py: 2,
                                    pt: 1,       // padding-top
                                    pb: 0,
                                    borderRadius: 2,
                                    cursor: "pointer",
                                    "&:hover": {
                                        backgroundColor: "#f5f5f5",
                                    },
                                }}
                            >
                                <img
                                    src={provider.logo}
                                    alt={provider.name}
                                    style={{ width: 40, height: 40, objectFit: "contain" }}
                                />
                                <Typography fontWeight="bold" fontSize="18px" variant="h6">{provider.name}</Typography>
                            </Box>
                        ))}

                    </Box>
                </Box>

                {/* Footer */}
                <DialogActions sx={{ p: 2 }}>
                    <Button variant="contained" sx={{ backgroundColor: "#e0e0e0", color: "#a6a6ae" }} onClick={() => setAiModel(false)} >Cancel</Button>
                    <Button variant="contained" sx={{ backgroundColor: "#14eca4ff", color: "#fff" }}>
                        Apply
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    );
};


const hideScrollbarStyles = `
/* Hide scrollbar for Chrome, Safari and Opera */
.hide-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.hide-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}

/* Optional: Smooth scrolling */
.hide-scrollbar {
    scroll-behavior: smooth;
}
`;


export default ModelTrainingTab;