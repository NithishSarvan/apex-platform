import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Avatar,
  Divider,
  TextField,
  Button,
  Stack,
} from "@mui/material";

const SettingsTabs = () => {
  const [tab, setTab] = useState(0);
  const [isEditingOrg, setIsEditingOrg] = useState(false);
  const [organization, setOrganization] = useState(""); // saved org value
  const [tempOrg, setTempOrg] = useState(""); // temp value while editing

  const startEditing = () => {
    setTempOrg(organization);
    setIsEditingOrg(true);
  };

  const cancelEditing = () => {
    setIsEditingOrg(false);
  };

  const saveOrganization = () => {
    setOrganization(tempOrg);
    setIsEditingOrg(false);
  };

  return (
    <div className="main-content" >
      <Box sx={{ width: "100%", py: 2 }}>
        {/* PAGE TITLE */}
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Settings
        </Typography>

        {/* TABS */}
        <Tabs
          value={tab}
          onChange={(e, newValue) => setTab(newValue)}
          sx={{
            mb: 4,
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: 600,
              color: "#000",
              backgroundColor: "#f4f5f6",
              minWidth: 100,
            },
            "& .MuiTab-root.Mui-selected": {
              color: "#000", // ✅ selected text color

            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#00c49a",
              color: "#000",
              height: 3,
            },

          }}
        >
          <Tab label="PROFILE" />
        </Tabs>

        {/* PROFILE TAB CONTENT */}
        {tab === 0 && (
          <Box>
            <Box sx={{ display: "flex", gap: 4, alignItems: "flex-start" }}>
              {/* AVATAR */}
              <Avatar
                sx={{
                  width: 72,
                  height: 72,
                  bgcolor: "#e6e0ef",
                  color: "#5b4b8a",
                  fontSize: 28,
                  fontWeight: 600,
                  mt: 0.8,
                }}
              >
                N
              </Avatar>

              {/* DETAILS */}
              <Box sx={{ flex: 1 }}>
                <ProfileRow label="Full Name" value="User" />
                <ProfileRow label="Email" value="user@apex.ai" />

                {/* Editable Organization Row */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "200px 1fr",
                    mb: 2,
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <Typography
                    sx={{
                      // color: "#6a7074",
                      fontSize: 14,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Organization
                  </Typography>

                  {/* Editable field or Add text */}
                  {!isEditingOrg ? (
                    <Typography
                      onClick={startEditing}
                      sx={{
                        fontSize: 14,
                        fontWeight: organization ? 500 : 400,
                        color: organization ? "#000" : "#0ea5a4",
                        cursor: "pointer",
                        // backgroundColor: organization ? "transparent" : "#f4f4f5",
                        borderRadius: 1,
                        padding: "10.5px 14px",
                        userSelect: "none",
                        maxWidth: 400,
                        height: 42,
                        lineHeight: "20px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {organization || "Add"}
                    </Typography>
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "end", gap: 1, maxWidth: "100%" }}>
                      <TextField
                        size="small"
                        fullWidth
                        value={tempOrg}
                        onChange={(e) => setTempOrg(e.target.value)}
                        placeholder="Organization Name"
                        variant="outlined"
                        autoFocus
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "#f4f5f6",
                            height: "52px",                // ⬅ increase field height
                            fontSize: 14,

                            // ❌ remove border (all states)
                            "& fieldset": {
                              border: "none",
                            },
                            "&:hover fieldset": {
                              border: "none",
                            },
                            "&.Mui-focused fieldset": {
                              border: "none",
                            },

                            // inner input padding
                            "& input": {
                              padding: "14px 12px",        // ⬅ increase inner spacing
                            },
                          },
                        }}
                      />

                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={cancelEditing}
                          sx={{ minWidth: 80, height: 36, fontWeight: 600, borderColor: "#02b499", color: "#02b499" }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={saveOrganization}
                          sx={{ minWidth: 80, height: 36, fontWeight: 600, backgroundColor: "#02b499" }}
                        >
                          Save
                        </Button>
                      </Stack>
                    </Box>
                  )}
                </Box>

                <ProfileRow label="Roles" value="Root Admin" />
              </Box>
            </Box>

            <Divider sx={{ mt: 4 }} />
          </Box>
        )}
      </Box>
    </div>

  );
};

export default SettingsTabs;

const ProfileRow = ({ label, value }) => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "200px 1fr",
      mb: 2,
      alignItems: "center",
    }}
  >
    <Typography sx={{ color: "", fontSize: 14 }}>{label}</Typography>

    <Typography
      sx={{
        fontSize: 14,
        fontWeight: 500,
        color: "#000",
        display: "flex",
        alignItems: "center",
      }}
    >
      {value}
    </Typography>
  </Box>
);
