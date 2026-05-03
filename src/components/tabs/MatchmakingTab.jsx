import { useState, useEffect } from 'react';
import { Info, CheckCircle, SearchX, ShieldX, FileX } from 'lucide-react';
import { applicants } from '../../data/applicants';
import { matchData } from '../../data/matches';
import { useApp } from '../../context/AppContext';
import MatchCard from '../MatchCard';
import Modal from '../Modal';

function getLoadingSteps(name) {
  return [
    `Reading ${name}'s intake profile`,
    'Scanning available hosts',
    'Evaluating LGBTQ+ Safety compatibility',
    'Evaluating Substance Use policies',
    'Evaluating Cultural Background',
    'Calculating compatibility scores',
    'Ranking matches...'
  ];
}

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
      <p style={{ margin: '0 0 16px', fontSize: 14, color: '#7C7C7C' }}>
        Ready to generate AI match suggestions for {guestName}.
      </p>
      <div style={{ backgroundColor: '#E7F1FD', borderLeft: '3px solid #008BF5', borderRadius: 6, padding: '14px 16px', marginBottom: 24 }}>
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

function AILoadingState({ visibleStepCount, steps }) {
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
          {steps.map((step, i) => (
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

  const loadingSteps = getLoadingSteps(selectedGuest.name);

  const [aiState, setAiState] = useState('idle');
  const [visibleStepCount, setVisibleStepCount] = useState(0);

  const [visibleCards, setVisibleCards] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [pendingMatch, setPendingMatch] = useState(null);
  const [overrideNote, setOverrideNote] = useState('');
  const [skippedOnly, setSkippedOnly] = useState(false);
  const [showSingleSkipped, setShowSingleSkipped] = useState(false);
  const [expandedPool, setExpandedPool] = useState(false);
  const [noSafeNoteText, setNoSafeNoteText] = useState('');
  const [showDeclinedDetails, setShowDeclinedDetails] = useState(false);
  const [declinedHidden, setDeclinedHidden] = useState(false);
  const [noMatchesNoteText, setNoMatchesNoteText] = useState('');

  useEffect(() => {
    if (aiState !== 'loading') return;
    if (visibleStepCount >= loadingSteps.length) {
      const t = setTimeout(() => setAiState('complete'), 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisibleStepCount(s => s + 1), 600);
    return () => clearTimeout(t);
  }, [aiState, visibleStepCount]);

  const handleGenerateMatches = () => {
    setAiState('loading');
    setVisibleStepCount(0);
  };

  const getVisibleIds = () => {
    if (!data || !data.matches) return [];
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
    setOverrideNote('');
    setShowModal(true);
  };

  const hasRedFlagsPending = pendingMatch?.flags?.some(f => f.color === 'red');

  const finalizeMatch = () => {
    setShowModal(false);
    confirmMatch(selectedGuestId, pendingMatch.name);
    showToast(
      hasRedFlagsPending
        ? '✅ Match confirmed. Override note saved.'
        : `✅ Match confirmed between ${selectedGuest.name} and ${pendingMatch.name}`,
      'success'
    );
  };

  const handleGuestChange = (id) => {
    setSelectedGuestId(Number(id));
    setVisibleCards(null);
    setSkippedOnly(false);
    setShowSingleSkipped(false);
    setExpandedPool(false);
    setAiState('idle');
    setVisibleStepCount(0);
    setDeclinedHidden(false);
    setShowDeclinedDetails(false);
    setNoMatchesNoteText('');
    setNoSafeNoteText('');
  };

  if (alreadyMatched) {
    return (
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
        <Header applicantList={applicantList} selectedGuestId={selectedGuestId} onChange={handleGuestChange} selectedGuest={selectedGuest} />
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
        <Header applicantList={applicantList} selectedGuestId={selectedGuestId} onChange={handleGuestChange} selectedGuest={selectedGuest} />
        <p style={{ color: '#7C7C7C', fontSize: 14 }}>No match data available for this applicant.</p>
      </div>
    );
  }

  const visibleMatchIds = getVisibleIds();
  const visibleMatches = (data.matches || []).filter(m => visibleMatchIds.includes(m.id));

  const trustBanner = (
    <>
      <div style={{ backgroundColor: '#E7F1FD', borderLeft: '3px solid #008BF5', borderRadius: 6, padding: '10px 14px', marginBottom: 4, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <Info size={16} style={{ color: '#008BF5', flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 13, color: '#242424' }}>These suggestions are generated by AI to support your decision. You make the final call.</span>
      </div>
      <p style={{ margin: '0 0 16px', fontSize: 12, color: '#7C7C7C' }}>
        Match criteria are drawn directly from each applicant's intake profile. Incomplete sections may limit results.
      </p>
    </>
  );

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <Header applicantList={applicantList} selectedGuestId={selectedGuestId} onChange={handleGuestChange} selectedGuest={selectedGuest} />

      {/* ── All states: idle ── */}
      {aiState === 'idle' && (
        <AIPreState onGenerate={handleGenerateMatches} guestName={selectedGuest.name} />
      )}

      {/* ── All states: loading ── */}
      {aiState === 'loading' && (
        <AILoadingState visibleStepCount={visibleStepCount} steps={loadingSteps} />
      )}

      {/* ── complete: normalMatches ── */}
      {aiState === 'complete' && data.type === 'normalMatches' && !skippedOnly && (
        <>
          {trustBanner}
          {visibleMatches.map((match, i) => (
            <div key={match.id} style={{ animation: `fadeIn 0.4s ease ${i * 0.3}s both` }}>
              <MatchCard match={match} matchType={data.type} onProceed={handleProceed} onSkip={handleSkip} />
            </div>
          ))}
          {!declinedHidden && data.declinedPairs?.map(dp => (
            <div key={dp.name} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: 14, marginBottom: 12, backgroundColor: '#FAFAFA', opacity: 0.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, color: '#9CA3AF' }}>⊘ {dp.name} — Previously declined</span>
                <button onClick={() => setDeclinedHidden(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#9CA3AF' }}>Remove from view</button>
              </div>
              <p style={{ margin: '4px 0 6px', fontSize: 12, color: '#9CA3AF' }}>Declined by host on {dp.declinedDate}.</p>
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
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <button
              onClick={() => setShowHostGallery(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#008BF5', fontSize: 14, fontWeight: 600, padding: 0 }}
            >
              Not finding the right match? View all eligible hosts →
            </button>
          </div>
        </>
      )}

      {/* ── complete: normalMatches — all skipped ── */}
      {aiState === 'complete' && data.type === 'normalMatches' && skippedOnly && (
        <div style={{ textAlign: 'center', padding: 32, color: '#7C7C7C' }}>
          <p style={{ fontSize: 14, marginBottom: 12 }}>You have reviewed all suggested matches.</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button onClick={() => setShowHostGallery(true)} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
              View All Hosts Manually
            </button>
            <button onClick={() => { setVisibleCards(null); setSkippedOnly(false); }} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
              Re-run Matches
            </button>
          </div>
        </div>
      )}

      {/* ── complete: noMatches ── */}
      {aiState === 'complete' && data.type === 'noMatches' && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <SearchX size={48} style={{ color: '#6B7280', marginBottom: 12 }} />
          <h4 style={{ margin: '0 0 8px', fontWeight: 700, color: '#242424', fontSize: 18 }}>No matches found</h4>
          <p style={{ margin: '0 0 20px', fontSize: 14, color: '#7C7C7C' }}>
            Based on {selectedGuest.name}'s current profile, no hosts scored above the 40% compatibility minimum threshold.
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 20 }}>
            <button
              onClick={() => { setAiState('idle'); setVisibleStepCount(0); }}
              style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}
            >
              Re-run Matches
            </button>
            <button onClick={() => setShowHostGallery(true)} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
              View All Hosts Manually
            </button>
          </div>
          <div style={{ textAlign: 'left', maxWidth: 480, margin: '0 auto' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#242424', marginBottom: 6 }}>Add a follow-up note for this case:</p>
            <textarea
              value={noMatchesNoteText}
              onChange={e => setNoMatchesNoteText(e.target.value)}
              placeholder="Add a note..."
              style={{ width: '100%', minHeight: 72, border: '1px solid #E5E7EB', borderRadius: 6, padding: 8, fontSize: 13, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
            <button
              onClick={() => { if (noMatchesNoteText.trim()) { addNote(selectedGuestId, noMatchesNoteText); setNoMatchesNoteText(''); showToast('✅ Note saved', 'success'); } }}
              style={{ backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}
            >
              Save Note
            </button>
          </div>
        </div>
      )}

      {/* ── complete: singleMatch ── */}
      {aiState === 'complete' && data.type === 'singleMatch' && !showSingleSkipped && (
        <>
          {trustBanner}
          <div style={{ backgroundColor: '#FEF3C7', color: '#92400E', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 13, fontWeight: 600 }}>
            ⚠ Only 1 host match was found for {selectedGuest.name}. Review carefully before proceeding.
          </div>
          {visibleMatches.map(match => (
            <MatchCard key={match.id} match={match} matchType={data.type} onProceed={handleProceed} onSkip={handleSkip} />
          ))}
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <button onClick={() => setShowHostGallery(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#008BF5', fontSize: 14, fontWeight: 600, padding: 0 }}>
              Not finding the right match? View all eligible hosts →
            </button>
          </div>
        </>
      )}
      {aiState === 'complete' && data.type === 'singleMatch' && showSingleSkipped && (
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

      {/* ── complete: allRedFlags ── */}
      {aiState === 'complete' && data.type === 'allRedFlags' && (
        <>
          <div style={{ backgroundColor: '#FEE2E2', borderLeft: '3px solid #DC2626', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 13, fontWeight: 600, color: '#DC2626' }}>
            ⚠ All suggested matches have at least one incompatible criteria. Proceed with caution and review each carefully.
          </div>
          {trustBanner}
          {visibleMatches.map((match, i) => (
            <div key={match.id} style={{ animation: `fadeIn 0.4s ease ${i * 0.3}s both` }}>
              <MatchCard match={match} matchType={data.type} onProceed={handleProceed} onSkip={handleSkip} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
            <button onClick={() => setShowHostGallery(true)} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
              View All Hosts Manually
            </button>
            <button onClick={goToDashboard} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
              Return to Dashboard
            </button>
          </div>
        </>
      )}

      {/* ── complete: noSafeMatches ── */}
      {aiState === 'complete' && data.type === 'noSafeMatches' && (
        <div>
          <div style={{ textAlign: 'center', padding: '24px 0 12px' }}>
            <ShieldX size={48} style={{ color: '#DC2626', marginBottom: 12 }} />
            <h4 style={{ margin: '0 0 8px', fontWeight: 700, color: '#242424', fontSize: 18 }}>No safe matches available</h4>
          </div>
          <div style={{ backgroundColor: '#FEE2E2', borderLeft: '3px solid #DC2626', borderRadius: 6, padding: '10px 14px', marginBottom: 12, fontSize: 13, fontWeight: 600, color: '#DC2626' }}>
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

      {/* ── complete: insufficientData ── */}
      {aiState === 'complete' && data.type === 'insufficientData' && (
        <div>
          <div style={{ textAlign: 'center', padding: '24px 0 16px' }}>
            <FileX size={48} style={{ color: '#6B7280', marginBottom: 12 }} />
            <h4 style={{ margin: '0 0 8px', fontWeight: 700, color: '#242424', fontSize: 18 }}>Insufficient profile data</h4>
            <p style={{ margin: '0 0 16px', fontSize: 14, color: '#7C7C7C' }}>{selectedGuest.name}'s profile is missing key information required to generate matches.</p>
          </div>
          <div style={{ backgroundColor: '#FEF3C7', borderLeft: '3px solid #92400E', borderRadius: 6, padding: '12px 16px', marginBottom: 20 }}>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: '#92400E' }}>Missing sections:</p>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#242424', lineHeight: 1.9 }}>
              {data.missingSections?.map((sec, i) => (
                <li key={i}>{sec.name}</li>
              ))}
            </ul>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setActiveTab('intake')}
              style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}
            >
              Return to Profile
            </button>
            <button
              onClick={goToDashboard}
              style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* ── complete: emptyPool ── */}
      {aiState === 'complete' && data.type === 'emptyPool' && (
        <div style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: 48, color: '#9CA3AF', marginBottom: 12 }}>🏠?</div>
          <h4 style={{ margin: '0 0 8px', fontWeight: 700, color: '#242424' }}>No hosts available</h4>
          <p style={{ margin: '0 0 16px', fontSize: 14, color: '#7C7C7C' }}>There are currently no verified hosts available in the system.</p>
          <div style={{ backgroundColor: '#E7F1FD', border: '1px solid #008BF5', borderRadius: 6, padding: 14, marginBottom: 16, textAlign: 'left', maxWidth: 480, margin: '0 auto 16px' }}>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: '#008BF5' }}>This may mean:</p>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#242424', lineHeight: 1.8 }}>
              <li>All current hosts are actively placed</li>
              <li>New applications are pending verification</li>
              <li>Your program needs to recruit hosts</li>
            </ul>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button onClick={() => setActiveTab('intake')} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
              View Host Applications
            </button>
            <button onClick={goToDashboard} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* ── Match confirmation modal ── */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={hasRedFlagsPending ? 'Override required to confirm match' : 'Confirm match?'}
      >
        {!hasRedFlagsPending ? (
          <>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: '#7C7C7C' }}>
              Confirm match between {selectedGuest.name} and {pendingMatch?.name}? This will notify both parties and cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, border: '1px solid #008BF5', borderRadius: 6, padding: '8px 0', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#008BF5' }}>
                Cancel
              </button>
              <button onClick={finalizeMatch} style={{ flex: 1, backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Confirm Match
              </button>
            </div>
          </>
        ) : (
          <>
            <p style={{ margin: '0 0 8px', fontSize: 14, color: '#DC2626', fontWeight: 600 }}>
              You are confirming a match with flagged criteria.
            </p>
            <p style={{ margin: '0 0 12px', fontSize: 13, color: '#7C7C7C' }}>
              Please explain your decision (minimum 20 characters). This is required and logged for program records.
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
              <button onClick={() => setShowModal(false)} style={{ flex: 1, border: '1px solid #008BF5', borderRadius: 6, padding: '8px 0', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#008BF5' }}>
                Cancel
              </button>
              <button
                onClick={() => { if (overrideNote.trim().length >= 20) finalizeMatch(); }}
                disabled={overrideNote.trim().length < 20}
                style={{ flex: 1, backgroundColor: overrideNote.trim().length >= 20 ? '#DC2626' : '#9CA3AF', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0', fontSize: 13, fontWeight: 600, cursor: overrideNote.trim().length >= 20 ? 'pointer' : 'not-allowed' }}
              >
                Confirm Override
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

function Header({ applicantList, selectedGuestId, onChange, selectedGuest }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#242424' }}>Matchmaking</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <label style={{ fontSize: 13, color: '#7C7C7C', fontWeight: 500 }}>Viewing matches for:</label>
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
    </div>
  );
}
