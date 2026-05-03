import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const badgeStyles = {
  amber:  { bg: '#FEF3C7', text: '#92400E' },
  green:  { bg: '#F0FDF4', text: '#15803D' },
  purple: { bg: '#F3E8FF', text: '#6B21A8' },
  gray:   { bg: '#F3F4F6', text: '#6B7280' },
  red:    { bg: '#FEE2E2', text: '#B91C1C' }
};

export default function AccordionSection({ title, badge, badgeType = 'gray', children, defaultOpen = false, icon }) {
  const [open, setOpen] = useState(defaultOpen);
  const bs = badgeStyles[badgeType] || badgeStyles.gray;

  return (
    <div style={{ border: '1px solid #E5E7EB', borderRadius: 6, overflow: 'hidden', marginBottom: 8 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px', background: '#fff', border: 'none', cursor: 'pointer',
          textAlign: 'left'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon && <span style={{ color: '#7C7C7C' }}>{icon}</span>}
          <span style={{ fontWeight: 600, fontSize: 14, color: '#242424' }}>{title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {badge && (
            <span style={{
              backgroundColor: bs.bg, color: bs.text,
              padding: '2px 10px', borderRadius: 999, fontSize: 12, fontWeight: 500
            }}>
              {badge}
            </span>
          )}
          <ChevronDown
            size={16}
            style={{ color: '#7C7C7C', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>
      </button>
      {open && (
        <div style={{ padding: '12px 16px', borderTop: '1px solid #E5E7EB', backgroundColor: '#FAFAFA' }}>
          {children}
        </div>
      )}
    </div>
  );
}
