import React from 'react';
import { formatDate, getInitials, getAvatarColor } from '../../utils/helpers';

export default function ContactModal({ contact, onClose, onEdit, onDelete }) {
  const initials = getInitials(contact.firstName, contact.lastName);
  const color = getAvatarColor(contact.firstName + contact.lastName);

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="detail-header">
          <div className="detail-avatar" style={{ background: color.bg, color: color.text }}>{initials}</div>
          <div style={{ flex: 1 }}>
            <div className="detail-name">{contact.firstName} {contact.lastName}</div>
            <div className="detail-company">{contact.company}</div>
            <span className={`badge ${contact.status === 'Active' ? 'badge-active' : 'badge-inactive'}`} style={{ marginTop: 8, display: 'inline-flex' }}>
              {contact.status}
            </span>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-row">
              <div className="detail-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <div className="detail-label">Email</div>
                <a href={`mailto:${contact.email}`} className="detail-value" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                  {contact.email}
                </a>
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.25h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.06-.97a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                <div className="detail-label">Phone</div>
                <div className="detail-value" style={{ fontFamily: 'var(--mono)' }}>{contact.phone}</div>
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <div>
                <div className="detail-label">Company</div>
                <div className="detail-value">{contact.company}</div>
              </div>
            </div>
            <div className="detail-row">
              <div className="detail-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div>
                <div className="detail-label">Created</div>
                <div className="detail-value">{formatDate(contact.createdAt)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onDelete} style={{ color: 'var(--danger)', borderColor: '#fca5a5' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: 4 }}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            Delete
          </button>
          <button className="btn-secondary" onClick={onClose}>Close</button>
          <button className="btn-primary" onClick={onEdit}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle', marginRight: 4 }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit Contact
          </button>
        </div>
      </div>
    </div>
  );
}
