import { useState, useEffect } from 'react';

const emptyForm = {
  studentId: '',
  name: '',
  email: '',
  department: '',
  semester: '',
  contact: '',
};

export default function StudentForm({ onSubmit, editingStudent, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingStudent) {
      setForm({
        studentId: editingStudent.studentId,
        name: editingStudent.name,
        email: editingStudent.email,
        department: editingStudent.department,
        semester: editingStudent.semester,
        contact: editingStudent.contact || '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editingStudent]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.studentId.trim()) newErrors.studentId = 'Student ID required';
    if (!form.name.trim()) newErrors.name = 'Full name required';
    if (!form.email.trim()) newErrors.email = 'Email required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Invalid email address';
    if (!form.department) newErrors.department = 'Department selection required';
    if (!form.semester) newErrors.semester = 'Semester required';
    else if (form.semester < 1 || form.semester > 8) newErrors.semester = 'Semester must be between 1 and 8';

    // Validate contact number as exactly 10 digits
    const contactStr = (form.contact || '').trim();
    if (!contactStr) {
      newErrors.contact = 'Contact number is required';
    } else if (!/^\d{10}$/.test(contactStr)) {
      newErrors.contact = 'Contact number must be exactly 10 digits';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const submission = {
      ...form,
      semester: Number(form.semester),
      contact: form.contact.trim(),
    };

    if (editingStudent) {
      onSubmit(editingStudent._id, submission);
    } else {
      onSubmit(submission);
    }
    setForm(emptyForm);
  };

  return (
    <div className="form-section">
      <div className="form-header">
        <div className="form-title-badge">
          {editingStudent ? '✏️ Mode: Update' : '✨ Mode: New Entry'}
        </div>
        <h2>{editingStudent ? 'Edit Student Record' : 'Enroll New Student'}</h2>
        <p className="form-subtitle">
          {editingStudent 
            ? `Updating credentials for student ID: ${editingStudent.studentId}`
            : 'Fill in all mandatory details below to register into MongoDB Atlas.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="student-entry-form">
        <div className="form-group">
          <label className="form-label">Student ID *</label>
          <div className="input-with-icon">
            <span className="field-icon">🆔</span>
            <input
              name="studentId"
              placeholder="e.g. ST101 or A552"
              value={form.studentId}
              onChange={handleChange}
              disabled={!!editingStudent}
              className={errors.studentId ? 'input-error' : ''}
            />
          </div>
          {errors.studentId && <span className="error">{errors.studentId}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <div className="input-with-icon">
            <span className="field-icon">👤</span>
            <input 
              name="name" 
              placeholder="e.g. Rudra Labhasetwar" 
              value={form.name} 
              onChange={handleChange}
              className={errors.name ? 'input-error' : ''}
            />
          </div>
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <div className="input-with-icon">
            <span className="field-icon">✉️</span>
            <input 
              name="email" 
              type="email" 
              placeholder="e.g. student@college.edu" 
              value={form.email} 
              onChange={handleChange}
              className={errors.email ? 'input-error' : ''}
            />
          </div>
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Department *</label>
          <div className="input-with-icon">
            <span className="field-icon">🏢</span>
            <select 
              name="department" 
              value={form.department} 
              onChange={handleChange} 
              required
              className={`select-field ${errors.department ? 'input-error' : ''}`}
            >
              <option value="" disabled hidden>Choose Department</option>
              <option value="Computer Science">💻 Computer Science</option>
              <option value="Electrical">⚡ Electrical</option>
              <option value="Civil">🏗️ Civil</option>
              <option value="Mechanical">⚙️ Mechanical</option>
            </select>
          </div>
          {errors.department && <span className="error">{errors.department}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Semester (1-8) *</label>
          <div className="input-with-icon">
            <span className="field-icon">📚</span>
            <input 
              name="semester" 
              type="number" 
              placeholder="Semester (1 to 8)" 
              min="1" 
              max="8" 
              value={form.semester} 
              onChange={handleChange}
              className={errors.semester ? 'input-error' : ''}
            />
          </div>
          {errors.semester && <span className="error">{errors.semester}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Phone Contact (10 Digits) *</label>
          <div className="input-with-icon">
            <span className="field-icon">📞</span>
            <input 
              name="contact" 
              type="tel" 
              placeholder="10-digit number (e.g. 9876543210)" 
              maxLength="10" 
              value={form.contact} 
              onChange={handleChange} 
              className={errors.contact ? 'input-error' : ''}
            />
          </div>
          {errors.contact && <span className="error">{errors.contact}</span>}
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            {editingStudent ? '💾 Update Changes' : '✨ Register Student'}
          </button>
          {editingStudent && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              ✕ Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
