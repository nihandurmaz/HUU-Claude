import { useState } from 'react';
import Avatar from './Avatar';

const dotColors = {
  compatible:   '#1A7F37',
  concern:      '#F59E0B',
  incompatible: '#DC2626',
  insufficient: '#9CA3AF'
};

const flagIcon = { red: '🔴', amber: '🟡', gray: '⬜' };

const criteriaOrder = [
  ['lgbtq', 'dietary', 'substance'],
  ['mental', 'cultural', 'struggles'],
  ['capacity', 'pets', 'parenting']
];

function CriteriaDot({ status, label, tooltip }) {
  const [showTip, setShowTip] = useState(false);
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 6, position: 'relative', cursor: 'default' }}
      onMouseEnter={() => setShowTip(true)}
      onMouseLeave={() => setShowTip(false)}
    >
      <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: dotColors[status] || '#9CA3AF', flexShrink: 0 }} />
      <span style={{ fontSize: 12, color: '#7C7C7C' }}>{label}</span>
      {showTip && (
        <div style={{
          position: 'absolute', bottom: '100%', left: 0, marginBottom: 6,
          backgroundColor: '#242424', color: '#fff', borderRadius: 4,
          padding: '6px 10px', fontSize: 11, whiteSpace: 'normal', minWidth: 200, maxWidth: 280,
          zIndex: 100, lineHeight: 1.4, boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          {tooltip}
        </div>
      )}
    </div>
  );
}

function ScoreRing({ score, matchType }) {
  const color = matchType === 'allRedFlags' ? '#DC2626' : score >= 90 ? '#1A7F37' : '#F59E0B';
  return (
    <div style={{
      width: 56, height: 56, borderRadius: '50%',
      border: `3px solid ${color}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0
    }}>
      <span style={{ fontWeight: 800, fontSize: 16, color }}>{score}%</span>
    </div>
  );
}

export default function MatchCard({ match, matchType, onProceed, onSkip }) {
  const [flagsExpanded, setFlagsExpanded] = useState(false);

  const hasRedFlags = match.flags.some(f => f.color === 'red');
  const hasAnyFlags = match.flags.length > 0;

  const flagBannerStyle = hasRedFlags
    ? { bg: '#F9FAFB', borderColor: '#DC2626', text: '#B91C1C' }
    : { bg: '#F9FAFB', borderColor: '#D97706', text: '#92400E' };

  const avatarColor = match.avatarColor || (match.score >= 90 ? '#1A7F37' : match.score >= 70 ? '#F59E0B' : '#7C3AED');

  return (
    <div style={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: 6, padding: 24, marginBottom: 16 }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar initials={match.initials} color={avatarColor} size={40} />
          <span style={{ fontWeight: 700, fontSize: 16, color: '#242424' }}>{match.name}</span>
        </div>
        <ScoreRing score={match.score} matchType={matchType} />
      </div>

      {/* Explanation */}
      <p style={{ margin: '0 0 12px', fontSize: 14, color: '#242424', lineHeight: 1.5 }}>{match.explanation}</p>

      {/* Criteria grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px 12px', marginBottom: 12 }}>
        {criteriaOrder.flat().map(key => {
          const c = match.criteria[key];
          if (!c) return null;
          return (
            <CriteriaDot
              key={key}
              status={c.status}
              label={c.label}
              tooltip={match.tooltips[key] || ''}
            />
          );
        })}
      </div>

      {/* Flag banner */}
      {hasAnyFlags && (
        <div>
          <button
            onClick={() => setFlagsExpanded(e => !e)}
            style={{
              width: '100%', backgroundColor: flagBannerStyle.bg, color: flagBannerStyle.text,
              border: '1px solid #E5E7EB', borderLeft: `3px solid ${flagBannerStyle.borderColor}`,
              borderRadius: 6, padding: '8px 12px', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', textAlign: 'left', marginBottom: flagsExpanded ? 0 : 12
            }}
          >
            ⚠ Review flagged criteria before proceeding &nbsp;{flagsExpanded ? '▲ Hide' : '▼ View flags'}
          </button>

          {flagsExpanded && (
            <div style={{ backgroundColor: '#FAFAFA', border: '1px solid #E5E7EB', borderTop: 'none', borderRadius: '0 0 6px 6px', padding: 12, marginBottom: 12 }}>
              {match.flags.map((flag, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ flexShrink: 0, fontSize: 12 }}>{flagIcon[flag.color] || '⬜'}</span>
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#242424' }}>{flag.criteria}</span>
                    <span style={{ fontSize: 12, color: '#7C7C7C' }}>— {flag.level}</span>
                  </div>
                  <p style={{ margin: '0 0 4px 20px', fontSize: 13, color: '#242424', lineHeight: 1.5 }}>{flag.explanation}</p>
                  <p style={{ margin: '0 0 8px 20px', fontSize: 11, color: '#9CA3AF' }}>Source: {flag.source}</p>
                  {i < match.flags.length - 1 && <div style={{ borderBottom: '1px solid #E5E7EB', marginBottom: 8 }} />}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button
          onClick={() => onSkip(match.id)}
          style={{ backgroundColor: '#fff', color: '#0066B8', border: '1px solid #0066B8', borderRadius: 6, padding: '8px 20px', fontSize: 14, cursor: 'pointer' }}
        >
          Skip
        </button>
        <button
          onClick={() => onProceed(match)}
          style={{ backgroundColor: '#0066B8', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          Proceed with Match
        </button>
      </div>
    </div>
  );
}
