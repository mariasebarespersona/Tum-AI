import React from 'react';

export const ChatHeader: React.FC<{ name: string; subtitle?: string }> = ({ name, subtitle = 'online' }) => {
  return (
    <div
      style={{
        background: '#075E54',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {/* Back arrow */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
      </svg>

      {/* Avatar */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ color: 'white', fontSize: 16, fontWeight: 700 }}>
          {name.charAt(0)}
        </span>
      </div>

      {/* Name + status */}
      <div>
        <p
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 600,
            color: 'white',
            fontFamily: "'Segoe UI', Helvetica, Arial, sans-serif",
          }}
        >
          {name}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: 'rgba(255,255,255,0.7)',
            fontFamily: "'Segoe UI', Helvetica, Arial, sans-serif",
          }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
};
