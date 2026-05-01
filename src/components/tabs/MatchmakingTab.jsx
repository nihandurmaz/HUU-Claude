import { useState, useEffect } from 'react';
import { Info, CheckCircle } from 'lucide-react';
import { applicants } from '../../data/applicants';
import { matchData } from '../../data/matches';
import { useApp } from '../../context/AppContext';
import MatchCard from '../MatchCard';
import Modal from '../Modal';

const AI_LOADING_STEPS = [
  "Reading intake profile",
  "Scanning 5 available hosts",
  "Evaluating LGBTQ+ Safety compatibility",
  "Evaluating Substance Use policies",
  "Evaluating Cultural Background",
  "Calculating compatibility scores",
  "Ranking matches..."
];

function useApplicantList() {
  return applicants.filter(a => !a.sidebarLocks.matchmaking);
}

function MatchConfirmedState({ guestName, hostName, onRelationship }) {
  return (
    <div style={{ textAlign: 'center', padding: 40 }}>
      <CheckCircle size={48} style={{ color: '#1A7F37', marginBottom: 12 }} />
      <h4 style={{ margin: '0 0 8px', fontWeight: 700, color: '#1A7F37', fontSize: 20 }}>Match Confirmed</h4>
      <p style={{ margin: '0 0 4px', fontSize: 14, color: '#242424' }}>{guestName} has been matched with {hostName}.</p>
      <p style={{ margin: '0 0 16px', fontSize: 14, color: '#7C7C7C' }}>Both parties have been notified.</p>
      <button
        onClick={onRelationship}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#008BF5', fontSize: 14, fontWeight: 600 }}
      >
        Go to Relationship Management →
      </button>
    </div>
  );
}

function AIPreState({ onGenerate, guestName }) {
  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ backgroundColor: '#E7F1FD', border: '1px solid #008BF5', borderRadius: 6, padding: '14px 16px', marginBottom: 24 }}>
        <p style={{ margin: 0, fontSize: 13, color: '#242424', lineHeight: 1.6 }}>
          The AI will analyze {guestName}'s intake profile across 9 compatibility criteria and rank available hosts by compatibility score.
        </p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onGenerate}
          style={{
            backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 6,
            padding: '14px 32px', fontSize: 16, fontWeight: 700, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 10
          }}
        >
          🤖 Generate AI Matches
        </button>
        <p style={{ margin: '12px 0 0', fontSize: 12, color: '#7C7C7C' }}>
          AI will evaluate: LGBTQ+ Safety · Dietary Needs · Substance Use · Mental Health · Cultural Background · Past Struggles · Hosting Capacity · Pets · Parenting Youth
        </p>
      </div>
    </div>
  );
}

function AILoadingState({ visibleStepCount }) {
  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{
        border: '1px solid #E5E7EB', borderRadius: 6, padding: 24,
        animation: 'pulse 2s ease infinite'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 24, height: 24, border: '3px solid #E5E7EB', borderTopColor: '#008BF5', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
          <span style={{ fontWeight: 700, fontSize: 15, color: '#242424' }}>AI is analyzing compatibility...</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {AI_LOADING_STEPS.map((step, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                opacity: i < visibleStepCount ? 1 : 0,
                transition: 'opacity 0.3s ease',
                fontSize: 13, color: '#242424'
              }}
            >
              <span style={{ color: '#1A7F37', fontWeight: 700, flexShrink: 0 }}>✓</span>
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MatchmakingTab({ applicant }) {
  const { setActiveTab, setShowHostGallery, confirmMatch, addNote, showToast, matchedPairs, getSidebarLocks, goToDashboard } = useApp();

  const applicantList = useApplicantList();
  const [selectedGuestId, setSelectedGuestId] = useState(applicant.id);
  const selectedGuest = applicants.find(a => a.id === selectedGuestId) || applicant;
  const data = matchData[selectedGuestId];

  const locks = getSidebarLocks(applicant.id);
  if (locks.matchmaking) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: '#7C7C7C', padding: 40 }}>
        <div style={{ fontSize: 48 }}>🔒</div>
        <p style={{ fontWeight: 600, color: '#242424', margin: 0, fontSize: 16 }}>This section is locked.</p>
        <p style={{ margin: 0, fontSize: 14 }}>Complete the previous step to unlock.</p>
      </div>
    );
  }

  const alreadyMatched = matchedPairs.find(p => p.guestId === selectedGuestId);

  const [aiState, setAiState] = useState('idle'); // 'idle' | 'loading' | 'complete'
  const [visibleStepCount, setVisibleStepCount] = useState(0);

  const [visibleCards, setVisibleCards] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingMatch, setPendingMatch] = useState(null);
  const [modalStep, setModalStep] = useState(1);
  const [overrideNote, setOverrideNote] = useState('');
  const [skippedOnly, setSkippedOnly] = useState(false);
  const [showSingleSkipped, setShowSingleSkipped] = useState(false);
  const [expandedPool, setExpandedPool] = useState(false);
  const [noSafeNoteText, setNoSafeNoteText] = useState('');
  const [showDeclinedDetails, setShowDeclinedDetails] = useState(false);
  const [declinedHidden, setDeclinedHidden] = useState(false);
  const [infoRequestedState, setInfoRequestedState] = useState(false);

  // Drive the loading animation
  useEffect(() => {
    if (aiState !== 'loading') return;
    if (visibleStepCount >= AI_LOADING_STEPS.length) {
      const t = setTimeout(() => setAiState('complete'), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisibleStepCount(s => s + 1), 400);
    return () => clearTimeout(t);
  }, [aiState, visibleStepCount]);

  const handleGenerateMatches = () => {
    setAiState('loading');
    setVisibleStepCount(0);
  };

  const getVisibleIds = () => {
    if (!data) return [];
    return visibleCards !== null ? visibleCards : data.matches.map(m => m.id);
  };

  const handleSkip = (matchId) => {
    const current = getVisibleIds();
    const next = current.filter(id => id !== matchId);
    setVisibleCards(next);
    if (data.type === 'singleMatch' && next.length === 0) setShowSingleSkipped(true);
    if (data.type !== 'singleMatch' && next.length === 0) setSkippedOnly(true);
  };

  const handleProceed = (match) => {
    setPendingMatch(match);
    setModalStep(1);
    setOverrideNote('');
    setShowModal(true);
  };

  const handleConfirmStep1 = () => {
    const hasRedFlags = pendingMatch?.flags?.some(f => f.color === 'red');
    if (!hasRedFlags) {
      finalizeMatch();
    } else {
      setModalStep(2);
    }
  };

  const finalizeMatch = () => {
    setShowModal(false);
    confirmMatch(selectedGuestId, pendingMatch.name);
    const hasRedFlags = pendingMatch?.flags?.some(f => f.color === 'red');
    showToast(
      hasRedFlags
        ? '✅ Match confirmed. Override note saved.'
        : `✅ Match confirmed between ${selectedGuest.name} and ${pendingMatch.name}`,
      'success'
    );
  };

  const handleSaveAndConfirm = () => {
    if (!overrideNote.trim()) return;
    finalizeMatch();
  };

  const handleGuestChange = (id) => {
    setSelectedGuestId(Number(id));
    setVisibleCards(null);
    setSkippedOnly(false);
    setShowSingleSkipped(false);
    setExpandedPool(false);
    setInfoRequestedState(false);
    setAiState('idle');
    setVisibleStepCount(0);
    setDeclinedHidden(false);
    setShowDeclinedDetails(false);
  };

  if (alreadyMatched) {
    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <ApplicantSelector applicantList={applicantList} selectedGuestId={selectedGuestId} onChange={handleGuestChange} />
        <MatchConfirmedState
          guestName={alreadyMatched.guestName}
          hostName={alreadyMatched.hostName}
          onRelationship={() => setActiveTab('relationship')}
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ flex: 1, padding: 24 }}>
        <ApplicantSelector applicantList={applicantList} selectedGuestId={selectedGuestId} onChange={handleGuestChange} />
        <p style={{ color: '#7C7C7C', fontSize: 14 }}>No match data available for this applicant.</p>
      </div>
    );
  }

  const visibleMatchIds = getVisibleIds();
  const visibleMatches = data.matches.filter(m => visibleMatchIds.includes(m.id));

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <ApplicantSelector applicantList={applicantList} selectedGuestId={selectedGuestId} onChange={handleGuestChange} />

      {/* STATE: normalMatches — idle (Generate AI Matches) */}
      {data.type === 'normalMatches' && aiState === 'idle' && (
        <AIPreState onGenerate={handleGenerateMatches} guestName={selectedGuest.name} />
      )}

      {/* STATE: normalMatches — loading */}
      {data.type === 'normalMatches' && aiState === 'loading' && (
        <AILoadingState visibleStepCount={visibleStepCount} />
      )}

      {/* STATE: normalMatches — complete, show cards */}
      {data.type === 'normalMatches' && aiState === 'complete' && !skippedOnly && (
        <>
          {/* AI disclaimer banner */}
          <div style={{ backgroundColor: '#E7F1FD', borderLeft: '4px solid #008BF5', borderRadius: 6, padding: '10px 14px', marginBottom: 4, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <Info size={16} style={{ color: '#008BF5', flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 13, color: '#242424' }}>These suggestions are generated by AI to support your decision. You make the final call.</span>
          </div>
          <p style={{ margin: '0 0 16px', fontSize: 12, color: '#7C7C7C' }}>
            Match criteria are drawn directly from each applicant's intake profile. Incomplete sections may limit results.
          </p>
          {visibleMatches.map((match, i) => (
            <div key={match.id} style={{ animation: `fadeIn 0.4s ease ${i * 0.3}s both` }}>
              <MatchCard match={match} onProceed={handleProceed} onSkip={handleSkip} />
            </div>
          ))}
          {/* Declined pair */}
          {!declinedHidden && data.declinedPairs?.map(dp => (
            <div key={dp.name} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: 14, marginBottom: 12, backgroundColor: '#FAFAFA', color: '#9CA3AF' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14 }}>⊘ {dp.name} — Previously declined</span>
                <button onClick={() => setDeclinedHidden(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#9CA3AF' }}>Remove from view</button>
              </div>
              <p style={{ margin: '4px 0 6px', fontSize: 12 }}>Declined by host on {dp.declinedDate}.</p>
              <button
                onClick={() => setShowDeclinedDetails(e => !e)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#008BF5', fontSize: 12 }}
              >
                {showDeclinedDetails ? 'Hide Details' : 'View Details'}
              </button>
              {showDeclinedDetails && (
                <div style={{ marginTop: 8, fontSize: 12, color: '#7C7C7C', lineHeight: 1.8 }}>
                  <div>Declined by: {dp.declinedBy}</div>
                  <div>Date: {dp.declinedDate}</div>
                  <div>Reason: {dp.reason}</div>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => setShowHostGallery(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#008BF5', fontSize: 14, fontWeight: 600, padding: 0 }}
          >
            Not finding the right match? View all eligible hosts →
          </button>
        </>
      )}

      {/* Skipped all in normal */}
      {data.type === 'normalMatches' && aiState === 'complete' && skippedOnly && (
        <div style={{ textAlign: 'center', padding: 32, color: '#7C7C7C' }}>
          <p style={{ fontSize: 14, marginBottom: 12 }}>You have reviewed all suggested matches.</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button onClick={() => setShowHostGallery(true)} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
              View All Hosts Manually
            </button>
            <button onClick={() => { setVisibleCards(null); setSkippedOnly(false); }} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* AI banner for non-normalMatches states */}
      {data.type !== 'normalMatches' && (
        <>
          <div style={{ backgroundColor: '#E7F1FD', borderLeft: '4px solid #008BF5', borderRadius: 6, padding: '10px 14px', marginBottom: 4, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <Info size={16} style={{ color: '#008BF5', flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 13, color: '#242424' }}>These suggestions are generated by AI to support your decision. You make the final call.</span>
          </div>
          <p style={{ margin: '0 0 16px', fontSize: 12, color: '#7C7C7C' }}>
            Match criteria are drawn directly from each applicant's intake profile. Incomplete sections may limit results.
          </p>
        </>
      )}

      {/* STATE: noMatches */}
      {data.type === 'noMatches' && (
        <div style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: 48, color: '#9CA3AF', marginBottom: 12 }}>👤?</div>
          <h4 style={{ margin: '0 0 8px', fontWeight: 700, color: '#242424' }}>No suitable matches found</h4>
          <p style={{ margin: '0 0 16px', fontSize: 14, color: '#7C7C7C' }}>
            Based on {selectedGuest.name}'s current profile, no hosts scored above the 40% compatibility minimum threshold.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
            <button onClick={() => setActiveTab('intake')} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
              Review {selectedGuest.name}'s Profile
            </button>
            <button onClick={() => setShowHostGallery(true)} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
              View All Hosts Manually
            </button>
          </div>
          <p style={{ fontSize: 12, color: '#7C7C7C', fontStyle: 'italic' }}>The AI requires a minimum compatibility score of 40% to surface a suggestion.</p>
        </div>
      )}

      {/* STATE: singleMatch */}
      {data.type === 'singleMatch' && !showSingleSkipped && (
        <>
          <div style={{ backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 13, fontWeight: 600 }}>
            ⚠ Only one eligible host match was found for {selectedGuest.name}. Review carefully.
          </div>
          {visibleMatches.map(match => (
            <MatchCard key={match.id} match={match} onProceed={handleProceed} onSkip={handleSkip} />
          ))}
          <button onClick={() => setShowHostGallery(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#008BF5', fontSize: 14, fontWeight: 600, padding: 0 }}>
            Not finding the right match? View all eligible hosts →
          </button>
        </>
      )}
      {data.type === 'singleMatch' && showSingleSkipped && (
        <div style={{ textAlign: 'center', padding: 32, color: '#7C7C7C' }}>
          <p style={{ fontSize: 14, marginBottom: 12 }}>You've skipped the only available match.</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button onClick={() => setShowHostGallery(true)} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
              View All Hosts Manually
            </button>
            <button onClick={() => { setShowSingleSkipped(false); setVisibleCards(data.matches.map(m => m.id)); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#008BF5' }}>
              Go Back
            </button>
          </div>
        </div>
      )}

      {/* STATE: allRedFlags */}
      {data.type === 'allRedFlags' && (
        <>
          <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 13, fontWeight: 600 }}>
            ⚠ All suggested matches have at least one incompatible criteria. Proceed with caution and review each carefully.
          </div>
          {visibleMatches.map(match => (
            <MatchCard key={match.id} match={match} onProceed={handleProceed} onSkip={handleSkip} />
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button onClick={() => setShowHostGallery(true)} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
              View All Hosts Manually
            </button>
            <button onClick={goToDashboard} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
              Return to Dashboard
            </button>
          </div>
        </>
      )}

      {/* STATE: insufficientData */}
      {data.type === 'insufficientData' && !infoRequestedState && (
        <div style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: 48, color: '#D69E2E', marginBottom: 12 }}>📋⚠</div>
          <h4 style={{ margin: '0 0 8px', fontWeight: 700, color: '#242424' }}>Insufficient profile data to generate matches</h4>
          <p style={{ margin: '0 0 16px', fontSize: 14, color: '#7C7C7C' }}>{selectedGuest.name}'s profile is missing key information required for match generation.</p>
          <div style={{ textAlign: 'left', display: 'inline-block', marginBottom: 20 }}>
            {data.missingSections?.map((sec, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8, fontSize: 13 }}>
                <span style={{ color: '#D69E2E' }}>⚠</span>
                <span style={{ color: '#242424' }}><strong>{sec.name}</strong> — {sec.reason}</span>
              </div>
            ))}
          </div>
          <div>
            <button
              onClick={() => setInfoRequestedState(true)}
              style={{ backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 12 }}
            >
              Request Missing Information
            </button>
          </div>
          <p style={{ fontSize: 12, color: '#7C7C7C', fontStyle: 'italic' }}>Completing these sections allows the AI to generate accurate and trustworthy suggestions.</p>
        </div>
      )}
      {data.type === 'insufficientData' && infoRequestedState && (
        <div style={{ textAlign: 'center', padding: 32, color: '#7C7C7C' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📤</div>
          <p style={{ fontSize: 14 }}>Information requested. Matches will regenerate once {selectedGuest.name} resubmits.</p>
        </div>
      )}

      {/* STATE: noSafeMatches */}
      {data.type === 'noSafeMatches' && (
        <div>
          <div style={{ textAlign: 'center', padding: '24px 0 12px' }}>
            <div style={{ fontSize: 48, color: '#DC2626', marginBottom: 12 }}>🛡✗</div>
            <h4 style={{ margin: '0 0 8px', fontWeight: 700, color: '#242424', fontSize: 16 }}>No safe matches available</h4>
          </div>
          <div style={{ backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 13, fontWeight: 600 }}>
            {selectedGuest.name}'s profile requires an LGBTQ+-affirming host. No verified affirming hosts are currently available.
          </div>
          <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 6, padding: 14, marginBottom: 16 }}>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: '#242424' }}>Why this is a hard requirement:</p>
            <p style={{ margin: 0, fontSize: 13, color: '#7C7C7C', lineHeight: 1.6 }}>
              {selectedGuest.name} is transgender and specifically needs an affirming, safe home environment. The AI treats LGBTQ+ Safety as a non-negotiable criterion for guests who have marked it as a hard requirement. This cannot be overridden.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button onClick={() => setExpandedPool(e => !e)} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
              Expand Host Pool
            </button>
            <button onClick={goToDashboard} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
              Return to Dashboard
            </button>
          </div>
          {expandedPool && (
            <div style={{ backgroundColor: '#E7F1FD', borderRadius: 6, padding: 12, marginBottom: 16, fontSize: 13, color: '#242424' }}>
              Contact your program administrator to recruit LGBTQ+-affirming hosts. Current affirming hosts available: 0
            </div>
          )}
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#242424', marginBottom: 6 }}>Add a follow-up note for this case:</p>
            <textarea
              value={noSafeNoteText}
              onChange={e => setNoSafeNoteText(e.target.value)}
              placeholder="Add a note..."
              style={{ width: '100%', minHeight: 72, border: '1px solid #E5E7EB', borderRadius: 6, padding: 8, fontSize: 13, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
            <button
              onClick={() => { if (noSafeNoteText.trim()) { addNote(selectedGuestId, noSafeNoteText); setNoSafeNoteText(''); showToast('✅ Note saved', 'success'); } }}
              style={{ backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}
            >
              Save Note
            </button>
          </div>
        </div>
      )}

      {/* STATE: emptyPool */}
      {data.type === 'emptyPool' && (
        <div style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: 48, color: '#9CA3AF', marginBottom: 12 }}>🏠?</div>
          <h4 style={{ margin: '0 0 8px', fontWeight: 700, color: '#242424' }}>No hosts available</h4>
          <p style={{ margin: '0 0 16px', fontSize: 14, color: '#7C7C7C' }}>There are currently no verified hosts available in the system.</p>
          <div style={{ backgroundColor: '#E7F1FD', border: '1px solid #008BF5', borderRadius: 6, padding: 14, marginBottom: 16, textAlign: 'left' }}>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: '#008BF5' }}>This may mean:</p>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#242424', lineHeight: 1.8 }}>
              <li>All current hosts are actively placed</li>
              <li>New applications are pending verification</li>
              <li>Your program needs to recruit hosts</li>
            </ul>
            <p style={{ margin: '10px 0 0', fontSize: 12, color: '#7C7C7C' }}>This is different from no compatible matches — the host pool itself is empty.</p>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button onClick={() => setActiveTab('intake')} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
              View Host Applications
            </button>
            <button onClick={() => setActiveTab('intake')} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Match confirmation modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalStep === 1
          ? `Confirm match between ${selectedGuest.name} and ${pendingMatch?.name}?`
          : 'Override confirmation required'
        }
      >
        {modalStep === 1 && (
          <>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: '#7C7C7C' }}>
              This will notify both parties and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: 6, padding: '8px 0', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
                Cancel
              </button>
              <button onClick={handleConfirmStep1} style={{ flex: 1, backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Confirm Match
              </button>
            </div>
          </>
        )}
        {modalStep === 2 && (
          <>
            <p style={{ margin: '0 0 8px', fontSize: 14, color: '#DC2626', fontWeight: 600 }}>
              You are confirming a match with flagged criteria.
            </p>
            <p style={{ margin: '0 0 12px', fontSize: 13, color: '#7C7C7C' }}>
              Please explain your decision. This is required and logged for program records.
            </p>
            <textarea
              value={overrideNote}
              onChange={e => setOverrideNote(e.target.value)}
              placeholder="Explain why you are proceeding despite the flagged criteria..."
              maxLength={500}
              style={{ width: '100%', minHeight: 100, border: '1px solid #E5E7EB', borderRadius: 6, padding: 10, fontSize: 13, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
            <p style={{ margin: '4px 0 16px', fontSize: 12, color: '#9CA3AF', textAlign: 'right' }}>{overrideNote.length}/500</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: 6, padding: '8px 0', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
                Cancel
              </button>
              <button
                onClick={handleSaveAndConfirm}
                disabled={!overrideNote.trim()}
                style={{ flex: 1, backgroundColor: overrideNote.trim() ? '#008BF5' : '#9CA3AF', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0', fontSize: 13, fontWeight: 600, cursor: overrideNote.trim() ? 'pointer' : 'not-allowed' }}
              >
                Save and Confirm
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

function ApplicantSelector({ applicantList, selectedGuestId, onChange }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 13, color: '#7C7C7C', marginRight: 8, fontWeight: 500 }}>Viewing matches for:</label>
      <select
        value={selectedGuestId}
        onChange={e => onChange(e.target.value)}
        style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '6px 12px', fontSize: 13, color: '#242424', backgroundColor: '#fff' }}
      >
        {applicantList.map(g => (
          <option key={g.id} value={g.id}>{g.name} ({g.type})</option>
        ))}
      </select>
    </div>
  );
}
