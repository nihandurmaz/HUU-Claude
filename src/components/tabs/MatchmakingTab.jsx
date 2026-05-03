import { useState, useEffect } from 'react';
import { Info, CheckCircle, SearchX, ShieldX, FileX, Loader2 } from 'lucide-react';
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
    <div style={{ paddingTop: 64 }}>
      <p style={{ margin: '0 0 16px', fontSize: 14, color: '#7C7C7C' }}>
        Ready to generate AI match suggestions for {guestName}.
      </p>
      <div style={{ backgroundColor: '#E7F1FD', borderLeft: '3px solid #008BF5', borderRadius: 6, padding: 16, marginBottom: 32 }}>
        <p style={{ margin: 0, fontSize: 13, color: '#242424', lineHeight: 1.6 }}>
          The AI will analyze {guestName}'s intake profile across 9 compatibility criteria and rank available hosts by compatibility score.
        </p>
      </div>
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onGenerate}
          style={{
            backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 6,
            padding: '14px 32px', fontSize: 16, fontWeight: 500, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 10
          }}
        >
          🤖 Generate AI Matches
        </button>
        <p style={{ margin: '24px 0 0', fontSize: 12, color: '#6B7280', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>
          AI will evaluate: LGBTQ+ Safety · Dietary Needs · Substance Use · Mental Health · Cultural Background · Past Struggles · Hosting Capacity · Pets · Parenting Youth
        </p>
      </div>
    </div>
  );
}

function AILoadingState({ visibleStepCount, steps }) {
  return (
    <div style={{ paddingTop: 32, display: 'flex', justifyContent: 'center' }}>
      <div style={{
        width: '100%', maxWidth: 480,
        backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: 6, padding: 32
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
          <Loader2 size={32} style={{ color: '#008BF5', animation: 'spin 0.8s linear infinite', marginBottom: 16 }} />
          <span style={{ fontWeight: 700, fontSize: 16, color: '#242424' }}>AI is analyzing compatibility...</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                opacity: i < visibleStepCount ? 1 : 0,
                transform: i < visibleStepCount ? 'translateY(0)' : 'translateY(4px)',
                transition: 'opacity 0.3s ease, transform 0.3s ease',
                fontSize: 14, color: '#6B7280', lineHeight: 1.6
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

function ViewAllHostsLink({ onClick }) {
  return (
    <div style={{ textAlign: 'center', marginTop: 16 }}>
      <p style={{ margin: '0 0 4px', fontSize: 14, color: '#6B7280' }}>Not finding the right match?</p>
      <button
        onClick={onClick}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#008BF5', fontSize: 14, fontWeight: 600, padding: 0 }}
      >
        View all eligible hosts →
      </button>
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
      const t = setTimeout(() => setAiState('complete'), 400);
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
        <Header applicantList={applicantList} selectedGuestId={selectedGuestId} onChange={handleGuestChange} />
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
        <Header applicantList={applicantList} selectedGuestId={selectedGuestId} onChange={handleGuestChange} />
        <p style={{ color: '#7C7C7C', fontSize: 14 }}>No match data available for this applicant.</p>
      </div>
    );
  }

  const visibleMatchIds = getVisibleIds();
  const visibleMatches = (data.matches || []).filter(m => visibleMatchIds.includes(m.id));

  const trustBanner = (
    <>
      <div style={{ backgroundColor: '#E7F1FD', borderLeft: '3px solid #008BF5', borderRadius: 6, padding: '12px 16px', marginBottom: 4, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <Info size={16} style={{ color: '#008BF5', flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 13, color: '#242424' }}>These suggestions are generated by AI to support your decision. You make the final call.</span>
      </div>
      <p style={{ margin: '0 0 16px', fontSize: 12, color: '#7C7C7C' }}>
        Match criteria are drawn directly from the intake profile. Incomplete sections may limit results.
      </p>
    </>
  );

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
      <Header applicantList={applicantList} selectedGuestId={selectedGuestId} onChange={handleGuestChange} />

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
            <div key={match.id} style={{ animation: `fadeIn 0.4s ease ${i * 0.25}s both` }}>
              <MatchCard match={match} matchType={data.type} onProceed={handleProceed} onSkip={handleSkip} />
            </div>
          ))}
          {!declinedHidden && data.declinedPairs?.map(dp => (
            <div key={dp.name} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: 16, marginBottom: 12, backgroundColor: '#F9FAFB', opacity: 0.6 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 14, color: '#6B7280' }}>⊘ {dp.name} — Previously declined</span>
              </div>
              <p style={{ margin: '0 0 6px', fontSize: 13, color: '#6B7280' }}>Declined by host on {dp.declinedDate}.</p>
              <button
                onClick={() => setShowDeclinedDetails(e => !e)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#008BF5', fontSize: 13, padding: 0 }}
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
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button
                  onClick={() => setDeclinedHidden(true)}
                  style={{ border: '1px solid #6B7280', borderRadius: 6, padding: '6px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#6B7280' }}
                >
                  Remove from view
                </button>
              </div>
            </div>
          ))}
          <ViewAllHostsLink onClick={() => setShowHostGallery(true)} />
        </>
      )}

      {/* ── complete: normalMatches — all skipped ── */}
      {aiState === 'complete' && data.type === 'normalMatches' && skippedOnly && (
        <div style={{ textAlign: 'center', padding: 32, color: '#7C7C7C' }}>
          <p style={{ fontSize: 14, marginBottom: 16 }}>You have reviewed all suggested matches.</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button onClick={() => setShowHostGallery(true)} style={{ border: '1px solid #008BF5', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#008BF5' }}>
              View All Hosts Manually
            </button>
            <button onClick={() => { setVisibleCards(null); setSkippedOnly(false); setAiState('idle'); setVisibleStepCount(0); }} style={{ backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Re-run AI Matching
            </button>
          </div>
        </div>
      )}

      {/* ── complete: noMatches ── */}
      {aiState === 'complete' && data.type === 'noMatches' && (
        <div style={{ paddingTop: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <SearchX size={48} style={{ color: '#6B7280', marginBottom: 12 }} />
            <h4 style={{ margin: '0 0 8px', fontWeight: 700, color: '#242424', fontSize: 18 }}>No matches found</h4>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: '#6B7280', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
              No available hosts currently meet {selectedGuest.name}'s profile requirements. New hosts may become available as they complete onboarding.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
              <button
                onClick={() => { setAiState('idle'); setVisibleStepCount(0); }}
                style={{ backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Re-run AI Matching
              </button>
              <button onClick={() => setShowHostGallery(true)} style={{ border: '1px solid #008BF5', borderRadius: 6, padding: '8px 20px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#008BF5' }}>
                View All Hosts Manually
              </button>
            </div>
          </div>
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Add a follow-up note for this case:</p>
            <textarea
              value={noMatchesNoteText}
              onChange={e => setNoMatchesNoteText(e.target.value)}
              placeholder="Add a note..."
              style={{ width: '100%', minHeight: 80, border: '1px solid #E5E7EB', borderRadius: 6, padding: 8, fontSize: 13, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button
                onClick={() => { if (noMatchesNoteText.trim()) { addNote(selectedGuestId, noMatchesNoteText); setNoMatchesNoteText(''); showToast('✅ Note saved', 'success'); } }}
                style={{ backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── complete: singleMatch ── */}
      {aiState === 'complete' && data.type === 'singleMatch' && !showSingleSkipped && (
        <>
          {trustBanner}
          <p style={{ margin: '0 0 16px', fontSize: 13, color: '#6B7280' }}>
            Only 1 host currently matches {selectedGuest.name}'s profile. Consider expanding the host pool if this match doesn't proceed.
          </p>
          {visibleMatches.map(match => (
            <MatchCard key={match.id} match={match} matchType={data.type} onProceed={handleProceed} onSkip={handleSkip} />
          ))}
          <ViewAllHostsLink onClick={() => setShowHostGallery(true)} />
        </>
      )}
      {aiState === 'complete' && data.type === 'singleMatch' && showSingleSkipped && (
        <div style={{ textAlign: 'center', padding: 32, color: '#7C7C7C' }}>
          <p style={{ fontSize: 14, marginBottom: 12 }}>You've skipped the only available match.</p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button onClick={() => setShowHostGallery(true)} style={{ border: '1px solid #008BF5', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#008BF5' }}>
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
          <div style={{ backgroundColor: '#FEE2E2', borderLeft: '3px solid #DC2626', borderRadius: 6, padding: 16, marginBottom: 16, fontSize: 13, color: '#DC2626' }}>
            ⚠ All suggested matches have at least one incompatible criterion. Proceed with caution and review each carefully. A written override will be required to confirm any of these matches.
          </div>
          {trustBanner}
          {visibleMatches.map((match, i) => (
            <div key={match.id} style={{ animation: `fadeIn 0.4s ease ${i * 0.25}s both` }}>
              <MatchCard match={match} matchType={data.type} onProceed={handleProceed} onSkip={handleSkip} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
            <button onClick={() => setShowHostGallery(true)} style={{ border: '1px solid #008BF5', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#008BF5' }}>
              View All Hosts Manually
            </button>
            <button onClick={goToDashboard} style={{ border: '1px solid #6B7280', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#6B7280' }}>
              Return to Dashboard
            </button>
          </div>
        </>
      )}

      {/* ── complete: noSafeMatches ── */}
      {aiState === 'complete' && data.type === 'noSafeMatches' && (
        <div>
          <div style={{ textAlign: 'center', paddingTop: 64, paddingBottom: 12 }}>
            <ShieldX size={48} style={{ color: '#DC2626', marginBottom: 12 }} />
            <h4 style={{ margin: '0 0 16px', fontWeight: 700, color: '#242424', fontSize: 18 }}>No safe matches available</h4>
          </div>
          <div style={{ backgroundColor: '#FEE2E2', borderLeft: '3px solid #DC2626', borderRadius: 6, padding: 16, marginBottom: 16, fontSize: 13, color: '#DC2626' }}>
            {selectedGuest.name}'s profile requires an LGBTQ+-affirming host. No verified affirming hosts are currently available.
          </div>
          <div style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 6, padding: 16, marginBottom: 16 }}>
            <p style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: '#242424' }}>Why this is a hard requirement</p>
            <p style={{ margin: 0, fontSize: 14, color: '#242424', lineHeight: 1.6 }}>
              {selectedGuest.name} is transgender and specifically needs an affirming, safe home environment. The AI treats LGBTQ+ Safety as a non-negotiable criterion for guests who have marked it as a hard requirement. This cannot be overridden.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
            <button onClick={() => setExpandedPool(e => !e)} style={{ border: '1px solid #008BF5', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#008BF5' }}>
              Expand Host Pool
            </button>
            <button onClick={goToDashboard} style={{ border: '1px solid #6B7280', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#6B7280' }}>
              Return to Dashboard
            </button>
          </div>
          {expandedPool && (
            <div style={{ backgroundColor: '#E7F1FD', borderRadius: 6, padding: 12, marginBottom: 16, fontSize: 13, color: '#242424' }}>
              Contact your program administrator to recruit LGBTQ+-affirming hosts. Currently affirming hosts available: 0
            </div>
          )}
          <div>
            <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 6 }}>Add a follow-up note for this case:</p>
            <textarea
              value={noSafeNoteText}
              onChange={e => setNoSafeNoteText(e.target.value)}
              placeholder="Add a note..."
              style={{ width: '100%', minHeight: 80, border: '1px solid #E5E7EB', borderRadius: 6, padding: 8, fontSize: 13, resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
              <button
                onClick={() => { if (noSafeNoteText.trim()) { addNote(selectedGuestId, noSafeNoteText); setNoSafeNoteText(''); showToast('✅ Note saved', 'success'); } }}
                style={{ backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── complete: insufficientData ── */}
      {aiState === 'complete' && data.type === 'insufficientData' && (
        <div style={{ paddingTop: 64 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <FileX size={48} style={{ color: '#6B7280', marginBottom: 12 }} />
            <h4 style={{ margin: '0 0 8px', fontWeight: 700, color: '#242424', fontSize: 18 }}>Not enough profile data to match</h4>
            <p style={{ margin: '0 0 0', fontSize: 14, color: '#6B7280', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
              {selectedGuest.name}'s host profile is missing key information needed for compatibility analysis. Complete the profile to enable matching.
            </p>
          </div>
          <div style={{ backgroundColor: '#FEF3C7', borderLeft: '3px solid #92400E', borderRadius: 6, padding: 16, marginBottom: 24, maxWidth: 480, margin: '0 auto 24px' }}>
            <p style={{ margin: '0 0 8px', fontSize: 13, fontWeight: 700, color: '#92400E' }}>Missing or incomplete sections:</p>
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13, color: '#242424', lineHeight: 1.9 }}>
              {data.missingSections?.map((sec, i) => (
                <li key={i}>{sec.name}</li>
              ))}
            </ul>
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button
              onClick={() => setActiveTab('intake')}
              style={{ backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              Return to Profile
            </button>
            <button
              onClick={goToDashboard}
              style={{ border: '1px solid #6B7280', borderRadius: 6, padding: '8px 20px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#6B7280' }}
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
          <div style={{ backgroundColor: '#E7F1FD', border: '1px solid #008BF5', borderRadius: 6, padding: 14, marginBottom: 16, textAlign: 'left', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto' }}>
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
            <p style={{ margin: '0 0 12px', fontSize: 14, color: '#7C7C7C' }}>
              This match has incompatible criteria flagged. To proceed, document your reasoning in writing. This override will be logged.
            </p>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#242424', marginBottom: 6 }}>
              Reason for override (required):
            </label>
            <textarea
              value={overrideNote}
              onChange={e => setOverrideNote(e.target.value)}
              placeholder="Explain why this match is being approved despite flagged criteria..."
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

function Header({ applicantList, selectedGuestId, onChange }) {
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
