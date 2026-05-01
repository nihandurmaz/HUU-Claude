export default function Avatar({ initials, color, size = 36 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 600,
        fontSize: size * 0.38,
        flexShrink: 0,
        userSelect: 'none'
      }}
    >
      {initials}
    </div>
  );
}
