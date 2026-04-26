import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { api } from '../services/api';
import './ChatWidget.css';

const SUGGESTIONS = [
  "What are Yash's skills?",
  "Tell me about his projects",
  "What's his experience?",
  "How to contact Yash?",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey there! 👋 I'm Yash's AI assistant. Ask me anything about his skills, projects, or experience!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await api.sendChat(text.trim(), sessionId);
      setSessionId(data.session_id);
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.reply, cached: data.cached },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "Sorry, I'm having trouble connecting. Try again or reach out at yashpatidar2203@gmail.com!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="chat__fab"
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open AI Chat"
          >
            <MessageCircle size={24} />
            <span className="chat__fab-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chat__panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="chat__header">
              <div className="chat__header-info">
                <div className="chat__header-avatar">
                  <Bot size={20} />
                </div>
                <div>
                  <h4 className="chat__header-name">Yash's AI Assistant</h4>
                  <span className="chat__header-status">
                    <span className="chat__status-dot" />
                    Powered by Gemini
                  </span>
                </div>
              </div>
              <button className="chat__close" onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="chat__messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chat__msg chat__msg--${msg.role}`}>
                  <div className="chat__msg-icon">
                    {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className="chat__msg-bubble">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                    {msg.cached && (
                      <span className="chat__cached-badge">
                        <Sparkles size={10} /> Instant
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="chat__msg chat__msg--assistant">
                  <div className="chat__msg-icon"><Bot size={16} /></div>
                  <div className="chat__msg-bubble chat__typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="chat__suggestions">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    className="chat__suggestion"
                    onClick={() => sendMessage(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form className="chat__input-bar" onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                type="text"
                className="chat__input"
                placeholder="Ask about skills, projects, experience..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="chat__send"
                disabled={!input.trim() || loading}
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
