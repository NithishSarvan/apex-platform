import { Box, Button, Typography, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Divider, IconButton, Slider, Menu, MenuItem } from "@mui/material";
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
import React, { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";


const gradientText = {
  background: "linear-gradient(to right, #11a77cb9, #0072ff)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const Chat = () => {

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
  const [aiModel, setAiModel] = useState(false)
  const [showKey, setShowKey] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };



  return (

    <div className='main-content-chat'>
      <Box
        sx={{
          height: "90vh",
          margin: 2,
          display: "flex",

          flexDirection: "column",
        }}
      >
        {/* ================= HEADER ================= */}
        <Box
          sx={{
            px: 3,
            py: 2,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }} >
            {/* Left */}
            <Box onClick={() => setAiModel(true)} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img src={gpt} alt="GPT" width={40} />
              <Typography variant="h6" fontWeight="bold">
                GPT-4o <span style={{ color: "#8a8a8a" }}>(Default)</span>
              </Typography>
              <span style={{ color: "#00c853", fontSize: "12px" }}>▼</span>
            </Box>

            {/* Right */}
            <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
              <Typography sx={{ color: "#8a8a8a", display: "flex", gap: 1, alignItems: "center" }}>
                <PiPaintBrushHouseholdLight /> Clear
              </Typography>
              <Typography sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <VscGitCompare /> Compare mode
              </Typography>
              <Typography onClick={handleMenuClick} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <FaBarsProgress /> Configuration
              </Typography>
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                disableAutoFocusItem
                MenuListProps={{
                  onClick: (e) => e.stopPropagation(), // ⛔ stop auto close
                }}
                PaperProps={{
                  sx: {
                    width: 450,
                    px: 4,
                    py: 3,
                    borderRadius: 2,
                    boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
                  },
                }}
              >
                {/* API KEY */}
                <Box sx={{ mb: 3 }}>
                  {/* <Typography fontSize={13} mb={1}>
                  API Key
                </Typography> */}

                  <TextField
                    fullWidth
                    size="small"
                    sx={{
                      backgroundColor: "#f4f5f6",
                      borderRadius: 1,
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          border: "none",
                        },
                        "&:hover fieldset": {
                          border: "none",
                        },
                        "&.Mui-focused fieldset": {
                          border: "none",
                        },
                      },
                    }}
                    placeholder="Enter API Key"
                    type={showKey ? "text" : "password"}
                    InputProps={{
                      endAdornment: (
                        <IconButton onClick={() => setShowKey(!showKey)}>
                          {showKey ? <MdVisibilityOff /> : <MdVisibility />}
                        </IconButton>
                      ),
                    }}
                  />
                </Box>

                {/* Temperature */}
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography fontSize={14}>Temperature</Typography>
                    <Typography fontSize={14}>1</Typography>
                  </Box>
                  <Slider
                    defaultValue={1}
                    min={0}
                    max={2}
                    step={0.1}
                    sx={{ color: "#0a7b6a" }}
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
                    sx={{ color: "#0a7b6a" }}
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
                    sx={{ color: "#0a7b6a" }}
                  />
                </Box>

                <Typography fontSize={12} color="gray">
                  Note: Token usage includes both input and output. Very low token limits may prevent the model from generating a response.              </Typography>

                {/* Footer buttons */}

              </Menu>

            </Box>
          </div>
        </Box>

        {/* ================= CENTER ================= */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Typography variant="h4" fontWeight="bold" sx={gradientText}>
            What can I help with?
          </Typography>


        </Box>

        {/* ================= BOTTOM INPUT ================= */}
        <Box
          sx={{
            width: "800px",
            marginLeft: "auto",
            marginRight: "auto"
          }}

        >

          <Typography sx={{ color: "#0a7b6aff", textAlign: "center", fontSize: "15px", margin: "20px 0px" }}>
            Subscribe now and start exploring the playground
          </Typography>
          <Box
            sx={{
              px: 3,
              py: 1,
              backgroundColor: "#f5f5f5",

            }}
          >

            <Box sx={{ display: "flex", gap: 1, justifyContent: "center", alignItems: "center" }}>

              <CiCirclePlus style={{ color: "#cacdd2" }} size={50} />
              <TextField
                fullWidth
                placeholder="Ask anything"
                variant="outlined"
              />
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
                <IoMdPlay size={30} style={{ marginRight: "6px" }} />
                Run
              </Button>

            </Box>
          </Box>
        </Box>

        <Dialog
          open={aiModel}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              overflow: "hidden",
            },
          }}
        >
          {/* Header */}
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold">Select Model</Typography>
          </DialogTitle>

          <Divider />

          {/* Body */}
          <Box sx={{ display: "flex", height: "250px" }}>

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
            <Button variant="contained" disabled>
              Apply
            </Button>
          </DialogActions>
        </Dialog>



      </Box>
    </div>
  );
};

export default Chat;
