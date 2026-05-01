import { useState } from 'react';
import { Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import OnboardingEventCard from '../OnboardingEventCard';

function getPreloadedData(applicant) {
  const id = applicant.id;
  if (applicant.onboardingState === 'completed') {
    const preloads = {
      2: {
        event1: { state: 'completed', date: '09/05/2024', time: '11:00', format: 'In-person', completedDate: '09/05/2024', completedTime: '11:00 AM' },
        event2: { state: 'completed', date: '09/12/2024', time: '10:00', format: 'In-person', completedDate: '09/12/2024', completedTime: '10:00 AM' }
      },
      5: {
        event1: { state: 'completed', date: '07/15/2024', time: '15:00', format: 'Video call', completedDate: '07/15/2024', completedTime: '3:00 PM' },
        event2: { state: 'completed', date: '07/22/2024', time: '09:00', format: 'In-person', completedDate: '07/22/2024', completedTime: '9:00 AM' }
      },
      7: {
        event1: { state: 'completed', date: '08/01/2024', time: '13:00', format: 'In-person', completedDate: '08/01/2024', completedTime: '1:00 PM' },
        event2: { state: 'completed', date: '08/08/2024', time: '10:00', format: 'In-person', completedDate: '08/08/2024', completedTime: '10:00 AM' }
      }
    };
    return preloads[id] || {
      event1: { state: 'completed', date: '08/01/2024', time: '10:00', format: 'In-person', completedDate: '08/01/2024', completedTime: '10:00 AM' },
      event2: { state: 'completed', date: '08/08/2024', time: '10:00', format: 'In-person', completedDate: '08/08/2024', completedTime: '10:00 AM' }
    };
  }
  if (applicant.onboardingState === 'inProgress') {
    if (id === 4) {
      return {
        event1: { state: 'completed', date: '08/10/2024', time: '14:00', format: 'Video call', completedDate: '08/10/2024', completedTime: '2:00 PM' },
        event2: { state: 'scheduled', date: '08/20/2024', time: '10:00', format: 'In-person' }
      };
    }
    return { event1: { state: 'notScheduled' }, event2: { state: 'notScheduled' } };
  }
  return { event1: { state: 'notScheduled' }, event2: { state: 'notScheduled' } };
}

export default function OnboardingEventsTab({ applicant }) {
  const { setActiveTab, unlockSidebarTab } = useApp();
  const onboardingState = applicant.onboardingState;

  const preloaded = getPreloadedData(applicant);
  const [event1Done, setEvent1Done] = useState(
    preloaded.event1.state === 'completed'
  );
  const [bothDone, setBothDone] = useState(
    preloaded.event1.state === 'completed' && preloaded.event2.state === 'completed'
  );

  if (onboardingState === 'locked') {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: '#7C7C7C', padding: 40 }}>
        <Lock size={48} style={{ color: '#9CA3AF' }} />
        <p style={{ fontWeight: 600, color: '#242424', margin: 0, fontSize: 16 }}>This section is locked.</p>
        <p style={{ margin: 0, fontSize: 14, textAlign: 'center' }}>Complete the intake profile review first to unlock onboarding events.</p>
      </div>
    );
  }

  const headerChip = bothDone
    ? { label: 'Completed', bg: '#F0FDF4', text: '#1A7F37' }
    : { label: 'In Progress', bg: '#FEF3C7', text: '#92400E' };

  return (
    <div style={{ padding: 24, flex: 1, overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h4 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#242424' }}>Onboarding Events</h4>
        <span style={{ backgroundColor: headerChip.bg, color: headerChip.text, padding: '4px 14px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>
          {headerChip.label}
        </span>
      </div>

      <div style={{ position: 'relative', paddingLeft: 16 }}>
        {/* Timeline line */}
        <div style={{ position: 'absolute', left: 0, top: 16, bottom: 16, width: 2, backgroundColor: '#E5E7EB' }} />

        <OnboardingEventCard
          eventName="Guest Coordinator Interview"
          description="Schedule a 30-60 minute interview to review intake profile and program expectations."
          scheduleButtonLabel="Schedule Interview"
          isLocked={false}
          preloaded={preloaded.event1}
          onComplete={() => setEvent1Done(true)}
        />

        <OnboardingEventCard
          eventName="Guest Training Session"
          description="Schedule a 2-hour orientation training covering program expectations, safety guidelines, and host home living."
          scheduleButtonLabel="Schedule Training"
          isLocked={!event1Done}
          preloaded={event1Done ? preloaded.event2 : { state: 'notScheduled' }}
          onComplete={() => {
            setBothDone(true);
            unlockSidebarTab(applicant.id, 'matchmaking');
          }}
        />
      </div>

      {bothDone && (
        <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #1A7F37', borderRadius: 6, padding: '14px 16px', marginTop: 8 }}>
          <p style={{ margin: '0 0 6px', color: '#1A7F37', fontWeight: 600, fontSize: 13 }}>
            ✅ All onboarding events completed. Matchmaking is now available.
          </p>
          <button
            onClick={() => setActiveTab('matchmaking')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#008BF5', fontSize: 13, fontWeight: 600, padding: 0 }}
          >
            Go to Matchmaking →
          </button>
        </div>
      )}
    </div>
  );
}
