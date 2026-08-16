'use client';

import React, { useState } from 'react';
import { PlaygroundShell } from '../../components/PlaygroundShell';
import { ChatThread, Message } from '../../components/ChatThread';
import { ChatInput } from '../../components/ChatInput';
import { DisclaimerBanner } from '../../components/DisclaimerBanner';
import { getAgent } from '../../lib/agent-registry';
import { RRT_AGENT_PROMPT } from './prompt';

export function RrtView() {
  const agent = getAgent('rrt')!;
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: 'I am the RRT Advocate Skill. I can help you navigate Rapid Response Team protocols.' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSend(text: string) {
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/agents/rrt', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ 
          input: text,
          history: messages 
        }),
      });

      const data = await response.json();
      const replyText = data.modelReply?.text || JSON.stringify(data.deterministic, null, 2);
      
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
      summary={agent.summary || 'Agent playground'}
      packageLabel={`${agent.package}@${agent.version}`}
      sourceRepo={agent.repo}
      inputArea={
        <div style={{ display: 'flex', flexDirection: 'column', height: '600px', background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
          <ChatThread messages={messages} isLoading={isLoading} />
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      }
    >
      <DisclaimerBanner>This agent operates under strict governance protocols. Ensure all interactions are logged according to ASFDK standards.</DisclaimerBanner>
      <details style={{ marginTop: '1rem' }}>
        <summary style={{ cursor: 'pointer', color: '#8b5cf6' }}>Assistant Persona</summary>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#05070d', padding: '1rem', borderRadius: 12, color: '#f8fafc', fontSize: '0.85rem', marginTop: '0.5rem' }}>{RRT_AGENT_PROMPT}</pre>
      </details>
    </PlaygroundShell>
  );
}
