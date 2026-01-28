import React, { useState } from 'react';
import { FiDatabase, FiGlobe, FiLink, FiPlus, FiTrash2, FiEdit, FiRefreshCw, FiCheck } from 'react-icons/fi';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    MenuItem,
    Grid,
    Divider
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiDelete, apiGet, apiPost } from '../api/client';

const DataSourcesStep = ({ data, onUpdate }) => {

    const queryClient = useQueryClient();
    const { data: sources = [], isLoading, error } = useQuery({
        queryKey: ["dataSources"],
        queryFn: async () => apiGet("/api/data-sources"),
    });

    const [showAddModal, setShowAddModal] = useState(false);
    const [newSource, setNewSource] = useState({
        name: '',
        type: '',
        connectionString: '',
        endpoint: '',
        authentication: '',
        apiKey: '',
        username: '',
        password: '',
        frequency: ""
    });

    const sourceTypes = [
        { id: 'database', name: 'Database', icon: <FiDatabase />, color: 'text-blue-600' },
        { id: 'api', name: 'API', icon: <FiGlobe />, color: 'text-green-600' },
        { id: 'webhook', name: 'Webhook', icon: <FiLink />, color: 'text-purple-600' },
        // { id: 'file', name: 'File System', icon: <FiDatabase />, color: 'text-yellow-600' },
        { id: 'queue', name: 'Message Queue', icon: <FiLink />, color: 'text-red-600' },
    ];

    const createSource = useMutation({
        mutationFn: async () => {
            const typeUpper = (newSource.type || "").trim().toUpperCase();
            return apiPost("/api/data-sources", {
                name: newSource.name,
                type: typeUpper,
                connectionString: typeUpper === "DATABASE" ? newSource.connectionString : null,
                endpointUrl: typeUpper === "DATABASE" ? null : newSource.connectionString,
            });
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["dataSources"] });
            setShowAddModal(false);
            setNewSource({
                name: '',
                type: '',
                connectionString: '',
                endpoint: '',
                authentication: '',
                apiKey: '',
                username: '',
                password: '',
                frequency: ""
            });
        }
    });

    const deleteSource = useMutation({
        mutationFn: async (id) => apiDelete(`/api/data-sources/${id}`),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["dataSources"] });
        }
    });

    const testSource = useMutation({
        mutationFn: async (id) => apiPost(`/api/data-sources/${id}/test`, {}),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["dataSources"] });
        }
    });

    const handleAddSource = () => {
        if (!newSource.name.trim()) return;
        createSource.mutate();
    };

    const getStatusColor = (status) => {
        const s = (status || "").toLowerCase();
        switch (s) {
            case 'connected': return 'bg-green-100 text-green-800';
            case 'disconnected': return 'bg-red-100 text-red-800';
            case 'syncing': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // legacy handler name used by the dialog "Connect Source" button
    const handleAddModel = handleAddSource;

    const inputSx = {
        "& .MuiOutlinedInput-root": {
            height: 44,
            backgroundColor: "#f4f5f6",
            borderRadius: "0px",
            border: "none",
            "& fieldset": {
                border: "none", // Remove border
            },
            "&:hover fieldset": {
                border: "none", // Remove border on hover
            },
            "&.Mui-focused fieldset": {
                border: "none", // Remove border on focus
                outline: "none",
            },
        },
        "& .MuiInputBase-input": {
            fontSize: "14px", // Adjust text size
            color: "#000000", // Text color
            padding: "0 12px", // Adjust padding
        },
    };


    return (
        <div className='main-content px-10'>
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-black-500 mb-4">Data Sources Configuration</h3>
                {/* <p className="text-sm text-gray-600 mb-6">Connect external data sources for real-time access and processing.</p> */}
                <div className='heighligts my-4  font-md' >
                    <p>Connect external data sources for real-time access and processing.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Source List */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-semibold">Connected Sources ({sources.length})</h4>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="check-btn flex items-center gap-2 "
                        >
                            <FiPlus /> Add Source
                        </button>
                    </div>

                    <div className="space-y-4">
                        {isLoading && <p className="text-gray-600">Loading data sources...</p>}
                        {error && <p className="text-red-600">Failed to load data sources: {error.message}</p>}
                        {sources.map((source) => (
                            <div key={source.id} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        {/* <div className={`card-icon-wrapper mb-3 p-2 rounded-lg `}>
                                            {(() => {
                                                const sourceType = sourceTypes.find(t => t.id === source.type);
                                                if (sourceType?.icon) {
                                                    return React.cloneElement(sourceType.icon, { size: 30 });
                                                }
                                                return null;
                                            })()}
                                        </div> */}
                                        <div>
                                            <h5 className="font-semibold">{source.name}</h5>
                                            <p className="text-sm text-gray-500">{source.type}</p>
                                        </div>
                                    </div>
                                    <span className={`status-badge ${getStatusColor(source.status)}`}>
                                        {(source.status || "").toLowerCase()}
                                    </span>
                                </div>

                                <div className="text-sm text-gray-600 mb-4">
                                    {(source.type || "").toLowerCase() === 'database' ? (
                                        <div className="py-2 text-sm text-[#676a6e] truncate"><p>{source.connectionString} </p></div>
                                    ) : (
                                        <div className="py-2 text-sm text-[#676a6e] truncate"><p>{source.endpointUrl} </p></div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="text-xs text-gray-500">
                                        <p>
                                            Last synced: —

                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => testSource.mutate(source.id)}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            <FiRefreshCw /> Test
                                        </button>
                                        <button
                                            onClick={() => deleteSource.mutate(source.id)}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {sources.length === 0 && (
                            <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                                <FiDatabase className="mx-auto text-3xl mb-2" />
                                <p>No data sources connected</p>
                                <button
                                    onClick={() => setShowAddModal(true)}
                                    className="btn btn-primary mt-4"
                                >
                                    <FiPlus /> Add Your First Source
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Configuration & Preview */}
                <div>
                    <div className="card">
                        <h4 className="font-semibold mb-4">Data Sync Configuration</h4>

                        <div className="space-y-4">


                            <div>
                                <label className="label">Data Retention</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-gray-600">Keep data for</label>
                                        <select className="select">
                                            <option>30 days</option>
                                            <option>90 days</option>
                                            <option>1 year</option>
                                            <option>Forever</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-600">Archive after</label>
                                        <select className="select">
                                            <option>7 days</option>
                                            <option>30 days</option>
                                            <option>Never</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="label">Access Control</label>
                                <div className="space-y-2">
                                    <label className="checkbox">
                                        <input type="checkbox" defaultChecked />
                                        Read access
                                    </label>
                                    <label className="checkbox">
                                        <input type="checkbox" />
                                        Write access
                                    </label>
                                    <label className="checkbox">
                                        <input type="checkbox" defaultChecked />
                                        Cache responses
                                    </label>
                                    <label className="checkbox">
                                        <input type="checkbox" />
                                        Encrypt stored data
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="label">Error Handling</label>
                                <select className="select">
                                    <option>Retry 3 times then fail</option>
                                    <option>Retry indefinitely</option>
                                    <option>Skip failed records</option>
                                    <option>Stop on first error</option>
                                </select>
                            </div>
                        </div>
                    </div>


                </div>
            </div>


            {showAddModal && (
                <Dialog
                    open={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 0,
                            maxHeight: "90vh",
                        },
                    }}
                >
                    {/* Header */}
                    <DialogTitle sx={{ px: 3, py: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" fontWeight={600}>
                                Add New Data Source
                            </Typography>
                            <IconButton onClick={() => setShowAddModal(false)}>
                                ✕
                            </IconButton>
                        </Box>
                    </DialogTitle>

                    <Divider />

                    {/* Content */}
                    <DialogContent sx={{ px: 3, py: 3 }}>
                        <Typography variant="body2" color="text.secondary" mb={3}>
                            Add a new data source by providing connection details such as provider, type, endpoint, and access credentials
                        </Typography>

                        <Box display="flex" flexDirection="column" gap={3}>
                            {/* Source Name */}
                            <Box>
                                <Typography variant="body2" fontWeight={450} fontSize={'15px'} color='#2f2f32' mb={1}>
                                    Source Name
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder="e.g., Customer Database"
                                    value={newSource.name}
                                    onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                                    sx={inputSx}
                                />
                            </Box>

                            {/* Source Type */}
                            <Box>
                                <Typography variant="body2" fontWeight={450} fontSize={'15px'} color='#2f2f32' mb={1}>
                                    Source Type
                                </Typography>
                                <TextField
                                    select
                                    fullWidth
                                    value={newSource.type}
                                    onChange={(e) => setNewSource({ ...newSource, type: e.target.value })}
                                    sx={{
                                        ...inputSx,
                                        "& .MuiSelect-select": {
                                            display: "flex",
                                            alignItems: "center",
                                            height: "44px !important",
                                        },
                                    }}
                                    SelectProps={{
                                        displayEmpty: true,
                                        renderValue: (selected) => {
                                            if (!selected || selected === "") {
                                                return <span style={{ color: '#999' }}>Select Source Type</span>;
                                            }
                                            return selected;
                                        },
                                    }}
                                >
                                    <MenuItem value="">Select Source Type</MenuItem>
                                    <MenuItem value="Database">Database</MenuItem>
                                    <MenuItem value="API">API</MenuItem>
                                    <MenuItem value="Webhook">Webhook</MenuItem>
                                </TextField>
                            </Box>



                            {/* Provider */}
                            {newSource.type === 'Database' && (
                                <Box>
                                    <Typography variant="body2" fontWeight={450} fontSize={'15px'} color='#2f2f32' mb={1}>
                                        Provider
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        placeholder="e.g., PostgreSQL, MySQL, MongoDB... : "
                                        value={newSource.provider}
                                        onChange={(e) =>
                                            setNewSource({ ...newSource, provider: e.target.value })
                                        }
                                        sx={inputSx}
                                    />
                                </Box>
                            )}


                            {/* Connection String / Endpoint */}
                            <Box>
                                <Typography variant="body2" fontWeight={450} fontSize={'15px'} color='#2f2f32' mb={1}>
                                    {newSource.type === 'Database' ? "Connection String" : "Connection Url"}
                                </Typography>
                                <TextField
                                    fullWidth
                                    placeholder={newSource.type === 'Database'
                                        ? "postgresql://username:password@localhost:5432/database"
                                        : "https://apex.ai/connect-model"
                                    }
                                    value={newSource.connectionString}
                                    onChange={(e) =>
                                        setNewSource({ ...newSource, connectionString: e.target.value })
                                    }
                                    sx={inputSx}
                                />
                            </Box>



                            {/* Authentication */}
                            {newSource.type !== 'Database' && (
                                <Box>
                                    <Typography variant="body2" fontWeight={450} fontSize={'15px'} color='#2f2f32' mb={1}>
                                        Authentication
                                    </Typography>
                                    <TextField
                                        select
                                        fullWidth
                                        value={newSource.authentication}
                                        onChange={(e) => setNewSource({ ...newSource, authentication: e.target.value })}
                                        sx={{
                                            ...inputSx,
                                            "& .MuiSelect-select": {
                                                display: "flex",
                                                alignItems: "center",
                                                height: "44px !important",
                                            },
                                        }}
                                        SelectProps={{
                                            displayEmpty: true,
                                            renderValue: (selected) => {
                                                if (!selected || selected === "") {
                                                    return <span style={{ color: '#999' }}>Select Authentication</span>;
                                                }
                                                return selected;
                                            },
                                        }}
                                    >
                                        <MenuItem value="">Select Authentication</MenuItem>
                                        <MenuItem value="No Authentication">No Authentication</MenuItem>
                                        <MenuItem value="JWT Token">JWT Token</MenuItem>
                                        <MenuItem value="API Key">API Key</MenuItem>

                                    </TextField>
                                </Box>
                            )}

                            {newSource.type &&
                                newSource.type !== 'Database' &&
                                newSource.authentication &&
                                newSource.authentication !== 'No Authentication' && (
                                    <Box>
                                        <Typography variant="body2" fontWeight={450} fontSize={'15px'} color='#2f2f32' mb={1}>
                                            {newSource.authentication === 'JWT Token' ? "JWT Token" : "API Key"}
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder={newSource.authentication === 'JWT Token'
                                                ? "ez51hbjh15246681289nhgsrqw.sdsdqwq...."
                                                : "AzXesids.."
                                            }
                                            value={newSource.connectionString}
                                            onChange={(e) =>
                                                setNewSource({ ...newSource, connectionString: e.target.value })
                                            }
                                            sx={inputSx}
                                        />
                                    </Box>
                                )}

                            {/* {newSource.type === 'Database' && (
                                <Box>
                                    <Typography variant="body2" fontWeight={450} fontSize={'15px'} color='#2f2f32' mb={1}>
                                        Sync Frequency
                                    </Typography>
                                    <TextField
                                        select
                                        fullWidth
                                        value={newSource.frequency}
                                        onChange={(e) => setNewSource({ ...newSource, frequency: e.target.value })}
                                        sx={{
                                            ...inputSx,
                                            "& .MuiSelect-select": {
                                                display: "flex",
                                                alignItems: "center",
                                                height: "44px !important",
                                            },
                                        }}
                                        SelectProps={{
                                            displayEmpty: true,
                                            renderValue: (selected) => {
                                                if (!selected || selected === "") {
                                                    return <span style={{ color: '#999' }}>Select Frequency</span>;
                                                }
                                                return selected;
                                            },
                                        }}
                                    >
                                        <MenuItem value="">Select Frequency</MenuItem>
                                        <MenuItem value="Real-time">Real-time</MenuItem>
                                        <MenuItem value="Every 5 minutes">Every 5 minutes</MenuItem>
                                        <MenuItem value="Every hour">Every hour</MenuItem>
                                        <MenuItem value="Every 6 hour">Every 6 hour</MenuItem>
                                        <MenuItem value="Daily">Daily</MenuItem>
                                        <MenuItem value="Weekly">Weekly</MenuItem>


                                    </TextField>
                                </Box>
                            )} */}

                        </Box>


                    </DialogContent>

                    <Divider />

                    {/* Footer */}
                    <DialogActions sx={{ px: 3, py: 2, mt: 2 }}>
                        <Box sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            gap: 2,
                            width: "100%"
                        }}>
                            <Typography
                                onClick={() => setShowAddModal(false)}
                                sx={{
                                    backgroundColor: "#f4f5f6",
                                    textTransform: "none",
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    padding: "6px 20px",
                                    color: " #2a1c2b",
                                    borderRadius: "4px",
                                    boxShadow: "none",

                                    "&:hover": {
                                        backgroundColor: "#b6b9b8ff",
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                Cancel
                            </Typography>

                            <Typography
                                onClick={() => setShowAddModal(false)}
                                sx={{
                                    backgroundColor: "#f4f5f6",
                                    textTransform: "none",
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    padding: "6px 20px",
                                    color: " #2a1c2b",
                                    borderRadius: "4px",
                                    boxShadow: "none",

                                    "&:hover": {
                                        backgroundColor: "#b6b9b8ff",
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                Test Connection
                            </Typography>

                            <Button
                                onClick={handleAddSource}
                                variant="contained"
                                sx={{
                                    backgroundColor: "#3df599ff",
                                    textTransform: "none",
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    padding: "6px 20px",
                                    color: " #ffffffff",
                                    borderRadius: "4px",
                                    boxShadow: "none",
                                    minWidth: "120px",
                                    "&:hover": {
                                        backgroundColor: "#a6f7dcff",
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                Connect Source
                            </Button>
                        </Box>
                    </DialogActions>

                </Dialog>
            )}

        </div >
    );
};

export default DataSourcesStep;