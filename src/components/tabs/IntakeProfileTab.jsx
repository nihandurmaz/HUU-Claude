import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import AccordionSection from '../AccordionSection';
import Modal from '../Modal';

function QA({ q, a, redIfEmpty }) {
  const isEmpty = !a || a === 'No answer yet';
  return (
    <div style={{ marginBottom: 10 }}>
      <p style={{ margin: 0, fontSize: 12, color: '#7C7C7C', fontWeight: 500 }}>{q}</p>
      <p style={{ margin: '2px 0 0', fontSize: 14, color: isEmpty && redIfEmpty ? '#DC2626' : '#242424', fontWeight: isEmpty && redIfEmpty ? 600 : 400 }}>
        {a || 'No answer yet'}
      </p>
    </div>
  );
}

function Stepper({ state }) {
  const steps = ['In Review', 'Information Requested', 'Resubmitted', 'Approved'];
  const stateToStep = { inReview: 0, infoRequested: 1, resubmitted: 2, approved: 3, denied: 3 };
  const current = stateToStep[state] ?? 0;

  const activeColor = state === 'resubmitted' ? '#7C3AED'
    : state === 'approved' ? '#1A7F37'
    : '#008BF5';

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: done ? '#1A7F37' : active ? activeColor : '#E5E7EB',
                color: done || active ? '#fff' : '#9CA3AF', fontWeight: 700, fontSize: 12, flexShrink: 0
              }}>
                {done ? '✓' : i + 1}
              </div>
              <span style={{
                fontSize: 11, color: done ? '#6B7280' : active ? activeColor : '#9CA3AF',
                textAlign: 'center', fontWeight: active ? 600 : 400, whiteSpace: 'nowrap'
              }}>
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, backgroundColor: i < current ? activeColor : '#E5E7EB', margin: '0 8px', marginBottom: 20 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function IntakeProfileTab({ applicant }) {
  const { intakeStates, updateIntakeState, setActiveTab, unlockSidebarTab, showToast, goToDashboard } = useApp();
  const state = intakeStates[applicant.id] || applicant.intakeState;

  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDenyModal, setShowDenyModal] = useState(false);

  const [infoCategories, setInfoCategories] = useState({ employment: true, education: false, background: false, interest: false, substance: true });
  const [infoNote, setInfoNote] = useState('');
  const [infoCatError, setInfoCatError] = useState('');

  const toggleCat = (key) => {
    setInfoCategories(prev => ({ ...prev, [key]: !prev[key] }));
    setInfoCatError('');
  };

  const handleSendRequest = () => {
    const anySelected = Object.values(infoCategories).some(Boolean);
    if (!anySelected) { setInfoCatError('Please select at least one category'); return; }
    setShowInfoModal(false);
    showToast(`✅ Request sent to ${applicant.name}`, 'success');
    updateIntakeState(applicant.id, 'infoRequested');
  };

  const handleApprove = () => {
    setShowApproveModal(false);
    updateIntakeState(applicant.id, 'approved');
    unlockSidebarTab(applicant.id, 'onboarding');
    showToast(`✅ ${applicant.name}'s profile approved`, 'success');
  };

  const handleDeny = () => {
    setShowDenyModal(false);
    updateIntakeState(applicant.id, 'denied');
    showToast(`${applicant.name}'s application denied`, 'error');
    goToDashboard();
  };

  const pendingBadge = state === 'resubmitted'
    ? <><RotateCcw size={11} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />Resubmitted</>
    : 'Needs Attention';
  const pendingBadgeType = state === 'resubmitted' ? 'purple' : 'amber';

  return (
    <div style={{ padding: 24, flex: 1, overflowY: 'auto' }}>
      <Stepper state={state} />

      {/* Dates row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: 13, color: '#6B7280' }}>
          Submitted {state === 'resubmitted' ? '30th Aug 2025' : '24th Aug 2025'}
        </span>
        {state === 'resubmitted' && (
          <span style={{ fontSize: 13, color: '#7C3AED', fontWeight: 500 }}>1st Sep 2025 | Resubmitted</span>
        )}
        {state === 'infoRequested' && (
          <span style={{ fontSize: 13, color: '#D69E2E', fontWeight: 500 }}>25th Aug 2025 | Information requested</span>
        )}
        {state === 'approved' && (
          <span style={{ fontSize: 13, color: '#1A7F37', fontWeight: 500 }}>✅ Approved on 1st Sep 2025</span>
        )}
      </div>

      {/* In review banner */}
      {state === 'inReview' && (
        <div style={{ backgroundColor: '#FEF3C7', borderLeft: '3px solid #92400E', borderRadius: 6, padding: '12px 16px', marginBottom: 16 }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: '#92400E' }}>📋 Intake under review</p>
        </div>
      )}

      {/* Resubmitted banner */}
      {state === 'resubmitted' && (
        <div style={{ backgroundColor: '#F3E8FF', border: '1px solid #7C3AED', borderRadius: 6, padding: 16, marginBottom: 16 }}>
          <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 13, color: '#7C3AED' }}>↺ Resubmitted by applicant</p>
          <p style={{ margin: 0, fontSize: 13, color: '#7C3AED' }}>
            {applicant.name} has provided additional information for Employment Information and Substance Use. Please review and approve or request more information.
          </p>
        </div>
      )}

      {/* Info requested banner */}
      {state === 'infoRequested' && (
        <div style={{ backgroundColor: '#FEF3C7', borderLeft: '3px solid #92400E', borderRadius: 6, padding: '12px 16px', marginBottom: 16 }}>
          <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 13, color: '#92400E' }}>📤 Information requested</p>
          <p style={{ margin: 0, fontSize: 13, color: '#92400E' }}>More information has been requested from {applicant.name}. Awaiting applicant response.</p>
        </div>
      )}

      {/* Approved banner */}
      {state === 'approved' && (
        <div style={{ backgroundColor: '#F0FDF4', borderLeft: '3px solid #1A7F37', border: '1px solid #E5E7EB', borderRadius: 6, padding: '14px 16px', marginBottom: 20 }}>
          <p style={{ margin: '0 0 6px', color: '#1A7F37', fontWeight: 600, fontSize: 13 }}>
            ✅ Intake profile approved on 1st Sep 2025
          </p>
          <button
            onClick={() => setActiveTab('onboarding')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#008BF5', fontSize: 13, fontWeight: 600, padding: 0 }}
          >
            Go to Onboarding Events →
          </button>
        </div>
      )}

      {/* Action buttons */}
      {(state === 'inReview' || state === 'resubmitted') && (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginBottom: 24 }}>
          <button
            onClick={() => setShowDenyModal(true)}
            style={{ backgroundColor: '#fff', color: '#DC2626', border: '1px solid #DC2626', borderRadius: 6, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Deny
          </button>
          <button
            onClick={() => setShowInfoModal(true)}
            style={{ backgroundColor: '#fff', color: '#008BF5', border: '1px solid #008BF5', borderRadius: 6, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Request More Info
          </button>
          <button
            onClick={() => setShowApproveModal(true)}
            style={{ backgroundColor: '#242424', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Approve {applicant.type}
          </button>
        </div>
      )}

      {/* Sections */}
      {state !== 'approved' && (
        <>
          <p style={{ margin: '0 0 8px', fontSize: 11, color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            PENDING (2)
          </p>
          <AccordionSection title="Employment Information" badge={pendingBadge} badgeType={pendingBadgeType}>
            <QA q="Are you currently employed?" a="Yes" />
            <QA q="Role:" a="Part-time barista, Blue Bottle Coffee" />
            <QA q="Seeking employment or educational opportunities?" a="Yes" />
          </AccordionSection>
          <AccordionSection title="Substance Use" badge={pendingBadge} badgeType={pendingBadgeType}>
            <QA q="Do you smoke cigarettes?" a="Yes" />
            <QA q="Smoke inside home?" a="Yes" />
            <QA q="Drink alcohol?" a="Yes" />
            <QA q="Concerns about drinking?" a="No" />
            <QA q="Other substances?" a="No" />
            <QA q="Agree to no substance use in host home?" a="No answer yet" redIfEmpty />
          </AccordionSection>
          <p style={{ margin: '16px 0 8px', fontSize: 11, color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            APPROVED (4)
          </p>
        </>
      )}

      {state === 'approved' && (
        <p style={{ margin: '0 0 8px', fontSize: 11, color: '#6B7280', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          APPROVED (6)
        </p>
      )}

      <AccordionSection title="Education" badge="Approved" badgeType="green">
        <QA q="GED or diploma?" a="Yes, Jefferson High School" />
        <QA q="Currently enrolled?" a="No" />
      </AccordionSection>

      <AccordionSection title="Background" badge="Approved" badgeType="green">
        <QA q="Currently staying:" a="Friend's place" />
        <QA q="In LA for:" a="2 years" />
        <QA q="Next Step Tool assessment:" a="In progress" />
        <QA q="Case management:" a="Yes" />
        <QA q="Case manager:" a="Maria Reyes, SPY Housing Team" />
      </AccordionSection>

      <AccordionSection title="Language Proficiency" badge="Approved" badgeType="green">
        <QA q="Bilingual or multilingual?" a="Yes" />
        <QA q="Languages:" a="English, Spanish" />
      </AccordionSection>

      <AccordionSection title="Interest as a Guest" badge="Approved" badgeType="green">
        <QA q="Preferred host:" a="Someone accepting of my identity, ideally speaks Spanish or understands Latino culture." />
        <QA q="Allergies:" a="No" />
        <QA q="Strengths:" a="Hardworking, respectful of shared spaces, committed to finding permanent housing." />
        <QA q="Willing to develop a case plan?" a="Yes" />
        <QA q="Commit to no overnight guests?" a="Yes" />
        <QA q="Weekly case management?" a="Yes" />
      </AccordionSection>

      {state === 'approved' && (
        <>
          <AccordionSection title="Employment Information" badge="Approved" badgeType="green">
            <QA q="Are you currently employed?" a="Yes" />
            <QA q="Role:" a="Part-time barista, Blue Bottle Coffee" />
            <QA q="Seeking employment or educational opportunities?" a="Yes" />
          </AccordionSection>
          <AccordionSection title="Substance Use" badge="Approved" badgeType="green">
            <QA q="Do you smoke cigarettes?" a="Yes" />
            <QA q="Agree to no substance use in host home?" a="Yes" />
          </AccordionSection>
        </>
      )}

      {/* Request More Info Modal */}
      <Modal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} title="Request more information">
        <p style={{ margin: '0 0 16px', fontSize: 13, color: '#7C7C7C' }}>
          You are requesting more information from {applicant.type}.
        </p>
        <p style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700, color: '#242424' }}>
          Select the category(s) where more information is needed.
        </p>
        <p style={{ margin: '0 0 12px', fontSize: 12, color: '#7C7C7C', fontStyle: 'italic' }}>
          Categories not selected would be approved and locked from further updates
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 4 }}>
          {[
            { key: 'employment', label: 'Employment Information' },
            { key: 'education',  label: 'Education' },
            { key: 'background', label: 'Background' },
            { key: 'interest',   label: 'Interest as a Guest' },
            { key: 'substance',  label: 'Substance Use' }
          ].map(({ key, label }) => (
            <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: '#242424' }}>
              <input type="checkbox" checked={infoCategories[key]} onChange={() => toggleCat(key)} />
              {label}
            </label>
          ))}
        </div>
        {infoCatError && <p style={{ margin: '4px 0 8px', fontSize: 12, color: '#DC2626' }}>{infoCatError}</p>}
        <div style={{ marginTop: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#242424', display: 'block', marginBottom: 4 }}>Add a note *</label>
          <textarea
            value={infoNote}
            onChange={e => setInfoNote(e.target.value)}
            placeholder="Add details about what is needed"
            style={{ width: '100%', minHeight: 80, border: '1px solid #E5E7EB', borderRadius: 6, padding: 8, fontSize: 13, resize: 'vertical', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }}
          />
          <p style={{ margin: '4px 0 0', fontSize: 11, color: '#9CA3AF' }}>This note will be visible to the Guest/Host</p>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          <button
            onClick={() => setShowInfoModal(false)}
            style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: 6, padding: '8px 0', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSendRequest}
            style={{ flex: 1, backgroundColor: '#242424', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Send Request
          </button>
        </div>
      </Modal>

      {/* Approve Modal */}
      <Modal isOpen={showApproveModal} onClose={() => setShowApproveModal(false)} title="Approve intake profile?">
        <p style={{ margin: '0 0 20px', fontSize: 14, color: '#7C7C7C' }}>
          Approve {applicant.name}'s intake profile? This will unlock Onboarding Events and notify the applicant.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setShowApproveModal(false)}
            style={{ flex: 1, border: '1px solid #008BF5', borderRadius: 6, padding: '8px 0', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#008BF5' }}
          >
            Cancel
          </button>
          <button
            onClick={handleApprove}
            style={{ flex: 1, backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Confirm
          </button>
        </div>
      </Modal>

      {/* Deny Modal */}
      <Modal isOpen={showDenyModal} onClose={() => setShowDenyModal(false)} title={`Deny ${applicant.name}'s application?`}>
        <p style={{ margin: '0 0 20px', fontSize: 14, color: '#7C7C7C' }}>
          This will permanently close their application. They will be notified.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setShowDenyModal(false)}
            style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: 6, padding: '8px 0', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}
          >
            Cancel
          </button>
          <button
            onClick={handleDeny}
            style={{ flex: 1, backgroundColor: '#DC2626', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Confirm Deny
          </button>
        </div>
      </Modal>
    </div>
  );
}
