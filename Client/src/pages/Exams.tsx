import React, { useEffect, useState } from 'react';
import { FileText, Clock, Users } from 'lucide-react';
import { fetchExams } from '../services/api';
import type { ExamApi } from '../types';

interface ExamsPageProps {
    darkMode: boolean;
}

interface GroupedExams {
    date: string;
    exams: Array<{
        subject: string;
        class: string;
        time: string;
        status: string;
        participants: number;
        color: string;
    }>;
}

const ExamsPage: React.FC<ExamsPageProps> = ({ darkMode }) => {
    const [groupedExams, setGroupedExams] = useState<GroupedExams[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchExams()
            .then((data) => {
                if (data.success) {
                    const exams = data.data.content ?? [];
                    const grouped = exams.reduce<Record<string, GroupedExams['exams']>>((acc, exam: ExamApi) => {
                        const date = new Date(exam.scheduledAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                        if (!acc[date]) acc[date] = [];
                        acc[date].push({
                            subject: exam.title,
                            class: exam.courseName ?? 'General',
                            time: new Date(exam.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            status: exam.status,
                            participants: exam.participants ?? 0,
                            color: darkMode ? 'bg-indigo-500/20' : 'bg-indigo-50',
                        });
                        return acc;
                    }, {});

                    setGroupedExams(Object.keys(grouped).map((date) => ({ date, exams: grouped[date] })));
                }
                setLoading(false);
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : 'Failed to load exams');
                setLoading(false);
            });
    }, [darkMode]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading exams...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="space-y-4">
            {groupedExams.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No exams scheduled. Enroll in a course to see exams.</div>
            ) : (
                groupedExams.map((day) => (
                    <div key={day.date} className="flex gap-4">
                        <div className="w-12 pt-2">
                            <span className="text-sm font-medium text-gray-500">{day.date}</span>
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {day.exams.map((exam, examIdx) => (
                                <div key={examIdx} className={`${exam.color} p-4 rounded-2xl transition-all hover:scale-[1.02] cursor-pointer`}>
                                    <div className="flex items-start justify-between mb-2">
                                        <div className={`${darkMode ? 'bg-white/10' : 'bg-white/60'} p-2 rounded-lg`}>
                                            <FileText className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                                        </div>
                                        <span className={`${darkMode ? 'bg-white/10 text-gray-300' : 'bg-white/80 text-gray-700'} text-xs px-3 py-1 rounded-full font-medium`}>
                                            {exam.status}
                                        </span>
                                    </div>
                                    <h3 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-1`}>{exam.subject}</h3>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>{exam.class}</p>
                                    <div className="flex items-center justify-between">
                                        <div className={`flex items-center gap-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            <Clock className="w-4 h-4" />
                                            {exam.time}
                                        </div>
                                        <div className={`flex items-center gap-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            <Users className="w-4 h-4" />
                                            {exam.participants}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ExamsPage;
