import { statusBadgeColors } from '../data/applicants';

export default function StatusBadge({ status }) {
  const colors = statusBadgeColors[status] || { bg: '#F3F4F6', text: '#6B7280' };
  return (
    <span
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        padding: '2px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        border: colors.bg === 'transparent' ? '1px solid #D69E2E' : 'none',
        display: 'inline-block'
      }}
    >
      {status}
    </span>
  );
}
