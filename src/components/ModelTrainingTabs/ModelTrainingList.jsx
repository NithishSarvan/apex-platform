
import FilterPanel from '../ModelCatalog/FilterPanel'
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    MenuItem,
    Grid,
    Divider,
    Menu
} from "@mui/material";
import OnboardingWizardDialog from '../AiOS/OnboardingWizardDialog';

import './ModelTrainingList.css';
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


const ModelTrainingList = ({ showFilters, setShowFilters }) => {

    const navigate = useNavigate();

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



    const [showWizard, setShowWizard] = useState(false);

    return (

        <div className="main-content ">
            <div className="catalog-header">
                <h1>Trained Models</h1>
                <button className="request-model-btn"
                    onClick={() => setShowWizard(true)}>Configure AI</button>
            </div>

            <div className="catalog-controls gap-0">


                <input
                    className="search-box"
                    placeholder="Search..."
                />
            </div>


            <Box>

                <Box sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: 0
                }}>
                    {models.map((model) => (
                        <Box
                            key={model.id}
                            onClick={() => navigate('/data-training', {
                                state: {
                                    modelName: model.name,
                                    useCase: model.useCase,
                                    sector: model.sector,
                                    subDOmain: model.subDomain,
                                },
                            })}
                            sx={{
                                border: "1px solid #e0e0e0",
                                borderRadius: 0,
                                p: 2.5,
                                cursor: "pointer",
                                backgroundColor: "white",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                                    transform: "translateY(-2px)",
                                },
                                position: "relative",
                            }}
                        >


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



            <OnboardingWizardDialog
                open={showWizard}
                onClose={() => setShowWizard(false)}
                onComplete={(formData) => {
                    setModels((prevModels) => [
                        ...prevModels,
                        {
                            id: `model-${Date.now()}`,      // unique id
                            useCase: formData.companyName,
                            desc: formData.description,
                            name: formData.modelPreference,
                            sector: formData.sector,
                            subDomain: formData.subDomain,
                            modelType: formData.modelType,
                            maxToken: formData.maxToken || '8192',
                            logo: formData.icon || gpt
                        }
                    ]);
                }}
            />

        </div >
    );

};

export default ModelTrainingList;
