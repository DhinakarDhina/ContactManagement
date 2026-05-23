import React, { useState, useEffect } from 'react';
import { validateContact } from '../../utils/helpers';

const emptyForm = { firstName: '', lastName: '', email: '', phone: '', company: '', status: 'Active' };

export default function ContactForm({ contact, onSubmit, onClose, loading }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (contact) {
      setForm({
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        email: contact.email || '',
        phone: contact.phone || '',
        company: contact.company || '',
        status: contact.status || 'Active',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
    setTouched({});
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const errs = validateContact({ ...form, [name]: value });
      setErrors(prev => ({ ...prev, [name]: errs[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errs = validateContact(form);
    setErrors(prev => ({ ...prev, [name]: errs[name] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validateContact(form);
    setErrors(errs);
    setTouched({ firstName: true, lastName: true, email: true, phone: true, company: true });
    if (Object.keys(errs).length === 0) {
      onSubmit(form);
    }
  };

  const Field = ({ name, label, placeholder, type = 'text', full = false }) => (
    <div className={`form-group${full ? ' full' : ''}`}>
      <label className="form-label" htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={form[name]}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`form-input${errors[name] ? ' error' : ''}`}
        autoComplete="off"
      />
      {errors[name] && (
        <span className="form-error">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {errors[name]}
        </span>
      )}
    </div>
  );

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-labelledby="form-title" aria-modal="true">
        <div className="modal-header">
          <h2 className="modal-title" id="form-title">
            {contact ? 'Edit Contact' : 'Add New Contact'}
          </h2>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            <div className="form-grid">
              <Field name="firstName" label="First Name" placeholder="e.g. Arjun" />
              <Field name="lastName" label="Last Name" placeholder="e.g. Sharma" />
              <Field name="email" label="Email Address" placeholder="arjun@company.com" type="email" full />
              <Field name="phone" label="Phone Number" placeholder="+91 98765 43210" />
              <Field name="company" label="Company Name" placeholder="e.g. TechCorp India" />
              <div className="form-group">
                <label className="form-label" htmlFor="status">Status</label>
                <select id="status" name="status" value={form.status} onChange={handleChange} className="form-select">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Saving...
                </>
              ) : (
                contact ? 'Save Changes' : 'Add Contact'
              )}
            </button>
          </div>
        </form>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
