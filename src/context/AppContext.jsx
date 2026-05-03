import React, { createContext, useContext, useState, useCallback } from 'react';
import { applicants } from '../data/applicants';

const AppContext = createContext(null);

export function AppContextProvider({ children }) {
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);
  const [activeTab, setActiveTab] = useState('intake');
  const [notes, setNotes] = useState({});
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [showHostGallery, setShowHostGallery] = useState(false);
  const [galleryGuestName, setGalleryGuestName] = useState('');
  const [toasts, setToasts] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);

  // Initialize intakeStates from applicants data
  const [intakeStates, setIntakeStates] = useState(() => {
    const states = {};
    applicants.forEach(a => { states[a.id] = a.intakeState; });
    return states;
  });

  // Track sidebar lock overrides (runtime unlocks from approvals etc.)
  const [sidebarLockOverrides, setSidebarLockOverrides] = useState({});

  const openHostGallery = useCallback((guestName) => {
    setShowHostGallery(true);
    setGalleryGuestName(guestName || '');
  }, []);

  const selectApplicant = useCallback((id) => {
    setSelectedApplicantId(id);
    setActiveTab('intake');
    setShowNotesPanel(false);
    setShowHostGallery(false);
    setGalleryGuestName('');
  }, []);

  const goToDashboard = useCallback(() => {
    setSelectedApplicantId(null);
    setActiveTab('intake');
    setShowNotesPanel(false);
    setShowHostGallery(false);
    setGalleryGuestName('');
  }, []);

  const addNote = useCallback((applicantId, text) => {
    const note = {
      id: Date.now().toString(),
      text,
      timestamp: new Date(),
      coordinatorName: 'Rachael C.'
    };
    setNotes(prev => ({
      ...prev,
      [applicantId]: [note, ...(prev[applicantId] || [])]
    }));
  }, []);

  const deleteNote = useCallback((applicantId, noteId) => {
    setNotes(prev => ({
      ...prev,
      [applicantId]: (prev[applicantId] || []).filter(n => n.id !== noteId)
    }));
  }, []);

  const editNote = useCallback((applicantId, noteId, text) => {
    setNotes(prev => ({
      ...prev,
      [applicantId]: (prev[applicantId] || []).map(n =>
        n.id === noteId ? { ...n, text, timestamp: new Date() } : n
      )
    }));
  }, []);

  const updateIntakeState = useCallback((applicantId, state) => {
    setIntakeStates(prev => ({ ...prev, [applicantId]: state }));
  }, []);

  const unlockSidebarTab = useCallback((applicantId, tab) => {
    setSidebarLockOverrides(prev => ({
      ...prev,
      [applicantId]: { ...(prev[applicantId] || {}), [tab]: false }
    }));
  }, []);

  const confirmMatch = useCallback((guestId, hostName) => {
    const guest = applicants.find(a => a.id === guestId);
    setMatchedPairs(prev => [
      ...prev.filter(p => p.guestId !== guestId),
      {
        guestId,
        guestName: guest?.name || '',
        hostName,
        confirmedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      }
    ]);
    unlockSidebarTab(guestId, 'relationship');
  }, [unlockSidebarTab]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Helper to get effective sidebar locks (merging original + overrides)
  const getSidebarLocks = useCallback((applicantId) => {
    const base = applicants.find(a => a.id === applicantId)?.sidebarLocks || {};
    const overrides = sidebarLockOverrides[applicantId] || {};
    return { ...base, ...overrides };
  }, [sidebarLockOverrides]);

  return (
    <AppContext.Provider value={{
      selectedApplicantId,
      activeTab,
      notes,
      intakeStates,
      matchedPairs,
      showNotesPanel,
      showHostGallery,
      galleryGuestName,
      toasts,
      sidebarLockOverrides,
      selectApplicant,
      goToDashboard,
      setActiveTab,
      addNote,
      deleteNote,
      editNote,
      updateIntakeState,
      unlockSidebarTab,
      confirmMatch,
      showToast,
      dismissToast,
      setShowNotesPanel,
      setShowHostGallery,
      openHostGallery,
      getSidebarLocks
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppContextProvider');
  return ctx;
}
