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
          {/* ================= HEADER ================= */}
          {/* <Box
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
          
            <Box onClick={() => setAiModel(true)} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img src={gpt} alt="GPT" width={40} />
              <Typography variant="h6" fontWeight="bold">
                Realtime
              </Typography>
            </Box>


          </div>
        </Box> */}



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
                <img src={gpt} alt="GPT" width={40} />
                <Typography variant="h6" fontWeight="bold">
                  Realtime
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
            // sx={{
            //   flex: 1,
            //   display: "flex",
            //   flexDirection: "column",
            //   alignItems: "center",
            //   justifyContent: "center",
            //   gap: 2,
            // }}
            className="realtime-subscription"
          >
            <img src={dataset} />
            <Typography variant="h6" fontWeight="500">
              Subscription
            </Typography>
            <p style={{ width: "40%", fontSize: "14px", textAlign: "center", color: "gray", marginBottom: "10px", paddingBottom: '10px', paddingTop: '10px' }} >Please contact our support team to activate your subscription or get assistance, or click "Contact Us" below.</p>
            <button className="check-btn flex gap-2 items-center py-2"><LuHeadset />Contact Us</button>
          </Box>

          {/* ================= BOTTOM INPUT ================= */}
          <Box
            sx={{
              width: "800px",
              marginLeft: "auto",
              marginRight: "auto",

              position: 'absolute',
              zIndex: '9999',
              bottom: '5px',
              left: '50%',
              transform: 'translate(-50%, 0px)',
              // alignItems: "center",
              // justifyContent: "center"
            }}
          // className="realtime-input-box"

          >

            {/* <Typography sx={{ color: "#0a7b6aff", textAlign: "center", fontSize: "15px", margin: "20px 0px" }}>
            Subscribe now and start exploring the playground
          </Typography> */}


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


        {/* configuration */}

      </Box >
    </div >
  );
};

export default Realtime;
