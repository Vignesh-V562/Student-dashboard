import React, { useEffect, useState } from 'react';
import { fetchAttendanceOverview } from '../services/api';
import type { AttendanceOverview } from '../types';

interface AttendancePageProps {
    darkMode: boolean;
}

const AttendancePage: React.FC<AttendancePageProps> = ({ darkMode }) => {
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

    if (loading) return <div className="p-8 text-center text-gray-500">Loading attendance...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Monthly Attendance</h3>
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: daysInMonth }, (_, i) => {
                            const day = i + 1;
                            const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const status = overview?.dayStatus?.[dateKey];
                            return (
                                <div
                                    key={day}
                                    className={`aspect-square flex items-center justify-center rounded-lg text-xs font-medium ${
                                        status === 'present'
                                            ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                                            : status === 'absent'
                                                ? darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                                                : darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'
                                    }`}
                                >
                                    {day}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <h3 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Subject Breakdown</h3>
                    <div className="space-y-4">
                        {!overview?.subjectBreakdown?.length ? (
                            <p className="text-gray-500 text-sm">No attendance records found.</p>
                        ) : (
                            overview.subjectBreakdown.map((sub) => (
                                <div key={sub.subjectUuid} className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{sub.subjectName}</p>
                                        <p className="text-xs text-gray-500">{sub.presentCount}/{sub.totalCount} Classes</p>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-sm font-bold ${sub.percentage > 75 ? 'text-green-500' : 'text-red-500'}`}>{sub.percentage}%</p>
                                        <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1">
                                            <div
                                                className={`h-full rounded-full ${sub.percentage > 75 ? 'bg-green-500' : 'bg-red-500'}`}
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
