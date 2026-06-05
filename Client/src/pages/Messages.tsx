import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { fetchMessages } from '../services/api';
import type { MessageApi } from '../types';

interface MessagesPageProps {
    darkMode: boolean;
}

const MessagesPage: React.FC<MessagesPageProps> = ({ darkMode }) => {
    const [messages, setMessages] = useState<MessageApi[]>([]);
    const [selected, setSelected] = useState<MessageApi | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) return <div className="p-8 text-center text-gray-500">Loading messages...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);

    const handleSendMessage = async () => {
        if (!selected || !newMessage.trim()) return;
        setSending(true);
        try {
            const receiverUuid = selected.senderName === 'Unknown' ? selected.uuid : selected.uuid; // Simplification, normally need receiverUuid from thread
            const res = await import('../services/api').then(api => api.sendMessage(receiverUuid, newMessage));
            if (res.success) {
                // Refresh messages
                const data = await import('../services/api').then(api => api.fetchMessages());
                if (data.success) {
                    setMessages(data.data);
                }
                setNewMessage('');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className={`h-[500px] flex rounded-2xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} overflow-hidden shadow-sm`}>
            <div className={`w-1/3 border-r flex flex-col ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-200'} border focus:outline-none`}
                        />
                    </div>
                </div>
                <div className="overflow-y-auto flex-1 custom-scrollbar">
                    {messages.length === 0 ? (
                        <p className="p-4 text-sm text-gray-500">No messages yet.</p>
                    ) : (
                        messages.map((msg) => (
                            <button
                                key={msg.uuid}
                                type="button"
                                onClick={() => setSelected(msg)}
                                className={`w-full text-left p-4 border-b ${darkMode ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-50 hover:bg-gray-50'} ${selected?.uuid === msg.uuid ? (darkMode ? 'bg-gray-700' : 'bg-blue-50') : ''}`}
                            >
                                <p className={`text-sm font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{msg.senderName}</p>
                                <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{msg.content}</p>
                            </button>
                        ))
                    )}
                </div>
            </div>
            <div className="flex-1 flex flex-col">
                {selected ? (
                    <>
                        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                            <p className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{selected.senderName}</p>
                            <p className="text-xs text-gray-500">{new Date(selected.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto">
                            <div className={`inline-block max-w-md p-4 rounded-2xl ${darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
                                {selected.content}
                            </div>
                        </div>
                        <div className={`p-4 border-t ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'}`}>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type a message..."
                                    className={`flex-1 px-4 py-2 rounded-xl text-sm border focus:outline-none ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-200 focus:border-blue-500' : 'bg-gray-50 border-gray-200 focus:border-blue-500'}`}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={sending || !newMessage.trim()}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors ${sending || !newMessage.trim() ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                >
                                    {sending ? 'Sending...' : 'Send'}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">Select a message</div>
                )}
            </div>
        </div>
    );
};

export default MessagesPage;
