import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    FiGrid,
    FiTarget,
    FiDatabase,
    FiSliders,
    FiGitMerge,
    FiHelpCircle,
    FiCheck,
    FiChevronLeft,
    FiChevronRight,
    FiHome
} from 'react-icons/fi';
import { MdOutlineChatBubbleOutline } from "react-icons/md";

const Sidebar = ({ activeView, setActiveView, collapsed }) => {
    const [expanded, setExpanded] = useState({});
    const location = useLocation();

    // Initialize expanded state based on current path
    useEffect(() => {
        const newExpanded = {};

        // Check if current path matches any child path
        menuItems.forEach(item => {
            if (item.children) {
                // Check if current location matches any child path
                const isChildActive = item.children.some(child =>
                    location.pathname === child.path ||
                    (child.path === '/' && location.pathname === '/')
                );
                if (isChildActive) {
                    newExpanded[item.label] = true;
                }
            }
        });

        setExpanded(newExpanded);
    }, [location.pathname]);

    const menuItems = [
        {
            icon: <FiHome />,
            label: 'Dashboard',
            children: [
                { label: 'Overview', path: '/' },
                { label: 'Providers', path: '/providers' },
            ],
            noBorderTop: true // Add this flag
        },
        {
            path: '/models',
            icon: <FiTarget />,
            label: 'Model Catalog'
        },
        {
            path: '/data-sources',
            icon: <FiDatabase />,
            label: 'Data Sources'
        },
        {
            path: '/model-training',
            icon: <FiSliders />,
            label: 'Model Training'
        },
        {
            icon: <MdOutlineChatBubbleOutline />,
            label: 'Playground',
            children: [
                { label: 'Standard', path: '/chat' },
                { label: 'Pre-Trained', path: '/realtime' },
                { label: 'API', path: '/api-playground' },
            ],
        },
    ];

    const toggleSection = (label) => {
        setExpanded(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    // Check if a section should be expanded based on current route
    const isSectionExpanded = (label) => {
        return expanded[label] || false;
    };

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <nav className="sidebar-nav">
                <ul className="menu-list">
                    {menuItems.map((item) => (
                        <li key={item.label}>
                            {item.children ? (
                                <div className="nav-section">
                                    <div
                                        className={`nav-item-header ${item.noBorderTop ? 'no-border-top' : ''}`}
                                        onClick={() => toggleSection(item.label)}
                                    >
                                        <span className="icon">{item.icon}</span>
                                        {!collapsed && <span className="label">{item.label}</span>}
                                        {!collapsed && (
                                            <span
                                                className={`arrow ${isSectionExpanded(item.label) ? 'expanded' : ''}`}
                                            >
                                                ▼
                                            </span>
                                        )}
                                    </div>

                                    {/* Always render children but control visibility */}
                                    <div className={`nav-subitems ${!collapsed && isSectionExpanded(item.label) ? 'visible' : 'hidden'}`}>
                                        {item.children.map((child) => (
                                            <NavLink
                                                key={child.path}
                                                to={child.path}
                                                end={child.path === '/'}
                                                className={({ isActive }) =>
                                                    `nav-subitem ${isActive ? 'active' : ''}`
                                                }
                                                onClick={() => {
                                                    // Auto-expand parent when child is clicked in collapsed mode
                                                    if (collapsed) {
                                                        setExpanded(prev => ({
                                                            ...prev,
                                                            [item.label]: true
                                                        }));
                                                    }
                                                }}
                                            >
                                                <div className="subitem-content">
                                                    {child.label}
                                                </div>
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `nav-item ${isActive ? 'active' : ''}`
                                    }
                                >
                                    <span className="icon">{item.icon}</span>
                                    {!collapsed && <span className="label">{item.label}</span>}
                                </NavLink>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Help Button */}
                <div className="help-button">
                    <FiHelpCircle size={22} color='#ffffff' />
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;