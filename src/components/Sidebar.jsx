import { FileText, Calendar, Users, HeartHandshake, Lock, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const tabs = [
  { key: 'intake',        label: 'Intake Profile',          icon: FileText },
  { key: 'onboarding',   label: 'Onboarding Events',       icon: Calendar },
  { key: 'matchmaking',  label: 'Matchmaking',             icon: Users },
  { key: 'relationship', label: 'Relationship Management', icon: HeartHandshake }
];

export default function Sidebar({ applicant, onLockedClick }) {
  const { activeTab, setActiveTab, getSidebarLocks } = useApp();
  const locks = getSidebarLocks(applicant.id);

  return (
    <div style={{ width: 260, flexShrink: 0, backgroundColor: '#fff', borderRight: '1px solid #E5E7EB', paddingTop: 8 }}>
      {tabs.map(({ key, label, icon: Icon }) => {
        const locked = locks[key];
        const active = activeTab === key && !locked;

        const handleClick = () => {
          if (locked) {
            onLockedClick(label);
          } else {
            setActiveTab(key);
          }
        };

        return (
          <button
            key={key}
            onClick={handleClick}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px', border: 'none', cursor: locked ? 'not-allowed' : 'pointer',
              textAlign: 'left', backgroundColor: active ? '#E7F1FD' : 'transparent',
              borderLeft: active ? '3px solid #008BF5' : '3px solid transparent',
              transition: 'background 0.15s'
            }}
            onMouseEnter={e => { if (!active && !locked) e.currentTarget.style.backgroundColor = '#F3F4F6'; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = locked ? 'transparent' : 'transparent'; }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon size={18} style={{ color: locked ? '#9CA3AF' : active ? '#008BF5' : '#7C7C7C' }} />
              <span style={{
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                color: locked ? '#9CA3AF' : active ? '#242424' : '#242424'
              }}>
                {label}
              </span>
            </div>
            {locked
              ? <Lock size={14} style={{ color: '#9CA3AF' }} />
              : active ? <ChevronRight size={14} style={{ color: '#008BF5' }} /> : null
            }
          </button>
        );
      })}
    </div>
  );
}
