import { CheckCircle, HeartHandshake } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function RelationshipManagementTab({ applicant }) {
  const { matchedPairs, showToast } = useApp();
  const match = matchedPairs.find(p => p.guestId === applicant.id);

  if (!match) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: 40, textAlign: 'center' }}>
        <HeartHandshake size={48} style={{ color: '#9CA3AF' }} />
        <p style={{ fontWeight: 700, color: '#242424', margin: 0, fontSize: 16 }}>No active relationship yet.</p>
        <p style={{ margin: 0, fontSize: 14, color: '#7C7C7C', maxWidth: 380 }}>
          A relationship will appear here once a match is confirmed and a contract is signed.
        </p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, padding: 24 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 28 }}>
        <CheckCircle size={48} style={{ color: '#1A7F37', marginBottom: 12 }} />
        <span style={{ backgroundColor: '#F0FDF4', color: '#1A7F37', padding: '4px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600, marginBottom: 10 }}>
          Active Match
        </span>
        <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#242424' }}>
          {match.guestName} is matched with {match.hostName}.
        </p>
        <p style={{ margin: 0, fontSize: 13, color: '#7C7C7C' }}>Match confirmed on {match.confirmedDate}.</p>
      </div>

      <div style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: 16 }}>
        <p style={{ margin: '0 0 10px', fontWeight: 600, fontSize: 14, color: '#242424' }}>Contract</p>
        <p style={{ margin: '0 0 12px', fontSize: 13, color: '#7C7C7C' }}>Contract Status: <strong>Pending upload</strong></p>
        <button
          onClick={() => showToast('Contract upload coming soon', 'info')}
          style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424' }}
        >
          Upload Contract
        </button>
      </div>
    </div>
  );
}
