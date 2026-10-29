import React from 'react';

export default function SearchBar({ value, onChange, count }) {
  return (
    <div className="search-bar-wrapper">
      <div className="search-input-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search by name, student ID, department, or email..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {value && (
          <button 
            type="button" 
            className="search-clear-btn" 
            onClick={() => onChange('')}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>
      <div className="search-count-badge">
        <span className="count-dot"></span>
        <span>{count} {count === 1 ? 'record' : 'records'}</span>
      </div>
    </div>
  );
}
