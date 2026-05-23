import React, { useState, useEffect, useCallback } from 'react';
import { ContactProvider, useContacts } from './context/ContactContext';
import ContactTable from './components/ContactTable/ContactTable';
import ContactForm from './components/ContactForm/ContactForm';
import ContactModal from './components/ContactModal/ContactModal';
import ConfirmDialog from './components/ConfirmDialog/ConfirmDialog';
import { SearchBar } from './components/SearchBar/SearchBar';
import FilterBar from './components/FilterBar/FilterBar';
import Toast from './components/Toast/Toast';
import './styles/App.css';

function AppContent() {
  const {
    contacts, pagination, loading, error,
    fetchContacts, createContact, updateContact, deleteContact,
    setSearch, setStatusFilter, setPage,
    search, statusFilter,
  } = useContacts();

  const [showForm, setShowForm] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [viewContact, setViewContact] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleSearch = useCallback((val) => {
    setSearch(val);
  }, [setSearch]);

  const handleFilter = useCallback((status) => {
    setStatusFilter(status);
  }, [setStatusFilter]);

  useEffect(() => {
    fetchContacts({ search, status: statusFilter, page: 1 });
  }, [search, statusFilter]);

  const handleAddContact = () => {
    setEditContact(null);
    setShowForm(true);
  };

  const handleEdit = (contact) => {
    setEditContact(contact);
    setShowForm(true);
  };

  const handleView = (contact) => {
    setViewContact(contact);
  };

  const handleDelete = (contact) => {
    setDeleteTarget(contact);
  };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editContact) {
        await updateContact(editContact._id, data);
        showToast('Contact updated successfully!');
      } else {
        await createContact(data);
        showToast('Contact added successfully!');
      }
      setShowForm(false);
      setEditContact(null);
      fetchContacts();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteContact(deleteTarget._id);
      showToast(`${deleteTarget.firstName} ${deleteTarget.lastName} deleted.`);
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handlePageChange = (page) => {
    setPage(page);
    fetchContacts({ page });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="9" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M2 20c0-3.866 3.134-7 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M16 14l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="19" cy="16" r="5" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
            </div>
            <div>
              <h1 className="brand-name">ContactHub</h1>
              <p className="brand-tagline">Contact Management System</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-pill">
              <span className="stat-count">{pagination.total}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-pill stat-active">
              <span className="stat-count">{contacts.filter(c => c.status === 'Active').length}</span>
              <span className="stat-label">Active</span>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="toolbar">
          <div className="toolbar-left">
            <SearchBar value={search} onChange={handleSearch} />
            <FilterBar value={statusFilter} onChange={handleFilter} />
          </div>
          <button className="btn-primary" onClick={handleAddContact}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Contact
          </button>
        </div>

        {error && (
          <div className="error-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {error}
            <button onClick={() => fetchContacts()} className="retry-btn">Retry</button>
          </div>
        )}

        <ContactTable
          contacts={contacts}
          loading={loading}
          pagination={pagination}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDelete}
          onPageChange={handlePageChange}
        />
      </main>

      {showForm && (
        <ContactForm
          contact={editContact}
          onSubmit={handleFormSubmit}
          onClose={() => { setShowForm(false); setEditContact(null); }}
          loading={formLoading}
        />
      )}

      {viewContact && (
        <ContactModal
          contact={viewContact}
          onClose={() => setViewContact(null)}
          onEdit={() => { setViewContact(null); handleEdit(viewContact); }}
          onDelete={() => { setViewContact(null); handleDelete(viewContact); }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Contact"
          message={`Are you sure you want to delete ${deleteTarget.firstName} ${deleteTarget.lastName}? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
          danger
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default function App() {
  return (
    <ContactProvider>
      <AppContent />
    </ContactProvider>
  );
}
