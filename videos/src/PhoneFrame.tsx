import React from 'react';

export const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div
      style={{
        width: 390,
        height: 844,
        borderRadius: 44,
        background: '#000',
        padding: 12,
        boxShadow: '0 25px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Notch */}
      <div
        style={{
          position: 'absolute',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 160,
          height: 34,
          borderRadius: 20,
          background: '#000',
          zIndex: 10,
        }}
      />

      {/* Screen */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 34,
          overflow: 'hidden',
          background: '#ECE5DD',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Status bar */}
        <div
          style={{
            height: 48,
            background: '#075E54',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: 4,
          }}
        >
          <span style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>9:41</span>
        </div>

        {children}
      </div>
    </div>
  );
};
