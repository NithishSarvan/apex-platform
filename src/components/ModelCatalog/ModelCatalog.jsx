
import FilterPanel from './FilterPanel';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { apiGet, apiPost } from '../../api/client';
import { apiPut } from '../../api/client';

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
    const queryClient = useQueryClient();

    const providerLogoByName = {
        OpenAI: gpt,
        Meta: meta,
        MBZUAI: mbzuai,
        Inception: inception,
        "Mistral AI": mistral,
        Anthropic: anthropicCalude,
        DeepSeek: deepseek,
        Qwen: qwen,
        Cohere: cohere,
        xAI: xai,
    };

    const [modelType, setModelType] = useState([
        { id: 'API', name: "API-Hosted" },
        { id: 'SELF', name: "Sefl-Hosted" },

    ]);
    const [search, setSearch] = useState("");
    const [selectedProviderId, setSelectedProviderId] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 20;

    const { data: providers = [] } = useQuery({
        queryKey: ["providers"],
        queryFn: async () => apiGet("/api/providers"),
    });

    const { data: modelsPage, isLoading: modelsLoading, error: modelsError } = useQuery({
        queryKey: ["models", { search, selectedProviderId, selectedType, page, pageSize }],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (search) params.set("q", search);
            if (selectedProviderId) params.set("providerId", selectedProviderId);
            if (selectedType) params.set("type", selectedType);
            params.set("page", String(page));
            params.set("pageSize", String(pageSize));
            return apiGet(`/api/models?${params.toString()}`);
        },
    });

    const models = modelsPage?.items || [];

    const [showAddModal, setShowAddModal] = useState(false);
    const [mode, setMode] = useState("create"); // create | edit
    const [editingModelId, setEditingModelId] = useState(null);
    const [actionsAnchor, setActionsAnchor] = useState(null);
    const [actionsModel, setActionsModel] = useState(null);

    const [newModel, setNewModel] = useState({
        name: '',
        internalName: '',
        providerId: "",
        type: "",
        url: "", // optional endpoint override (rare)
        status: "ACTIVE",
    });

    const createModel = useMutation({
        mutationFn: async () => {
            return apiPost("/api/models", {
                name: newModel.name,
                providerId: newModel.providerId || null,
                modelKey: newModel.internalName || null,
                type: newModel.type || "API",
                status: newModel.status || "ACTIVE",
                // recommended flow: base URL lives on Provider; model endpoint is an optional override
                endpointUrl: newModel.url || null,
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["models"] });
            setShowAddModal(false);
            setNewModel({ name: '', internalName: '', providerId: "", type: "", url: "", status: "ACTIVE" });
            setMode("create");
            setEditingModelId(null);
        }
    });

    const updateModel = useMutation({
        mutationFn: async () => {
            if (!editingModelId) throw new Error("Missing model id");
            return apiPut(`/api/models/${editingModelId}`, {
                name: newModel.name || null,
                providerId: newModel.providerId || null,
                modelKey: newModel.internalName || null,
                type: newModel.type || "API",
                status: newModel.status || "ACTIVE",
                endpointUrl: newModel.url || null,
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["models"] });
            setShowAddModal(false);
            setNewModel({ name: '', internalName: '', providerId: "", type: "", url: "", status: "ACTIVE" });
            setMode("create");
            setEditingModelId(null);
        }
    });

    const openActions = Boolean(actionsAnchor);
    const handleActionsOpen = (event, model) => {
        event.stopPropagation();
        setActionsAnchor(event.currentTarget);
        setActionsModel(model);
    };
    const handleActionsClose = () => {
        setActionsAnchor(null);
        setActionsModel(null);
    };

    const startCreate = () => {
        setMode("create");
        setEditingModelId(null);
        setNewModel({ name: '', internalName: '', providerId: "", type: "", url: "", status: "ACTIVE" });
        setShowAddModal(true);
    };

    const startEdit = (model) => {
        handleActionsClose();
        setMode("edit");
        setEditingModelId(model.id);
        setNewModel({
            name: model.name || '',
            internalName: model.modelKey || '',
            providerId: model.providerId || "",
            type: model.type || "API",
            url: model.endpointUrl || "",
            status: model.status || "ACTIVE",
        });
        setShowAddModal(true);
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
                    onClick={startCreate}>Request Model</button>
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
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />
            </div>

            {modelsLoading && <p className="text-gray-600">Loading models...</p>}
            {modelsError && <p className="text-red-600">Failed to load models: {modelsError.message}</p>}

            <div className="catalog-grid">
                {models.map((model) => (
                    <div key={model.id} className="model-card" onClick={() => navigate(`/model-details/${model.id}`)}>
                        <div className='flex gap-2 mb-2' style={{ alignItems: "center", justifyContent: "space-between" }}>
                            <div className='flex gap-2' style={{ alignItems: "center" }}>
                                <img src={model.providerLogoUrl || providerLogoByName[model.providerName] || gpt} width={30} height={30} alt={model.name} />
                                <h3 style={{ marginBottom: 0 }}>{model.name}</h3>
                            </div>
                            <IconButton
                                size="small"
                                onClick={(e) => handleActionsOpen(e, model)}
                                aria-label="model actions"
                            >
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        </div>

                        <p>{model.providerName ? `${model.providerName} • ${model.type}` : model.type}</p>
                    </div>
                ))}
            </div>

            <Menu
                anchorEl={actionsAnchor}
                open={openActions}
                onClose={handleActionsClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MenuItem onClick={() => actionsModel && startEdit(actionsModel)}>Edit</MenuItem>
            </Menu>

            {modelsPage && (
                <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-gray-600">
                        Showing {models.length} of {modelsPage.total}
                    </div>
                    <div className="flex gap-2">
                        <button className="btn btn-secondary btn-sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                            Prev
                        </button>
                        <button
                            className="btn btn-secondary btn-sm"
                            disabled={(page * pageSize) >= modelsPage.total}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

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
                                {mode === "edit" ? "Edit Model" : "Request Model"}
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
                                    value={newModel.providerId}
                                    onChange={(e) => setNewModel({ ...newModel, providerId: e.target.value })}
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
                                            native: false,
                                            displayEmpty: true,
                                            renderValue: (selected) => {
                                                if (!selected || selected === "") {
                                                    return <span style={{ color: '#999' }}>Select Model Provider</span>;
                                                }
                                                const provider = providers.find(p => p.id === selected);
                                                return provider ? provider.name : selected;
                                            },
                                        }
                                    }}
                                >

                                    <MenuItem value="">Select Provider</MenuItem>
                                    {providers.map(ind => (
                                        <MenuItem key={ind.id} value={ind.id}>{ind.name}</MenuItem>
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
                                        <MenuItem key={ind.id} value={ind.id}>{ind.name}</MenuItem>
                                    ))}

                                </TextField>

                            </Box>

                            {newModel.type && (
                                <>
                                    <Box>
                                        <TextField
                                            fullWidth
                                            placeholder="Endpoint override (optional) e.g., https://api.deepseek.com"
                                            value={newModel.url}
                                            onChange={(e) =>
                                                setNewModel({ ...newModel, url: e.target.value })
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
                                onClick={() => (mode === "edit" ? updateModel.mutate() : createModel.mutate())}
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
                                {mode === "edit"
                                    ? (updateModel.isPending ? "Saving..." : "Save")
                                    : (createModel.isPending ? "Submitting..." : "Submit Request")}
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
