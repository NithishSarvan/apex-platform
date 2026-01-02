import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stepper,
    Step,
    StepLabel,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Checkbox,
    Chip,
    Typography,
    Button,
    Box,
    Divider,
    Paper,
    Grid
} from '@mui/material';

const OnboardingWizardDialog = ({ open, onClose, onComplete }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        companyName: '',
        description: '',
        sector: '',
        subDomain: '',
        primaryUseCase: '',
        modelPreference: '',
        maxToken: '12678',
        modelType: 'API',
        industry: '',
        useCase: '',
        dataTypes: [],
        compliance: [],
        teamSize: '',
        modelPreference: '',
        icon: null
    });

    const industries = ['Insurance', 'Banking', 'Healthcare', 'Retail', 'Finance', 'Education', 'Manufacturing', 'Other'];
    const useCases = ['Customer Support', 'Claims Processing', 'Fraud Detection', 'Stock Analysis', 'Report Generation', 'Document Processing', 'HR Assistance', 'Other'];
    const dataTypes = ['Customer Data', 'Financial Records', 'Medical Records', 'Product Catalog', 'Market Data', 'Internal Documents', 'APIs/Webhooks', 'Databases'];
    const complianceFrameworks = ['GDPR', 'HIPAA', 'PCI-DSS', 'FINRA', 'SOC2', 'ISO27001'];

    const steps = ['Use Case Info', 'Model Selection', 'Review'];

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            onComplete(formData);
            onClose();
        } else {
            setActiveStep(activeStep + 1);
        }
    };

    const handleTapClick = (step) => {

        setActiveStep(step);

    };

    const handleBack = () => setActiveStep(activeStep - 1);


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

    const inputTextAreaSx = {
        "& .MuiOutlinedInput-root": {
            backgroundColor: "#f4f5f6",
            borderRadius: "0px",
            "& fieldset": {
                border: "none",
            },
            "&:hover fieldset": {
                border: "none",
            },
            "&.Mui-focused fieldset": {
                border: "none",
                outline: "none",
            },
            // Remove fixed height for multiline
            "&.Mui-focused": {
                outline: "none",
                boxShadow: "none",
            },
        },
        "& .MuiInputBase-input": {
            fontSize: "14px",
            color: "#000000",
            padding: "12px",
            // Better line height for multiline
            lineHeight: "1.5",
        },
        // Remove outline on focus for the entire component
        "& .Mui-focused": {
            outline: "none",
        },
    };

    const selectSx = {
        backgroundColor: "#f4f5f6",
        borderRadius: "0px",
        height: 44,
        "& .MuiSelect-select": {
            height: "44px !important",
            minHeight: "44px !important",
            display: "flex",
            alignItems: "center",
            fontSize: "14px",
            color: "#000000",
            padding: "0 12px !important",
        },
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
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({
                    ...prev,
                    icon: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box className="space-y-4">

                        <Box>
                            <Typography variant="body2" fontWeight={450} fontSize={'15px'} color='#2f2f32' mb={1}>
                                Use Case
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter use case"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                sx={inputSx}
                            />
                        </Box>

                        <Box>
                            <Typography
                                variant="body2"
                                fontWeight={450}
                                fontSize={'15px'}
                                color='#2f2f32'
                                mb={1}
                            >
                                Use Case Category
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                value={formData.primaryUseCase}
                                onChange={(e) => setFormData({ ...formData, primaryUseCase: e.target.value })}
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
                                            return <span style={{ color: '#999' }}>Select Use Case Category</span>;
                                        }
                                        return selected;
                                    },
                                }}
                            >
                                <MenuItem value="">Select Use Case Category</MenuItem>
                                {useCases.map(uc => (
                                    <MenuItem key={uc} value={uc}>{uc}</MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        <Box>
                            <Typography
                                variant="body2"
                                fontWeight={450}
                                fontSize={'15px'}
                                color='#2f2f32'
                                mb={1}
                            >
                                Description
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                minRows={4}
                                maxRows={10}
                                placeholder="Enter description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                sx={inputTextAreaSx}
                            />
                        </Box>

                        <Box>
                            <input
                                accept="image/*"
                                type="file"
                                id="logo-upload"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <label htmlFor="logo-upload">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    sx={{
                                        borderColor: '#ddd',
                                        color: '#2f2f32',
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: '#999',
                                            backgroundColor: '#f9f9f9'
                                        }
                                    }}
                                >
                                    Upload Icon
                                </Button>
                            </label>
                            {formData.icon && (
                                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <img
                                        src={formData.icon}
                                        alt="Preview"
                                        style={{ width: 60, height: 60, borderRadius: 4, objectFit: 'contain' }}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        Icon uploaded
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                );

            case 1:
                return (
                    <Box className="space-y-4">
                        {/* Industry Field (styled like Source Type) */}
                        <Box>
                            <Typography
                                variant="body2"
                                fontWeight={450}
                                fontSize={'15px'}
                                color='#2f2f32'
                                mb={1}
                            >
                                Sector
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                value={formData.sector}
                                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
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
                                            return <span style={{ color: '#999' }}>Select Industry</span>;
                                        }
                                        return selected;
                                    },
                                }}
                            >
                                <MenuItem value="">Select Industry</MenuItem>
                                {industries.map(ind => (
                                    <MenuItem key={ind} value={ind}>{ind}</MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        {/* Industry Description */}
                        <Typography
                            variant="body2"
                            sx={{
                                color: '#666',
                                mt: 1,
                                fontStyle: 'italic'
                            }}
                        >
                            {formData.industry === 'Insurance' && 'We\'ll pre-configure policy lookup, claims processing, and compliance tools.'}
                            {formData.industry === 'Banking' && 'We\'ll pre-configure transaction analysis, fraud detection, and financial reporting tools.'}
                            {formData.industry === 'Healthcare' && 'We\'ll pre-configure HIPAA compliance, patient data handling, and medical terminology tools.'}
                            {formData.industry && !['Insurance', 'Banking', 'Healthcare'].includes(formData.industry) && 'We\'ll configure default AI tools for your industry.'}
                        </Typography>

                        <Box>
                            <Typography variant="body2" fontWeight={450} fontSize={'15px'} color='#2f2f32' mb={1}>
                                Sub domain
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter domain"
                                value={formData.subDomain}
                                onChange={(e) => setFormData({ ...formData, subDomain: e.target.value })}
                                sx={inputSx}
                            />
                        </Box>

                        <Box>
                            <Typography
                                variant="body2"
                                fontWeight={450}
                                fontSize={'15px'}
                                color='#2f2f32'
                                mb={1}
                            >
                                Model Preference
                            </Typography>
                            <TextField
                                select
                                fullWidth
                                value={formData.modelPreference}
                                onChange={(e) => setFormData({ ...formData, modelPreference: e.target.value })}
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
                                            return <span style={{ color: '#999' }}>Select Model Preference</span>;
                                        }

                                        // Map values to display names
                                        const displayNames = {
                                            'openai': 'OpenAI GPT-4',
                                            'claude': 'Anthropic Claude',
                                            'llama': 'Meta Llama 3',
                                            'gemini': 'Google Gemini',
                                            'custom': 'Custom/Private Model'
                                        };
                                        return displayNames[selected] || selected;
                                    },
                                }}
                            >
                                <MenuItem value="">Select Model Preference</MenuItem>
                                <MenuItem value="openai">OpenAI GPT-4</MenuItem>
                                <MenuItem value="claude">Anthropic Claude</MenuItem>
                                <MenuItem value="llama">Meta Llama 3</MenuItem>
                                <MenuItem value="gemini">Google Gemini</MenuItem>
                                <MenuItem value="custom">Custom/Private Model</MenuItem>
                            </TextField>
                        </Box>
                    </Box >


                );

            case 2:
                return (
                    <Paper className="bg-gray-50" sx={{ p: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>Configuration Summary</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Use Case:</Typography>
                                <Typography variant="body1" fontWeight="medium">{formData.companyName}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Use Case Category:</Typography>
                                <Typography variant="body1" fontWeight="medium">{formData.primaryUseCase}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Sector:</Typography>
                                <Typography variant="body1" fontWeight="medium">{formData.sector}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Sub Domain:</Typography>
                                <Typography variant="body1" fontWeight="medium">{formData.subDomain}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Model Preference:</Typography>
                                <Typography variant="body1" fontWeight="medium">{formData.modelPreference}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" color="text.secondary">Icon:</Typography>
                            </Box>
                            {formData.icon && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <img
                                        src={formData.icon}
                                        alt="Preview"
                                        style={{ width: 60, height: 60, borderRadius: 4, objectFit: 'contain' }}
                                    />

                                </Box>
                            )}

                        </Box>
                    </Paper>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
        >
            {/* Header */}
            <DialogTitle>
                <Typography variant="h6" fontWeight="bold">
                    Configure setup for model training
                </Typography>
            </DialogTitle>

            <Divider />

            {/* Body */}
            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ display: "flex", minHeight: "400px" }}>

                    <Box className="chat-pop-left"

                    >
                        {steps.map((label, index) => (
                            <Box
                                key={label}
                                onClick={() => handleTapClick(index)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 2,
                                    cursor: "pointer",
                                    color: activeStep === index ? "#00bfa5" : "#666",
                                    fontWeight: activeStep === index ? "bold" : "normal",
                                    "&:hover": {
                                        color: "#00bfa5",
                                        borderRadius: "6px",
                                    },

                                }}
                            >
                                <Typography sx={{ width: 30, fontWeight: 'bold' }}>
                                    {`0${index + 1}`}
                                </Typography>
                                <Typography fontWeight={activeStep === index ? "bold" : "normal"}>
                                    {label}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Right Content - Step Forms */}
                    <Box
                        sx={{
                            flex: 1,
                            p: 3,
                            overflowY: "auto"
                        }}
                    >
                        {renderStepContent(activeStep)}
                    </Box>
                </Box>
            </DialogContent>

            {/* Footer */}
            <DialogActions sx={{ p: 2 }}>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: "#e0e0e0",
                        color: "#a6a6ae",
                        '&:hover': {
                            backgroundColor: "#d5d5d5"
                        }
                    }}
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    sx={{
                        backgroundColor: activeStep === 0 ? "#f5f5f5" : "#00bfa5",
                        color: activeStep === 0 ? "#a6a6ae" : "white",
                        '&:hover': {
                            backgroundColor: activeStep === 0 ? "#f5f5f5" : "#00a992"
                        }
                    }}
                >
                    Back
                </Button>
                <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{
                        backgroundColor: "#00bfa5",
                        color: "white",
                        '&:hover': {
                            backgroundColor: "#00a992"
                        }
                    }}
                >
                    {activeStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
                </Button>
            </DialogActions>


        </Dialog>
    );
};

export default OnboardingWizardDialog;