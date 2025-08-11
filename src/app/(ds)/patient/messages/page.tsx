/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Send, Paperclip, Search, MoreVertical, Phone, Video, Smile,
  CheckCheck, Check, Loader2
} from 'lucide-react';

type UserRole = 'patient' | 'doctor' | 'system';

interface Participant {
  id: string;
  role: UserRole;
  name: string;
  avatar?: string;
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string; // ISO
  read?: boolean;
}

interface Conversation {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  lastMessageAt: string;
  unreadCount: number;
  participants: Participant[];
}

const BRAND = '#C4E1E1';

// ---------- Dummy Data ----------
const me: Participant = {
  id: 'u_patient_1',
  role: 'patient',
  name: 'You',
};

const doctors: Participant[] = [
  { id: 'u_doc_1', role: 'doctor', name: 'Dr. Aline Uwase' },
  { id: 'u_doc_2', role: 'doctor', name: 'Dr. Daniel Nkurunziza' },
  { id: 'u_doc_3', role: 'doctor', name: 'Dr. Keza Mugisha' },
];

const dummyConversations: Conversation[] = [
  {
    id: 'c_1',
    doctorName: 'Dr. Aline Uwase',
    doctorSpecialty: 'Cardiologist',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    unreadCount: 2,
    participants: [me, doctors[0]],
  },
  {
    id: 'c_2',
    doctorName: 'Dr. Daniel Nkurunziza',
    doctorSpecialty: 'Dermatologist',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    unreadCount: 0,
    participants: [me, doctors[1]],
  },
  {
    id: 'c_3',
    doctorName: 'Dr. Keza Mugisha',
    doctorSpecialty: 'Pediatrics',
    lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    unreadCount: 0,
    participants: [me, doctors[2]],
  },
];

const dummyMessages: Message[] = [
  // c_1
  {
    id: 'm1', conversationId: 'c_1', senderId: 'u_doc_1',
    text: 'Hello! How are your chest pains today?', createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString()
  },
  {
    id: 'm2', conversationId: 'c_1', senderId: 'u_patient_1',
    text: 'Hi doctor. Much better after the medication, thank you!', createdAt: new Date(Date.now() - 1000 * 60 * 50).toISOString(), read: true
  },
  {
    id: 'm3', conversationId: 'c_1', senderId: 'u_doc_1',
    text: 'Great to hear. Remember to avoid strenuous activity for a few days.', createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString()
  },
  // c_2
  {
    id: 'm4', conversationId: 'c_2', senderId: 'u_patient_1',
    text: 'Could I get advice on a rash on my arm?', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3.5).toISOString(), read: true
  },
  {
    id: 'm5', conversationId: 'c_2', senderId: 'u_doc_2',
    text: 'Of course. Can you send a clear photo and tell me when it started?', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), read: true
  },
  // c_3
  {
    id: 'm6', conversationId: 'c_3', senderId: 'u_doc_3',
    text: 'Following up on the pediatric checkup—any fever since yesterday?', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(), read: true
  },
];

export default function PatientMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(dummyConversations);
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [activeId, setActiveId] = useState<string>(dummyConversations[0].id);
  const [query, setQuery] = useState('');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId)!,
    [conversations, activeId]
  );

  const activeMessages = useMemo(
    () => messages
      .filter((m) => m.conversationId === activeId)
      .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)),
    [messages, activeId]
  );

  // fake "mark as read" when you open a conversation
  useEffect(() => {
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, unreadCount: 0 } : c))
    );
  }, [activeId]);

  // fake "doctor typing…" after you send a message
  const scrollRef = useRef<HTMLDivElement>(null);
  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      conversationId: activeId,
      senderId: me.id,
      text,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
    // simulate typing + reply
    setIsTyping(true);
    setTimeout(() => {
      const docId = activeConversation.participants.find(p => p.role === 'doctor')!.id;
      setMessages((prev) => [
        ...prev,
        {
          id: `m_${Date.now()}_doc`,
          conversationId: activeId,
          senderId: docId,
          text: 'Thanks for the update. I’ll review and get back to you shortly.',
          createdAt: new Date().toISOString(),
          read: false,
        },
      ]);
      setIsTyping(false);
    }, 1400);
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, isTyping]);

  const filteredConversations = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.doctorName.toLowerCase().includes(q) ||
        c.doctorSpecialty.toLowerCase().includes(q)
    );
  }, [conversations, query]);

  const doctorInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const dateKey = (iso: string) =>
    new Date(iso).toLocaleDateString();

  return (
    <div
      className="min-h-[calc(100vh-4rem)] p-4 md:p-6"
      style={{ ['--brand' as any]: BRAND } as React.CSSProperties}
    >
      {/* brand ribbon */}
      <div
        className="mx-auto mb-4 h-1 max-w-6xl rounded-full"
        style={{ background: 'linear-gradient(90deg, transparent 0%, var(--brand) 22%, var(--brand) 78%, transparent 100%)' }}
      />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-[320px_1fr]">
        {/* Sidebar / Conversations */}
        <aside className="rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-base font-semibold text-gray-900">Messages</h2>
            <button
              className="rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
              onClick={() => {
                // fake new conversation
                const c: Conversation = {
                  id: `c_${Date.now()}`,
                  doctorName: 'Dr. New Conversation',
                  doctorSpecialty: 'General',
                  lastMessageAt: new Date().toISOString(),
                  unreadCount: 0,
                  participants: [me, { id: `u_doc_${Date.now()}`, role: 'doctor', name: 'Dr. New Conversation' }],
                };
                setConversations([c, ...conversations]);
                setActiveId(c.id);
              }}
            >
              New
            </button>
          </div>
          <div className="px-4 pb-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search doctor or specialty…"
                className="h-10 w-full rounded-xl border border-black/10 bg-white pl-9 pr-3 text-sm outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]"
              />
            </div>
          </div>
          <div className="max-h-[65vh] overflow-auto">
            <ul className="divide-y divide-black/5">
              {filteredConversations.map((c) => (
                <li
                  key={c.id}
                  className={`cursor-pointer px-4 py-3 transition-colors hover:bg-[var(--brand)]/10 ${activeId === c.id ? 'bg-[var(--brand)]/10' : 'bg-transparent'}`}
                  onClick={() => setActiveId(c.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="grid h-10 w-10 place-items-center rounded-full text-sm font-semibold text-gray-800 ring-1 ring-black/5"
                      style={{ background: 'radial-gradient(circle at 30% 30%, var(--brand), #ffffff 70%)' }}
                    >
                      {doctorInitials(c.doctorName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate font-medium text-gray-900">{c.doctorName}</p>
                        <span className="ml-3 shrink-0 text-xs text-gray-500">
                          {new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="truncate text-xs text-gray-500">{c.doctorSpecialty}</p>
                    </div>
                    {c.unreadCount > 0 && (
                      <span className="ml-2 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-600 px-1.5 text-xs font-semibold text-white">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Chat Panel */}
        <section className="flex min-h-[70vh] flex-col rounded-2xl border border-black/5 bg-white/80 shadow-xl backdrop-blur">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/5 px-5 py-3">
            <div className="flex items-center gap-3">
              <div
                className="grid h-10 w-10 place-items-center rounded-full text-sm font-semibold text-gray-800 ring-1 ring-black/5"
                style={{ background: 'radial-gradient(circle at 30% 30%, var(--brand), #ffffff 70%)' }}
              >
                {doctorInitials(activeConversation.doctorName)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{activeConversation.doctorName}</p>
                <p className="text-xs text-gray-500">{activeConversation.doctorSpecialty} • usually replies within a day</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="rounded-lg border border-black/10 bg-white px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
                <Phone className="h-4 w-4" />
              </button>
              <button className="rounded-lg border border-black/10 bg-white px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
                <Video className="h-4 w-4" />
              </button>
              <button className="rounded-lg border border-black/10 bg-white px-2 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-auto p-4">
            {groupByDate(activeMessages).map(({ date, items }) => (
              <div key={date}>
                <div className="mb-2 flex items-center justify-center">
                  <span className="rounded-full bg-gray-100 px-3 py-0.5 text-xs text-gray-600 ring-1 ring-black/5">
                    {date}
                  </span>
                </div>
                <div className="space-y-2">
                  {items.map((m) => {
                    const fromMe = m.senderId === me.id;
                    return (
                      <div key={m.id} className={`flex ${fromMe ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ring-1 ${
                            fromMe
                              ? 'bg-[var(--brand)] text-gray-900 ring-[var(--brand)]/60'
                              : 'bg-white text-gray-800 ring-black/5'
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words">{m.text}</p>
                          <div className="mt-1 flex items-center justify-end gap-1 text-[10px] text-gray-500">
                            <span>{formatTime(m.createdAt)}</span>
                            {fromMe ? (
                              m.read ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {activeConversation.doctorName} is typing…
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Composer */}
          <div className="border-t border-black/5 p-3">
            <div className="flex items-end gap-2">
              <button
                title="Attach"
                className="h-10 rounded-xl border border-black/10 bg-white px-3 text-gray-700 hover:bg-gray-50"
                onClick={() => alert('Attachment picker (demo)')}
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <div className="relative flex-1">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Write a message…"
                  className="min-h-[40px] w-full resize-none rounded-xl border border-black/10 bg-white px-3 py-2 pr-10 outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]"
                />
                <button
                  title="Emoji"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 hover:bg-gray-100"
                  onClick={() => alert('Emoji picker (demo)')}
                >
                  <Smile className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={sendMessage}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--brand)] px-4 font-medium text-gray-900 ring-1 ring-black/10 hover:bg-[#b3d8d8] disabled:opacity-60"
                disabled={!input.trim()}
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* -------- small helpers -------- */
function groupByDate(items: Message[]) {
  const map = new Map<string, Message[]>();
  items.forEach((m) => {
    const key = new Date(m.createdAt).toLocaleDateString();
    map.set(key, [...(map.get(key) || []), m]);
  });
  return Array.from(map.entries()).map(([date, msgs]) => ({ date, items: msgs }));
}
