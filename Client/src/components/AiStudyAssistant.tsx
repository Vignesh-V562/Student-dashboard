import React, { useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';

const AiStudyAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
        { role: 'ai', text: 'Hello! I am your AI Mentor Assistant. How can I help you with your projects today?' }
    ]);
    const [input, setInput] = useState('');

    const [loading, setLoading] = useState(false);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const newMessages = [...messages, { role: 'user' as const, text: input }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const { sendChatMessage } = await import('../services/api');
            
            // Format for backend: { role: "system|user|assistant", content: string }
            const apiMessages = newMessages.map(m => ({
                role: m.role === 'ai' ? 'assistant' : m.role,
                content: m.text
            }));

            const response = await sendChatMessage(apiMessages);
            
            if (response.success && response.data) {
                setMessages([
                    ...newMessages,
                    { role: 'ai', text: response.data.text }
                ]);
            } else {
                throw new Error("Failed to get response");
            }
        } catch (error) {
            setMessages([
                ...newMessages,
                { role: 'ai', text: 'Sorry, I am having trouble connecting to my neural network right now.' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="glass-modal flex h-[400px] w-80 flex-col overflow-hidden shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-between border-b border-white/10 bg-white/5 p-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-purple-400" />
                            <h3 className="glass-heading text-sm mb-0">AI Mentor</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-xl p-3 text-sm ${msg.role === 'user' ? 'bg-cyan-500/20 text-cyan-50' : 'bg-white/10 text-white/90'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] rounded-xl p-3 text-sm bg-white/10 text-white/90 flex gap-1 items-center">
                                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                    <div className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSend} className="border-t border-white/10 p-3 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="glass-modal-input flex-1 px-3 py-2 text-sm"
                        />
                        <button type="submit" className="glass-btn-primary flex items-center justify-center p-2">
                            <Send className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="glass-btn-primary group flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110"
                >
                    <Sparkles className="h-6 w-6 text-white group-hover:text-purple-200" />
                </button>
            )}
        </div>
    );
};

export default AiStudyAssistant;
