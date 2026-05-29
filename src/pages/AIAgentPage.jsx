import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Send, Bot, User, Sparkles, Trash2, Paperclip, X, FileText, Image as ImageIcon, MessageSquare, Menu } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import logoImg from '../../MyLogo.PNG';
import mammoth from 'mammoth';

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const quickChips = [
  "Explain the TNEA cutoff formula",
  "Career options after 12th Science",
  "How to study effectively for board exams?",
];

export default function AIAgentPage() {
  const { user, studentClass } = useAuth();
  
  const [chatSessions, setChatSessions] = useState(() => {
    const saved = localStorage.getItem('tn_studymate_chats');
    if (saved) {
      return JSON.parse(saved);
    }
    return [{ id: Date.now().toString(), title: 'New Chat', messages: [] }];
  });
  
  const [currentSessionId, setCurrentSessionId] = useState(chatSessions[0]?.id || Date.now().toString());

  const currentSession = chatSessions.find(s => s.id === currentSessionId) || { id: currentSessionId, title: 'New Chat', messages: [] };
  const messages = currentSession.messages;

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initial load scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Scroll only when user sends a message (isTyping becomes true)
  useEffect(() => {
    if (isTyping) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isTyping]);

  useEffect(() => {
    localStorage.setItem('tn_studymate_chats', JSON.stringify(chatSessions));
  }, [chatSessions]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    const newAttachments = await Promise.all(files.map(async (file) => {
      if (file.type.startsWith('image/')) {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              id: Date.now() + Math.random().toString(),
              name: file.name,
              type: 'image',
              dataUrl: reader.result
            });
          };
          reader.readAsDataURL(file);
        });
      } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let text = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(' ') + '\n';
          }
          return {
            id: Date.now() + Math.random().toString(),
            name: file.name,
            type: 'document',
            content: text.trim() ? text.substring(0, 10000) : '[Empty PDF]' // limit chars to avoid huge context
          };
        } catch (err) {
          console.error("PDF parsing error", err);
          return {
            id: Date.now() + Math.random().toString(),
            name: file.name,
            type: 'document',
            content: '[Error reading PDF]'
          };
        }
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.name.endsWith('.docx')) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          return {
            id: Date.now() + Math.random().toString(),
            name: file.name,
            type: 'document',
            content: result.value || '[Empty Document]'
          };
        } catch (err) {
          console.error("DOCX parsing error", err);
          return {
            id: Date.now() + Math.random().toString(),
            name: file.name,
            type: 'document',
            content: '[Error reading DOCX]'
          };
        }
      } else {
        let content = '';
        try { content = await file.text(); } catch (err) { }
        return {
          id: Date.now() + Math.random().toString(),
          name: file.name,
          type: 'document',
          content: content || '[Binary Document]'
        };
      }
    }));
    
    setAttachments(prev => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const createNewChat = () => {
    const newSession = { id: Date.now().toString(), title: 'New Chat', messages: [] };
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setShowHistory(false);
  };

  const clearChat = () => {
    setChatSessions(prev => {
      const updated = prev.filter(s => s.id !== currentSessionId);
      if (updated.length === 0) {
        const newSession = { id: Date.now().toString(), title: 'New Chat', messages: [] };
        setCurrentSessionId(newSession.id);
        return [newSession];
      }
      setCurrentSessionId(updated[0].id);
      return updated;
    });
  };

  const sendMessage = async (text) => {
    const msgText = text || input.trim();
    if (!msgText && attachments.length === 0) return;

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: msgText,
      attachments: attachments.length > 0 ? [...attachments] : null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return { 
          ...s, 
          messages: [...s.messages, userMsg],
          title: s.messages.length === 0 ? (msgText.substring(0, 30) || 'Chat with Files') : s.title
        };
      }
      return s;
    }));

    setInput('');
    const currentAttachments = [...attachments];
    setAttachments([]);
    setIsTyping(true);

    try {
      const systemPrompt = `You are StudyMate-Assistant, a friendly and helpful education assistant for Tamil Nadu ${studentClass}th standard students. 
You help with:
- Subject doubts and explanations
- Career guidance (engineering, medical, arts)
- Study tips and exam preparation strategies
- TNEA cutoff calculation and college selection
- Group selection after 10th (Bio-Maths, CS, Commerce, Arts)
- Board exam preparation tips

Keep responses concise, encouraging, and student-friendly. Use emojis occasionally. 
If asked about cutoff: TNEA Cutoff = Maths + Physics/2 + Chemistry/2 (out of 200).
Focus on Tamil Nadu education context.`;

      const hasImage = currentAttachments.some(a => a.type === 'image');
      const apiModel = hasImage ? 'llama-3.2-11b-vision-preview' : 'llama-3.1-8b-instant';

      const buildMessageContent = (mText, mAtt) => {
        if (!mAtt || mAtt.length === 0) return mText || "Here is the file attached.";
        const textContext = mAtt.filter(a => a.type === 'document').map(a => `[File: ${a.name}]\n${a.content}`).join('\n\n');
        const finalString = `${mText || ''}\n\n${textContext}`.trim();
        
        if (hasImage) {
          const contentArr = [{ type: 'text', text: finalString || "Please check the attached image." }];
          mAtt.filter(a => a.type === 'image').forEach(img => {
             contentArr.push({ type: 'image_url', image_url: { url: img.dataUrl } });
          });
          return contentArr;
        }
        return finalString;
      };

      const apiMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({
          role: m.role === 'ai' ? 'assistant' : 'user',
          content: buildMessageContent(m.content, m.attachments),
        })),
        { 
          role: 'user', 
          content: buildMessageContent(msgText, currentAttachments)
        },
      ];

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY || ''}`
        },
        body: JSON.stringify({
          messages: apiMessages,
          model: apiModel,
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error('Failed to connect to Groq API');
      const data = await response.json();
      const aiText = data.choices[0]?.message?.content;

      const aiMsg = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiText || "I'm sorry, I couldn't process that. Please try again!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, aiMsg] };
        }
        return s;
      }));
    } catch (error) {
      // Fallback response
      const fallbackResponses = {
        'cutoff': `📊 **TNEA Cutoff Formula:**\n\nCutoff = Maths + (Physics / 2) + (Chemistry / 2)\n\nTotal: Out of 200 marks\n\n**Example:** If Maths = 95, Physics = 90, Chemistry = 85:\nCutoff = 95 + 45 + 42.5 = **182.5/200**\n\nUse our Cutoff Calculator for instant results! 🧮`,
        'group': `🎯 **Group Selection After 10th:**\n\n1. **Bio-Maths** — For Medicine + Engineering (needs strong Maths & Science)\n2. **CS-Maths** — For IT & Engineering (needs strong Maths)\n3. **Pure Science** — For Research & Lab careers\n4. **Commerce** — For CA, Banking, Business\n5. **Arts** — For Government jobs, Law, Teaching\n\n💡 Tip: Choose based on your strongest subjects and career interest!`,
        'study': `📚 **Study Tips for Board Exams:**\n\n1. Start with previous year question papers\n2. Focus on important 5-mark questions\n3. Create short notes for quick revision\n4. Practice Maths daily — at least 10 problems\n5. Use the Pomodoro technique (25 min study + 5 min break)\n6. Revise before sleeping — it helps memory!\n\n💪 You've got this!`,
      };

      let fallback = "I'm having trouble connecting right now. Please check your internet and try again! 🔄\n\nIn the meantime, check out the other features like the Cutoff Calculator or Notes section.";
      
      const lowerMsg = msgText.toLowerCase();
      if (lowerMsg.includes('cutoff') || lowerMsg.includes('tnea')) fallback = fallbackResponses.cutoff;
      else if (lowerMsg.includes('group') || lowerMsg.includes('10th') || lowerMsg.includes('after')) fallback = fallbackResponses.group;
      else if (lowerMsg.includes('study') || lowerMsg.includes('tip') || lowerMsg.includes('exam')) fallback = fallbackResponses.study;

      setChatSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return { ...s, messages: [...s.messages, {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            content: fallback,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }] };
        }
        return s;
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (text) => {
    // Simple markdown-like formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div className="chat-container" style={{ display: 'flex', flexDirection: 'row', height: '100%', overflow: 'hidden' }}>
      
      {/* Sidebar for History */}
      {showHistory && (
        <div style={{ width: '260px', background: 'rgba(10, 14, 39, 0.95)', borderRight: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', height: '100%', zIndex: 100 }}>
          <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 600 }}>Chat History</span>
            <button onClick={() => setShowHistory(false)} className="btn btn-ghost btn-icon"><X size={18} /></button>
          </div>
          <div style={{ padding: 'var(--space-2)', flex: 1, overflowY: 'auto' }}>
            <button className="btn btn-outline" style={{ width: '100%', marginBottom: 'var(--space-4)', justifyContent: 'flex-start' }} onClick={createNewChat}>
              <MessageSquare size={16} style={{ marginRight: '8px' }} /> New Chat
            </button>
            {chatSessions.map(session => (
              <div 
                key={session.id}
                onClick={() => { setCurrentSessionId(session.id); setShowHistory(false); }}
                style={{ 
                  padding: 'var(--space-2) var(--space-3)', 
                  background: session.id === currentSessionId ? 'rgba(59,130,246,0.15)' : 'transparent',
                  borderLeft: session.id === currentSessionId ? '3px solid var(--color-accent-blue)' : '3px solid transparent',
                  borderRadius: '0 var(--radius-md) var(--radius-md) 0', 
                  fontSize: '0.9rem', 
                  color: session.id === currentSessionId ? '#fff' : 'var(--color-text-secondary)', 
                  cursor: 'pointer',
                  marginBottom: 'var(--space-2)',
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  transition: 'all 0.2s'
                }}
              >
                {session.title || 'New Chat'}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: 'var(--space-3) var(--space-6)',
        background: 'rgba(10, 14, 39, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-border)',
        zIndex: 50, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <button className="btn btn-ghost btn-icon" onClick={() => setShowHistory(!showHistory)} title="History">
            <Menu size={20} />
          </button>
          <div style={{
            width: 36, height: 36, borderRadius: 'var(--radius-lg)',
            background: 'var(--gradient-pink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
          }}>
            <img src={logoImg} alt="TN StudyMate" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>StudyMate-Assistant</div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-emerald)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-accent-emerald)' }} />
              Online
            </div>
          </div>
        </div>
        <button className="btn btn-ghost btn-icon" onClick={clearChat} title="Delete chat">
          <Trash2 size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            className={`chat-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="chat-bubble-header">
              {msg.role === 'ai' ? <img src={logoImg} style={{width: 18, height: 18, borderRadius: '50%'}} alt="AI"/> : <User size={14} />}
              <span>{msg.role === 'ai' ? 'StudyMate-Assistant' : 'You'}</span>
              <span style={{ marginLeft: 'auto' }}>{msg.time}</span>
            </div>
            {msg.attachments && (
              <div className="chat-bubble-attachments">
                {msg.attachments.map(att => (
                  <div key={att.id} className="chat-bubble-attachment">
                    {att.type === 'image' ? <ImageIcon size={14} /> : <FileText size={14} />}
                    <span style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{att.name}</span>
                  </div>
                ))}
              </div>
            )}
            {msg.content && <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />}
          </motion.div>
        ))}

        {isTyping && (
          <div className="chat-bubble ai">
            <div className="chat-typing-dots">
              <span /><span /><span />
            </div>
          </div>
        )}
        
        {messages.length === 0 && (
          <div className="chat-quick-chips" style={{ marginTop: '80px', marginBottom: 'auto', width: '100%' }}>
            {quickChips.map((chip, idx) => (
              <button
                key={chip}
                className="chat-suggestion-card"
                onClick={() => sendMessage(chip)}
              >
                <div className="chat-suggestion-icon">
                  {idx === 0 ? <Sparkles size={16} /> : idx === 1 ? <Bot size={16} /> : <FileText size={16} />}
                </div>
                <span className="chat-suggestion-text">{chip}</span>
              </button>
            ))}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="chat-input-bar">
        <div className="chat-input-wrapper">
          {attachments.length > 0 && (
            <div className="chat-attachments-preview">
              {attachments.map(att => (
                <div key={att.id} className="attachment-chip">
                  {att.type === 'image' ? <ImageIcon size={14} /> : <FileText size={14} />}
                  <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{att.name}</span>
                  <button onClick={() => removeAttachment(att.id)}>
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="chat-input-row">
            <button 
              className="btn-attach"
              onClick={() => fileInputRef.current?.click()}
              disabled={isTyping}
            >
              <Paperclip size={20} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              hidden
              multiple
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask your study doubt..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              id="ai-chat-input"
            />
            <button
              className="chat-send-btn"
              onClick={() => sendMessage()}
              disabled={(!input.trim() && attachments.length === 0) || isTyping}
              style={{ opacity: ((!input.trim() && attachments.length === 0) || isTyping) ? 0.5 : 1 }}
              id="ai-chat-send"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
