import React, { useEffect, useState } from 'react';
import { fetchAttendanceOverview } from '../services/api';
import type { AttendanceOverview } from '../types';

const AttendancePage: React.FC = () => {
    const [overview, setOverview] = useState<AttendanceOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAttendanceOverview()
            .then((data) => {
                if (data.success) setOverview(data.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : 'Failed to load attendance');
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="glass-loading">Loading attendance…</div>;
    if (error) return <div className="auth-error rounded-xl p-4 text-center text-sm">{error}</div>;

    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="glass-card p-6">
                    <h3 className="glass-heading mb-4 text-base">Monthly Attendance</h3>
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: daysInMonth }, (_, i) => {
                            const day = i + 1;
                            const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const status = overview?.dayStatus?.[dateKey];
                            return (
                                <div
                                    key={day}
                                    className={`flex aspect-square items-center justify-center rounded-lg text-xs font-semibold ${
                                        status === 'present'
                                            ? 'bg-green-500/25 text-green-300 ring-1 ring-green-400/30'
                                            : status === 'absent'
                                                ? 'bg-red-500/25 text-red-300 ring-1 ring-red-400/30'
                                                : 'glass-card-inner text-slate-500'
                                    }`}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="glass-card p-6">
                    <h3 className="glass-heading mb-4 text-base">Subject Breakdown</h3>
                    <div className="space-y-4">
                        {!overview?.subjectBreakdown?.length ? (
                            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 shadow-[0_0_30px_rgba(56,189,248,0.15)]">
                                    <svg className="h-8 w-8 text-slate-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h4 className="glass-heading text-slate-300 text-sm mb-1">No Attendance Data</h4>
                                <p className="glass-muted text-xs max-w-[200px]">Your teachers haven't recorded any attendance for this month yet.</p>
                            </div>
                        ) : (
                            overview.subjectBreakdown.map((sub) => (
                                <div key={sub.subjectUuid} className="flex items-center justify-between">
                                    <div>
                                        <p className="glass-heading text-sm">{sub.subjectName}</p>
                                        <p className="glass-muted text-xs">{sub.presentCount}/{sub.totalCount} classes</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-bold ${sub.percentage > 75 ? 'text-green-400' : 'text-red-400'}`}>
                                            {sub.percentage}%
                                        </p>
                                        <div className="mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                                            <div
                                                className={`h-full rounded-full ${sub.percentage > 75 ? 'bg-green-400' : 'bg-red-400'}`}
                                                style={{ width: `${sub.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;
