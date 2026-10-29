import React from 'react';

export default function Home({ onNavigate, studentCount = 0 }) {
  return (
    <div className="home-container">
      {/* Decorative ambient glowing orbs in background */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>
      <div className="ambient-glow glow-3"></div>

      <div className="hero-section">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          <span>Cloud-Native Academic Ecosystem</span>
        </div>

        <h1 className="hero-title">
          Empower Education With <br />
          <span className="gradient-text">Student Intelligence</span>
        </h1>

        <p className="hero-subtitle">
          Next-generation management system built for high-performance student record tracking, 
          powered by containerized microservices and resilient cloud databases.
        </p>

        <div className="hero-cta-group">
          <button className="btn-hero-primary" onClick={() => onNavigate('student-data')}>
            <span>📂 Open Student Directory</span>
            <span className="btn-arrow">→</span>
          </button>
          <button className="btn-hero-secondary" onClick={() => onNavigate('student-data')}>
            <span>➕ Enroll New Student</span>
          </button>
        </div>

        {/* Live Metrics Row */}
        <div className="metrics-bar">
          <div className="metric-item">
            <span className="metric-number">{studentCount}</span>
            <span className="metric-label">Enrolled Students</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <span className="metric-number">100%</span>
            <span className="metric-label">Cloud Uptime</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <span className="metric-number">&lt; 50ms</span>
            <span className="metric-label">API Latency</span>
          </div>
          <div className="metric-divider"></div>
          <div className="metric-item">
            <span className="metric-number">4</span>
            <span className="metric-label">Departments</span>
          </div>
        </div>
      </div>

      {/* Cloud Architecture Pipeline Banner */}
      <div className="telemetry-banner">
        <div className="telemetry-node">
          <span className="node-icon">🌐</span>
          <div className="node-info">
            <span className="node-name">Frontend Edge</span>
            <span className="node-status">Vercel Production</span>
          </div>
        </div>
        <span className="telemetry-arrow">⚡</span>
        <div className="telemetry-node">
          <span className="node-icon">🐳</span>
          <div className="node-info">
            <span className="node-name">Container Service</span>
            <span className="node-status">Render Docker</span>
          </div>
        </div>
        <span className="telemetry-arrow">⚡</span>
        <div className="telemetry-node">
          <span className="node-icon">🗄️</span>
          <div className="node-info">
            <span className="node-name">Database Cluster</span>
            <span className="node-status">MongoDB Atlas</span>
          </div>
        </div>
      </div>

      {/* Feature Showcase Grid */}
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon-wrapper icon-purple">
            <span>⚡</span>
          </div>
          <h3>Dockerized Backend API</h3>
          <p>
            Deployed on Render with dynamic port binding, automated container health checks, and sub-second cold starts.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper icon-cyan">
            <span>🛡️</span>
          </div>
          <h3>Enterprise Atlas Security</h3>
          <p>
            Zero-leak TLS encrypted connections with strict validation rules for student IDs, emails, and 10-digit contacts.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper icon-emerald">
            <span>🔍</span>
          </div>
          <h3>Real-Time Search & Filtering</h3>
          <p>
            Instant multi-parameter query engine to search across names, IDs, departments, and semesters with immediate feedback.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon-wrapper icon-amber">
            <span>✨</span>
          </div>
          <h3>Glassmorphic Modern UI</h3>
          <p>
            Crafted with responsive layouts, smooth micro-interactions, backdrop blurs, and adaptive dark mode aesthetics.
          </p>
        </div>
      </div>
    </div>
  );
}
