import React, { useState } from "react";
import { Alert, Box, Button, Divider, IconButton, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import { login } from "../api/auth";
import { useLocation, useNavigate } from "react-router-dom";
import AppLogo from "../assets/apex-logo.svg";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

export default function Login() {
  const [email, setEmail] = useState("admin@apex.local");
  const [password, setPassword] = useState("admin123!");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(1200px 600px at 10% 20%, rgba(2,180,153,0.18), transparent 55%), radial-gradient(900px 500px at 90% 40%, rgba(16,185,129,0.16), transparent 55%), linear-gradient(135deg, #f6f8f9 0%, #eef2f4 100%)",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 920,
          borderRadius: 2,
          border: "1px solid #e7eaee",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
        }}
      >
        {/* Left panel (branding) */}
        <Box
          sx={{
            p: { xs: 3.5, md: 5 },
            background: "linear-gradient(135deg, rgba(2,180,153,1) 0%, rgba(16,185,129,1) 100%)",
            color: "white",
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <img src={AppLogo} alt="APEX" style={{ width: 52, height: 52, background: "rgba(255,255,255,0.9)", borderRadius: 10, padding: 6 }} />
            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: 20, lineHeight: 1.2 }}>APEX AI3</Typography>
              <Typography sx={{ opacity: 0.9, fontSize: 14 }}>Enterprise AI platform prototype</Typography>
            </Box>
          </Box>

          <Typography sx={{ fontSize: 28, fontWeight: 900, lineHeight: 1.15, mt: 2 }}>
            Sign in to manage providers, models, and chat.
          </Typography>

          <Box sx={{ mt: 2.5, opacity: 0.95, fontSize: 14, lineHeight: 1.8 }}>
            <div>• Model Catalog + configuration</div>
            <div>• Chat playground with token usage</div>
            <div>• Data sources + orchestration groundwork</div>
          </Box>

          <Box sx={{ mt: 3, opacity: 0.85, fontSize: 12 }}>
            Tip: Use the seeded admin credentials for the prototype.
          </Box>
        </Box>

        {/* Right panel (form) */}
        <Box sx={{ p: { xs: 3.5, md: 5 }, backgroundColor: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2, display: { xs: "flex", md: "none" } }}>
            <img src={AppLogo} alt="APEX" style={{ width: 44, height: 44 }} />
            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: 18, lineHeight: 1.2 }}>APEX AI3</Typography>
              <Typography sx={{ color: "#6a7074", fontSize: 13 }}>Sign in to continue</Typography>
            </Box>
          </Box>

          <Typography sx={{ fontWeight: 900, fontSize: 22, mb: 0.5 }}>Welcome back</Typography>
          <Typography sx={{ color: "#6a7074", fontSize: 14, mb: 2.5 }}>
            Enter your credentials to access the platform.
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={onSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              autoComplete="username"
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" aria-label="toggle password visibility">
                      {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.2,
                mt: 0.5,
                fontWeight: 800,
                textTransform: "none",
                backgroundColor: "#02b499",
                "&:hover": { backgroundColor: "#00b894" },
              }}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>

            <Divider sx={{ my: 1 }} />

            <Typography sx={{ color: "#6a7074", fontSize: 12, lineHeight: 1.6 }}>
              By continuing, you agree to the prototype’s Terms of Service and Privacy Policy.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

