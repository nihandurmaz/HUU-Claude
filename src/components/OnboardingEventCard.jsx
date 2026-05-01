import { useState } from 'react';
import { Lock } from 'lucide-react';

const borderColors = {
  notScheduled: '#9CA3AF',
  scheduled: '#D69E2E',
  overdue: '#DC2626',
  completed: '#1A7F37'
};

const chipStyles = {
  notScheduled: { bg: '#F3F4F6', text: '#6B7280' },
  scheduled:    { bg: '#FEF3C7', text: '#92400E' },
  overdue:      { bg: '#FEE2E2', text: '#DC2626' },
  completed:    { bg: '#F0FDF4', text: '#1A7F37' }
};

function StatusChip({ state }) {
  const s = chipStyles[state] || chipStyles.notScheduled;
  const labels = { notScheduled: 'Not Scheduled', scheduled: 'Scheduled', overdue: 'Overdue', completed: 'Completed' };
  return (
    <span style={{ backgroundColor: s.bg, color: s.text, padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>
      {state === 'completed' ? '✅ ' : ''}{labels[state]}
    </span>
  );
}

export default function OnboardingEventCard({ eventName, description, scheduleButtonLabel, isLocked, preloaded, onSendInvitation, onComplete }) {
  // preloaded: { state, date, time, format, completedDate, completedTime }
  const [eventState, setEventState] = useState(preloaded?.state || 'notScheduled');
  const [scheduledDate, setScheduledDate] = useState(preloaded?.date || '');
  const [scheduledTime, setScheduledTime] = useState(preloaded?.time || '');
  const [scheduledFormat, setScheduledFormat] = useState(preloaded?.format || 'In-person');
  const [completedDate, setCompletedDate] = useState(preloaded?.completedDate || '');
  const [completedTime, setCompletedTime] = useState(preloaded?.completedTime || '');

  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [schedFormDate, setSchedFormDate] = useState('');
  const [schedFormTime, setSchedFormTime] = useState('');
  const [schedFormFormat, setSchedFormFormat] = useState('In-person');
  const [schedError, setSchedError] = useState('');

  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [compFormDate, setCompFormDate] = useState('');
  const [compFormTime, setCompFormTime] = useState('');

  const borderColor = isLocked ? '#E5E7EB' : borderColors[eventState] || '#9CA3AF';
  const cardBg = eventState === 'completed' ? '#F9FAFB' : '#fff';

  const openScheduleForm = (prefill = false) => {
    setSchedFormDate(prefill ? scheduledDate : '');
    setSchedFormTime(prefill ? scheduledTime : '');
    setSchedFormFormat(prefill ? scheduledFormat : 'In-person');
    setSchedError('');
    setShowScheduleForm(true);
  };

  const handleSendInvitation = () => {
    if (!schedFormDate || !schedFormTime) { setSchedError('Please select a date and time'); return; }
    setScheduledDate(schedFormDate);
    setScheduledTime(schedFormTime);
    setScheduledFormat(schedFormFormat);
    setEventState('scheduled');
    setShowScheduleForm(false);
    setSchedError('');
    if (onSendInvitation) onSendInvitation();
  };

  const handleMarkComplete = () => {
    setCompFormDate(scheduledDate);
    setCompFormTime(scheduledTime);
    setShowCompleteForm(true);
  };

  const handleConfirmComplete = () => {
    setCompletedDate(compFormDate);
    setCompletedTime(compFormTime);
    setEventState('completed');
    setShowCompleteForm(false);
    if (onComplete) onComplete();
  };

  if (isLocked) {
    return (
      <div style={{ border: '1px solid #E5E7EB', borderLeft: `3px solid ${borderColor}`, borderRadius: 6, padding: 16, backgroundColor: '#FAFAFA', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: '#9CA3AF' }}>{eventName}</span>
          <StatusChip state="notScheduled" />
        </div>
        <p style={{ margin: '0 0 10px', fontSize: 13, color: '#9CA3AF' }}>{description}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9CA3AF', fontSize: 13 }}>
          <Lock size={14} />
          Complete the Coordinator Interview first to schedule training.
        </div>
        <button disabled style={{ marginTop: 10, backgroundColor: '#E5E7EB', color: '#9CA3AF', border: 'none', borderRadius: 6, padding: '7px 14px', fontSize: 13, cursor: 'not-allowed' }}>
          {scheduleButtonLabel}
        </button>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #E5E7EB', borderLeft: `3px solid ${borderColor}`, borderRadius: 6, padding: 16, backgroundColor: cardBg, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: '#242424' }}>{eventName}</span>
        <StatusChip state={eventState} />
      </div>
      <p style={{ margin: '0 0 12px', fontSize: 13, color: '#7C7C7C' }}>{description}</p>

      {/* Not Scheduled */}
      {eventState === 'notScheduled' && !showScheduleForm && (
        <button
          onClick={() => openScheduleForm(false)}
          style={{ backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          {scheduleButtonLabel}
        </button>
      )}

      {/* Scheduled */}
      {eventState === 'scheduled' && !showScheduleForm && !showCompleteForm && (
        <div>
          <p style={{ margin: '0 0 4px', fontSize: 13, color: '#242424' }}>
            Scheduled for {scheduledDate} at {scheduledTime} via {scheduledFormat}
          </p>
          <p style={{ margin: '0 0 10px', fontSize: 12, color: '#1A7F37' }}>✉ Invitation sent to applicant</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleMarkComplete}
              style={{ border: '1px solid #E5E7EB', backgroundColor: '#fff', color: '#242424', borderRadius: 6, padding: '6px 12px', fontSize: 13, cursor: 'pointer' }}
            >
              Mark as Complete
            </button>
            <button
              onClick={() => openScheduleForm(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#008BF5', fontSize: 13, fontWeight: 600 }}
            >
              Reschedule
            </button>
          </div>
        </div>
      )}

      {/* Overdue */}
      {eventState === 'overdue' && !showScheduleForm && !showCompleteForm && (
        <div>
          <p style={{ margin: '0 0 8px', fontSize: 13, color: '#DC2626' }}>
            ⚠ This interview was scheduled for {scheduledDate} and has not been completed.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handleMarkComplete}
              style={{ border: '1px solid #E5E7EB', backgroundColor: '#fff', color: '#242424', borderRadius: 6, padding: '6px 12px', fontSize: 13, cursor: 'pointer' }}
            >
              Mark as Complete
            </button>
            <button
              onClick={() => openScheduleForm(true)}
              style={{ backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
            >
              Reschedule
            </button>
          </div>
        </div>
      )}

      {/* Completed */}
      {eventState === 'completed' && (
        <p style={{ margin: 0, fontSize: 13, color: '#1A7F37' }}>
          Completed on {completedDate} at {completedTime}
        </p>
      )}

      {/* Schedule form */}
      {showScheduleForm && (
        <div style={{ marginTop: 8, padding: 12, backgroundColor: '#F9FAFB', borderRadius: 6, border: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: '#7C7C7C', display: 'block', marginBottom: 4 }}>Date</label>
              <input type="date" value={schedFormDate} onChange={e => setSchedFormDate(e.target.value)}
                style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 4, padding: '6px 8px', fontSize: 13, boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: '#7C7C7C', display: 'block', marginBottom: 4 }}>Time</label>
              <input type="time" value={schedFormTime} onChange={e => setSchedFormTime(e.target.value)}
                style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 4, padding: '6px 8px', fontSize: 13, boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 12, color: '#7C7C7C', display: 'block', marginBottom: 4 }}>Format</label>
            <select value={schedFormFormat} onChange={e => setSchedFormFormat(e.target.value)}
              style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 4, padding: '6px 8px', fontSize: 13 }}>
              <option>In-person</option>
              <option>Video call</option>
              <option>Phone call</option>
            </select>
          </div>
          {schedError && <p style={{ margin: '0 0 8px', fontSize: 12, color: '#DC2626' }}>{schedError}</p>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleSendInvitation}
              style={{ backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Send Invitation
            </button>
            <button onClick={() => setShowScheduleForm(false)}
              style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '6px 14px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Complete form */}
      {showCompleteForm && (
        <div style={{ marginTop: 8, padding: 12, backgroundColor: '#F9FAFB', borderRadius: 6, border: '1px solid #E5E7EB' }}>
          <p style={{ margin: '0 0 8px', fontSize: 13, color: '#242424', fontWeight: 600 }}>Confirm completion date and time:</p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: '#7C7C7C', display: 'block', marginBottom: 4 }}>Date</label>
              <input type="date" value={compFormDate} onChange={e => setCompFormDate(e.target.value)}
                style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 4, padding: '6px 8px', fontSize: 13, boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: '#7C7C7C', display: 'block', marginBottom: 4 }}>Time</label>
              <input type="time" value={compFormTime} onChange={e => setCompFormTime(e.target.value)}
                style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 4, padding: '6px 8px', fontSize: 13, boxSizing: 'border-box' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleConfirmComplete}
              style={{ backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              Confirm Completion
            </button>
            <button onClick={() => setShowCompleteForm(false)}
              style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '6px 14px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
