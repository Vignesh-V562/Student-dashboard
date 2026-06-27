import React, { useEffect, useState } from 'react';
import { fetchSchedule } from '../services/api';
import type { ScheduleEntryApi } from '../types';

const SchedulePage: React.FC = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

    const [events, setEvents] = useState<Array<{ day: string; time: string; subject: string; room: string }>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSchedule()
            .then((data) => {
                if (data.success) {
                    setEvents(
                        data.data.map((e: ScheduleEntryApi) => ({
                            day: e.dayOfWeek,
                            time: e.startTime.substring(0, 5),
                            subject: e.subjectName,
                            room: e.room ?? 'TBD',
                        }))
                    );
                }
                setLoading(false);
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : 'Failed to load schedule');
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="glass-loading">Loading schedule…</div>;
    if (error) return <div className="auth-error rounded-xl p-4 text-center text-sm">{error}</div>;

    if (events.length === 0) {
        return (
            <div className="glass-card flex flex-col items-center justify-center p-16 text-center min-h-[400px]">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 ring-1 ring-white/10 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
                    <svg className="h-10 w-10 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="glass-heading text-xl mb-2">No Classes Scheduled</h3>
                <p className="glass-muted max-w-sm">Your weekly schedule is currently empty. Once teachers assign classes, they will appear here automatically.</p>
            </div>
        );
    }

    return (
        <div className="glass-card overflow-hidden">
            <div className="custom-scrollbar overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="glass-muted border-b border-white/10 bg-white/5 p-4 text-left text-xs font-semibold uppercase tracking-wider">Time</th>
                            {days.map((day) => (
                                <th key={day} className="glass-muted min-w-[150px] border-b border-white/10 bg-white/5 p-4 text-left text-xs font-semibold uppercase tracking-wider">
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {times.map((time) => (
                            <tr key={time}>
                                <td className="glass-muted border-b border-white/5 p-4 text-xs font-medium">{time}</td>
                                {days.map((day) => {
                                    const event = events.find((e) => e.day === day && e.time === time);
                                    return (
                                        <td key={`${day}-${time}`} className="border-b border-white/5 p-2">
                                            {event ? (
                                                <div className="glass-exam-chip cursor-pointer !p-3 text-xs">
                                                    <p className="glass-heading text-xs font-bold">{event.subject}</p>
                                                    <p className="glass-muted text-[10px]">Room {event.room}</p>
                                                </div>
                                            ) : null}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SchedulePage;
