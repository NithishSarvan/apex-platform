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
    FiHome,
    FiBriefcase,
    FiZap
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
                const isChildActive = checkChildActive(item.children, location.pathname);
                if (isChildActive) {
                    newExpanded[item.label] = true;
                }

                // Also check for nested grandchildren
                item.children.forEach(child => {
                    if (child.children) {
                        const isGrandchildActive = checkChildActive(child.children, location.pathname);
                        if (isGrandchildActive) {
                            newExpanded[item.label] = true;
                            newExpanded[child.label] = true;
                        }
                    }
                });
            }
        });

        setExpanded(newExpanded);
    }, [location.pathname]);

    // Helper function to check if any child is active
    const checkChildActive = (children, pathname) => {
        return children.some(child => {
            if (child.path) {
                return pathname === child.path || (child.path === '/' && pathname === '/');
            }
            if (child.children) {
                return checkChildActive(child.children, pathname);
            }
            return false;
        });
    };

    const menuItems = [
        {
            icon: <FiTarget />,
            label: 'Onboarding',
            children: [
                { label: 'Client Management', path: '/client-mang' },
                { label: 'License Management', path: '/license-management' },
                { label: 'Utilization Report', path: '/utilization-report' },
                { label: 'Billing Summary', path: '/billing-management' },
            ],
            noBorderTop: true
        },
        {
            icon: <FiGrid />,
            label: 'Platform',
            children: [
                { label: 'Overview', path: '/' },
                { label: 'Providers', path: '/providers' },
                { label: 'Model Catalog', path: '/models' },
                { label: 'Data Sources', path: '/data-sources' },
                { label: 'Model Training', path: '/model-training' },
                {
                    label: 'Playground',
                    children: [
                        { label: 'Standard', path: '/chat' },
                        { label: 'Pre-Trained', path: '/realtime' },
                        { label: 'API', path: '/api-playground' },
                    ]
                },
            ],
        },
        {
            icon: <FiBriefcase />,
            label: 'Business Application',
            children: [
                { label: 'AI Voice Bot', path: '/ai-voice-bot' },
                { label: 'Intelligent Document', path: '/intelligent-doc' },
                { label: 'AI Motor Claims Automation', path: '/motor-claims' },
            ],
        },
        {
            icon: <FiZap />,
            label: 'Accelerators',
            children: [
                { label: 'Predefined Workflow', path: '/predefine-wf' },
                { label: 'Workflow Builder', path: '/workf-builder' },
            ],
        },
    ];

    const toggleSection = (label) => {
        setExpanded(prev => ({
            ...prev,
            [label]: !prev[label]
        }));
    };

    // Recursive component to render nested menu items
    const renderMenuItem = (item, level = 0) => {
        const isExpanded = expanded[item.label] || false;

        if (item.children) {
            return (
                <div className="nav-section">
                    <div
                        className={`nav-item-header ${level === 0 && item.noBorderTop ? 'no-border-top' : ''} ${level > 0 ? 'nested' : ''}`}
                        onClick={() => toggleSection(item.label)}
                        style={{
                            paddingLeft: level > 0 ? '65px' : '20px'
                        }}
                    >
                        <span className="icon">{item.icon}</span>
                        {!collapsed && level === 0 && <span className="label">{item.label}</span>}
                        {!collapsed && level > 0 && <span className="label nested-label">{item.label}</span>}
                        {!collapsed && (
                            <span className={`arrow ${isExpanded ? 'expanded' : ''}`}>
                                ▼
                            </span>
                        )}
                    </div>

                    <div className={`nav-subitems ${!collapsed && isExpanded ? 'visible' : 'hidden'}`}>
                        {item.children.map((child) => (
                            <React.Fragment key={child.label || child.path}>
                                {child.children ? (
                                    // Render nested child with children
                                    renderMenuItem(child, level + 1)
                                ) : (
                                    // Render regular child link
                                    <NavLink
                                        to={child.path}
                                        end={child.path === '/'}
                                        className={({ isActive }) =>
                                            `nav-subitem ${isActive ? 'active' : ''}`
                                        }
                                        style={{ paddingLeft: `${50 + (level * 20)}px` }}
                                        onClick={() => {
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
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <NavLink
                to={item.path}
                className={({ isActive }) =>
                    `nav-item ${isActive ? 'active' : ''}`
                }
                style={{ paddingLeft: `${20 + (level * 20)}px` }}
            >
                <span className="icon">{item.icon}</span>
                {!collapsed && <span className="label">{item.label}</span>}
            </NavLink>
        );
    };

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <nav className="sidebar-nav">
                <ul className="menu-list">
                    {menuItems.map((item) => (
                        <li key={item.label}>
                            {renderMenuItem(item)}
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

