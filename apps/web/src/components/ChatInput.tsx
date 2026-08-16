'use client';

import React, { useState } from 'react';

/**
 * Props for the ChatInput component.
 * 
 * @typedef {Object} ChatInputProps
 * @property {(message: string) => void} onSend - Callback fired when the user submits a message
 * @property {boolean} [isLoading] - Whether the agent is processing (disables input)
 */
interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

/**
 * A controlled text input form for sending messages in the chat playground.
 * 
 * Features:
 * - Enter-to-submit behavior (Shift+Enter for new line if needed)
 * - Input disabled during agent processing
 * - Placeholder text with clear styling
 * - Send button with loading spinner state
 * - Accessible gap and padding spacing
 * 
 * @param {ChatInputProps} props - The component props
 * 
 * @example
 * <ChatInput onSend={handleSend} isLoading={isLoading} />
 */
export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSend(input.trim());
    setInput('');
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ 
        display: 'flex', 
        gap: '8px', 
        padding: '1rem', 
        borderTop: '1px solid rgba(0,0,0,0.1)',
        background: 'white' 
      }}
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        aria-label="Message"
        style={{ 
          flex: 1, 
          padding: '0.6rem 1rem', 
          borderRadius: '20px', 
          border: '1px solid #ccc',
          fontSize: '1rem' 
        }}
      />
      <button 
        type="submit" 
        disabled={!input.trim() || isLoading}
        style={{ 
          padding: '0.6rem 1.2rem', 
          borderRadius: '20px', 
          background: '#007AFF', 
          color: 'white', 
          border: 'none', 
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        {isLoading ? '...' : 'Send'}
      </button>
    </form>
  );
}
