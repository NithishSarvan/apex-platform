import React, { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  MenuItem,
  Grid,
  Divider,
  Menu
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiGet, apiPost, apiPut, apiDelete } from '../api/client';

// Import your assets
import gpt from "../assets/gpt-JRKBi7sz.svg";
import meta from "../assets/meta-svg.svg";
import mbzuai from "../assets/mbzuai.svg";
import inception from "../assets/inception.svg";
import mistral from "../assets/mistral.svg";
import stablediffusion from "../assets/stablediffusion.png";
import anthropicCalude from "../assets/anthropicCalude.svg";
import deepseek from "../assets/deepseek.svg";
import qwen from "../assets/qwen.svg";
import cohere from "../assets/cohere.svg";
import xai from "../assets/xai.svg";

const Providers = () => {
  const queryClient = useQueryClient();
  const { data: providers = [], isLoading, error } = useQuery({
    queryKey: ["providers"],
    queryFn: async () => apiGet("/api/providers"),
  });
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [editingProviderId, setEditingProviderId] = useState(null);
  const [actionsAnchor, setActionsAnchor] = useState(null);
  const [actionsProvider, setActionsProvider] = useState(null);

  const [newProvider, setNewProvider] = useState({
    name: '',
    description: '',
    modelCount: '',
    logo: null,
    apiKey: "",
    type: "DEEPSEEK",
    baseUrl: "https://api.deepseek.com",
  });

  const handleOpen = () => {
    setMode("create");
    setEditingProviderId(null);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setNewProvider({
      name: '',
      description: '',
      modelCount: 0,
      logo: null,
      apiKey: "",
      type: "DEEPSEEK",
      baseUrl: "https://api.deepseek.com",
    });
    setMode("create");
    setEditingProviderId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProvider(prev => {
      const next = {
        ...prev,
        [name]: name === 'modelCount' ? parseInt(value) || 0 : value
      };

      // Helpful defaults when user switches provider type
      if (name === "type") {
        const defaults = {
          DEEPSEEK: "https://api.deepseek.com",
          OPENAI: "https://api.openai.com",
          GROQ: "https://api.groq.com",
          OPENAI_COMPAT: "",
          GEMINI: "https://generativelanguage.googleapis.com",
          MOCK: "",
        };
        const current = (prev.baseUrl || "").trim();
        const wasDefaultish =
          current === "" ||
          current.includes("deepseek.com") ||
          current.includes("openai.com") ||
          current.includes("groq.com") ||
          current.includes("generativelanguage.googleapis.com");
        if (wasDefaultish) {
          next.baseUrl = defaults[value] ?? next.baseUrl;
        }
      }
      return next;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProvider((prev) => ({
          ...prev,
          logo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const createProvider = useMutation({
    mutationFn: async () => {
      return apiPost("/api/providers", {
        name: newProvider.name,
        description: newProvider.description,
        modelCount: Number(newProvider.modelCount) || 0,
        logoUrl: newProvider.logo,
        apiKey: newProvider.apiKey,
        type: newProvider.type || null,
        baseUrl: newProvider.baseUrl || null,
        status: "ACTIVE",
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["providers"] });
      handleClose();
    },
  });

  const updateProvider = useMutation({
    mutationFn: async () => {
      if (!editingProviderId) throw new Error("Missing provider id");
      return apiPut(`/api/providers/${editingProviderId}`, {
        name: newProvider.name || null,
        description: newProvider.description ?? null,
        modelCount: Number(newProvider.modelCount) || 0,
        logoUrl: newProvider.logo,
        apiKey: newProvider.apiKey, // if present, updates provider secret
        type: newProvider.type || null,
        baseUrl: newProvider.baseUrl || null,
        status: "ACTIVE",
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["providers"] });
      handleClose();
    },
  });

  const testProvider = useMutation({
    mutationFn: async (providerId) => apiPost(`/api/providers/${providerId}/test`, {}),
  });

  const deleteProvider = useMutation({
    mutationFn: async (providerId) => apiDelete(`/api/providers/${providerId}`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["providers"] });
    }
  });

  const handleSubmit = () => {
    if (mode === "edit") updateProvider.mutate();
    else createProvider.mutate();
  };

  const openActions = Boolean(actionsAnchor);
  const handleActionsOpen = (event, provider) => {
    setActionsAnchor(event.currentTarget);
    setActionsProvider(provider);
  };
  const handleActionsClose = () => {
    setActionsAnchor(null);
    setActionsProvider(null);
  };

  const startEdit = (provider) => {
    handleActionsClose();
    setMode("edit");
    setEditingProviderId(provider.id);
    setNewProvider({
      name: provider.name || '',
      description: provider.description || '',
      modelCount: provider.modelCount || 0,
      logo: provider.logoUrl || null,
      apiKey: "", // do not prefill secret
      type: provider.type || "DEEPSEEK",
      baseUrl: provider.baseUrl || "https://api.deepseek.com",
    });
    setOpen(true);
  };

  const renderProviderRow = (provider) => (

    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5, justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <img src={provider.logoUrl || provider.logo} width={60} height={60} alt={provider.name} />
          <h5 className='font-semibold text-xl'>{provider.name}</h5>
        </Box>

        <IconButton size="small" onClick={(e) => handleActionsOpen(e, provider)}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>
      <p className='text-sm'>
        {provider.description} | {provider.modelCount} Model{provider.modelCount !== 1 ? 's' : ''}
        {provider.type ? ` | ${provider.type}` : ''}
        {provider.baseUrl ? ` | ${provider.baseUrl}` : ''}
        {provider.hasSecret ? ' | key: saved' : ' | key: missing'}
      </p>
    </Box>

  );

  const groupedProviders = useMemo(() => {
    const grouped = [];
    for (let i = 0; i < providers.length; i += 2) {
      grouped.push(providers.slice(i, i + 2));
    }
    return grouped;
  }, [providers]);

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

  const inputTextAreaSx = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#f4f5f6",
      borderRadius: "0px",
      "& fieldset": {
        border: "none",
      },
      "&:hover fieldset": {
        border: "none",
      },
      "&.Mui-focused fieldset": {
        border: "none",
        outline: "none",
      },
      // Remove fixed height for multiline
      "&.Mui-focused": {
        outline: "none",
        boxShadow: "none",
      },
    },
    "& .MuiInputBase-input": {
      fontSize: "14px",
      color: "#000000",
      padding: "0",
      // Better line height for multiline
      // lineHeight: "1.5",
    },
    // Remove outline on focus for the entire component
    "& .Mui-focused": {
      outline: "none",
    },
  };

  return (
    <div className="main-content">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl my-2 font-bold text-black-500">
            {" "}
            Leading Providers in the AI Industry
          </h1>
          <button className="request-model-btn" onClick={handleOpen}>
            Add New Provider
          </button>
        </div>
        <p className="text-gray-600">
          Choose from the industry's leading LLM providers to harness the full
          potential of AI tailored to your business needs. Our curated selection
          ensures access to the most advanced, reliable, scalable language
          models driving real-world results.
        </p>
      </div>

      {isLoading && <p className="text-gray-600">Loading providers...</p>}
      {error && <p className="text-red-600">Failed to load providers: {error.message}</p>}

      <TableContainer sx={{ maxWidth: "100%", margin: 'auto', mt: 4 }}>
        <Table sx={{
          border: '1px solid #ccc',             // outer border
          '& th, & td': { border: '2px solid #ccc' }  // inner borders
        }}>
          <TableBody>
            {groupedProviders.map((row, index) => (
              <TableRow key={index}>
                {row.map(provider => (
                  <TableCell key={provider.id} >
                    {renderProviderRow(provider)}
                  </TableCell>
                ))}
                {/* If odd number of providers, add empty cell */}
                {row.length === 1 && (
                  <TableCell sx={{ width: '50%' }}></TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Actions menu per provider */}
      <Menu
        anchorEl={actionsAnchor}
        open={openActions}
        onClose={handleActionsClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={() => actionsProvider && startEdit(actionsProvider)}>Edit</MenuItem>
        <MenuItem
          onClick={async () => {
            if (!actionsProvider) return;
            handleActionsClose();
            try {
              const res = await testProvider.mutateAsync(actionsProvider.id);
              alert(res?.message || "Provider test completed");
            } catch (e) {
              alert(e?.message || "Provider test failed");
            }
          }}
        >
          Test connection
        </MenuItem>
        <MenuItem
          onClick={async () => {
            if (!actionsProvider) return;
            handleActionsClose();
            const ok = window.confirm(`Delete provider "${actionsProvider.name}"?`);
            if (!ok) return;
            try {
              await deleteProvider.mutateAsync(actionsProvider.id);
            } catch (e) {
              alert(e?.message || "Delete failed");
            }
          }}
          sx={{ color: "#c62828" }}
        >
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={open}
        onClose={handleClose}
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
              {mode === "edit" ? "Edit Provider" : "Add New Provider"}
            </Typography>
            <IconButton onClick={handleClose} sx={{ p: 0 }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <Divider />

        {/* Content */}
        <DialogContent sx={{ px: 3, py: 3 }}>
          <Box display="flex" flexDirection="column" gap={3}>
            {/* Provider Name */}
            <Box>
              <TextField
                fullWidth
                placeholder="Provider Name e.g., New AI Company"
                value={newProvider.name}
                name="name"
                onChange={handleInputChange}
                sx={inputSx}
              />
            </Box>

            {/* Number of Models */}
            <Box>

              <TextField
                fullWidth
                placeholder="Number of available models"
                value={newProvider.modelCount}
                name="modelCount"
                onChange={handleInputChange}
                sx={inputSx}
              />
            </Box>

            {/* Provider Type */}
            <Box>
              <TextField
                select
                fullWidth
                value={newProvider.type}
                name="type"
                onChange={handleInputChange}
                sx={inputSx}
              >
                <MenuItem value="DEEPSEEK">DeepSeek (OpenAI-compatible)</MenuItem>
                <MenuItem value="OPENAI">OpenAI</MenuItem>
                <MenuItem value="GEMINI">Gemini (Google)</MenuItem>
                <MenuItem value="GROQ">Groq (OpenAI-compatible)</MenuItem>
                <MenuItem value="OPENAI_COMPAT">OpenAI Compatible (generic)</MenuItem>
                <MenuItem value="MOCK">Mock (local)</MenuItem>
              </TextField>
            </Box>

            {/* Base URL */}
            <Box>
              <TextField
                fullWidth
                placeholder="Base URL e.g., https://api.deepseek.com"
                value={newProvider.baseUrl}
                name="baseUrl"
                onChange={handleInputChange}
                sx={inputSx}
              />
            </Box>

            {/* Description */}
            <Box>

              <TextField
                fullWidth
                placeholder="Enter provider description"
                value={newProvider.description}
                name="description"
                onChange={handleInputChange}
                multiline
                minRows={4}
                maxRows={10}
                sx={inputTextAreaSx}
              />
            </Box>

            {/* API Key (stored encrypted; never returned) */}
            <Box>
              <TextField
                fullWidth
                placeholder={mode === "edit" ? "New API Key (optional, updates secret)" : "Provider API Key (stored encrypted)"}
                value={newProvider.apiKey}
                name="apiKey"
                onChange={handleInputChange}
                sx={inputSx}
                type="password"
              />
            </Box>

            {/* Logo Upload */}
            <Box>
              <input
                accept="image/*"
                type="file"
                id="logo-upload"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <label htmlFor="logo-upload">
                <Button
                  variant="outlined"
                  component="span"
                  sx={{
                    borderColor: "#ddd",
                    color: "#666",
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#999",
                      backgroundColor: "#f9f9f9",
                    },
                  }}
                >
                  Upload Provider Logo
                </Button>
              </label>
              {newProvider.logo && (
                <Box
                  sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}
                >
                  <img
                    src={newProvider.logo}
                    alt="Preview"
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 4,
                      objectFit: "contain",
                    }}
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 3,
              width: "100%",
            }}
          >
            <Typography
              onClick={handleClose}
              sx={{
                backgroundColor: "#f4f5f6",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "14px",
                padding: "6px 20px",
                color: "#2a1c2b",
                borderRadius: "4px",
                boxShadow: "none",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#b6b9b8ff",
                  boxShadow: "none",
                },
              }}
            >
              Cancel
            </Typography>

            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={!newProvider.name || !newProvider.description || createProvider.isPending || updateProvider.isPending}
              sx={{
                backgroundColor: !newProvider.name || !newProvider.description ? "#e0e0e0" : "#41dabbff",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "14px",
                padding: "6px 20px",
                color: !newProvider.name || !newProvider.description ? "#b1b1b1" : "#ffffff",
                borderRadius: "4px",
                boxShadow: "none",
                minWidth: "120px",
                "&:hover": {
                  backgroundColor: !newProvider.name || !newProvider.description ? "#e0e0e0" : "#41dabbff",
                  boxShadow: "none",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#e0e0e0",
                  color: "#b1b1b1",
                },
              }}
            >
              {mode === "edit"
                ? (updateProvider.isPending ? "Saving..." : "Save")
                : (createProvider.isPending ? "Adding..." : "Add Provider")}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Providers;
