'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Message interface for the chat playground.
 * 
 * @typedef {Object} Message
 * @property {('user'|'assistant')} role - The message sender role
 * @property {string} content - The message text content
 */
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Props for the ChatThread component.
 * 
 * @typedef {Object} ChatThreadProps
 * @property {Message[]} messages - The conversation history
 * @property {boolean} isLoading - Whether a response is in flight
 */
interface ChatThreadProps {
  messages: Message[];
  isLoading: boolean;
}

/**
 * Renders a scrollable message thread with auto-scrolling.
 * 
 * @param {ChatThreadProps} props - The component props
 * 
 * Features:
 * - Auto-scroll to bottom on new messages or loading state
 * - User messages aligned right, assistant messages aligned left
 * - Loading state display with "Typing..." indicator
 * - Empty state when no messages exist
 * - Grid background styling
 */
export function ChatThread({ messages, isLoading }: ChatThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div 
      ref={scrollRef}
      style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '1rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem',
        background: '#f9f9f9' 
      }}
    >
      {messages.length === 0 && !isLoading && (
        <div style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>
          No messages yet. Start the conversation!
        </div>
      )}
      
      {messages.map((msg, i) => (
        <div 
          key={i} 
          style={{ 
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '80%' 
          }}
        >
          <div style={{ 
            padding: '0.6rem 1rem', 
            borderRadius: '12px', 
            background: msg.role === 'user' ? '#007AFF' : '#e5e5ea',
            color: msg.role === 'user' ? 'white' : 'black',
            fontSize: '0.95rem',
            lineHeight: 1.4
          }}>
            {msg.content}
          </div>
        </div>
      ))}

      {isLoading && (
        <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
          <div style={{ 
            padding: '0.6rem 1rem', 
            borderRadius: '12px', 
            background: '#e5e5ea', 
            color: 'black',
            fontSize: '0.95rem',
            fontStyle: 'italic'
          }}>
            Typing...
          </div>
        </div>
      )}
    </div>
  );
}
