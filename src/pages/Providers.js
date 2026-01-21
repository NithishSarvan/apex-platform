import React, { useState } from "react";
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
  Menu,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

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

const initialProviders = [
  { id: 1, name: "OpenAI", description: "OpenAI", modelCount: 26, logo: gpt },
  { id: 2, name: "Meta", description: "Meta", modelCount: 3, logo: meta },
  { id: 3, name: "MBZUAI", description: "MBZUAI", modelCount: 2, logo: mbzuai },
  {
    id: 4,
    name: "Inception",
    description: "Inception",
    modelCount: 1,
    logo: inception,
  },
  {
    id: 5,
    name: "Mistral AI",
    description: "mistral",
    modelCount: 3,
    logo: mistral,
  },
  {
    id: 6,
    name: "Stability AI",
    description: "Stability AI",
    modelCount: 1,
    logo: stablediffusion,
  },
  {
    id: 7,
    name: "Anthropic",
    description: "Anthropic",
    modelCount: 1,
    logo: anthropicCalude,
  },
  {
    id: 8,
    name: "DeepSeek",
    description: "DeepSeek",
    modelCount: 1,
    logo: deepseek,
  },
  { id: 9, name: "Qwen", description: "Qwen", modelCount: 3, logo: qwen },
  {
    id: 10,
    name: "Cohere",
    description: "Cohere",
    modelCount: 4,
    logo: cohere,
  },
  { id: 11, name: "xAI", description: "xAI", modelCount: 1, logo: xai },
];

const Providers = () => {
  const [providers, setProviders] = useState(initialProviders);
  const [open, setOpen] = useState(false);
  const [newProvider, setNewProvider] = useState({
    name: "",
    description: "",
    modelCount: "",
    logo: null,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewProvider({ name: "", description: "", modelCount: 0, logo: null });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProvider((prev) => ({
      ...prev,
      [name]: name === "modelCount" ? parseInt(value) || 0 : value,
    }));
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

  const handleSubmit = () => {
    if (newProvider.name && newProvider.description) {
      const newProviderWithId = {
        ...newProvider,
        id: providers.length + 1,
      };
      setProviders((prev) => [...prev, newProviderWithId]);
      handleClose();
    }
  };

  const renderProviderRow = (provider) => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }}>
        <img src={provider.logo} width={60} height={60} alt={provider.name} />
        <h5 className="font-semibold text-xl">{provider.name}</h5>
      </Box>
      <p className="text-sm">
        {provider.description} | {provider.modelCount} Model
        {provider.modelCount !== 1 ? "s" : ""}
      </p>
    </Box>
  );

  // Group providers into pairs for table layout
  const groupedProviders = [];
  for (let i = 0; i < providers.length; i += 2) {
    groupedProviders.push(providers.slice(i, i + 2));
  }

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

      {/* <TableContainer sx={{ maxWidth: "100%", margin: "auto", mt: 4 }}>
        <Table
          sx={{
            border: "1px solid #ccc", 
            "& th, & td": { border: "2px solid #ccc" }, 
          }}
        >
          <TableBody>
            {groupedProviders.map((row, index) => (
              <TableRow key={index}>
                {row.map((provider) => (
                  <TableCell key={provider.id}>
                    {renderProviderRow(provider)}
                  </TableCell>
                ))}
                
                {row.length === 1 && (
                  <TableCell sx={{ width: "50%" }}></TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 0,
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {providers.map((provider) => (
          <Box
            key={provider.id}
            sx={{
              flex: { xs: "100%", sm: "calc(50% - 16px)" },
              border: "1px solid #ccc",
              p: 2,
              boxSizing: "border-box",
            }}
          >
            {renderProviderRow(provider)}
          </Box>
        ))}
      </Box>
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
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight={600}>
              Add New Provider
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
              disabled={!newProvider.name || !newProvider.description}
              sx={{
                backgroundColor:
                  !newProvider.name || !newProvider.description
                    ? "#e0e0e0"
                    : "#41dabbff",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "14px",
                padding: "6px 20px",
                color:
                  !newProvider.name || !newProvider.description
                    ? "#b1b1b1"
                    : "#ffffff",
                borderRadius: "4px",
                boxShadow: "none",
                minWidth: "120px",
                "&:hover": {
                  backgroundColor:
                    !newProvider.name || !newProvider.description
                      ? "#e0e0e0"
                      : "#41dabbff",
                  boxShadow: "none",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#e0e0e0",
                  color: "#b1b1b1",
                },
              }}
            >
              Add Provider
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Providers;
