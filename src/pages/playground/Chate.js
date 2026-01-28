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
import { MdChevronLeft, MdChevronRight, MdDeleteOutline, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiDelete, apiGet, apiPost } from "../../api/client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const LAST_CHAT_ID_KEY = "apex_last_chat_id";

const SUPPORTED_INPUT_MODALITIES = ["text"]; // Phase-1 adapters: text-only
const SUPPORTED_OUTPUT_MODALITIES = ["text"];


const gradientText = {
  background: "linear-gradient(to right, #11a77cb9, #0072ff)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const Chat = () => {
  const { state } = useLocation();
  const initialModelName = state?.modelName;
  const initialModelLogo = state?.modelLogo;
  const initialModelId = state?.modelId;

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
  const [selectedModelId, setSelectedModelId] = useState(initialModelId || null);
  const [selectedModelName, setSelectedModelName] = useState(initialModelName || null);
  const [selectedModelLogo, setSelectedModelLogo] = useState(initialModelLogo || null);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [rateLimit, setRateLimit] = useState(null); // { secondsLeft, message }
  const [errorBanner, setErrorBanner] = useState(null); // { message }
  const [historyLimit, setHistoryLimit] = useState(200);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [modelConfig, setModelConfig] = useState(null); // parsed configJson
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingChat, setDeletingChat] = useState(null); // chat object

  const { data: modelsPage } = useQuery({
    queryKey: ["models", { page: 1, pageSize: 100 }],
    queryFn: async () => apiGet("/api/models?page=1&pageSize=100"),
  });
  const models = modelsPage?.items || [];

  const { data: chatsPage, refetch: refetchChats } = useQuery({
    queryKey: ["chats", { page: 1, pageSize: 50 }],
    queryFn: async () => apiGet("/chat?page=1&pageSize=50"),
  });
  const chats = Array.isArray(chatsPage) ? chatsPage : [];

  function normalizeMessage(m) {
    const base = { ...m };
    base._pending = Boolean(m?._pending);
    base.usageLabel = null;
    base.contextUsage = null; // { usedPct, usedTokens, limitTokens }
    if (!m?.metadataJson) return base;
    try {
      const meta = JSON.parse(m.metadataJson);
      const u = meta?.usage;
      if (!u) return base;
      const pt = typeof u.promptTokens === "number" ? u.promptTokens : null;
      const ct = typeof u.completionTokens === "number" ? u.completionTokens : null;
      const tt = typeof u.totalTokens === "number" ? u.totalTokens : null;

      // context usage (if provided by backend)
      if (u.context && typeof u.context === "object") {
        const usedTokens = typeof u.context.usedTokens === "number" ? u.context.usedTokens : null;
        const limitTokens = typeof u.context.limitTokens === "number" ? u.context.limitTokens : null;
        const usedPct = typeof u.context.usedPct === "number" ? u.context.usedPct : null;
        if (usedTokens != null && limitTokens != null && usedPct != null) {
          base.contextUsage = { usedPct, usedTokens, limitTokens };
        }
      }

      if (pt == null && ct == null && tt == null) return base;
      const parts = [];
      if (pt != null) parts.push(`input ${pt}`);
      if (ct != null) parts.push(`output ${ct}`);
      if (tt != null) parts.push(`total ${tt}`);
      base.usageLabel = `Tokens used: ${parts.join(" • ")}`;
      return base;
    } catch {
      return base;
    }
  }

  const formatTokenCount = (n) => {
    if (typeof n !== "number" || Number.isNaN(n)) return "-";
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return String(n);
  };

  const getLatestContextUsage = () => {
    // Use the most recent assistant message that has contextUsage
    for (let i = messages.length - 1; i >= 0; i--) {
      const m = messages[i];
      if (m?.role === "assistant" && m?.contextUsage) return m.contextUsage;
    }
    return null;
  };

  const MarkdownMessage = ({ content }) => (
    <Box
      sx={{
        fontSize: 14,
        lineHeight: 1.6,
        "& p": { margin: "0 0 10px 0" },
        "& ul, & ol": { paddingLeft: "18px", margin: "0 0 10px 0" },
        "& li": { marginBottom: "6px" },
        "& code": { backgroundColor: "#eef2f4", padding: "2px 6px", borderRadius: 1, fontSize: 13 },
        "& pre": {
          backgroundColor: "#0b1020",
          color: "#e6edf3",
          padding: "12px 14px",
          borderRadius: 2,
          overflowX: "auto",
          margin: "0 0 12px 0",
        },
        "& pre code": { backgroundColor: "transparent", padding: 0, color: "inherit" },
        "& h1, & h2, & h3, & h4": { margin: "12px 0 8px 0", fontWeight: 800, lineHeight: 1.25 },
        "& blockquote": {
          borderLeft: "3px solid #d0d7df",
          paddingLeft: "10px",
          margin: "0 0 12px 0",
          color: "#4b5563",
        },
        "& hr": { border: "none", borderTop: "1px solid #e5e7eb", margin: "12px 0" },
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content || ""}
      </ReactMarkdown>
    </Box>
  );

  const parseConfigJson = (s) => {
    if (!s) return null;
    try { return JSON.parse(s); } catch { return null; }
  };

  const normalizeModality = (m) => {
    const s = (m ?? "").toString().trim().toLowerCase();
    if (!s) return null;
    if (s === "image") return "images";
    if (s === "embedding") return "embeddings";
    return s;
  };

  const normalizeModalities = (arr, fallback) => {
    const list = Array.isArray(arr) ? arr : [];
    const out = list.map(normalizeModality).filter(Boolean);
    return out.length ? out : fallback;
  };

  const loadSelectedModelConfig = async (modelId) => {
    if (!modelId) {
      setModelConfig(null);
      return;
    }
    try {
      const m = await apiGet(`/api/models/${modelId}`);
      setModelConfig(parseConfigJson(m?.configJson));
    } catch {
      setModelConfig(null);
    }
  };

  const inputModalities = normalizeModalities(modelConfig?.inputModalities, ["text"]);
  const outputModalities = normalizeModalities(modelConfig?.outputModalities, ["text"]);
  const textAllowed = inputModalities.includes("text") && outputModalities.includes("text");

  const createChat = useMutation({
    mutationFn: async (modelId) => apiPost("/chat", { modelId }),
    onSuccess: (chat) => {
      setChatId(chat.id);
      try {
        localStorage.setItem(LAST_CHAT_ID_KEY, chat.id);
      } catch { }
      setMessages([]);
      setErrorBanner(null);
      refetchChats();
    },
  });

  const clearChat = useMutation({
    mutationFn: async () => {
      if (!chatId) throw new Error("No chat selected");
      return apiDelete(`/chat/${chatId}/messages`);
    },
    onSuccess: async () => {
      setMessages([]);
      setConfirmClearOpen(false);
      setErrorBanner(null);
      await refetchChats();
    },
    onError: (e) => setErrorBanner({ message: e?.message || "Failed to clear chat." }),
  });

  const deleteChat = useMutation({
    mutationFn: async (id) => {
      if (!id) throw new Error("No chat selected");
      return apiDelete(`/chat/${id}`);
    },
    onSuccess: async () => {
      const id = deletingChat?.id;
      setConfirmDeleteOpen(false);
      setDeletingChat(null);
      setErrorBanner(null);

      // If we deleted the currently open chat, reset UI.
      if (id && id === chatId) {
        setChatId(null);
        setMessages([]);
        setSelectedModelId(null);
        setSelectedModelName(null);
        setSelectedModelLogo(null);
        setModelConfig(null);
      }
      try {
        const saved = localStorage.getItem(LAST_CHAT_ID_KEY);
        if (id && saved === id) localStorage.removeItem(LAST_CHAT_ID_KEY);
      } catch { }

      await refetchChats();
    },
    onError: (e) => setErrorBanner({ message: e?.message || "Failed to delete chat." }),
  });

  const sendMessage = useMutation({
    mutationFn: async (content) => {
      if (!chatId) throw new Error("Chat not created yet");
      return apiPost(`/chat/${chatId}/messages`, { content });
    },
    onSuccess: (msgs) => {
      // Backend returns only the newly created messages (user + assistant) for low latency.
      const arr = Array.isArray(msgs) ? msgs : [];
      setMessages((prev) => {
        // Remove any pending optimistic placeholders (we append them at the end).
        const withoutPending = prev.filter((m) => !m?._pending);
        const normalized = arr.map(normalizeMessage);
        return [...withoutPending, ...normalized];
      });
      setPrompt("");
      setRateLimit(null);
      setErrorBanner(null);
      refetchChats();
    },
    onError: (e) => {
      const retryAfter =
        e?.retryAfterSeconds ??
        e?.details?.retryAfterSeconds ??
        null;
      if (e?.status === 429) {
        const seconds = typeof retryAfter === "number" && retryAfter > 0 ? retryAfter : 30;
        setRateLimit({
          secondsLeft: seconds,
          message: e?.message || "Rate limit exceeded. Please wait and retry."
        });
        setErrorBanner(null);
        return;
      }
      setErrorBanner({ message: e?.message || "Request failed. Please try again." });
    }
  });

  const fetchHistory = async (limit) => {
    if (!chatId) return;
    setHistoryLoading(true);
    setErrorBanner(null);
    try {
      const page = await apiGet(`/chat/${chatId}/messages/page?page=1&pageSize=${limit}&order=desc`);
      const arr = Array.isArray(page) ? page : [];
      // backend returns desc; flip to asc for display
      const asc = arr.slice().reverse().map(normalizeMessage);
      setMessages(asc);
    } catch (e) {
      setErrorBanner({ message: e?.message || "Failed to load chat history." });
    } finally {
      setHistoryLoading(false);
    }
  };

  const restoreLastChat = async () => {
    let saved = null;
    try {
      saved = localStorage.getItem(LAST_CHAT_ID_KEY);
    } catch { }
    if (!saved) return;

    // restore chat id + selected model so history can load and send button works
    setChatId(saved);
    try {
      const chat = await apiGet(`/chat/${saved}`);
      if (chat?.modelId) setSelectedModelId(chat.modelId);
      if (chat?.modelName) setSelectedModelName(chat.modelName);
      if (chat?.providerLogoUrl) setSelectedModelLogo(chat.providerLogoUrl);
      if (chat?.modelId) await loadSelectedModelConfig(chat.modelId);
    } catch (e) {
      // if chat is invalid/expired, clear saved value so we don't loop forever
      try { localStorage.removeItem(LAST_CHAT_ID_KEY); } catch { }
    }
  };

  // On direct /chat open (or page refresh), restore previous chat session so history appears.
  React.useEffect(() => {
    if (initialModelId) return; // coming from Try it out -> createChat flow
    if (chatId) return;
    restoreLastChat();
  }, []);

  // Create chat automatically when we arrive from "Try it out"
  React.useEffect(() => {
    if (selectedModelId && !chatId && !createChat.isPending) {
      createChat.mutate(selectedModelId);
    }
  }, [selectedModelId, chatId]);

  // Load model config whenever selected model changes (drives modality UI + validation)
  React.useEffect(() => {
    if (!selectedModelId) return;
    loadSelectedModelConfig(selectedModelId);
  }, [selectedModelId]);

  // Load recent history whenever chat changes or user increases history window.
  React.useEffect(() => {
    if (!chatId) return;
    fetchHistory(historyLimit);
  }, [chatId, historyLimit]);

  // Rate limit countdown
  React.useEffect(() => {
    if (!rateLimit?.secondsLeft) return;
    const t = setInterval(() => {
      setRateLimit((prev) => {
        if (!prev) return prev;
        const next = Math.max(0, (prev.secondsLeft || 0) - 1);
        if (next === 0) return null;
        return { ...prev, secondsLeft: next };
      });
    }, 1000);
    return () => clearInterval(t);
  }, [rateLimit?.secondsLeft]);

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
        {/* ================= HISTORY + CHAT WRAPPER ================= */}
        <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
          {/* Left: history */}
          {historyOpen && (
            <Box sx={{
              width: 280,
              borderRight: "1px solid #e0e0e0",
              backgroundColor: "#f4f5f6",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}>
              <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: 800 }}>Chat history</Typography>
                <IconButton size="small" onClick={() => setHistoryOpen(false)} aria-label="Collapse history">
                  <MdChevronLeft />
                </IconButton>
              </Box>
              <Box sx={{ px: 2, pb: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ textTransform: "none", backgroundColor: "#02b499", "&:hover": { backgroundColor: "#00b894" } }}
                  onClick={() => setAiModel(true)}
                >
                  New chat
                </Button>
              </Box>
              <Box sx={{ flex: 1, overflowY: "auto", px: 1, pb: 2 }}>
                {chats.length === 0 ? (
                  <Typography sx={{ color: "#6a7074", fontSize: 13, px: 1, mt: 1 }}>
                    No chats yet.
                  </Typography>
                ) : (
                  chats.map((c) => (
                    <Box
                      key={c.id}
                      onClick={async () => {
                        setChatId(c.id);
                        try { localStorage.setItem(LAST_CHAT_ID_KEY, c.id); } catch { }
                        setSelectedModelId(c.modelId || null);
                        setSelectedModelName(c.modelName || null);
                        setSelectedModelLogo(c.providerLogoUrl || null);
                        await loadSelectedModelConfig(c.modelId);
                        // fetch explicitly for this chat id (state update is async)
                        setHistoryLoading(true);
                        try {
                          const page = await apiGet(`/chat/${c.id}/messages/page?page=1&pageSize=${historyLimit}&order=desc`);
                          const arr = Array.isArray(page) ? page : [];
                          const asc = arr.slice().reverse().map(normalizeMessage);
                          setMessages(asc);
                        } catch (e) {
                          setErrorBanner({ message: e?.message || "Failed to load chat history." });
                        } finally {
                          setHistoryLoading(false);
                        }
                      }}
                      sx={{
                        px: 1.5,
                        py: 1.2,
                        borderRadius: 1,
                        cursor: "pointer",
                        backgroundColor: c.id === chatId ? "#e0f2f1" : "transparent",
                        "&:hover": { backgroundColor: "#eaecef" },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                          {c.title || "Chat"}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingChat(c);
                            setConfirmDeleteOpen(true);
                          }}
                          aria-label="Delete chat"
                        >
                          <MdDeleteOutline />
                        </IconButton>
                      </Box>
                      <Typography sx={{ fontSize: 12, color: "#6a7074" }}>
                        {c.modelName ? `Model: ${c.modelName}` : "No model"}
                      </Typography>
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          )}



          {/* Right: chat area */}
          <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
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
              {!historyOpen && (
                <Box sx={{ width: 44, borderRight: "1px solid #e0e0e0", backgroundColor: "#f4f5f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IconButton size="small" onClick={() => setHistoryOpen(true)} aria-label="Expand history">
                    <MdChevronRight />
                  </IconButton>
                </Box>
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }} >
                {/* Left */}


                <Box onClick={() => setAiModel(true)} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <img src={selectedModelLogo || gpt} alt="Model" width={40} />
                  <Typography variant="h6" fontWeight="bold">
                    {selectedModelName || "GPT-4o"} {!selectedModelName && <span style={{ color: "#8a8a8a" }}>(Default)</span>}
                  </Typography>
                  <span style={{ color: "#00c853", fontSize: "12px" }}>▼</span>
                </Box>

                {/* Right */}
                <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                  <Typography
                    sx={{ color: "#8a8a8a", display: "flex", gap: 1, alignItems: "center", cursor: chatId ? "pointer" : "default" }}
                    onClick={() => {
                      if (!chatId) return;
                      setConfirmClearOpen(true);
                    }}
                    title={!chatId ? "Select a chat to clear" : "Clear messages in this chat"}
                  >
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
                justifyContent: "flex-start",
                gap: 2,
                px: 3,
                overflowY: "auto",
              }}
            >
              {!textAllowed && (
                <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", mt: 2, mb: 1, p: 1.5, borderRadius: 2, border: "1px solid #ffe0b2", backgroundColor: "#fff8e1" }}>
                  <Typography sx={{ fontSize: 13, color: "#8a4b00" }}>
                    This model is configured with Text disabled. Phase 1 supports text-only chat. Please enable Text input/output in Model Details.
                  </Typography>
                </Box>
              )}
              {errorBanner && (
                <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", mt: 2, mb: 1, p: 1.5, borderRadius: 2, border: "1px solid #ffcdd2", backgroundColor: "#ffebee" }}>
                  <Typography sx={{ fontSize: 13, color: "#b71c1c" }}>
                    {errorBanner.message}
                  </Typography>
                </Box>
              )}
              {rateLimit && (
                <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", mt: 2, mb: 1, p: 1.5, borderRadius: 2, border: "1px solid #ffe0b2", backgroundColor: "#fff8e1" }}>
                  <Typography sx={{ fontSize: 13, color: "#8a4b00" }}>
                    {rateLimit.message} {rateLimit.secondsLeft ? `Retry in ${rateLimit.secondsLeft}s.` : ""}
                  </Typography>
                </Box>
              )}
              {messages.length === 0 ? (
                <Typography variant="h4" fontWeight="bold" sx={gradientText}>
                  What can I help with?
                </Typography>
              ) : (
                <Box sx={{ width: "100%", maxWidth: 900, mx: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                    <Button
                      variant="text"
                      disabled={historyLoading || !chatId}
                      sx={{ textTransform: "none", color: "#0a7b6a" }}
                      onClick={() => setHistoryLimit((n) => Math.min(2000, n + 200))}
                    >
                      {historyLoading ? "Loading history..." : `Load older (+200)`}
                    </Button>
                  </Box>
                  {messages.map((m) => (
                    <Box key={m.id} sx={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                      <Box sx={{
                        maxWidth: "85%",
                        px: 2,
                        py: 1.5,
                        borderRadius: 2,
                        backgroundColor: m.role === "user" ? "#e8f5e9" : "#f4f5f6",
                        border: "1px solid #e0e0e0",
                        whiteSpace: "pre-wrap",
                      }}>
                        {m.role === "assistant"
                          ? <MarkdownMessage content={m.content} />
                          : <Typography sx={{ fontSize: 14, whiteSpace: "pre-wrap" }}>{m.content}</Typography>}
                        {m.role !== "user" && m.usageLabel && (
                          <Typography sx={{ fontSize: 12, color: "#8a8a8a", mt: 0.75 }}>
                            {m.usageLabel}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

            </Box>

            {/* ================= BOTTOM INPUT ================= */}
            <Box
              sx={{
                width: "800px",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "20px"
              }}

            >

              {/* <Typography sx={{ color: "#0a7b6aff", textAlign: "center", fontSize: "15px", margin: "20px 0px" }}>
            Subscribe now and start exploring the playground
          </Typography> */}
              <Box
                sx={{
                  px: 3,
                  py: 1,
                  backgroundColor: "#f5f5f5",

                }}
              >
                {/* Context usage (like ChatGPT) */}
                {(() => {
                  const cu = getLatestContextUsage();
                  if (!cu) return null;
                  const pct = `${cu.usedPct.toFixed(1)}%`;
                  return (
                    <Typography sx={{ fontSize: 12, color: "#6a7074", mb: 0.75 }}>
                      {pct} · {formatTokenCount(cu.usedTokens)} / {formatTokenCount(cu.limitTokens)} context used
                    </Typography>
                  );
                })()}

                {/* Modality chips driven by model config */}
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Typography sx={{ fontSize: 12, color: "#6a7074", fontWeight: 700 }}>Input:</Typography>
                    {["text", "images", "audio", "video", "embeddings"].map((m) => {
                      const configured = inputModalities.includes(m);
                      const supported = SUPPORTED_INPUT_MODALITIES.includes(m);
                      const active = configured;
                      return (
                        <Box
                          key={`in-${m}`}
                          sx={{
                            px: 1,
                            py: 0.3,
                            borderRadius: 10,
                            fontSize: 12,
                            border: "1px solid " + (active ? "#02b499" : "#d0d7df"),
                            backgroundColor: active ? "#e6fffb" : "#ffffff",
                            color: !supported && active ? "#b71c1c" : "#111",
                          }}
                          title={!supported && active ? "Configured but not supported by current adapters (Phase 1 text-only)" : undefined}
                        >
                          {m}
                        </Box>
                      );
                    })}
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Typography sx={{ fontSize: 12, color: "#6a7074", fontWeight: 700 }}>Output:</Typography>
                    {["text", "images", "audio", "video"].map((m) => {
                      const configured = outputModalities.includes(m);
                      const supported = SUPPORTED_OUTPUT_MODALITIES.includes(m);
                      const active = configured;
                      return (
                        <Box
                          key={`out-${m}`}
                          sx={{
                            px: 1,
                            py: 0.3,
                            borderRadius: 10,
                            fontSize: 12,
                            border: "1px solid " + (active ? "#02b499" : "#d0d7df"),
                            backgroundColor: active ? "#e6fffb" : "#ffffff",
                            color: !supported && active ? "#b71c1c" : "#111",
                          }}
                          title={!supported && active ? "Configured but not supported by current adapters (Phase 1 text-only)" : undefined}
                        >
                          {m}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1, justifyContent: "center", alignItems: "center" }}>

                  {/* <CiCirclePlus style={{ color: "#cacdd2" }} size={50} /> */}
                  <TextField
                    fullWidth
                    placeholder="Ask anything"
                    variant="outlined"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <Button
                    variant="contained"
                    disabled={
                      !prompt.trim() ||
                      sendMessage.isPending ||
                      Boolean(rateLimit) ||
                      !textAllowed ||
                      !(chatId || selectedModelId)
                    }
                    sx={{
                      color: "#fefdfdff",
                      backgroundColor: !prompt.trim() || rateLimit || !textAllowed || !(chatId || selectedModelId)
                        ? "#f8e6f8ff"
                        : "#02b499",
                      boxShadow: "none",
                      textTransform: "none",
                    }}
                    title={
                      !textAllowed
                        ? "Text input/output is disabled in Model Details for this model."
                        : (!(chatId || selectedModelId) ? "Select a model (or open a chat) to run." : undefined)
                    }
                    onClick={() => {
                      if (rateLimit) return;
                      setErrorBanner(null);
                      if (!chatId && selectedModelId) {
                        createChat.mutate(selectedModelId, {
                          onSuccess: () => sendMessage.mutate(prompt),
                        });
                      } else {
                        // optimistic append (keeps UI responsive)
                        const tmpUserId = `tmp-user-${Date.now()}`;
                        const tmpAsstId = `tmp-asst-${Date.now()}`;
                        setMessages((prev) => [
                          ...prev,
                          normalizeMessage({ id: tmpUserId, role: "user", content: prompt, createdAt: new Date().toISOString(), metadataJson: null, _pending: true }),
                          normalizeMessage({ id: tmpAsstId, role: "assistant", content: "…", createdAt: new Date().toISOString(), metadataJson: null, _pending: true }),
                        ]);
                        sendMessage.mutate(prompt);
                      }
                    }}
                  >
                    <IoMdPlay size={30} style={{ marginRight: "6px" }} />
                    {rateLimit ? `Wait (${rateLimit.secondsLeft}s)` : (sendMessage.isPending ? "Running..." : "Run")}
                  </Button>

                </Box>
              </Box>

              {/* Confirm clear */}
              <Dialog open={confirmClearOpen} onClose={() => setConfirmClearOpen(false)}>
                <DialogTitle>Clear chat?</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    This will delete all messages in the current chat. The chat will remain in the history list.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setConfirmClearOpen(false)}>Cancel</Button>
                  <Button
                    variant="contained"
                    onClick={() => clearChat.mutate()}
                    disabled={clearChat.isPending}
                    sx={{ backgroundColor: "#02b499", "&:hover": { backgroundColor: "#00b894" } }}
                  >
                    {clearChat.isPending ? "Clearing..." : "Clear"}
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Confirm delete */}
              <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
                <DialogTitle>Delete chat?</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    This will delete the chat and all its messages permanently.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => deleteChat.mutate(deletingChat?.id)}
                    disabled={deleteChat.isPending}
                  >
                    {deleteChat.isPending ? "Deleting..." : "Delete"}
                  </Button>
                </DialogActions>
              </Dialog>
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
                  {models.map((model) => (
                    <Box
                      key={model.id}
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
                      onClick={() => {
                        setSelectedModelId(model.id);
                        setSelectedModelName(model.name);
                        // backend provides provider logo URL; fall back to existing mapping by providerName
                        setSelectedModelLogo(model.providerLogoUrl || gpt);
                      }}
                    >
                      <img
                        src={model.providerLogoUrl || gpt}
                        alt={model.name}
                        style={{ width: 40, height: 40, objectFit: "contain" }}
                      />
                      <Typography fontWeight="bold" fontSize="18px" variant="h6">{model.name}</Typography>
                    </Box>
                  ))}

                </Box>
              </Box>



              {/* Footer */}
              <DialogActions sx={{ p: 2 }}>
                <Button variant="contained" sx={{ backgroundColor: "#e0e0e0", color: "#a6a6ae" }} onClick={() => setAiModel(false)} >Cancel</Button>
                <Button variant="contained" onClick={() => {
                  setAiModel(false);
                  if (selectedModelId) {
                    setChatId(null);
                    createChat.mutate(selectedModelId);
                  }
                }} disabled={!selectedModelId}>
                  Apply
                </Button>
              </DialogActions>
            </Dialog>



          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Chat;
