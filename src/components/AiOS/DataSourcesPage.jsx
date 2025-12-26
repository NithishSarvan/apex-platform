
// ==================== COMPONENT 5: DATA SOURCES PAGE ====================
import React, { useState } from 'react';
import {
    Paper, Typography, Grid, TextField, Button, Chip,
    Accordion, AccordionSummary, AccordionDetails,
    FormControl, InputLabel, Select, MenuItem,
    FormControlLabel, Switch, Checkbox, Box
} from '@mui/material';
import {
    ExpandMore as ExpandMoreIcon,
    Storage as StorageIcon,
    Api as ApiIcon,
    Webhook as WebhookIcon,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';

export const DataSourcesPage = () => {
    const [sources, setSources] = useState([
        {
            id: 1,
            name: 'Customer Database',
            type: 'DATABASE',
            status: 'connected',
            connection: 'postgresql://user:pass@localhost:5432/customers',
            lastSync: '5 minutes ago'
        },
        {
            id: 2,
            name: 'CRM Webhook',
            type: 'WEBHOOK',
            status: 'connected',
            connection: 'https://crm.example.com/webhook',
            lastSync: '2 days ago'
        }
    ]);

    const [newSource, setNewSource] = useState({
        type: 'database',
        name: '',
        connection: ''
    });

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Data Sources Configuration
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Connect external data sources for real-time access and processing
            </Typography>

            {/* Connected Sources */}
            <Paper sx={{ mb: 4, p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Connected Sources ({sources.length})</Typography>

                {sources.map((source) => (
                    <Accordion key={source.id} sx={{ mb: 2 }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                {source.type === 'DATABASE' && <StorageIcon sx={{ mr: 2 }} />}
                                {source.type === 'WEBHOOK' && <WebhookIcon sx={{ mr: 2 }} />}
                                {source.type === 'API' && <ApiIcon sx={{ mr: 2 }} />}

                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography>{source.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {source.type} • Last synced: {source.lastSync}
                                    </Typography>
                                </Box>

                                <Chip
                                    label={source.status}
                                    size="small"
                                    color={source.status === 'connected' ? 'success' : 'warning'}
                                />
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography variant="body2" sx={{ mb: 2, fontFamily: 'monospace' }}>
                                {source.connection}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button variant="outlined" size="small">
                                    Test Connection
                                </Button>
                                <Button variant="outlined" size="small">
                                    Configure
                                </Button>
                                <Button variant="outlined" color="error" size="small">
                                    Remove
                                </Button>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Paper>

            {/* Add New Source */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Add New Data Source</Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Source Type</InputLabel>
                            <Select
                                value={newSource.type}
                                label="Source Type"
                                onChange={(e) => setNewSource({ ...newSource, type: e.target.value })}
                            >
                                <MenuItem value="database">Database</MenuItem>
                                <MenuItem value="api">API</MenuItem>
                                <MenuItem value="webhook">Webhook</MenuItem>
                                <MenuItem value="file">File Upload</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Source Name"
                            value={newSource.name}
                            onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                            placeholder="e.g., Production Database"
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Connection"
                            value={newSource.connection}
                            onChange={(e) => setNewSource({ ...newSource, connection: e.target.value })}
                            placeholder={
                                newSource.type === 'database'
                                    ? 'postgresql://user:pass@host:port/db'
                                    : 'https://api.example.com/data'
                            }
                        />
                    </Grid>
                </Grid>

                <Button variant="contained" sx={{ mt: 3 }} startIcon={<AddIcon />}>
                    Connect Source
                </Button>
            </Paper>
        </Paper>
    );
};