import React, { useEffect, useState } from 'react';
import { Search, Send } from 'lucide-react';
import { fetchMessages, sendMessage } from '../services/api';
import type { MessageApi } from '../types';

const MessagesPage: React.FC = () => {
    const [messages, setMessages] = useState<MessageApi[]>([]);
    const [selected, setSelected] = useState<MessageApi | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchMessages()
            .then((data) => {
                if (data.success) {
                    setMessages(data.data);
                    setSelected(data.data[0] ?? null);
                }
                setLoading(false);
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : 'Failed to load messages');
                setLoading(false);
            });
    }, []);

    const handleSendMessage = async () => {
        if (!selected || !newMessage.trim()) return;
        setSending(true);
        try {
            const res = await sendMessage(selected.uuid, newMessage);
            if (res.success) {
                const data = await fetchMessages();
                if (data.success) setMessages(data.data);
                setNewMessage('');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="glass-loading">Loading messages…</div>;
    if (error) return <div className="auth-error rounded-xl p-4 text-center text-sm">{error}</div>;

    return (
        <div className="glass-card flex h-[520px] overflow-hidden">
            <div className="flex w-1/3 flex-col border-r border-white/10">
                <div className="border-b border-white/10 p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search…" className="glass-modal-input !py-2 pl-10 text-sm" />
                    </div>
                </div>
                <div className="custom-scrollbar flex-1 overflow-y-auto">
                    {messages.length === 0 ? (
                        <p className="glass-muted p-4 text-sm">No messages yet.</p>
                    ) : (
                        messages.map((msg) => (
                            <button
                                key={msg.uuid}
                                type="button"
                                onClick={() => setSelected(msg)}
                                className={`w-full border-b border-white/5 p-4 text-left transition-colors hover:bg-white/5 ${
                                    selected?.uuid === msg.uuid ? 'bg-cyan-500/10 border-l-2 border-l-cyan-400' : ''
                                }`}
                            >
                                <p className="glass-heading text-sm">{msg.senderName}</p>
                                <p className="glass-muted truncate text-xs">{msg.content}</p>
                            </button>
                        ))
                    )}
                </div>
            </div>

            <div className="flex flex-1 flex-col">
                {selected ? (
                    <>
                        <div className="border-b border-white/10 p-4">
                            <p className="glass-heading text-sm">{selected.senderName}</p>
                            <p className="glass-muted text-xs">{new Date(selected.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="glass-exam-chip inline-block max-w-md !rounded-2xl">
                                {selected.content}
                            </div>
                        </div>
                        <div className="border-t border-white/10 p-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type a message…"
                                    className="glass-modal-input flex-1 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={handleSendMessage}
                                    disabled={sending || !newMessage.trim()}
                                    className="glass-btn-primary !mt-0 shrink-0 !rounded-xl !px-4 disabled:opacity-50"
                                >
                                    <Send className="h-4 w-4" />
                                    {sending ? '…' : 'Send'}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="glass-muted flex flex-1 items-center justify-center">Select a message</div>
                )}
            </div>
        </div>
    );
};

export default MessagesPage;
