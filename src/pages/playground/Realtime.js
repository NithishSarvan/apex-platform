import { Box, Button, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Divider, IconButton, Slider, Menu, MenuItem, Drawer, FormControl, InputLabel, Select, TextareaAutosize } from "@mui/material";
import { PiFloppyDiskBackLight, PiPaintBrushHouseholdLight } from "react-icons/pi";
import { VscGitCompare } from "react-icons/vsc";
import { FaBarsProgress } from "react-icons/fa6";
import { IoMdArrowDropup, IoMdPlay } from "react-icons/io";
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
import dataset from "../../assets/dataset.svg"
import React, { useState } from "react";
import { MdKeyboardArrowUp, MdMic, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { LuHeadset } from "react-icons/lu";


const gradientText = {
  background: "linear-gradient(to right, #11a77cb9, #0072ff)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const Realtime = () => {


  const [providers, setProviders] = useState([
    {
      name: 'OpenAI',
      logo: gpt,
      description: 'Advanced AI models including GPT-4'
    },
    {
      name: 'Anthropic',
      logo: anthropicCalude,
      description: 'Claude series models'
    },
    {
      name: 'Google',
      logo: xai,
      description: 'Gemini and PaLM models'
    },
    {
      name: 'Meta',
      logo: meta,
      description: 'Llama series models'
    },
    {
      name: 'Microsoft',
      logo: cohere,
      description: 'Azure AI models'
    },
    {
      name: 'Amazon',
      logo: deepseek,
      description: 'Bedrock models'
    }
  ]);


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



  const [aiModel, setAiModel] = useState(false)
  const [showKey, setShowKey] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (state) => () => {
    setOpen(state);
  };


  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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

  const [activeTab, setActiveTab] = useState('trained'); // 'trained' or 'standard'
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedModelName, setSelectedModelName] = useState('Gpt-5');
  const [selectedModelLogo, setSelectedModelLogo] = useState(gpt);

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setSelectedProvider(null); // Clear provider selection
  };

  const handleProviderSelect = (provider) => {
    setSelectedProvider(provider);
    setSelectedModel(null); // Clear model selection
  };

  const handleApplySelection = () => {
    if (selectedModel) {
      console.log("Selected Model:", selectedModel);
      setSelectedModelName(selectedModel.name);
      setSelectedModelLogo(selectedModel.logo);
    } else if (selectedProvider) {
      console.log("Selected Provider:", selectedProvider);
      setSelectedModelName(selectedProvider.name);
      setSelectedModelLogo(selectedProvider.logo);
    }
    setAiModel(false);
  };


  return (
    <div className='main-content main-content-chat'>

      <Box sx={{ display: "flex", width: "100%" }} >

        <Box
          sx={{
            height: "100%",
            // margin: 2,
            display: "flex",
            width: "100%",
            flexDirection: "column",
          }}
        >

          <Box
            className="realtime-header"
          >
            {/* LEFT SIDE – Realtime */}
            <Box
              sx={{
                flex: 1,
                px: 3,
                py: 2,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                onClick={() => setAiModel(true)}
                sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer" }}
              >
                <img src={selectedModelLogo} alt="GPT" width={40} />
                <Typography variant="h6" fontWeight="bold">
                  {selectedModelName}
                </Typography>
              </Box>
            </Box>

            {/* RIGHT SIDE – Configuration */}
            <Box sx={{ display: "flex", alignItems: "center", pr: 2 }}>
              <Typography
                onClick={toggleDrawer(true)}
                sx={{
                  display: open ? "none" : "flex",
                  gap: 1,
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <FaBarsProgress /> Configuration
              </Typography>
            </Box>
          </Box>


          {/* Configuration Panel - Positioned absolutely over the content */}
          <Box
            sx={{
              position: "fixed",
              right: 0,
              top: 64, // Height of the header
              bottom: 0,
              width: "380px",
              borderLeft: "solid 1px #b7b7b7ff",
              backgroundColor: "#fff",
              px: 2,
              overflowY: "auto",
              display: open ? "block" : "none",
              zIndex: 1001, // CHANGED FROM 999 TO 1001
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                pt: 2,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{ display: "flex", gap: 1, alignItems: "center" }}
              >
                Configuration
              </Typography>

              <Button
                onClick={toggleDrawer(false)}
                sx={{
                  color: "#000",
                  fontWeight: 600,
                  minWidth: "auto",
                  padding: 1,
                }}
              >
                <PiFloppyDiskBackLight size={20} />
              </Button>
            </Box>

            {/* API Key */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="API Key"
                type={showKey ? "text" : "password"}
                sx={grayInputSx}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowKey(!showKey)}>
                      {showKey ? <MdVisibilityOff /> : <MdVisibility />}
                    </IconButton>
                  ),
                }}
              />
            </Box>

            {/* Select */}
            <Box sx={{ mb: 3, backgroundColor: "#f4f5f6", py: 1 }}>
              <FormControl fullWidth size="small" sx={{ backgroundColor: "#f4f5f6" }} >
                <InputLabel id="age-label">Model ID</InputLabel>
                <Select
                  labelId="age-label"
                  label="Age"
                  sx={grayInputSx}
                >
                  <MenuItem value={10}>gpt-4o-realtime-preview-2024-12-17</MenuItem>
                  {/* <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem> */}
                </Select>
              </FormControl>
            </Box>

            {/* Textarea */}
            <Box sx={{ mb: 3 }}>
              <Typography fontSize={14}>Realtime Settings</Typography>

              <TextareaAutosize
                minRows={3}
                placeholder="System Instructions"
                style={{
                  width: "100%",
                  backgroundColor: "#f4f5f6",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px",
                  fontFamily: "inherit",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </Box>
            {/* Select */}
            <Box sx={{ mb: 3, backgroundColor: "#f4f5f6", py: 1 }}>
              <FormControl fullWidth size="small" sx={{ backgroundColor: "#f4f5f6" }} >
                <InputLabel id="age-label">Voice</InputLabel>
                <Select
                  labelId="age-label"
                  label="Age"
                  sx={grayInputSx}
                >
                  <MenuItem value={10}>Alloy</MenuItem>
                  <MenuItem value={10}>Ash</MenuItem>
                  <MenuItem value={10}>Ballad</MenuItem>
                  <MenuItem value={10}>Coral</MenuItem>
                  <MenuItem value={10}>Echo</MenuItem>
                  <MenuItem value={10}>Sage</MenuItem>
                  <MenuItem value={10}>Shimmer</MenuItem>
                  <MenuItem value={10}>Verse</MenuItem>
                  {/* <MenuItem value={20}>Twenty</MenuItem>
                  <MenuItem value={30}>Thirty</MenuItem> */}
                </Select>
              </FormControl>
            </Box>
            {/* Temperature */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontSize={14}>Temperature</Typography>
                <Typography fontSize={14}>1</Typography>
              </Box>
              <Slider
                defaultValue={1}
                min={0}
                max={2}
                step={0.1}
                sx={{
                  color: "#0a7b6a",
                  "& .MuiSlider-rail": { opacity: 0.3 },
                }}
              />
            </Box>

            {/* Top P */}
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontSize={14}>Top P</Typography>
                <Typography fontSize={14}>1</Typography>
              </Box>
              <Slider
                defaultValue={1}
                min={0}
                max={1}
                step={0.05}
                sx={{
                  color: "#0a7b6a",
                  "& .MuiSlider-rail": { opacity: 0.3 },
                }}
              />
            </Box>

            {/* Max Tokens */}
            <Box sx={{ mb: 1 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontSize={14}>Max tokens</Typography>
                <Typography fontSize={14}>16384</Typography>
              </Box>
              <Slider
                defaultValue={16384}
                min={256}
                max={32768}
                step={256}
                sx={{
                  color: "#0a7b6a",
                  "& .MuiSlider-rail": { opacity: 0.3 },
                }}
              />
            </Box>

            {/* Note */}
            <Typography fontSize={12} color="gray">
              Note: Token usage includes both input and output. Very low token limits
              may prevent the model from generating a response.
            </Typography>
          </Box>


          {/* ================= CENTER ================= */}
          <Box

            className="realtime-subscription"
          >

          </Box>


          <Box
            sx={{
              width: "800px",
              marginLeft: "auto",
              marginRight: "auto",
              position: 'fixed', // Changed from absolute to fixed
              zIndex: 1000, // Reduced from 9999 to 1000 (less than dialog's default 1300)
              bottom: '20px', // Adjusted from 5px
              left: '60%',
              transform: 'translateX(-50%)',
              backgroundColor: '#fff', // Added background to ensure visibility
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', // Optional shadow
              borderRadius: '12px', // Optional rounded corners
              border: '1px solid #d0ccccff',

            }}

          >




            <Box
              sx={{
                px: 3,
                py: 1.3,
                backgroundColor: "#fff",
                border: "1px solid #d0ccccff",


              }}
            >

              <Box sx={{ width: "100%" }}>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    px: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    disabled
                    sx={{
                      color: "#fefdfdff",
                      backgroundColor: "#f8e6f8ff",
                      boxShadow: "none",
                      textTransform: "none",
                    }}
                  >
                    <IoMdPlay size={18} style={{ marginRight: "6px", color: "#ffffff" }} />
                    Start Session
                  </Button>
                  {/* Mic Button */}


                  {/* Text Input */}
                  <TextField
                    placeholder=""
                    variant="outlined"
                    size="small"
                    sx={{
                      flex: 1, // ✅ auto-adjusts width
                      backgroundColor: "transparent",
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  />

                  <IconButton color="#d0ccccff">
                    <MdMic color="#d0ccccff" size={22} />
                  </IconButton>
                  <Typography color="#d0ccccff" >Enable access</Typography>
                  {/* Send Button */}
                  <IconButton
                    sx={{
                      color: "#d0ccccff",

                    }}
                  >
                    <IoMdArrowDropup color="#d0ccccff" size={18} />
                  </IconButton>
                </Box>
              </Box>


            </Box>
          </Box>

        </Box>


        <Dialog
          open={aiModel}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              overflow: "hidden",
              borderRadius: 3,
              maxHeight: "90vh", // Limit overall dialog height
              display: "flex",
              flexDirection: "column",
            },
          }}
        >
          {/* Header */}
          <DialogTitle sx={{ pb: 1, flexShrink: 0 }}>
            <Typography variant="h6" fontWeight="bold">Select Model</Typography>
          </DialogTitle>

          <Divider />

          {/* Body - This will take available space and scroll if needed */}
          <Box sx={{
            display: "flex",
            flex: 1,
            minHeight: 0, // Important for flex children to scroll
            overflow: "hidden"
          }}>
            {/* Left Sidebar */}
            <Box className="chat-pop-left" sx={{
              width: "220px",
              flexShrink: 0,

              overflowY: "auto" // Add scroll if content overflows
            }}>
              {[
                { step: "01", label: "Trained Models", id: "trained", active: activeTab === 'trained' },
                { step: "02", label: "Standard Models", id: "standard", active: activeTab === 'standard' },
              ].map((item) => (
                <Box
                  key={item.step}
                  onClick={() => setActiveTab(item.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    cursor: "pointer",
                    color: item.active ? "#00bfa5" : "#666",
                    fontWeight: item.active ? "bold" : "normal",
                  }}
                >
                  <Typography sx={{ width: 30, fontWeight: "bold" }}>
                    {item.step}
                  </Typography>
                  <Typography fontWeight="bold">{item.label}</Typography>
                </Box>
              ))}
            </Box>

            {/* Right Content Area */}
            <Box
              sx={{
                flex: 1,
                p: 3,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Trained Models Section */}
              {activeTab === 'trained' && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    Select from Trained Models
                  </Typography>
                  <Box sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: 2
                  }}>
                    {models.map((model) => (
                      <Box
                        key={model.id}
                        onClick={() => handleModelSelect(model)}
                        sx={{
                          border: selectedModel?.id === model.id ? "2px solid #00d4aa" : "1px solid #e0e0e0",
                          borderRadius: 2,
                          p: 2.5,
                          cursor: "pointer",
                          backgroundColor: selectedModel?.id === model.id ? "rgba(0, 212, 170, 0.05)" : "white",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                            transform: "translateY(-2px)",
                          },
                          position: "relative",
                        }}
                      >
                        {/* Selection Indicator */}
                        {selectedModel?.id === model.id && (
                          <Box sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            backgroundColor: "#00d4aa",
                            color: "white",
                            borderRadius: "50%",
                            width: 20,
                            height: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                          }}>
                            ✓
                          </Box>
                        )}

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
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: "13px" }}>
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
              )}

              {/* Standard Models Section */}
              {activeTab === 'standard' && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    Select from Standard Models
                  </Typography>
                  <Box sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: 2
                  }}>
                    {providers.map((provider) => (
                      <Box
                        key={provider.name}
                        onClick={() => handleProviderSelect(provider)}
                        sx={{
                          border: selectedProvider?.name === provider.name ? "2px solid #00d4aa" : "1px solid #e0e0e0",
                          borderRadius: 2,
                          p: 3,
                          cursor: "pointer",
                          backgroundColor: selectedProvider?.name === provider.name ? "rgba(0, 212, 170, 0.05)" : "white",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                            transform: "translateY(-2px)",
                          },
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          position: "relative",
                          minHeight: "140px",
                        }}
                      >
                        {/* Selection Indicator */}
                        {selectedProvider?.name === provider.name && (
                          <Box sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            backgroundColor: "#00d4aa",
                            color: "white",
                            borderRadius: "50%",
                            width: 20,
                            height: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                          }}>
                            ✓
                          </Box>
                        )}

                        <img
                          src={provider.logo}
                          alt={provider.name}
                          style={{ width: 60, height: 60, objectFit: "contain", marginBottom: 12 }}
                        />
                        <Typography fontWeight="bold" fontSize="18px">
                          {provider.name}
                        </Typography>
                        {provider.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: "13px" }}>
                            {provider.description}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          {/* Footer - Fixed at bottom */}
          <Box sx={{
            flexShrink: 0, // Prevent footer from shrinking
            borderTop: 1,
            borderColor: "divider",
            backgroundColor: "#fafafa",
            p: 2,
          }}>
            <Box sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              px: 1,
            }}>
              <Button
                variant="outlined"
                onClick={() => {
                  setAiModel(false);
                  setSelectedModel(null);
                  setSelectedProvider(null);
                }}
                sx={{
                  borderColor: "#e0e0e0",
                  color: "#666",
                  minWidth: "100px",
                  "&:hover": {
                    borderColor: "#00d4aa",
                    backgroundColor: "rgba(0, 212, 170, 0.05)",
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disabled={!selectedModel && !selectedProvider}
                sx={{
                  backgroundColor: "#00d4aa",
                  minWidth: "100px",
                  "&:hover": {
                    backgroundColor: "#00b894",
                  },
                  "&.Mui-disabled": {
                    backgroundColor: "#e0e0e0",
                    color: "#a6a6ae",
                  }
                }}
                onClick={handleApplySelection}
              >
                Apply
              </Button>
            </Box>
          </Box>
        </Dialog>

      </Box >

    </div >
  );
};

export default Realtime;
