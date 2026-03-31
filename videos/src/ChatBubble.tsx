import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import type { Message } from './types';

const CHECK_MARK = '\u2713\u2713';

export const ChatBubble: React.FC<{ message: Message; index: number }> = ({ message, index }) => {
  const frame = useCurrentFrame();
  const age = frame - message.delayFrames;

  if (age < 0) return null;

  const slideY = interpolate(age, [0, 10], [25, 0], { extrapolateRight: 'clamp' });
  const opacity = interpolate(age, [0, 8], [0, 1], { extrapolateRight: 'clamp' });
  const isAgent = message.sender === 'agent';

  const time = `${9 + Math.floor(index * 0.4)}:${String(10 + (index * 7) % 50).padStart(2, '0')}`;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isAgent ? 'flex-start' : 'flex-end',
        marginBottom: 6,
        opacity,
        transform: `translateY(${slideY}px)`,
        paddingLeft: isAgent ? 0 : 60,
        paddingRight: isAgent ? 60 : 0,
      }}
    >
      <div
        style={{
          background: isAgent ? '#FFFFFF' : '#DCF8C6',
          borderRadius: 12,
          borderTopLeftRadius: isAgent ? 0 : 12,
          borderTopRightRadius: isAgent ? 12 : 0,
          padding: '8px 12px',
          maxWidth: 320,
          boxShadow: '0 1px 1px rgba(0,0,0,0.08)',
          position: 'relative',
        }}
      >
        {message.image && (
          <div
            style={{
              width: 280,
              height: 160,
              borderRadius: 8,
              marginBottom: 6,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <span style={{ fontSize: 48 }}>{message.image}</span>
          </div>
        )}
        <p
          style={{
            margin: 0,
            fontSize: 16,
            lineHeight: 1.45,
            color: '#111B21',
            fontFamily: "'Segoe UI', Helvetica, Arial, sans-serif",
            whiteSpace: 'pre-wrap',
          }}
        >
          {message.text}
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 4,
            marginTop: 3,
          }}
        >
          <span style={{ fontSize: 11, color: '#667781' }}>{time}</span>
          {!isAgent && (
            <span style={{ fontSize: 11, color: '#53BDEB' }}>{CHECK_MARK}</span>
          )}
        </div>
      </div>
    </div>
  );
};
