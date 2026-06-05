import React, { useEffect, useState } from 'react';
import { fetchSchedule } from '../services/api';
import type { ScheduleEntryApi } from '../types';

interface SchedulePageProps {
    darkMode: boolean;
}

const SchedulePage: React.FC<SchedulePageProps> = ({ darkMode }) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

    const [events, setEvents] = useState<Array<{
        day: string;
        time: string;
        subject: string;
        room: string;
        color: string;
    }>>([]);
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
                            color: darkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-700',
                        }))
                    );
                }
                setLoading(false);
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : 'Failed to load schedule');
                setLoading(false);
            });
    }, [darkMode]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading schedule...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-100'} overflow-hidden`}>
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50'} text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[100px]`}>Time</th>
                            {days.map((day) => (
                                <th key={day} className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-900/50' : 'border-gray-100 bg-gray-50'} text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[150px]`}>{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {times.map((time) => (
                            <tr key={time}>
                                <td className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-50'} text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{time}</td>
                                {days.map((day) => {
                                    const event = events.find((e) => e.day === day && e.time === time);
                                    return (
                                        <td key={`${day}-${time}`} className={`p-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-50'}`}>
                                            {event ? (
                                                <div className={`${event.color} p-3 rounded-xl text-xs hover:scale-[1.02] transition-transform cursor-pointer`}>
                                                    <p className="font-bold">{event.subject}</p>
                                                    <p className="opacity-80 text-[10px]">Room {event.room}</p>
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
