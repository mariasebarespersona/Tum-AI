import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ChatHeader } from './ChatHeader';
import { ChatBubble } from './ChatBubble';
import { TypingIndicator } from './TypingIndicator';
import type { Message } from './types';

interface Props {
  contactName: string;
  messages: Message[];
  subtitle?: string;
  bgColor?: string;
  label?: string;
}

export const WhatsAppChat: React.FC<Props> = ({
  contactName,
  messages,
  subtitle = 'online',
  bgColor = '#0f172a',
  label,
}) => {
  const frame = useCurrentFrame();

  // Find if we should show typing indicator
  const showTyping = messages.some(
    (m) => m.sender === 'agent' && frame >= m.delayFrames - 40 && frame < m.delayFrames
  );

  return (
    <AbsoluteFill
      style={{
        background: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Segoe UI', Helvetica, Arial, sans-serif",
      }}
    >
      {/* Label */}
      {label && (
        <div
          style={{
            position: 'absolute',
            top: 50,
            left: 0,
            right: 0,
            textAlign: 'center',
          }}
        >
          <p
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: 13,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 500,
              margin: 0,
            }}
          >
            {label}
          </p>
        </div>
      )}

      {/* Chat — full frame, no phone border */}
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0,
          overflow: 'hidden',
        }}
      >
        <ChatHeader name={contactName} subtitle={subtitle} />

        {/* Chat area */}
        <div
          style={{
            flex: 1,
            overflowY: 'hidden',
            padding: '16px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4cfc4' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundColor: '#ECE5DD',
          }}
        >
          {/* Date badge */}
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <span
              style={{
                background: '#E1F2FB',
                color: '#5A6673',
                fontSize: 13,
                padding: '5px 14px',
                borderRadius: 8,
                fontWeight: 500,
              }}
            >
              Today
            </span>
          </div>

          {/* Messages */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {messages.map((msg, i) => (
              <ChatBubble key={i} message={msg} index={i} />
            ))}

            {showTyping && <TypingIndicator />}
          </div>
        </div>

        {/* Input bar */}
        <div
          style={{
            background: '#F0F2F5',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div style={{ fontSize: 24 }}>😊</div>
          <div
            style={{
              flex: 1,
              background: 'white',
              borderRadius: 24,
              padding: '12px 18px',
              fontSize: 15,
              color: '#667781',
            }}
          >
            Type a message
          </div>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#00A884',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.85 0 3.58-.5 5.07-1.38L22 22l-1.38-4.93C21.5 15.58 22 13.85 22 12c0-5.52-4.48-10-10-10zm-1 14.5v-9l7 4.5-7 4.5z" />
            </svg>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
