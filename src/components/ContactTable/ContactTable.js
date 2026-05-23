import React from 'react';
import { formatDate, getInitials, getAvatarColor } from '../../utils/helpers';

function SkeletonRow() {
  return (
    <tr>
      {[1,2,3,4,5,6].map(i => (
        <td key={i}><div className="skeleton" style={{ height: 16, width: i === 1 ? 140 : i === 3 ? 60 : 100 }} /></td>
      ))}
    </tr>
  );
}

export default function ContactTable({ contacts, loading, pagination, onEdit, onView, onDelete, onPageChange }) {
  const { total, page, totalPages, limit } = pagination;
  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const renderPages = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) startPage = Math.max(1, endPage - maxVisible + 1);
    for (let p = startPage; p <= endPage; p++) {
      pages.push(
        <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => onPageChange(p)}>
          {p}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="table-card">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Contact</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Company</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : contacts.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className="empty-state">
                    <div className="empty-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    </div>
                    <p className="empty-title">No contacts found</p>
                    <p className="empty-desc">Try adjusting your search or filter, or add a new contact.</p>
                  </div>
                </td>
              </tr>
            ) : (
              contacts.map(contact => {
                const initials = getInitials(contact.firstName, contact.lastName);
                const color = getAvatarColor(contact.firstName + contact.lastName);
                return (
                  <tr key={contact._id} onClick={() => onView(contact)}>
                    <td>
                      <div className="contact-cell">
                        <div className="avatar" style={{ background: color.bg, color: color.text }}>{initials}</div>
                        <div>
                          <div className="contact-name">{contact.firstName} {contact.lastName}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#1a6ef5', fontFamily: 'var(--mono)', fontSize: 12.5 }}>{contact.email}</td>
                    <td style={{ fontFamily: 'var(--mono)', fontSize: 12.5 }}>{contact.phone}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{contact.company}</td>
                    <td>
                      <span className={`badge ${contact.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                        {contact.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12.5 }}>{formatDate(contact.createdAt)}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="action-cell">
                        <button className="icon-btn" title="View" onClick={() => onView(contact)}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button className="icon-btn" title="Edit" onClick={() => onEdit(contact)}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button className="icon-btn delete" title="Delete" onClick={() => onDelete(contact)}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {total > 0 && (
        <div className="pagination">
          <span>{start}–{end} of {total} contacts</span>
          <div className="pagination-controls">
            <button className="page-btn" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            {renderPages()}
            <button className="page-btn" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
