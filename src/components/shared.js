import React, { useEffect, useRef } from 'react';

// ── SearchBar ──────────────────────────────────────────────────
export function SearchBar({ value, onChange }) {
  const ref = useRef();
  useEffect(() => {
    const handler = setTimeout(() => {}, 0);
    return () => clearTimeout(handler);
  }, [value]);

  return (
    <div className="search-wrap">
      <span className="search-icon">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      </span>
      <input
        ref={ref}
        type="text"
        className="search-input"
        placeholder="Search by name, email, company…"
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label="Search contacts"
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')} aria-label="Clear search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      )}
    </div>
  );
}

// ── FilterBar ─────────────────────────────────────────────────
export function FilterBar({ value, onChange }) {
  return (
    <div className="filter-tabs" role="group" aria-label="Filter by status">
      {['All', 'Active', 'Inactive'].map(s => (
        <button
          key={s}
          className={`filter-tab ${value === s ? 'active' : ''}`}
          onClick={() => onChange(s)}
          aria-pressed={value === s}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

// ── ConfirmDialog ─────────────────────────────────────────────
export function ConfirmDialog({ title, message, onConfirm, onCancel, danger }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal" style={{ maxWidth: 420 }} role="alertdialog" aria-labelledby="confirm-title" aria-modal="true">
        <div className="modal-body" style={{ textAlign: 'center', padding: '28px 28px 20px' }}>
          <div className="confirm-icon" style={{ margin: '0 auto 16px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h2 id="confirm-title" style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{title}</h2>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{message}</p>
        </div>
        <div className="modal-footer" style={{ justifyContent: 'center', gap: 12, padding: '16px 28px 24px' }}>
          <button className="btn-secondary" onClick={onCancel} style={{ minWidth: 100 }}>Cancel</button>
          <button className={danger ? 'btn-danger' : 'btn-primary'} onClick={onConfirm} style={{ minWidth: 100 }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────
export function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3200);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="toast-wrap">
      <div className={`toast ${type}`} role="alert">
        {type === 'success' ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d9e75" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d04040" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        )}
        <span style={{ flex: 1 }}>{message}</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: 2, display: 'flex' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
  );
}
