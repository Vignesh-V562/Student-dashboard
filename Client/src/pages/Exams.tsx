import React, { useEffect, useState } from 'react';
import { FileText, Clock, Users } from 'lucide-react';
import { fetchExams } from '../services/api';
import type { ExamApi } from '../types';

interface GroupedExams {
    date: string;
    exams: Array<{
        subject: string;
        class: string;
        time: string;
        status: string;
        participants: number;
    }>;
}

const ExamsPage: React.FC = () => {
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
    }, []);

    if (loading) return <div className="glass-loading">Loading exams…</div>;
    if (error) return <div className="auth-error rounded-xl p-4 text-center text-sm">{error}</div>;

    return (
        <div className="space-y-4">
            {groupedExams.length === 0 ? (
                <div className="glass-card p-8 text-center glass-muted">No exams scheduled. Enroll in a course to see exams.</div>
            ) : (
                groupedExams.map((day) => (
                    <div key={day.date} className="flex gap-4">
                        <div className="w-12 pt-2">
                            <span className="glass-muted text-sm font-semibold">{day.date}</span>
                        </div>
                        <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2">
                            {day.exams.map((exam, examIdx) => (
                                <div key={examIdx} className="glass-exam-chip cursor-pointer">
                                    <div className="mb-2 flex items-start justify-between">
                                        <div className="rounded-lg bg-white/10 p-2">
                                            <FileText className="h-4 w-4 text-cyan-300" />
                                        </div>
                                        <span className="glass-badge">{exam.status}</span>
                                    </div>
                                    <h3 className="glass-heading mb-1 text-sm">{exam.subject}</h3>
                                    <p className="glass-muted mb-3 text-sm">{exam.class}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="glass-muted flex items-center gap-1 text-sm">
                                            <Clock className="h-4 w-4" />
                                            {exam.time}
                                        </div>
                                        <div className="glass-muted flex items-center gap-1 text-sm">
                                            <Users className="h-4 w-4" />
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
