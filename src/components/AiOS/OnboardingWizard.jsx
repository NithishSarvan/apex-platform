
// ==================== COMPONENT 1: ONBOARDING WIZARD ====================
import React, { useState } from 'react';
import {
    Container, Paper, Typography, Stepper, Step, StepLabel,
    Button, TextField, Select, MenuItem, FormControl, InputLabel,
    Checkbox, Chip, Card, CardContent
} from '@mui/material';

export const OnboardingWizard = ({ onComplete }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({
        companyName: '',
        industry: '',
        useCase: '',
        dataTypes: [],
        compliance: [],
        teamSize: '',
        modelPreference: ''
    });

    const industries = ['Insurance', 'Banking', 'Healthcare', 'Retail', 'Finance'];
    const useCases = ['Customer Support', 'Claims Processing', 'Fraud Detection', 'Stock Analysis'];
    const dataTypes = ['Customer Data', 'Financial Records', 'Medical Records', 'Product Catalog'];
    const complianceFrameworks = ['GDPR', 'HIPAA', 'PCI-DSS', 'FINRA'];

    const steps = ['Company Info', 'Business Domain', 'AI Purpose', 'Data & Compliance', 'Review'];

    const handleNext = () => {
        if (activeStep === steps.length - 1) {
            onComplete(formData);
        } else {
            setActiveStep(activeStep + 1);
        }
    };

    const handleBack = () => setActiveStep(activeStep - 1);

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <div className="space-y-4">
                        <TextField
                            fullWidth
                            label="Company Name"
                            value={formData.companyName}
                            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Team Size"
                            select
                            value={formData.teamSize}
                            onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                        >
                            {['1-10', '11-50', '51-200', '201-1000'].map(size => (
                                <MenuItem key={size} value={size}>{size}</MenuItem>
                            ))}
                        </TextField>
                    </div>
                );

            case 1:
                return (
                    <div className="space-y-4">
                        <FormControl fullWidth>
                            <InputLabel>Industry</InputLabel>
                            <Select
                                value={formData.industry}
                                label="Industry"
                                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                            >
                                {industries.map(ind => (
                                    <MenuItem key={ind} value={ind}>{ind}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <FormControl fullWidth>
                            <InputLabel>Primary Use Case</InputLabel>
                            <Select
                                value={formData.useCase}
                                label="Primary Use Case"
                                onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                            >
                                {useCases.map(uc => (
                                    <MenuItem key={uc} value={uc}>{uc}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            fullWidth
                            label="Model Preference"
                            select
                            value={formData.modelPreference}
                            onChange={(e) => setFormData({ ...formData, modelPreference: e.target.value })}
                        >
                            <MenuItem value="openai">OpenAI GPT-4</MenuItem>
                            <MenuItem value="claude">Anthropic Claude</MenuItem>
                            <MenuItem value="llama">Meta Llama 3</MenuItem>
                            <MenuItem value="custom">Custom/Private Model</MenuItem>
                        </TextField>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <FormControl fullWidth>
                            <InputLabel>Data Types</InputLabel>
                            <Select
                                multiple
                                value={formData.dataTypes}
                                label="Data Types"
                                onChange={(e) => setFormData({ ...formData, dataTypes: e.target.value })}
                                renderValue={(selected) => (
                                    <div className="flex flex-wrap gap-1">
                                        {selected.map(value => (
                                            <Chip key={value} label={value} size="small" />
                                        ))}
                                    </div>
                                )}
                            >
                                {dataTypes.map(type => (
                                    <MenuItem key={type} value={type}>
                                        <Checkbox checked={formData.dataTypes.includes(type)} />
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Compliance</InputLabel>
                            <Select
                                multiple
                                value={formData.compliance}
                                label="Compliance"
                                onChange={(e) => setFormData({ ...formData, compliance: e.target.value })}
                                renderValue={(selected) => (
                                    <div className="flex flex-wrap gap-1">
                                        {selected.map(value => (
                                            <Chip key={value} label={value} size="small" color="primary" />
                                        ))}
                                    </div>
                                )}
                            >
                                {complianceFrameworks.map(framework => (
                                    <MenuItem key={framework} value={framework}>
                                        <Checkbox checked={formData.compliance.includes(framework)} />
                                        {framework}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                );

            case 4:
                return (
                    <Card className="bg-gray-50">
                        <CardContent>
                            <Typography variant="h6" className="mb-4">Configuration Summary</Typography>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Company:</span>
                                    <span className="font-medium">{formData.companyName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Industry:</span>
                                    <span className="font-medium">{formData.industry}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Use Case:</span>
                                    <span className="font-medium">{formData.useCase}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Model:</span>
                                    <span className="font-medium">{formData.modelPreference}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <Container maxWidth="md" className="py-8">
            <Paper className="p-6">
                <Typography variant="h5" className="mb-6 text-center">
                    Configure Your AI Agent
                </Typography>

                <Stepper activeStep={activeStep} className="mb-8">
                    {steps.map(label => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {renderStepContent(activeStep)}

                <div className="flex justify-between mt-8">
                    <Button onClick={handleBack} disabled={activeStep === 0}>
                        Back
                    </Button>
                    <Button variant="contained" onClick={handleNext}>
                        {activeStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
                    </Button>
                </div>
            </Paper>
        </Container>
    );
};