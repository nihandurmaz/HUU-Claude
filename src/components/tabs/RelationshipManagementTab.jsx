import { useState } from 'react';
import { CheckCircle, HeartHandshake } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Modal from '../Modal';

const NOTE_MAX = 500;

export default function RelationshipManagementTab({ applicant }) {
  const { matchedPairs, showToast, getSidebarLocks } = useApp();

  const locks = getSidebarLocks(applicant.id);
  if (locks.relationship) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: 40, textAlign: 'center' }}>
        <HeartHandshake size={48} style={{ color: '#9CA3AF' }} />
        <p style={{ fontWeight: 600, color: '#242424', margin: 0, fontSize: 16 }}>This section is locked.</p>
        <p style={{ margin: 0, fontSize: 14, color: '#7C7C7C', maxWidth: 380 }}>
          Confirm a match first to unlock Relationship Management.
        </p>
      </div>
    );
  }

  const match = matchedPairs.find(p => p.guestId === applicant.id);

  if (!match) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: 40, textAlign: 'center' }}>
        <HeartHandshake size={48} style={{ color: '#9CA3AF' }} />
        <p style={{ fontWeight: 600, color: '#242424', margin: 0, fontSize: 16 }}>No active relationship yet.</p>
        <p style={{ margin: 0, fontSize: 14, color: '#7C7C7C', maxWidth: 380 }}>
          A relationship will appear here once a match is confirmed and a contract is signed.
        </p>
      </div>
    );
  }

  return <MatchedView match={match} showToast={showToast} />;
}

function MatchedView({ match, showToast }) {
  const defaultNote = `Hi ${match.guestName} and ${match.hostName},\n\nCongratulations on your match! I'd like to coordinate a time for you both to meet before the placement begins.\n\nPlease reach out to each other at your earliest convenience to schedule an introductory call or in-person meeting.\n\nIf you have any questions or need support, please don't hesitate to contact me.\n\nBest regards,\nRachael C.\nHome Unite Us Coordinator`;

  const [showModal, setShowModal] = useState(false);
  const [noteText, setNoteText] = useState(defaultNote);
  const [sentNotes, setSentNotes] = useState([]);
  const [expandedNoteId, setExpandedNoteId] = useState(null);

  const handleSendNote = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    const newNote = {
      id: Date.now(),
      text: noteText,
      sentAt: `${dateStr} at ${timeStr}`
    };
    setSentNotes(prev => [newNote, ...prev]);
    setShowModal(false);
    setNoteText(defaultNote);
    showToast(`✅ Meeting note sent to ${match.guestName} and ${match.hostName}`, 'success');
  };

  return (
    <div style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h4 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#242424' }}>Relationship Management</h4>
        <span style={{ backgroundColor: '#F0FDF4', color: '#1A7F37', padding: '4px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>
          Active Match
        </span>
      </div>

      {/* Match summary card */}
      <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #1A7F37', borderRadius: 6, padding: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <CheckCircle size={18} style={{ color: '#1A7F37' }} />
          <span style={{ fontWeight: 700, fontSize: 14, color: '#1A7F37' }}>Active Match</span>
        </div>
        <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#242424' }}>
          {match.guestName} ↔ {match.hostName}
        </p>
        <p style={{ margin: '0 0 4px', fontSize: 13, color: '#7C7C7C' }}>Match confirmed on {match.confirmedDate}</p>
        <p style={{ margin: 0, fontSize: 13, color: '#7C7C7C' }}>Contract Status: <strong style={{ color: '#242424' }}>Pending</strong></p>
      </div>

      {/* Schedule Initial Meeting section */}
      {sentNotes.length === 0 && (
        <div style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: 16, marginBottom: 20 }}>
          <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 14, color: '#242424' }}>Schedule Initial Meeting</p>
          <p style={{ margin: '0 0 14px', fontSize: 13, color: '#7C7C7C' }}>
            Send a note to both the guest and host to coordinate their first meeting.
          </p>
          <button
            onClick={() => setShowModal(true)}
            style={{ backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            Send Meeting Note
          </button>
        </div>
      )}

      {/* Communications: sent notes */}
      {sentNotes.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: '0 0 10px', fontWeight: 700, fontSize: 11, color: '#7C7C7C', textTransform: 'uppercase', letterSpacing: 1 }}>
            COMMUNICATIONS
          </p>
          {sentNotes.map(note => (
            <div key={note.id} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: 14, marginBottom: 8, backgroundColor: '#FAFAFA' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 16 }}>📧</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: '#242424' }}>Meeting coordination note sent</span>
              </div>
              <p style={{ margin: '0 0 2px', fontSize: 12, color: '#7C7C7C' }}>
                Sent to: {match.guestName} + {match.hostName}
              </p>
              <p style={{ margin: '0 0 8px', fontSize: 12, color: '#7C7C7C' }}>
                Sent by: Rachael C. · {note.sentAt}
              </p>
              <p style={{ margin: '0 0 6px', fontSize: 13, color: '#242424', fontStyle: 'italic' }}>
                "{note.text.slice(0, 100)}{note.text.length > 100 ? '...' : ''}"
              </p>
              <button
                onClick={() => setExpandedNoteId(expandedNoteId === note.id ? null : note.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#008BF5', fontSize: 12, fontWeight: 600, padding: 0 }}
              >
                {expandedNoteId === note.id ? 'Hide Message' : 'View Full Message'}
              </button>
              {expandedNoteId === note.id && (
                <div style={{ marginTop: 10, backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: 4, padding: 12, fontSize: 13, color: '#242424', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {note.text}
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => setShowModal(true)}
            style={{ border: '1px solid #008BF5', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#008BF5', fontWeight: 600, marginTop: 4 }}
          >
            Send Another Note
          </button>
        </div>
      )}

      {/* Send Note Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Send a note to both parties">
        <p style={{ margin: '0 0 14px', fontSize: 13, color: '#7C7C7C' }}>
          This message will be sent to {match.guestName} (Guest) and {match.hostName} (Host).
        </p>

        {/* Recipients */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          <span style={{ backgroundColor: '#F0FDF4', color: '#1A7F37', padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500 }}>
            📧 {match.guestName} (Guest)
          </span>
          <span style={{ backgroundColor: '#F0FDF4', color: '#1A7F37', padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500 }}>
            📧 {match.hostName} (Host)
          </span>
        </div>

        <textarea
          value={noteText}
          onChange={e => setNoteText(e.target.value.slice(0, NOTE_MAX))}
          style={{
            width: '100%', minHeight: 200, border: '1px solid #E5E7EB', borderRadius: 6,
            padding: '10px 12px', fontSize: 13, resize: 'vertical', boxSizing: 'border-box',
            fontFamily: 'inherit', lineHeight: 1.6, outline: 'none', color: '#242424'
          }}
        />
        <p style={{ margin: '4px 0 16px', fontSize: 12, color: '#9CA3AF', textAlign: 'right' }}>
          {noteText.length}/{NOTE_MAX}
        </p>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setShowModal(false)}
            style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: 6, padding: '8px 0', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSendNote}
            disabled={!noteText.trim()}
            style={{
              flex: 1, backgroundColor: noteText.trim() ? '#008BF5' : '#9CA3AF',
              color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0',
              fontSize: 13, fontWeight: 600, cursor: noteText.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            Send Note
          </button>
        </div>
      </Modal>
    </div>
  );
}
