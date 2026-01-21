import React, { useState } from "react";
import { Box, Divider, Grid, Menu, Typography } from "@mui/material";

import { FiMenu } from "react-icons/fi";
import { IoFolderOutline } from "react-icons/io5";
import { BsPersonWorkspace } from "react-icons/bs";
import { FaArrowUpLong } from "react-icons/fa6";

import { HiOutlineUsers } from "react-icons/hi2";
import { MdOutlineAccountTree, MdOutlineSettings, MdOutlineLogout } from "react-icons/md";
import { FiKey } from "react-icons/fi";
import { TbReportAnalytics } from "react-icons/tb";
import { RiFileList3Line } from "react-icons/ri";
import { TbGridDots } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';
import AppLogo from '../../assets/apex-logo.svg'

const Header = ({ onToggleSidebar }) => {
    const [workspaceAnchor, setWorkspaceAnchor] = useState(null);
    const [profileAnchor, setProfileAnchor] = useState(null);
    const navigate = useNavigate();
    return (
        <header className="header">
            {/* LEFT */}
            <div className="header-left">
                <button className="menu-btn" onClick={onToggleSidebar}>
                    <FiMenu size={20} />
                </button>

                <div className="logo">
                    <img src={AppLogo} style={{ width: '40px' }} />

                    <span className="logo-text">APEX AI3</span>
                </div>
            </div>

            {/* RIGHT */}
            <div className="header-right">
                <button className="doc-btn" style={{ borderRight: "1px solid #e0e0e0" }} onClick={() =>
                    window.open(
                        "https://www.core42.ai/compass/documentation",
                        "_blank",
                        "noopener,noreferrer"
                    )
                }>
                    <IoFolderOutline size={22} />
                    <Typography variant="p" sx={{ fontWeight: 600, pointerEvents: "none" }} >Documentation</Typography>

                    <FaArrowUpLong style={{ transform: "rotate(45deg)", pointerEvents: "none" }} size={14} />
                </button>

                {/* WORKSPACE */}
                <button
                    className="workspace-btn" style={{ borderRight: "1px solid #e0e0e0" }}
                    onClick={(e) => setWorkspaceAnchor(e.currentTarget)}
                >

                    <TbGridDots size={22} />
                    <Typography variant="p" sx={{ fontWeight: 600, pointerEvents: "none" }} >WorkSpace</Typography>
                </button>

                <Menu
                    anchorEl={workspaceAnchor}
                    open={Boolean(workspaceAnchor)}
                    onClose={() => setWorkspaceAnchor(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    PaperProps={{
                        sx: {
                            width: 410,
                            borderRadius: 2,
                            boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
                        },
                    }}
                >
                    <Grid container>
                        {[
                            { label: "User Management", icon: <HiOutlineUsers size={35} /> },
                            { label: "Departments", icon: <MdOutlineAccountTree size={35} /> },
                            { label: "Resources", icon: <RiFileList3Line size={35} /> },
                            { label: "API keys", icon: <FiKey size={35} /> },
                            { label: "Usage reports", icon: <TbReportAnalytics size={35} /> },
                            { label: "Activity Log", icon: <RiFileList3Line size={35} /> },
                        ].map((item, index) => {
                            const isLastColumn = (index + 1) % 3 === 0;
                            const isLastRow = index >= 3;

                            return (
                                <Grid
                                    item
                                    size={4}
                                    key={index}
                                    sx={{
                                        borderRight: isLastColumn ? "none" : "1px solid #e0e0e0",
                                        borderBottom: isLastRow ? "none" : "1px solid #e0e0e0",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            py: 3,
                                            cursor: "pointer",
                                            "&:hover": {
                                                backgroundColor: "#f5f5f5",
                                            },
                                        }}
                                    >
                                        {item.icon}
                                        <Typography
                                            sx={{
                                                fontSize: 13,
                                                textAlign: "center",
                                                mt: 1,
                                            }}
                                        >
                                            {item.label}
                                        </Typography>
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Menu>


                <button
                    className="user-menu"
                    onClick={(e) => setProfileAnchor(e.currentTarget)}
                >
                    <Typography variant="p" sx={{ fontWeight: 600, pointerEvents: "none" }} >User</Typography>

                    <span style={{ color: "#00c853", fontSize: "12px", pointerEvents: "none" }}>▼</span>

                </button>

                <Menu
                    anchorEl={profileAnchor}
                    open={Boolean(profileAnchor)}
                    onClose={() => setProfileAnchor(null)}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
                    MenuListProps={{
                        sx: {
                            padding: 0,   
                        },
                    }}
                    PaperProps={{
                        sx: { width: 250, borderRadius: 0 },
                    }}
                >
                    <Box sx={{ p: 2 }} >
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }} >user@apex.ai</Typography>
                        <div
                            className="profile-item"
                            onClick={() => {
                                navigate("/settings")

                            }}
                        >
                            <MdOutlineSettings size={18} />
                            Settings
                        </div>

                        <Divider />

                        <div className="profile-item ">
                            <MdOutlineLogout size={18} />
                            Logout
                        </div>
                    </Box>
                    <Divider />
                    <p
                        style={{
                            padding: "10px 16px",
                            backgroundColor: "#f4f4f5",
                            color: "#6a7074",
                        }}
                        className="text-sm"
                    >
                        Privacy Policy · Terms of Service
                    </p>
                </Menu>


            </div>
        </header>
    );
};

export default Header;
