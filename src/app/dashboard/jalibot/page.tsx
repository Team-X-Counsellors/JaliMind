'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConversationSidebar, ConversationSummary } from './ConversationSidebar';

interface Message {
  role: 'user' | 'bot';
  content: string;
  crisis?: boolean;
  animate?: boolean;
}

interface SpeechRecognitionResultEvent extends Event {
  results: { [index: number]: { [index: number]: { transcript: string } } };
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

const WELCOME_MESSAGE: Message = {
  role: 'bot',
  content:
    "Habari! I'm JaliBot, your AI counselling companion. How are you feeling today? I'm here to listen and support you.",
};

const CONVERSATION_ID_KEY = 'jalibot_conversation_id';
const WORD_REVEAL_MS = 45;

function TypewriterText({ text, onDone }: { text: string; onDone: () => void }) {
  const [wordCount, setWordCount] = useState(0);
  const words = text.split(' ');

  useEffect(() => {
    if (wordCount >= words.length) {
      if (words.length > 0) onDone();
      return;
    }
    const timer = setTimeout(() => setWordCount((c) => c + 1), WORD_REVEAL_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordCount, words.length]);

  return <p className="whitespace-pre-wrap">{words.slice(0, wordCount).join(' ')}</p>;
}

export default function JalibotPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setSpeechSupported('speechSynthesis' in window);
    setRecognitionSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
    };
  }, []);

  const speak = (text: string, index: number) => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    if (speakingIndex === index) {
      setSpeakingIndex(null);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const RecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!RecognitionCtor) return;
    const recognition = new RecognitionCtor();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const loadHistoryList = useCallback(async () => {
    try {
      const { data } = await api.get('/api/jalibot/history/');
      setConversations(data);
    } catch {
      // history sidebar is a nice-to-have; ignore failures silently
    }
  }, []);

  const loadConversation = useCallback(async (id: string) => {
    try {
      const { data } = await api.get(`/api/jalibot/history/${id}/`);
      const hydrated: Message[] = data.messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'bot',
        content: m.content,
      }));
      window.speechSynthesis?.cancel();
      setSpeakingIndex(null);
      setMessages(hydrated.length > 0 ? hydrated : [WELCOME_MESSAGE]);
      setConversationId(id);
      setCrisisDetected(data.crisis_detected);
      localStorage.setItem(CONVERSATION_ID_KEY, id);
    } catch {
      localStorage.removeItem(CONVERSATION_ID_KEY);
      setConversationId(null);
      setMessages([WELCOME_MESSAGE]);
    }
  }, []);

  useEffect(() => {
    loadHistoryList();
    const storedId = localStorage.getItem(CONVERSATION_ID_KEY);
    if (storedId) loadConversation(storedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startNewConversation = () => {
    window.speechSynthesis?.cancel();
    setSpeakingIndex(null);
    setMessages([WELCOME_MESSAGE]);
    setConversationId(null);
    setCrisisDetected(false);
    localStorage.removeItem(CONVERSATION_ID_KEY);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const { data } = await api.post('/api/jalibot/chat/', {
        message: text,
        conversation_id: conversationId,
      });
      setMessages((m) => [...m, { role: 'bot', content: data.reply, crisis: data.crisis_detected, animate: true }]);
      if (data.crisis_detected) setCrisisDetected(true);
      if (data.conversation_id && data.conversation_id !== conversationId) {
        setConversationId(data.conversation_id);
        localStorage.setItem(CONVERSATION_ID_KEY, data.conversation_id);
      }
      loadHistoryList();
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { reply?: string } } })?.response?.data;
      const msg = data?.reply || 'Sorry, I had trouble responding. Please try again in a moment.';
      setMessages((m) => [...m, { role: 'bot', content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4 animate-fade-in">
      <ConversationSidebar
        conversations={conversations}
        activeId={conversationId}
        onSelect={loadConversation}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold font-display">JaliBot AI</h2>
            <p className="text-muted-foreground text-sm">Confidential, culturally aware AI guidance</p>
          </div>
          <Button variant="outline" size="sm" onClick={startNewConversation}>
            New conversation
          </Button>
        </div>

        {crisisDetected && (
          <Card className="mb-4 border-destructive/40 bg-destructive/5 p-4">
            <p className="text-sm font-medium text-destructive">
              JaliBot has detected distress signals. You&apos;re not alone — please reach out to a counselor or crisis line:
            </p>
            <ul className="text-sm mt-2 space-y-1 text-destructive/80">
              <li>Kenya: Befrienders Kenya — +254 722 178 177</li>
              <li>Nigeria: SURPIN — 0800-800-2000</li>
              <li>South Africa: SADAG — 0800 456 789</li>
            </ul>
          </Card>
        )}

        <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <motion.div
                initial={msg.animate ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-tr-sm'
                    : 'bg-card border border-border rounded-tl-sm'
                }`}
              >
                {msg.crisis && (
                  <Badge variant="destructive" className="mb-2 text-xs">Crisis support activated</Badge>
                )}
                {msg.animate ? (
                  <TypewriterText
                    text={msg.content}
                    onDone={() =>
                      setMessages((m) =>
                        m.map((mm, idx) => (idx === i ? { ...mm, animate: false } : mm))
                      )
                    }
                  />
                ) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
                {msg.role === 'bot' && speechSupported && (
                  <button
                    onClick={() => speak(msg.content, i)}
                    className="text-xs text-primary mt-1 hover:underline"
                  >
                    {speakingIndex === i ? 'Stop' : 'Read aloud'}
                  </button>
                )}
              </motion.div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-muted-foreground">
                JaliBot is thinking…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="flex gap-2 pt-4 border-t border-border">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={listening ? 'Listening…' : 'Type a message…'}
            disabled={loading}
            className="flex-1"
          />
          {recognitionSupported && (
            <Button
              type="button"
              variant={listening ? 'destructive' : 'outline'}
              onClick={toggleListening}
              disabled={loading}
            >
              {listening ? 'Stop' : 'Speak'}
            </Button>
          )}
          <Button onClick={send} disabled={loading || !input.trim()}>Send</Button>
        </div>
      </div>
    </div>
  );
}
