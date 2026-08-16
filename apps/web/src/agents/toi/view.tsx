'use client';

import React, { useState } from 'react';
import { PlaygroundShell } from '../../components/PlaygroundShell';
import { ChatThread, Message } from '../../components/ChatThread';
import { ChatInput } from '../../components/ChatInput';
import { getAgent } from '../../lib/agent-registry';
import { sendAgentMessage } from '../../lib/send-agent-message';
import { TOI_AGENT_PROMPT } from './prompt';

export function ToiView() {
  const agent = getAgent('toi')!;
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'Hello! I am the TOI Adoption Agent. Ask me about defining, validating, or refining your Terms of Interaction (TOI) documents.' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSend(text: string) {
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const newHistory = [...messages, userMsg].map(m => m.content);
      const data = await sendAgentMessage('toi', text, newHistory);
      const det = data.deterministic as { summary?: string; ok?: boolean } | undefined;
      const replyText =
        data.modelReply?.text ??
        det?.summary ??
        JSON.stringify(data.deterministic, null, 2) ??
        'No reply.';
      setMessages(prev => [...prev, { role: 'assistant', content: replyText }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error connecting to agent.' }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PlaygroundShell
      title={agent.name}
      summary="Help users define, validate, and refine consent-based Terms of Interaction."
      packageLabel={`${agent.package}@${agent.version}`}
      sourceRepo={agent.repo}
      inputArea={
        <div style={{ display: 'flex', flexDirection: 'column', height: '600px', background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
          <ChatThread messages={messages} isLoading={isLoading} />
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      }
    >
      <details style={{ marginTop: '1rem' }}>
        <summary style={{ cursor: 'pointer', color: '#8b5cf6' }}>Assistant Persona</summary>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#05070d', padding: '1rem', borderRadius: 12, color: '#f8fafc', fontSize: '0.85rem', marginTop: '0.5rem' }}>{TOI_AGENT_PROMPT}</pre>
      </details>
    </PlaygroundShell>
  );
}
