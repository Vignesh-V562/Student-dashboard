import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createExam } from '../services/api';

interface CreateExamModalProps {
    darkMode: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateExamModal: React.FC<CreateExamModalProps> = ({ darkMode, onClose, onSuccess }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [duration, setDuration] = useState('60');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const scheduledAt = new Date(`${date}T${time}:00`).toISOString();
            const res = await createExam({
                title,
                scheduledAt,
                durationMinutes: parseInt(duration),
                maxMarks: 100,
                passingMarks: 50,
            });

            if (res.success) {
                onSuccess();
                onClose();
            } else {
                setError(res.message || 'Failed to create exam');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className={`w-full max-w-md p-6 rounded-2xl shadow-xl ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Create New Exam</h2>
                    <button onClick={onClose} className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Exam Title</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                            placeholder="e.g. Midterm Mathematics"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date</label>
                            <input
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Time</label>
                            <input
                                type="time"
                                required
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Duration (minutes)</label>
                        <input
                            type="number"
                            required
                            min="15"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-gray-50 border-gray-200'}`}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`px-4 py-2 rounded-xl font-medium ${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create Exam'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateExamModal;
