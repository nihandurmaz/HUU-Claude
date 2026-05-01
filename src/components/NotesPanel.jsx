import { useState, useRef } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';

function timeAgo(date) {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function NoteCard({ note, applicantId }) {
  const { deleteNote, editNote, showToast } = useApp();
  const [mode, setMode] = useState('view'); // view | edit | confirmDelete
  const [editText, setEditText] = useState(note.text);

  if (mode === 'edit') {
    return (
      <div style={{ padding: 12, border: '1px solid #E5E7EB', borderRadius: 6, backgroundColor: '#F9FAFB', marginBottom: 8 }}>
        <textarea
          value={editText}
          onChange={e => setEditText(e.target.value)}
          style={{ width: '100%', minHeight: 72, border: '1px solid #E5E7EB', borderRadius: 4, padding: 8, fontSize: 13, resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button
            onClick={() => { editNote(applicantId, note.id, editText); setMode('view'); showToast('Note updated', 'success'); }}
            style={{ backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 4, padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
          >
            Save Changes
          </button>
          <button
            onClick={() => { setEditText(note.text); setMode('view'); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#7C7C7C' }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'confirmDelete') {
    return (
      <div style={{ padding: 12, border: '1px solid #FEE2E2', borderRadius: 6, backgroundColor: '#FFF5F5', marginBottom: 8 }}>
        <p style={{ margin: '0 0 8px', fontSize: 13, color: '#DC2626' }}>Delete this note?</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => { deleteNote(applicantId, note.id); showToast('Note deleted', 'info'); }}
            style={{ backgroundColor: '#DC2626', color: '#fff', border: 'none', borderRadius: 4, padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
          >
            Confirm
          </button>
          <button
            onClick={() => setMode('view')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#7C7C7C' }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 12, border: '1px solid #E5E7EB', borderRadius: 6, marginBottom: 8 }}>
      <p style={{ margin: '0 0 6px', fontSize: 13, color: '#242424', lineHeight: 1.5 }}>{note.text}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: '#9CA3AF' }}>{note.coordinatorName} · {timeAgo(note.timestamp)}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setMode('edit')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#008BF5' }}>Edit</button>
          <button onClick={() => setMode('confirmDelete')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#DC2626' }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function NotesPanel({ applicantId }) {
  const { notes, addNote, showToast, setShowNotesPanel } = useApp();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [unsavedWarning, setUnsavedWarning] = useState(false);
  const applicantNotes = notes[applicantId] || [];

  const handleClose = () => {
    if (text.trim()) {
      setUnsavedWarning(true);
    } else {
      setShowNotesPanel(false);
    }
  };

  const handleSave = () => {
    if (!text.trim()) { setError('Please write a note before saving'); return; }
    addNote(applicantId, text.trim());
    setText('');
    setError('');
    setUnsavedWarning(false);
    showToast('✅ Note saved', 'success');
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', zIndex: 400 }}
      />
      {/* Panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 320,
        backgroundColor: '#fff', boxShadow: '-4px 0 16px rgba(0,0,0,0.12)',
        zIndex: 500, display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#242424' }}>Internal Notes</span>
            <button
              onClick={handleClose}
              disabled={unsavedWarning}
              style={{ background: 'none', border: 'none', cursor: unsavedWarning ? 'not-allowed' : 'pointer', color: unsavedWarning ? '#9CA3AF' : '#7C7C7C', display: 'flex', padding: 4 }}
            >
              <X size={18} />
            </button>
          </div>
          <p style={{ margin: 0, fontSize: 11, color: '#9CA3AF' }}>
            Only visible to coordinators. Never shown to applicants.
          </p>
        </div>

        {/* Notes list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {applicantNotes.length === 0 ? (
            <p style={{ fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginTop: 24 }}>
              No notes yet for this applicant.
            </p>
          ) : (
            applicantNotes.map(note => (
              <NoteCard key={note.id} note={note} applicantId={applicantId} />
            ))
          )}
        </div>

        {/* Add note area */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #E5E7EB' }}>
          {unsavedWarning && (
            <div style={{ marginBottom: 10, padding: 10, backgroundColor: '#FEF3C7', borderRadius: 6, fontSize: 13, color: '#92400E' }}>
              <p style={{ margin: '0 0 8px', fontWeight: 600 }}>You have unsaved notes.</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => { setText(''); setUnsavedWarning(false); setShowNotesPanel(false); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#DC2626' }}
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  style={{ backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}
                >
                  Save Note
                </button>
              </div>
            </div>
          )}
          <textarea
            value={text}
            onChange={e => { setText(e.target.value); if (error) setError(''); if (unsavedWarning) setUnsavedWarning(false); }}
            placeholder="Add a note about this applicant..."
            style={{
              width: '100%', minHeight: 80, border: '1px solid #E5E7EB', borderRadius: 6,
              padding: 10, fontSize: 13, resize: 'vertical', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit'
            }}
          />
          {error && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#DC2626' }}>{error}</p>}
          <button
            onClick={handleSave}
            style={{
              marginTop: 8, width: '100%', backgroundColor: '#008BF5', color: '#fff',
              border: 'none', borderRadius: 6, padding: '8px 0', fontSize: 14,
              fontWeight: 600, cursor: 'pointer'
            }}
          >
            Save Note
          </button>
        </div>
      </div>
    </>
  );
}
