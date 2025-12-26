export const DOMAIN_TEMPLATES = {
    insurance: {
        id: 'insurance',
        name: 'Insurance',
        description: 'Policy management, claims processing, customer support',
        semanticEntities: [
            {
                id: 'policy',
                name: 'Policy',
                description: 'Insurance policy contract',
                fields: [
                    { id: 'policy_number', name: 'Policy Number', type: 'string', required: true },
                    { id: 'policy_holder', name: 'Policy Holder', type: 'entity', ref: 'customer' },
                    { id: 'coverage_type', name: 'Coverage Type', type: 'string', enum: ['auto', 'home', 'health', 'life'] },
                    { id: 'premium_amount', name: 'Premium Amount', type: 'number' },
                    { id: 'expiry_date', name: 'Expiry Date', type: 'date' },
                    { id: 'status', name: 'Status', type: 'string', enum: ['active', 'expired', 'cancelled'] }
                ]
            },
            {
                id: 'claim',
                name: 'Claim',
                description: 'Insurance claim request',
                fields: [
                    { id: 'claim_id', name: 'Claim ID', type: 'string', required: true },
                    { id: 'policy', name: 'Policy', type: 'entity', ref: 'policy' },
                    { id: 'incident_date', name: 'Incident Date', type: 'date' },
                    { id: 'amount', name: 'Claim Amount', type: 'number' },
                    { id: 'status', name: 'Status', type: 'string', enum: ['pending', 'approved', 'rejected', 'paid'] },
                    { id: 'description', name: 'Description', type: 'text' }
                ]
            }
        ],
        intents: [
            {
                id: 'get_policy_details',
                name: 'Get Policy Details',
                description: 'Retrieve policy information',
                userPhrases: ['What is my policy number?', 'When does my policy expire?'],
                requiredParameters: ['policy_number'],
                confidenceThreshold: 0.8,
                capabilities: ['policy_lookup']
            }
        ],
        tools: [
            {
                id: 'policy_lookup',
                name: 'policy_lookup',
                description: 'Retrieve policy details by policy number',
                type: 'read',
                implementation: {
                    type: 'sql',
                    query: 'SELECT * FROM policies WHERE policy_number = {{policy_number}}'
                },
                parameters: [
                    { name: 'policy_number', type: 'string', required: true }
                ]
            }
        ],
        guardrails: {
            neverAllow: ['approve_claims', 'modify_policy_terms'],
            requireHuman: ['claims_over_10000', 'policy_cancellation']
        }
    }
};

export default DOMAIN_TEMPLATES;