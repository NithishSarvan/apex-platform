
// ==================== COMPONENT 7: RULE ENGINE PAGE ====================
import React, { useState } from 'react';
import {
    Paper, Typography, Grid, TextField, Button, Chip,
    Card, CardContent, FormControl, InputLabel,
    Select, MenuItem, Switch, FormControlLabel, Box
} from '@mui/material';
import { Security as SecurityIcon } from '@mui/icons-material';

export const RuleEnginePage = () => {
    const [rules, setRules] = useState({
        businessContext: 'Insurance claim approval assistant',
        dataAccess: 'Can read policies, cannot write',
        actionsAllowed: ['generate_reports', 'lookup_data'],
        prohibitedActions: ['approve_claims', 'share_pii'],
        humanInLoop: ['approve_claims > 10000'],
        fallbackStrategy: 'safe_mode',
        maxRetries: 3
    });

    const [newAllowedAction, setNewAllowedAction] = useState('');
    const [newProhibitedAction, setNewProhibitedAction] = useState('');

    const addAllowedAction = () => {
        if (newAllowedAction.trim()) {
            setRules({
                ...rules,
                actionsAllowed: [...rules.actionsAllowed, newAllowedAction.trim()]
            });
            setNewAllowedAction('');
        }
    };

    const addProhibitedAction = () => {
        if (newProhibitedAction.trim()) {
            setRules({
                ...rules,
                prohibitedActions: [...rules.prohibitedActions, newProhibitedAction.trim()]
            });
            setNewProhibitedAction('');
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon /> AI Behavior Rules
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Business Context"
                        value={rules.businessContext}
                        onChange={(e) => setRules({ ...rules, businessContext: e.target.value })}
                        placeholder="Describe what this AI agent does..."
                    />
                </Grid>

                {/* Allowed Actions */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                ✅ Actions Allowed
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                {rules.actionsAllowed.map(action => (
                                    <Chip key={action} label={action} size="small" />
                                ))}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    placeholder="Add allowed action"
                                    value={newAllowedAction}
                                    onChange={(e) => setNewAllowedAction(e.target.value)}
                                />
                                <Button size="small" onClick={addAllowedAction}>Add</Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Prohibited Actions */}
                <Grid item xs={12} md={6}>
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                🚫 Actions Never Allowed
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                {rules.prohibitedActions.map(action => (
                                    <Chip key={action} label={action} size="small" color="error" />
                                ))}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    size="small"
                                    fullWidth
                                    placeholder="Add prohibited action"
                                    value={newProhibitedAction}
                                    onChange={(e) => setNewProhibitedAction(e.target.value)}
                                />
                                <Button size="small" onClick={addProhibitedAction}>Add</Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Configuration */}
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Fallback Strategy</InputLabel>
                        <Select
                            value={rules.fallbackStrategy}
                            label="Fallback Strategy"
                            onChange={(e) => setRules({ ...rules, fallbackStrategy: e.target.value })}
                        >
                            <MenuItem value="safe_mode">Safe Mode</MenuItem>
                            <MenuItem value="escalate_human">Escalate to Human</MenuItem>
                            <MenuItem value="retry">Retry</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Max Retries"
                        type="number"
                        value={rules.maxRetries}
                        onChange={(e) => setRules({ ...rules, maxRetries: parseInt(e.target.value) })}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Data Access"
                        value={rules.dataAccess}
                        onChange={(e) => setRules({ ...rules, dataAccess: e.target.value })}
                    />
                </Grid>

                <Grid item xs={12}>
                    <Button variant="contained">
                        Save Rules
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};