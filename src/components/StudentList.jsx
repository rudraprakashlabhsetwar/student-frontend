import React from 'react';

// Department badge styling helper
const getDepartmentBadge = (dept) => {
  switch (dept) {
    case 'Computer Science':
      return { className: 'dept-badge dept-cs', icon: '💻' };
    case 'Electrical':
      return { className: 'dept-badge dept-ee', icon: '⚡' };
    case 'Civil':
      return { className: 'dept-badge dept-civil', icon: '🏗️' };
    case 'Mechanical':
      return { className: 'dept-badge dept-mech', icon: '⚙️' };
    default:
      return { className: 'dept-badge dept-default', icon: '📚' };
  }
};

// Generates an avatar gradient and initials
const getAvatar = (name) => {
  const parts = (name || '').trim().split(' ').filter(Boolean);
  const initials = parts.length >= 2 
    ? (parts[0][0] + parts[1][0]).toUpperCase() 
    : (name ? name.slice(0, 2).toUpperCase() : 'ST');
  
  const gradients = [
    'linear-gradient(135deg, #6366f1, #8b5cf6)',
    'linear-gradient(135deg, #06b6d4, #3b82f6)',
    'linear-gradient(135deg, #10b981, #059669)',
    'linear-gradient(135deg, #f59e0b, #d97706)',
    'linear-gradient(135deg, #ec4899, #8b5cf6)',
  ];
  
  const charSum = (name || '').split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const bg = gradients[charSum % gradients.length];
  
  return { initials, bg };
};

export default function StudentList({ students, onEdit, onDelete }) {
  if (students.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <p>No matching students found</p>
        <small>Try adjusting your search criteria or add a new student using the enrollment form.</small>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="student-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>ID</th>
            <th>Department</th>
            <th>Sem</th>
            <th>Contact</th>
            <th style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => {
            const avatar = getAvatar(s.name);
            const deptInfo = getDepartmentBadge(s.department);

            return (
              <tr key={s._id} className="student-row">
                {/* Avatar + Name + Email */}
                <td>
                  <div className="student-profile">
                    <div className="student-avatar" style={{ background: avatar.bg }}>
                      {avatar.initials}
                    </div>
                    <div className="student-details">
                      <span className="student-name">{s.name}</span>
                      <span className="student-email">{s.email}</span>
                    </div>
                  </div>
                </td>

                {/* Student ID badge */}
                <td>
                  <span className="student-id-chip">{s.studentId}</span>
                </td>

                {/* Department badge */}
                <td>
                  <span className={deptInfo.className}>
                    <span>{deptInfo.icon}</span>
                    <span>{s.department}</span>
                  </span>
                </td>

                {/* Semester chip */}
                <td>
                  <span className="sem-chip">Sem {s.semester}</span>
                </td>

                {/* Contact */}
                <td>
                  <span className="contact-chip">
                    📞 {s.contact || '—'}
                  </span>
                </td>

                {/* Action Buttons */}
                <td style={{ textAlign: 'center' }}>
                  <div className="actions">
                    <button 
                      onClick={() => onEdit(s)} 
                      className="btn-action btn-edit" 
                      title="Edit Student Record"
                      aria-label="Edit Student"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => onDelete(s._id)} 
                      className="btn-action btn-delete" 
                      title="Delete Student Record"
                      aria-label="Delete Student"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
