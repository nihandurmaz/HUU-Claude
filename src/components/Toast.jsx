import { useEffect } from 'react';
import { X } from 'lucide-react';

const typeStyles = {
  success: { bg: '#F0FDF4', border: '#1A7F37', text: '#1A7F37' },
  error:   { bg: '#FEE2E2', border: '#DC2626', text: '#DC2626' },
  info:    { bg: '#E7F1FD', border: '#008BF5', text: '#008BF5' }
};

export default function Toast({ message, type = 'info', onDismiss }) {
  const s = typeStyles[type] || typeStyles.info;

  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      style={{
        backgroundColor: s.bg,
        borderLeft: `4px solid ${s.border}`,
        color: s.text,
        padding: '12px 16px',
        borderRadius: 6,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontSize: 14,
        fontWeight: 500,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        minWidth: 280,
        maxWidth: 400
      }}
    >
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.text, padding: 0, display: 'flex' }}>
        <X size={16} />
      </button>
    </div>
  );
}
