import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { fetchAssignments } from '../services/api';
import type { AssignmentApi } from '../types';

interface AssignmentsPageProps {
    darkMode: boolean;
}

const AssignmentsPage: React.FC<AssignmentsPageProps> = ({ darkMode }) => {
    const [assignments, setAssignments] = useState<AssignmentApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAssignments()
            .then((data) => {
                if (data.success) setAssignments(data.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : 'Failed to load assignments');
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading assignments...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="space-y-4">
            {assignments.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No assignments found.</div>
            ) : (
                assignments.map((assignment) => {
                    const due = new Date(assignment.dueDate);
                    const isOverdue = !assignment.completed && due < new Date();
                    const status = assignment.completed ? 'Done' : isOverdue ? 'Overdue' : 'Pending';
                    const color = assignment.completed ? 'bg-green-500' : isOverdue ? 'bg-red-500' : 'bg-orange-500';

                    return (
                        <div
                            key={assignment.uuid}
                            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-100'} flex items-center justify-between transition-all hover:scale-[1.01] cursor-pointer`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-12 ${color} rounded-full`} />
                                <div>
                                    <h3 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{assignment.title}</h3>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {assignment.subjectName} • {due.toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right hidden sm:block">
                                    <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Status</p>
                                    <p className={`text-sm font-semibold ${assignment.completed ? 'text-green-500' : isOverdue ? 'text-red-500' : 'text-orange-500'}`}>{status}</p>
                                </div>
                                {assignment.completed ? (
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                ) : isOverdue ? (
                                    <AlertCircle className="w-6 h-6 text-red-500" />
                                ) : (
                                    <Clock className="w-6 h-6 text-gray-300" />
                                )}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default AssignmentsPage;
