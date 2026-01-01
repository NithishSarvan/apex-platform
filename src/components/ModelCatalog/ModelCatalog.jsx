
import FilterPanel from './FilterPanel';
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

const ModelCatalog = ({ showFilters, setShowFilters }) => {

    const navigate = useNavigate();


    const [providers, setProviders] = useState([
        { id: 1, name: "OpenAI", description: "OpenAI", modelCount: 26 },
        { id: 2, name: "Meta", description: "Meta", modelCount: 3 },
        { id: 3, name: "MBZUAI", description: "MBZUAI", modelCount: 2 },
        { id: 4, name: "Inception", description: "Inception", modelCount: 1 },
        { id: 5, name: "Mistral AI", description: "mistral", modelCount: 3 },
        { id: 6, name: "Stability AI", description: "Stability AI", modelCount: 1 },
        { id: 7, name: "Anthropic", description: "Anthropic", modelCount: 1 },
        { id: 8, name: "DeepSeek", description: "DeepSeek", modelCount: 1 },
        { id: 9, name: "Qwen", description: "Qwen", modelCount: 3 },
        { id: 10, name: "Cohere", description: "Cohere", modelCount: 4 },
        { id: 11, name: "xAI", description: "xAI", modelCount: 1 },
    ]);

    const [modelType, setModelType] = useState([
        { id: 'API', name: "API-Hosted" },
        { id: 'SELF', name: "Sefl-Hosted" },

    ]);

    const models = [
        { id: 'gpt-4', logo: gpt, name: 'GPT-4o', desc: `GPT-4o is OpenAI's latest model, offering faster, more efficient, and skillful multimodal reasoning for text inputs while maintaining improved accuracy, coherence, and responsiveness.` },
        { id: 'gpt-41', logo: gpt, name: 'GPT-4o mini', desc: `OpenAI's most advanced model in the small models category supports text inputs and generates text outputs, making it ideal for smaller tasks.` },
        {
            id: 'gpt-42', logo: deepseek, name: 'K2 Think Cerebras', desc: `K2 Think is a reasoning model that achieves state-of-the-art performance with 32B parameters. It was developed in the UAE by Mohamed bin Zayed University of Artificial Intelligence (MBZUAI). The model is deployed and running on the Cerebras clusters.`
        },
        { id: 'gpt-43', logo: gpt, name: 'gpt-oss-120b Cerebras', desc: `K2 Think is a reasoning model that achieves state-of-the-art performance with 32B parameters. It was developed in the UAE by Mohamed bin Zayed University of Artificial Intelligence (MBZUAI). The model is deployed and running on the Core42 cloud located in the UAE region.` },
        { id: 'gpt-44', logo: gpt, name: 'Whisper', desc: `Whisper is a general-purpose speech recognition model. It is trained on a large dataset of diverse audio and is also a multitask model that can perform multilingual speech recognition as well as speech translation and language identification.` },
        { id: 'gpt-45', logo: mistral, name: 'Llama 3 70B', desc: `Llama 3 is an auto-regressive language model, part of the Llama 3 family, and the next generation of Meta's open-source LLMs. It is one of the most capable openly available LLMs with improved reasoning capabilities compared to its previous models.` }
    ];

    const [showAddModal, setShowAddModal] = useState(false);

    const [newModel, setNewModel] = useState({
        name: '',
        provider: '',
        type: '',
        endpoint: '',
        apiKey: '',
        cost: "",
        url: "",
        apikey: "",
        logo: null
    });

    const handleAddModel = () => {
        const newModelObj = {
            id: `model-${Date.now()}`,
            name: newModel.name,
            provider: newModel.provider,
            type: newModel.type,
            maxTokens: newModel.maxTokens,
            cost: newModel.cost,
            status: 'inactive',

        };
        // setModels([...models, newModelObj]);
        // setSelectedModel(newModelObj.id);
        setShowAddModal(false);
        // setNewModel({ name: '', provider: '', type: 'API', endpoint: '', apiKey: '' });
    };


    const grayInputSx = {
        backgroundColor: "#f4f5f6",
        borderRadius: 1,
        "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none",
        },
    };


    const inputSx = {
        "& .MuiOutlinedInput-root": {
            height: 44,
            backgroundColor: "#f4f5f6",
            borderRadius: "0px",
            border: "none",
            "& fieldset": {
                border: "none", // Remove border
            },
            "&:hover fieldset": {
                border: "none", // Remove border on hover
            },
            "&.Mui-focused fieldset": {
                border: "none", // Remove border on focus
                outline: "none",
            },
        },
        "& .MuiInputBase-input": {
            fontSize: "14px", // Adjust text size
            color: "#000000", // Text color
            padding: "0 12px", // Adjust padding
        },
    };
    const [anchorEl, setAnchorEl] = useState(null);

    const menuOpen = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewModel(prev => ({
                    ...prev,
                    logo: reader.result
                }));


            };
            reader.readAsDataURL(file);
        }
    };


    return (

        <div className="main-content ">
            <div className="catalog-header">
                <h1>Model Catalog</h1>
                <button className="request-model-btn"
                    onClick={() => setShowAddModal(true)}>Request Model</button>
            </div>

            <div className="catalog-controls">
                <div>

                    <button
                        className="filters-btn"
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                    >
                        ⚙️ Filters
                    </button>
                    <Menu
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={() => setAnchorEl(null)}
                        disableAutoFocusItem
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        MenuListProps={{
                            onClick: (e) => e.stopPropagation(), // ⛔ prevent auto close
                        }}

                        PaperProps={{
                            sx: {
                                width: 380,
                                py: 2,
                                // maxHeight: "80vh",
                                // overflowY: "auto",
                                borderRadius: 2,
                                boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
                                ml: 34,
                                // mt: -8,
                                display: "flex",
                                flexDirection: "column",
                                overflow: "hidden",
                                // top: '66px'

                            },
                        }}
                    >
                        {/* YOUR FILTER CONTENT HERE */}

                        <Box sx={{
                            flex: 1, // Takes available space
                            overflowY: "auto", // Scroll only this area
                            maxHeight: "calc(80vh - 70px)",
                            px: 4
                        }} >
                            {/* PROVIDERS */}
                            <div className="filter-section">
                                <h4>Providers (11)</h4>
                                <Grid container spacing={2}>
                                    <Grid item size={6} ><label><input type="checkbox" /> OpenAI</label></Grid>
                                    <Grid item size={6}><label><input type="checkbox" /> Inception</label></Grid>
                                    <Grid item size={6}><label><input type="checkbox" /> Meta</label></Grid>
                                    <Grid item size={6}><label><input type="checkbox" /> Mistral AI</label></Grid>
                                </Grid>
                                <div className="see-all">▼ See All (7)</div>
                            </div>

                            {/* MODALITY */}
                            <div className="filter-section">
                                <h4>Modality (4)</h4>
                                <Grid container spacing={2}>
                                    <Grid item size={6}><label><input type="checkbox" /> Text</label></Grid>
                                    <Grid item size={6}><label><input type="checkbox" /> Image</label></Grid>
                                    <Grid item size={6}><label><input type="checkbox" /> Audio</label></Grid>
                                </Grid>
                            </div>



                            <div className="filter-section">
                                <h4>Mode  (2)</h4>
                                <Grid container spacing={2}>
                                    <Grid item size={6}><label><input type="radio" /> Preview</label></Grid>
                                    <Grid item size={6}><label><input type="radio" /> Production</label></Grid>

                                </Grid>
                            </div>
                        </Box>
                        {/* FOOTER */}
                        <Grid container justifyContent="space-between"
                            sx={{
                                flexShrink: 0, // Don't shrink
                                mt: "auto", // Push to bottom
                                borderTop: "solid 1px #cfcbcbff",
                                px: 4,
                                pt: 1,
                                pb: 1,
                                backgroundColor: "white" // Ensure background color
                            }}>
                            <Grid item>
                                <button className="clear-btn">Clear all</button>
                            </Grid>
                            <Grid item>
                                <button className="apply-btn">Apply</button>
                            </Grid>
                        </Grid>
                    </Menu>
                </div>

                <input
                    className="search-box"
                    placeholder="Search for a model..."
                />
            </div>

            <div className="catalog-grid">
                {models.map((model) => (
                    <div key={model} className="model-card" onClick={() => navigate('/model-details', {
                        state: {
                            modelName: model.name,
                            overview: model.desc,
                            logo: model.logo
                        },
                    })}>
                        <div className='flex  gap-2 mb-2'>
                            <img src={model.logo} width={30} height={30} alt={model.name} />
                            <h3 style={{ marginBottom: 0 }}>{model.name}</h3>
                        </div>

                        <p>{model.desc}</p>
                    </div>
                ))}
            </div>

            {showFilters && <FilterPanel setShowFilters={setShowFilters} />}

            {showAddModal && (
                <Dialog
                    open={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 0,
                            maxHeight: "90vh",
                        },
                    }}
                >
                    {/* Header */}
                    <DialogTitle sx={{ px: 3, py: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" fontWeight={600}>
                                Request Model
                            </Typography>
                            <IconButton onClick={() => setShowAddModal(false)}>
                                {/* <CloseIcon /> */}
                            </IconButton>
                        </Box>
                    </DialogTitle>

                    <Divider />

                    {/* Content */}
                    <DialogContent sx={{ px: 3, py: 3 }}>
                        <Typography variant="body2" color="text.secondary" mb={3}>
                            Can't see the right model in the catalog? Request it here! Just give us a name
                            and describe how you'd like to use it. We'll take it from there and keep you updated.
                        </Typography>

                        <Box display="flex" flexDirection="column" gap={3}>
                            {/* Model Name */}
                            <Box>
                                {/* <Typography variant="body2" fontWeight={500} mb={1}>
                                    Model Name
                                </Typography> */}
                                <TextField
                                    fullWidth
                                    placeholder="Model name e.g., GPT-4 Custom"
                                    value={newModel.name}
                                    onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
                                    sx={inputSx}
                                />
                            </Box>

                            {/* Inner Model Name */}
                            <Box>

                                <TextField
                                    fullWidth
                                    placeholder="Enter model reference code"
                                    value={newModel.internalName}
                                    onChange={(e) =>
                                        setNewModel({ ...newModel, internalName: e.target.value })
                                    }
                                    sx={inputSx}
                                />
                            </Box>


                            {/* Provider */}
                            <Box>


                                <TextField
                                    select
                                    fullWidth
                                    displayEmpty
                                    value={newModel.cost}
                                    onChange={(e) => setNewModel({ ...newModel, cost: e.target.value })}
                                    sx={{
                                        ...inputSx,
                                        "& .MuiSelect-select": {
                                            display: "flex",
                                            alignItems: "center",
                                            height: "44px !important",
                                        },
                                    }}

                                    slotProps={{
                                        select: {
                                            native: false, // Set to false for custom rendering
                                            displayEmpty: true,
                                            renderValue: (selected) => {
                                                if (!selected || selected === "") {
                                                    return <span style={{ color: '#999' }}>Select Model Providers</span>;
                                                }
                                                const provider = providers.find(p => p.id === selected);
                                                return provider ? provider.name : selected;
                                            },
                                        },
                                    }}
                                >

                                    <MenuItem value="">Select Providers</MenuItem>
                                    {providers.map(ind => (
                                        <MenuItem value={ind.id}>{ind.name}</MenuItem>
                                    ))}

                                </TextField>
                            </Box>

                            {/* Max Tokens */}
                            <Box>

                                <TextField
                                    fullWidth
                                    placeholder="Max Tokens Eg.32781"
                                    value={newModel.maxTokens}
                                    onChange={(e) =>
                                        setNewModel({ ...newModel, maxTokens: e.target.value })
                                    }
                                    sx={inputSx}
                                />
                            </Box>




                            <Box>
                                <TextField
                                    select
                                    fullWidth
                                    value={newModel.type}
                                    onChange={(e) =>
                                        setNewModel({
                                            ...newModel,
                                            type: e.target.value,
                                            url: "",
                                            apikey: "",
                                        })
                                    }
                                    sx={{
                                        ...inputSx,
                                        "& .MuiSelect-select": {
                                            display: "flex",
                                            alignItems: "center",
                                            height: "44px !important",
                                        },
                                    }}

                                    slotProps={{
                                        select: {
                                            native: false, // Set to false for custom rendering
                                            displayEmpty: true,
                                            renderValue: (selected) => {
                                                if (!selected || selected === "") {
                                                    return <span style={{ color: '#999' }}>Select Model type</span>;
                                                }
                                                const modelTypeSele = modelType.find(p => p.id === selected);
                                                return modelTypeSele ? modelTypeSele.name : selected;
                                            },
                                        },
                                    }}
                                >



                                    <MenuItem value="">Select Model Type</MenuItem>
                                    {modelType.map(ind => (
                                        <MenuItem value={ind.id}>{ind.name}</MenuItem>
                                    ))}

                                </TextField>

                            </Box>

                            {newModel.type && (
                                <>
                                    <Box>
                                        <TextField
                                            fullWidth
                                            placeholder="Enter API URL"
                                            value={newModel.url}
                                            onChange={(e) =>
                                                setNewModel({ ...newModel, url: e.target.value })
                                            }
                                            sx={inputSx}
                                        />
                                    </Box>

                                    <Box>
                                        <TextField
                                            fullWidth
                                            placeholder="Enter API Key"
                                            value={newModel.apikey}
                                            onChange={(e) =>
                                                setNewModel({ ...newModel, apikey: e.target.value })
                                            }
                                            sx={inputSx}
                                        />
                                    </Box>
                                </>
                            )}


                            <Box>
                                <input
                                    accept="image/*"
                                    type="file"
                                    id="logo-upload"
                                    style={{ display: 'none' }}
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="logo-upload">
                                    <Button
                                        variant="outlined"
                                        component="span"
                                        sx={{
                                            borderColor: '#ddd',
                                            color: '#666',
                                            textTransform: 'none',
                                            '&:hover': {
                                                borderColor: '#999',
                                                backgroundColor: '#f9f9f9'
                                            }
                                        }}
                                    >
                                        Upload Provider Logo
                                    </Button>
                                </label>
                                {newModel.logo && (
                                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <img
                                            src={newModel.logo}
                                            alt="Preview"
                                            style={{ width: 60, height: 60, borderRadius: 4, objectFit: 'contain' }}
                                        />
                                        <Typography variant="body2" color="text.secondary">
                                            Logo uploaded
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                        </Box>
                    </DialogContent>

                    <Divider />

                    {/* Footer */}
                    <DialogActions sx={{ px: 3, py: 2, mt: 2 }}>
                        <Box sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            gap: 3,
                            width: "100%"
                        }}>
                            <Typography
                                onClick={() => setShowAddModal(false)}
                                sx={{
                                    backgroundColor: "#f4f5f6",
                                    textTransform: "none",
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    padding: "6px 20px",
                                    color: " #2a1c2b",
                                    borderRadius: "4px",
                                    boxShadow: "none",

                                    "&:hover": {
                                        backgroundColor: "#b6b9b8ff",
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                Cancel
                            </Typography>

                            <Button
                                onClick={handleAddModel}
                                variant="contained"
                                sx={{
                                    backgroundColor: "#e0e0e0",
                                    textTransform: "none",
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    padding: "6px 20px",
                                    color: " #b1b1b1",
                                    borderRadius: "4px",
                                    boxShadow: "none",
                                    minWidth: "120px",
                                    "&:hover": {
                                        backgroundColor: "#b6b9b8ff",
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                Submit Request
                            </Button>
                        </Box>
                    </DialogActions>


                    {/* Footer with text links like the image */}

                </Dialog>

            )
            }
        </div >
    );

};

export default ModelCatalog;
