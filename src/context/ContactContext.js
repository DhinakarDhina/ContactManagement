import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { contactsAPI } from '../utils/api';

const ContactContext = createContext(null);

const initialState = {
  contacts: [],
  pagination: { total: 0, page: 1, limit: 10, totalPages: 1 },
  loading: false,
  error: null,
  selectedContact: null,
  search: '',
  statusFilter: 'All',
};

function contactReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'SET_CONTACTS':
      return { ...state, loading: false, contacts: action.payload.data, pagination: action.payload.pagination };
    case 'ADD_CONTACT':
      return { ...state, contacts: [action.payload, ...state.contacts], pagination: { ...state.pagination, total: state.pagination.total + 1 } };
    case 'UPDATE_CONTACT':
      return { ...state, contacts: state.contacts.map(c => c._id === action.payload._id ? action.payload : c) };
    case 'DELETE_CONTACT':
      return { ...state, contacts: state.contacts.filter(c => c._id !== action.payload), pagination: { ...state.pagination, total: Math.max(0, state.pagination.total - 1) } };
    case 'SET_SELECTED':
      return { ...state, selectedContact: action.payload };
    case 'SET_SEARCH':
      return { ...state, search: action.payload, pagination: { ...state.pagination, page: 1 } };
    case 'SET_STATUS_FILTER':
      return { ...state, statusFilter: action.payload, pagination: { ...state.pagination, page: 1 } };
    case 'SET_PAGE':
      return { ...state, pagination: { ...state.pagination, page: action.payload } };
    default:
      return state;
  }
}

export function ContactProvider({ children }) {
  const [state, dispatch] = useReducer(contactReducer, initialState);

  const fetchContacts = useCallback(async (params = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await contactsAPI.getAll({
        search: state.search,
        status: state.statusFilter,
        page: state.pagination.page,
        limit: state.pagination.limit,
        ...params,
      });
      dispatch({ type: 'SET_CONTACTS', payload: res });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message });
    }
  }, [state.search, state.statusFilter, state.pagination.page, state.pagination.limit]);

  const createContact = useCallback(async (data) => {
    const res = await contactsAPI.create(data);
    dispatch({ type: 'ADD_CONTACT', payload: res.data });
    return res;
  }, []);

  const updateContact = useCallback(async (id, data) => {
    const res = await contactsAPI.update(id, data);
    dispatch({ type: 'UPDATE_CONTACT', payload: res.data });
    return res;
  }, []);

  const deleteContact = useCallback(async (id) => {
    await contactsAPI.delete(id);
    dispatch({ type: 'DELETE_CONTACT', payload: id });
  }, []);

  const selectContact = useCallback((contact) => {
    dispatch({ type: 'SET_SELECTED', payload: contact });
  }, []);

  const setSearch = useCallback((val) => dispatch({ type: 'SET_SEARCH', payload: val }), []);
  const setStatusFilter = useCallback((val) => dispatch({ type: 'SET_STATUS_FILTER', payload: val }), []);
  const setPage = useCallback((val) => dispatch({ type: 'SET_PAGE', payload: val }), []);

  return (
    <ContactContext.Provider value={{
      ...state,
      fetchContacts,
      createContact,
      updateContact,
      deleteContact,
      selectContact,
      setSearch,
      setStatusFilter,
      setPage,
    }}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContacts() {
  const ctx = useContext(ContactContext);
  if (!ctx) throw new Error('useContacts must be used inside ContactProvider');
  return ctx;
}
