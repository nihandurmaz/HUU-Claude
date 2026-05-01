import { useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, Lock } from 'lucide-react';
import { applicants } from '../data/applicants';
import { useApp } from '../context/AppContext';
import Avatar from './Avatar';
import StatusBadge from './StatusBadge';
import Sidebar from './Sidebar';
import NotesPanel from './NotesPanel';
import IntakeProfileTab from './tabs/IntakeProfileTab';
import OnboardingEventsTab from './tabs/OnboardingEventsTab';
import MatchmakingTab from './tabs/MatchmakingTab';
import RelationshipManagementTab from './tabs/RelationshipManagementTab';

export default function ApplicantDetail() {
  const { selectedApplicantId, goToDashboard, selectApplicant, activeTab, setActiveTab, showNotesPanel, setShowNotesPanel, intakeStates } = useApp();
  const [lockedMessage, setLockedMessage] = useState(null);

  const applicant = applicants.find(a => a.id === selectedApplicantId);
  if (!applicant) return null;

  const idx = applicants.findIndex(a => a.id === selectedApplicantId);
  const prev = idx > 0 ? applicants[idx - 1] : null;
  const next = idx < applicants.length - 1 ? applicants[idx + 1] : null;

  const currentStatus = intakeStates[applicant.id] === 'denied' ? 'Denied'
    : intakeStates[applicant.id] === 'approved' ? 'Intake profile approved'
    : applicant.status;

  const handleLockedClick = (tabLabel) => {
    setLockedMessage(tabLabel);
    // Clear after active tab change via sidebar
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setLockedMessage(null);
  };

  const renderContent = () => {
    if (lockedMessage) {
      return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: 40, textAlign: 'center' }}>
          <Lock size={48} style={{ color: '#9CA3AF' }} />
          <p style={{ fontWeight: 600, color: '#242424', margin: 0, fontSize: 16 }}>This section is locked.</p>
          <p style={{ margin: 0, fontSize: 14, color: '#7C7C7C' }}>Complete the previous step to unlock.</p>
        </div>
      );
    }
    switch (activeTab) {
      case 'intake': return <IntakeProfileTab applicant={applicant} />;
      case 'onboarding': return <OnboardingEventsTab applicant={applicant} />;
      case 'matchmaking': return <MatchmakingTab applicant={applicant} />;
      case 'relationship': return <RelationshipManagementTab applicant={applicant} />;
      default: return <IntakeProfileTab applicant={applicant} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F1F1F1', display: 'flex', flexDirection: 'column' }}>
      {/* Header card */}
      <div style={{ backgroundColor: '#fff', borderBottom: '1px solid #E5E7EB', padding: '14px 24px' }}>
        {/* Top row: back + navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <button
            onClick={goToDashboard}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#008BF5', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}
          >
            <ChevronLeft size={16} /> Back to Dashboard
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => prev && selectApplicant(prev.id)}
              disabled={!prev}
              style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '5px 12px', fontSize: 13, background: '#fff', cursor: prev ? 'pointer' : 'not-allowed', color: prev ? '#242424' : '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              onClick={() => next && selectApplicant(next.id)}
              disabled={!next}
              style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '5px 12px', fontSize: 13, background: '#fff', cursor: next ? 'pointer' : 'not-allowed', color: next ? '#242424' : '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Applicant info row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <Avatar initials={applicant.initials} color={applicant.avatarColor} size={48} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#242424' }}>{applicant.name}</h3>
                <StatusBadge status={currentStatus} />
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 13, color: '#7C7C7C' }}>
                <span>{applicant.type}</span>
                <span>·</span>
                <span>{applicant.stage}</span>
                <span>·</span>
                <span>Coordinator: {applicant.coordinator}</span>
                <span>·</span>
                <span>Updated: {applicant.updated}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowNotesPanel(n => !n)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 14px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}
          >
            <FileText size={15} /> Notes
          </button>
        </div>
      </div>

      {/* Body: sidebar + content */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        <Sidebar
          applicant={applicant}
          onLockedClick={(label) => { setLockedMessage(label); }}
        />
        <div style={{ flex: 1, display: 'flex', overflowY: 'auto', backgroundColor: '#fff' }}>
          {renderContent()}
        </div>
      </div>

      {/* Notes panel */}
      {showNotesPanel && <NotesPanel applicantId={applicant.id} />}
    </div>
  );
}
