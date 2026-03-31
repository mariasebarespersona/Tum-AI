import React from 'react';
import { useCurrentFrame } from 'remotion';

export const TypingIndicator: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 6 }}>
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 12,
          borderTopLeftRadius: 0,
          padding: '12px 16px',
          display: 'flex',
          gap: 5,
          boxShadow: '0 1px 1px rgba(0,0,0,0.08)',
        }}
      >
        {[0, 1, 2].map((i) => {
          const bounce = Math.sin(((frame * 4) + i * 25) * (Math.PI / 180) * 8) * 3;
          return (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#A0A4A8',
                transform: `translateY(${bounce}px)`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
