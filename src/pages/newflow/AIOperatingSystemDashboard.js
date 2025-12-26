import React, { useState } from 'react';
import {
    Box, Container, Paper, Typography, Tabs, Tab,
    Grid, Chip, Button
} from '@mui/material';
import {
    Settings as SettingsIcon,
    Psychology as PsychologyIcon,
    Schema as SchemaIcon,
    Storage as StorageIcon,
    AutoFixHigh as AutoFixHighIcon,
    Security as SecurityIcon,
    Timeline as TimelineIcon
} from '@mui/icons-material';

import { OnboardingWizard } from '../../components/AiOS/OnboardingWizard';
import { IntentRegistryPage } from '../../components/AiOS/IntentRegistryPage';
import { SemanticDataLayerPage } from '../../components/AiOS/SemanticDataLayerPage';
import { DataSourcesPage } from '../../components/AiOS/DataSourcesPage';
import { ToolStudioPage } from '../../components/AiOS/ToolStudioPage';
import { RuleEnginePage } from '../../components/AiOS/RuleEnginePage';
import { WorkflowBuilderPage } from '../../components/AiOS/WorkflowBuilderPage';

const AIOperatingSystemDashboard = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [tenant, setTenant] = useState(null);
    const [showOnboarding, setShowOnboarding] = useState(true);

    const handleOnboardingComplete = (data) => {
        setTenant(data);
        setShowOnboarding(false);
    };

    const tabs = [
        { label: 'Intent Registry', icon: <PsychologyIcon />, component: <IntentRegistryPage /> },
        { label: 'Semantic Layer', icon: <SchemaIcon />, component: <SemanticDataLayerPage /> },
        // { label: 'Data Sources', icon: <StorageIcon />, component: <DataSourcesPage /> },
        { label: 'Tool Studio', icon: <AutoFixHighIcon />, component: <ToolStudioPage /> },
        { label: 'Rules Engine', icon: <SecurityIcon />, component: <RuleEnginePage /> },
        // { label: 'Workflows', icon: <TimelineIcon />, component: <WorkflowBuilderPage /> },
        // { label: 'Settings', icon: <SettingsIcon />, component: <div>Settings Page</div> }
    ];

    if (showOnboarding) {
        return <OnboardingWizard onComplete={handleOnboardingComplete} />;
    }

    return (
        <Box className="min-h-screen bg-gray-50">
            {/* Header */}
            <Paper className="sticky top-0 z-10 p-4 mb-6 shadow">
                <div className="flex justify-between items-center">
                    <div>
                        <Typography variant="h5" className="font-bold">
                            AI Operating System
                        </Typography>
                        <Typography variant="body2" className="text-gray-600">
                            Tenant: {tenant?.companyName} • {tenant?.industry} • {tenant?.useCase}
                        </Typography>
                    </div>
                    <div className="flex items-center gap-4">
                        <Chip label="Multi-Tenant" />
                        <Button variant="outlined" onClick={() => setShowOnboarding(true)}>
                            Switch Tenant
                        </Button>
                    </div>
                </div>
            </Paper>

            <Container maxWidth="xl">
                {/* Tabs Navigation */}
                <Paper className="mb-6">
                    <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} variant="scrollable">
                        {tabs.map((tab, index) => (
                            <Tab
                                key={index}
                                label={
                                    <div className="flex items-center gap-2">
                                        {tab.icon}
                                        {tab.label}
                                    </div>
                                }
                            />
                        ))}
                    </Tabs>
                </Paper>

                {/* Content Area */}
                <Grid container spacing={3}>
                    <Grid item xs={10}>
                        {tabs[activeTab].component}
                    </Grid>
                </Grid>

                {/* Footer Stats */}
                {/* <Paper className="mt-8 p-4">
                    <Grid container spacing={3}>
                        <Grid item xs={3}>
                            <Typography variant="body2" className="text-gray-500">Intents</Typography>
                            <Typography variant="h6">8 Registered</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="body2" className="text-gray-500">Semantic Entities</Typography>
                            <Typography variant="h6">5 Mapped</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="body2" className="text-gray-500">Tools</Typography>
                            <Typography variant="h6">12 Configured</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="body2" className="text-gray-500">Active Workflows</Typography>
                            <Typography variant="h6">3 Running</Typography>
                        </Grid>
                    </Grid>
                </Paper> */}
            </Container>
        </Box>
    );
};

export default AIOperatingSystemDashboard;