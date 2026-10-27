import { useState, useEffect } from 'react';
import { studentApi } from './api/studentApi';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import SearchBar from './components/SearchBar';
import Home from './components/Home';
import './styles/App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' ya 'student-data'
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3500);
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const res = await studentApi.getAll();
      setStudents(res.data);
    } catch (err) {
      showMessage(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentPage === 'student-data') {
      loadStudents();
    }
  }, [currentPage]);

  const handleCreate = async (student) => {
    try {
      await studentApi.create(student);
      showMessage('✅ Student added successfully');
      loadStudents();
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const handleUpdate = async (id, student) => {
    try {
      await studentApi.update(id, student);
      showMessage('✅ Student updated successfully');
      setEditingStudent(null);
      loadStudents();
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student record?')) return;
    try {
      await studentApi.delete(id);
      showMessage('✅ Student deleted successfully');
      loadStudents();
    } catch (err) {
      showMessage(err.message, 'error');
    }
  };

  const filteredStudents = students.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.name?.toLowerCase().includes(term) ||
      s.studentId?.toLowerCase().includes(term) ||
      s.department?.toLowerCase().includes(term) ||
      s.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer' }}>
            🎓 Student Management
          </h1>
          {currentPage === 'student-data' && (
            <button className="btn-back" onClick={() => setCurrentPage('home')}>
              ← Back to Home
            </button>
          )}
        </div>
      </header>

      {message.text && <div className={`message ${message.type}`}>{message.text}</div>}

      <main className="main-content">
        {currentPage === 'home' ? (
          <Home onNavigate={setCurrentPage} />
        ) : (
          <div className="container">
            <section className="left-panel">
              <StudentForm
                onSubmit={editingStudent ? handleUpdate : handleCreate}
                editingStudent={editingStudent}
                onCancel={() => setEditingStudent(null)}
              />
            </section>

            <section className="right-panel">
              <SearchBar value={searchTerm} onChange={setSearchTerm} count={filteredStudents.length} />
              {loading ? (
                <div className="loading">⏳ Loading students...</div>
              ) : (
                <StudentList students={filteredStudents} onEdit={setEditingStudent} onDelete={handleDelete} />
              )}
            </section>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <span>🌐 Frontend: Vercel</span>
        <span>⚙️ Backend: Render</span>
        <span>🗄️ Database: MongoDB Atlas</span>
      </footer>
    </div>
  );
}

export default App;