
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
            useCase: "Policy Inquiry & Claims Assistance"
        },
        {
            id: 'gpt-41', name: 'GPT-4o mini', desc: `OpenAI's most advanced model in the small models category supports text inputs and generates text outputs, making it ideal for smaller tasks.`,
            sector: 'Insurance',
            subDomain: 'Policy Quotation',
            modelType: 'API',
            maxToken: '32768',
            useCase: "Workflow Automation"
        },
        {
            id: 'gpt-42', name: 'K2 Think Cerebras', desc: `K2 Think is a reasoning model that achieves state-of-the-art performance with 32B parameters. It was developed in the UAE by Mohamed bin Zayed University of Artificial Intelligence (MBZUAI). The model is deployed and running on the Cerebras clusters.`,
            sector: 'Insurance',
            subDomain: 'Finance',
            modelType: 'Self',
            maxToken: '32768',
            useCase: "Claims Assistance"
        },
        {
            id: 'gpt-43', name: 'gpt-oss-120b Cerebras', desc: `K2 Think is a reasoning model that achieves state-of-the-art performance with 32B parameters. It was developed in the UAE by Mohamed bin Zayed University of Artificial Intelligence (MBZUAI). The model is deployed and running on the Core42 cloud located in the UAE region.`,
            sector: 'Insurance',
            subDomain: 'Agent',
            modelType: 'API',
            maxToken: '32768',
            useCase: "Fraud Detection"
        },
        {
            id: 'gpt-44', name: 'Whisper', desc: `Whisper is a general-purpose speech recognition model. It is trained on a large dataset of diverse audio and is also a multitask model that can perform multilingual speech recognition as well as speech translation and language identification.`,
            sector: 'Others',
            subDomain: 'Customer',
            modelType: 'Self',
            maxToken: '32768',
            useCase: "Policy Renewal & Alerts"
        },
        {
            id: 'gpt-45', name: 'Llama 3 70B', desc: `Llama 3 is an auto-regressive language model, part of the Llama 3 family, and the next generation of Meta's open-source LLMs. It is one of the most capable openly available LLMs with improved reasoning capabilities compared to its previous models.`,
            sector: 'Others',
            subDomain: 'Finance',
            modelType: 'Self',
            maxToken: '32768',
            useCase: "Policy Inquiry & Customer Support"
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

            <div className="catalog-grid">


                {models.map((model) => (
                    <div key={model.id} className="model-card" onClick={() => navigate('/data-training')}>

                        <p className="model-name">{model.name}</p>
                        <div className="model-card-header">
                            <h3 className="model-name">{model.useCase}</h3>

                        </div>

                        <p className="model-desc">{model.desc}</p>

                        <div className="model-parameters">
                            <div className="parameter-row">
                                <div className="parameter">
                                    <span className="parameter-label">Sector</span>
                                    <span className="parameter-value">{model.sector}</span>
                                </div>
                                <div className="parameter">
                                    <span className="parameter-label">Sub-domain</span>
                                    <span className="parameter-value">{model.subDomain}</span>
                                </div>
                            </div>

                            <div className="parameter-row">
                                <div className="parameter">
                                    <span className="parameter-label">Model Type</span>
                                    <span className="parameter-value">{model.modelType}</span>
                                </div>
                                <div className="parameter">
                                    <span className="parameter-label">Max Tokens</span>
                                    <span className="parameter-value">{model.maxToken}</span>
                                </div>
                            </div>



                        </div>


                    </div>
                ))}

            </div>

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
                        }
                    ]);
                }}
            />

        </div >
    );

};

export default ModelTrainingList;
