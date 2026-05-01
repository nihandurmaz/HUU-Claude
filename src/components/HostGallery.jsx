import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { hostGallery } from '../data/matches';
import { useApp } from '../context/AppContext';
import Avatar from './Avatar';
import AccordionSection from './AccordionSection';
import Modal from './Modal';

function SignalTag({ label, value }) {
  let style;
  if (value === true) style = { bg: '#F0FDF4', text: '#1A7F37', icon: '✓' };
  else if (value === false) style = { bg: '#FEE2E2', text: '#DC2626', icon: '✗' };
  else style = { bg: '#FEF3C7', text: '#92400E', icon: '?' };

  return (
    <span style={{
      backgroundColor: style.bg, color: style.text,
      padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 4
    }}>
      {style.icon} {label}
    </span>
  );
}

function HostCard({ host, onViewProfile }) {
  return (
    <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: 6, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <Avatar initials={host.initials} color="#7C3AED" size={48} />
        <span style={{ fontWeight: 700, fontSize: 16, color: '#242424' }}>{host.name}</span>
      </div>
      <p style={{ margin: '0 0 12px', fontSize: 14, color: '#7C7C7C', lineHeight: 1.5 }}>{host.summary}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        <SignalTag label="LGBTQ+ Affirming" value={host.signals.lgbtq} />
        <SignalTag label="Sober Household" value={host.signals.sober} />
        <SignalTag label="Full-Time Available" value={host.signals.fullTime} />
        <SignalTag label="Pets in Home" value={host.signals.pets} />
      </div>
      <button
        onClick={() => onViewProfile(host)}
        style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: '7px 16px', fontSize: 13, background: '#fff', cursor: 'pointer', color: '#242424', width: '100%' }}
      >
        View Full Profile
      </button>
    </div>
  );
}

function HostDetailView({ host, onBack, onInitiateMatch }) {
  return (
    <div style={{ padding: 24 }}>
      <button
        onClick={onBack}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#008BF5', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, padding: 0 }}
      >
        <ChevronLeft size={16} /> Back to All Hosts
      </button>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar initials={host.initials} color="#7C3AED" size={64} />
          <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: '#242424' }}>{host.name}</h2>
        </div>
        <button
          onClick={onInitiateMatch}
          style={{ backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          Initiate Match
        </button>
      </div>

      <p style={{ margin: '0 0 16px', fontSize: 14, color: '#7C7C7C', lineHeight: 1.6 }}>{host.summary}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        <SignalTag label="LGBTQ+ Affirming" value={host.signals.lgbtq} />
        <SignalTag label="Sober Household" value={host.signals.sober} />
        <SignalTag label="Full-Time Available" value={host.signals.fullTime} />
        <SignalTag label="Pets in Home" value={host.signals.pets} />
      </div>

      <AccordionSection title="Housing Information">
        <div style={{ fontSize: 13, color: '#242424', lineHeight: 2 }}>
          <div>Housing type: Owned single family home</div>
          <div>Private space available: Yes</div>
          <div>Homeowner's insurance: Yes</div>
        </div>
      </AccordionSection>

      <AccordionSection title="Lifestyle">
        <div style={{ fontSize: 13, color: '#242424', lineHeight: 2 }}>
          <div>Smoking: No</div>
          <div>Alcohol use: {host.signals.sober ? 'No' : 'Yes'}</div>
          <div>Other substances: No</div>
        </div>
      </AccordionSection>

      <AccordionSection title="Hosting Preferences">
        <div style={{ fontSize: 13, color: '#242424', lineHeight: 2 }}>
          <div>Hosting type: Full-time (3-6 months)</div>
          <div>Can host: 1 youth at a time</div>
          <div>LGBTQ+-affirming: {host.signals.lgbtq === true ? 'Yes' : host.signals.lgbtq === null ? 'Not confirmed' : 'No'}</div>
          <div>Pets in home: {host.signals.pets ? 'Yes' : 'No'}</div>
        </div>
      </AccordionSection>
    </div>
  );
}

export default function HostGallery() {
  const { setShowHostGallery, showToast } = useApp();
  const [detailHost, setDetailHost] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  if (detailHost) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F1F1F1' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', backgroundColor: '#fff', minHeight: '100vh' }}>
          <HostDetailView
            host={detailHost}
            onBack={() => setDetailHost(null)}
            onInitiateMatch={() => setShowMatchModal(true)}
          />
          <Modal isOpen={showMatchModal} onClose={() => setShowMatchModal(false)} title={`Initiate match with ${detailHost.name}?`}>
            <p style={{ margin: '0 0 20px', fontSize: 14, color: '#7C7C7C' }}>This will notify both parties and cannot be undone.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setShowMatchModal(false)} style={{ flex: 1, border: '1px solid #E5E7EB', borderRadius: 6, padding: '8px 0', fontSize: 13, background: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { setShowMatchModal(false); showToast(`Match initiated with ${detailHost.name}`, 'success'); }} style={{ flex: 1, backgroundColor: '#008BF5', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Confirm Match
              </button>
            </div>
          </Modal>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F1F1F1', padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setShowHostGallery(false)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#008BF5', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, padding: 0, marginBottom: 12 }}
        >
          <ChevronLeft size={16} /> Back
        </button>
        <h3 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: '#242424', textAlign: 'center' }}>All Eligible Hosts</h3>
        <p style={{ margin: 0, fontSize: 14, color: '#7C7C7C', textAlign: 'center' }}>
          AI-generated summaries for each verified host. Click View Full Profile to review their complete application.
        </p>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 900, margin: '0 auto' }}>
        {hostGallery.map(host => (
          <HostCard key={host.id} host={host} onViewProfile={setDetailHost} />
        ))}
      </div>
    </div>
  );
}
