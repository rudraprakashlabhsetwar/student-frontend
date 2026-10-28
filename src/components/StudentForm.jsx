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
    if (!form.name.trim()) newErrors.name = 'Name required';
    if (!form.email.trim()) newErrors.email = 'Email required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Invalid email';
    if (!form.department) newErrors.department = 'Department required';
    if (!form.semester) newErrors.semester = 'Semester required';
    else if (form.semester < 1 || form.semester > 8) newErrors.semester = 'Semester must be 1-8';

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
      <h2>{editingStudent ? '✏️ Edit Student' : '➕ Add New Student'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            name="studentId"
            placeholder="Student ID (e.g., A440...) *"
            value={form.studentId}
            onChange={handleChange}
            disabled={!!editingStudent}
          />
          {errors.studentId && <span className="error">{errors.studentId}</span>}
        </div>

        <div className="form-group">
          <input name="name" placeholder="Full Name *" value={form.name} onChange={handleChange} />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <input name="email" type="email" placeholder="Email Address *" value={form.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <select 
            name="department" 
            value={form.department} 
            onChange={handleChange} 
            required
            style={{ color: form.department === '' ? '#64748b' : '#f8fafc' }}
          >
            <option value="" disabled hidden>Select Department *</option>
            <option value="Computer Science" style={{ color: '#fdfdfd' }}>Computer Science</option>
            <option value="Electrical" style={{ color: '#fcfcfd' }}>Electrical</option>
            <option value="Civil" style={{ color: '#ffffff' }}>Civil</option>
            <option value="Mechanical" style={{ color: '#ffffff' }}>Mechanical</option>
          </select>
          {errors.department && <span className="error">{errors.department}</span>}
        </div>

        <div className="form-group">
          <input name="semester" type="number" placeholder="Semester (1-8) *" min="1" max="8" value={form.semester} onChange={handleChange} />
          {errors.semester && <span className="error">{errors.semester}</span>}
        </div>

        <div className="form-group">
          <input 
            name="contact" 
            type="tel" 
            placeholder="Contact (exactly 10 digits) *" 
            maxLength="10" 
            value={form.contact} 
            onChange={handleChange} 
          />
          {errors.contact && <span className="error">{errors.contact}</span>}
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">
            {editingStudent ? 'Update Student' : 'Save Student'}
          </button>
          {editingStudent && (
            <button type="button" onClick={onCancel} className="btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
