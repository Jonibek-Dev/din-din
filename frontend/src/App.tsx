import React, { useState, useEffect, useRef } from 'react';
import { Plus, MessageSquare, Trash2, ArrowUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import logoImg from './assets/logo.jpg';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

const App: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem('din-din-chats');
    return saved ? JSON.parse(saved) : [{ id: '1', title: 'New Conversation', messages: [] }];
  });
  const [activeChatId, setActiveChatId] = useState<string>(chats[0]?.id || '1');
  const [selectedModel, setSelectedModel] = useState('llama-3.3-70b-versatile');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const models = [
    { id: 'llama-3.3-70b-versatile', name: 'din-din Pro' },
    { id: 'llama-3-8b-8192', name: 'din-din Mini' },
    { id: 'mixtral-8x7b-32768', name: 'din-din Turbo' },
    { id: 'gemma2-9b-it', name: 'din-din Lite' },
  ];

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  useEffect(() => {
    localStorage.setItem('din-din-chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [activeChat?.messages]);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: []
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
  };

  const deleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newChats = chats.filter(c => c.id !== id);
    if (newChats.length === 0) {
      const resetChat: Chat = { id: Date.now().toString(), title: 'New Conversation', messages: [] };
      setChats([resetChat]);
      setActiveChatId(resetChat.id);
    } else {
      setChats(newChats);
      if (activeChatId === id) {
        setActiveChatId(newChats[0].id);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    const updatedMessages = [...activeChat.messages, userMessage];
    
    const updatedChats = chats.map(c => 
      c.id === activeChatId ? { 
        ...c, 
        messages: updatedMessages, 
        title: c.messages.length === 0 ? input.slice(0, 25) : c.title 
      } : c
    );
    setChats(updatedChats);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, model: selectedModel }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Server error');
      }

      const data = await response.json();
      
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: data.content || 'Error: No response' 
      };

      setChats(prev => prev.map(c => 
        c.id === activeChatId ? { ...c, messages: [...updatedMessages, assistantMessage] } : c
      ));
    } catch (error: any) {
      setChats(prev => prev.map(c => 
        c.id === activeChatId ? { ...c, messages: [...updatedMessages, { role: 'assistant', content: `**Error**: ${error.message}. Please check your API key.` }] } : c
      ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <img src={logoImg} alt="din-din logo" className="app-logo" />
          </div>
          <span className="logo-text">din-din</span>
        </div>
        
        <button className="new-chat-btn" onClick={createNewChat}>
          <Plus size={18} />
          New Chat
        </button>

        <div className="chat-list">
          {chats.map(chat => (
            <div 
              key={chat.id} 
              className={`chat-item ${chat.id === activeChatId ? 'active' : ''}`}
              onClick={() => setActiveChatId(chat.id)}
            >
              <MessageSquare size={18} color="#8e8e93" />
              <div className="chat-item-title">{chat.title}</div>
              <Trash2 
                size={16} 
                className="delete-btn" 
                onClick={(e) => deleteChat(e, chat.id)}
              />
            </div>
          ))}
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
          <select 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            style={{ 
              width: '100%', 
              background: '#fff', 
              border: '1px solid var(--border)',
              padding: '8px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          >
            {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
      </aside>

      <main className="chat-window">
        <div className="chat-messages">
          {activeChat?.messages.length === 0 ? (
            <div className="empty-state">
              <div className="logo-container" style={{ transform: 'scale(1.5)', marginBottom: '30px' }}>
                <img src={logoImg} alt="din-din logo" className="app-logo" />
              </div>
              <h2>How can I help you today?</h2>
              <p style={{ marginTop: '10px' }}>Select a model and start a conversation.</p>
            </div>
          ) : (
            activeChat?.messages.map((msg, i) => (
              <div key={i} className="message-wrapper">
                <div className={`message ${msg.role}`}>
                  <div className="markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <div className="input-wrapper">
            <textarea
              className="chat-input"
              placeholder="Message"
              rows={1}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                  e.currentTarget.style.height = 'auto';
                }
              }}
            />
            <button 
              className="send-btn" 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              <ArrowUp size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
