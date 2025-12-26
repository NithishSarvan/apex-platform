import React from 'react';

const FilterPanel = ({ setShowFilters }) => (
    <div className="filter-overlay" onClick={() => setShowFilters(false)}>
        <div className="filter-panel" onClick={(e) => e.stopPropagation()}>
            <h3>Providers</h3>

            {['OpenAI', 'Meta', 'Mistral AI'].map((p) => (
                <label key={p}>
                    <input type="checkbox" /> {p}
                </label>
            ))}

            <div className="filter-actions">
                <button className="clear-btn">Clear</button>
                <button className="apply-btn" onClick={() => setShowFilters(false)}>
                    Apply
                </button>
            </div>
        </div>
    </div>
);

export default FilterPanel;
