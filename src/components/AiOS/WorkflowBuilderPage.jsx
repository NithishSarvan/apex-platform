
// ==================== COMPONENT 8: WORKFLOW BUILDER PAGE ====================
import React, { useState } from 'react';
import {
    Paper, Typography, Grid, TextField, Button, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Switch, FormControl, InputLabel,
    Select, MenuItem, Card
} from '@mui/material';
import {
    Timeline as TimelineIcon,
    Add as AddIcon,
    Edit as EditIcon
} from '@mui/icons-material';

export const WorkflowBuilderPage = () => {
    const [workflows, setWorkflows] = useState([
        { id: 1, name: 'Daily Report', trigger: 'cron:0 9 * * *', action: 'generate_report', status: 'active' },
        { id: 2, name: 'Policy Expiry Alert', trigger: 'event:policy_expiring', action: 'send_email', status: 'active' }
    ]);

    const [newWorkflow, setNewWorkflow] = useState({
        name: '',
        triggerType: 'cron',
        triggerValue: '',
        action: ''
    });

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimelineIcon /> Automated Workflows
            </Typography>

            <TableContainer sx={{ mb: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Workflow Name</TableCell>
                            <TableCell>Trigger</TableCell>
                            <TableCell>Action</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {workflows.map(wf => (
                            <TableRow key={wf.id} hover>
                                <TableCell>{wf.name}</TableCell>
                                <TableCell>
                                    <Chip label={wf.trigger.split(':')[0]} size="small" />
                                    <Typography variant="body2" color="text.secondary">
                                        {wf.trigger.split(':')[1]}
                                    </Typography>
                                </TableCell>
                                <TableCell>{wf.action}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={wf.status}
                                        size="small"
                                        color={wf.status === 'active' ? 'success' : 'default'}
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton size="small">
                                        <EditIcon />
                                    </IconButton>
                                    <Switch size="small" checked={wf.status === 'active'} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create Workflow */}
            <Paper variant="outlined" sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 3 }}>Create New Workflow</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Workflow Name"
                            value={newWorkflow.name}
                            onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                            <InputLabel>Trigger Type</InputLabel>
                            <Select
                                value={newWorkflow.triggerType}
                                label="Trigger Type"
                                onChange={(e) => setNewWorkflow({ ...newWorkflow, triggerType: e.target.value })}
                            >
                                <MenuItem value="cron">Schedule (Cron)</MenuItem>
                                <MenuItem value="event">Event-Based</MenuItem>
                                <MenuItem value="condition">Condition-Based</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label={newWorkflow.triggerType === 'cron' ? 'Cron Expression' : 'Trigger Value'}
                            value={newWorkflow.triggerValue}
                            onChange={(e) => setNewWorkflow({ ...newWorkflow, triggerValue: e.target.value })}
                            placeholder={newWorkflow.triggerType === 'cron' ? '0 9 * * *' : 'event_name'}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Action"
                            value={newWorkflow.action}
                            onChange={(e) => setNewWorkflow({ ...newWorkflow, action: e.target.value })}
                            placeholder="send_email, generate_report, etc."
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" startIcon={<AddIcon />}>
                            Create Workflow
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Paper>
    );
};
