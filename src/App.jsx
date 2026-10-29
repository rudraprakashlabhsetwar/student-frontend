import { useState, useEffect, useMemo } from 'react';
import { studentApi } from './api/studentApi';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import SearchBar from './components/SearchBar';
import Home from './components/Home';
import './styles/App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'student-data'
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await studentApi.getAll();
      setStudents(res.data || []);
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Load students initially so metrics are available immediately
  useEffect(() => {
    loadStudents();
  }, []);

  // Reload when switching to student-data page to guarantee freshness
  useEffect(() => {
    if (currentPage === 'student-data') {
      loadStudents();
    }
  }, [currentPage]);

  const handleCreate = async (student) => {
    try {
      await studentApi.create(student);
      showMessage('🎉 Student successfully registered into Atlas DB');
      loadStudents();
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const handleUpdate = async (id, student) => {
    try {
      await studentApi.update(id, student);
      showMessage('✅ Student record updated successfully');
      setEditingStudent(null);
      loadStudents();
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student record? This action cannot be undone.')) return;
    try {
      await studentApi.delete(id);
      showMessage('🗑️ Student record successfully deleted');
      loadStudents();
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  // Filter students by search term and selected department chip
  const filteredStudents = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return students.filter((s) => {
      const matchesSearch =
        s.name?.toLowerCase().includes(term) ||
        s.studentId?.toLowerCase().includes(term) ||
        s.department?.toLowerCase().includes(term) ||
        s.email?.toLowerCase().includes(term);

      const matchesDept = selectedDept === 'All' || s.department === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [students, searchTerm, selectedDept]);

  // Department counts for filter chips
  const departments = ['All', 'Computer Science', 'Electrical', 'Civil', 'Mechanical'];

  return (
    <div className="app">
      {/* Sleek Glassmorphism Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="brand" onClick={() => setCurrentPage('home')}>
            <span className="brand-logo">🎓</span>
            <div className="brand-text">
              <h1>StudentHub<span className="brand-accent">Pro</span></h1>
              <span className="brand-badge">v2.0 Cloud</span>
            </div>
          </div>

          <div className="header-actions">
            <button 
              className={`nav-pill ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => setCurrentPage('home')}
            >
              🏠 Home
            </button>
            <button 
              className={`nav-pill ${currentPage === 'student-data' ? 'active' : ''}`}
              onClick={() => setCurrentPage('student-data')}
            >
              📊 Directory ({students.length})
            </button>
            <div className="status-indicator" title="All Cloud Systems Connected">
              <span className="status-pulse"></span>
              <span className="status-text">Cloud Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Alert Messages */}
      {message.text && (
        <div className={`message ${message.type}`}>
          <span className="message-icon">{message.type === 'error' ? '⚠️' : '✨'}</span>
          <span>{message.text}</span>
          <button className="message-close" onClick={() => setMessage({ text: '', type: '' })}>✕</button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="main-content">
        {currentPage === 'home' ? (
          <Home onNavigate={setCurrentPage} studentCount={students.length} />
        ) : (
          <div className="container">
            {/* Left Panel: Form */}
            <section className="left-panel">
              <StudentForm
                onSubmit={editingStudent ? handleUpdate : handleCreate}
                editingStudent={editingStudent}
                onCancel={() => setEditingStudent(null)}
              />
            </section>

            {/* Right Panel: Search, Filters & Student List */}
            <section className="right-panel">
              <div className="directory-header">
                <div>
                  <h2 className="directory-title">Academic Directory</h2>
                  <p className="directory-subtitle">Browse, filter, and manage verified student profiles</p>
                </div>
                <button 
                  className="btn-refresh" 
                  onClick={loadStudents}
                  title="Refresh from MongoDB Atlas"
                  disabled={loading}
                >
                  🔄 {loading ? 'Syncing...' : 'Sync Data'}
                </button>
              </div>

              {/* Department Filter Chips */}
              <div className="dept-filter-bar">
                {departments.map((dept) => {
                  const count = dept === 'All' 
                    ? students.length 
                    : students.filter((s) => s.department === dept).length;
                  return (
                    <button
                      key={dept}
                      className={`filter-chip ${selectedDept === dept ? 'active' : ''}`}
                      onClick={() => setSelectedDept(dept)}
                    >
                      <span>{dept}</span>
                      <span className="chip-count">{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <SearchBar 
                value={searchTerm} 
                onChange={setSearchTerm} 
                count={filteredStudents.length} 
              />

              {/* Student Table or Loading Indicator */}
              {loading ? (
                <div className="loading-card">
                  <div className="loading-spinner"></div>
                  <p>Synchronizing real-time student records from Render & Atlas...</p>
                </div>
              ) : (
                <StudentList 
                  students={filteredStudents} 
                  onEdit={(s) => {
                    setEditingStudent(s);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                  onDelete={handleDelete} 
                />
              )}
            </section>
          </div>
        )}
      </main>

      {/* Modern Footer with Architecture Telemetry */}
      <footer className="app-footer">
        <div className="footer-pill">
          <span className="pill-dot vercel-dot"></span>
          <span>Frontend: <strong>Vercel Edge</strong></span>
        </div>
        <div className="footer-pill">
          <span className="pill-dot render-dot"></span>
          <span>Backend: <strong>Render Docker Container</strong></span>
        </div>
        <div className="footer-pill">
          <span className="pill-dot mongo-dot"></span>
          <span>Database: <strong>MongoDB Atlas Cluster</strong></span>
        </div>
      </footer>
    </div>
  );
}

export default App;
