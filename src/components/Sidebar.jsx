import { useState } from 'react';
import { FileText, Calendar, Users, HeartHandshake, Lock, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const tabs = [
  { key: 'intake',        label: 'Intake Profile',          icon: FileText },
  { key: 'onboarding',   label: 'Onboarding Events',       icon: Calendar },
  { key: 'matchmaking',  label: 'Matchmaking',             icon: Users },
  { key: 'relationship', label: 'Relationship Management', icon: HeartHandshake }
];

const lockedMessages = {
  onboarding:   'Approve the intake profile to unlock Onboarding Events.',
  matchmaking:  'Complete onboarding events to unlock Matchmaking.',
  relationship: 'Confirm a match in Matchmaking to unlock Relationship Management.'
};

export default function Sidebar({ applicant }) {
  const { activeTab, setActiveTab, getSidebarLocks } = useApp();
  const locks = getSidebarLocks(applicant.id);
  const [lockedMsgKey, setLockedMsgKey] = useState(null);

  return (
    <div style={{ width: 260, flexShrink: 0, backgroundColor: '#fff', borderRight: '1px solid #E5E7EB', paddingTop: 8 }}>
      {tabs.map(({ key, label, icon: Icon }) => {
        const locked = locks[key];
        const active = activeTab === key && !locked;

        const handleClick = () => {
          if (locked) {
            setLockedMsgKey(prev => prev === key ? null : key);
          } else {
            setActiveTab(key);
            setLockedMsgKey(null);
          }
        };

        return (
          <div key={key}>
            <button
              onClick={handleClick}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', border: 'none', cursor: locked ? 'default' : 'pointer',
                textAlign: 'left', backgroundColor: active ? '#E7F1FD' : 'transparent',
                borderLeft: active ? '3px solid #0066B8' : '3px solid transparent',
                transition: 'background 0.15s'
              }}
              onMouseEnter={e => { if (!active && !locked) e.currentTarget.style.backgroundColor = '#F3F4F6'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon size={18} style={{ color: locked ? '#9CA3AF' : active ? '#0066B8' : '#7C7C7C' }} />
                <span style={{
                  fontSize: 14,
                  fontWeight: active ? 600 : 400,
                  color: locked ? '#6B7280' : '#242424'
                }}>
                  {label}
                </span>
              </div>
              {locked
                ? <Lock size={14} style={{ color: '#9CA3AF' }} />
                : active ? <ChevronRight size={14} style={{ color: '#0066B8' }} /> : null
              }
            </button>

            {locked && lockedMsgKey === key && (
              <div style={{ padding: '6px 16px 10px 44px', backgroundColor: '#FAFAFA', borderBottom: '1px solid #F3F4F6' }}>
                <p style={{ margin: 0, fontSize: 12, color: '#7C7C7C', lineHeight: 1.5 }}>
                  {lockedMessages[key]}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
