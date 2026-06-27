import { useEffect, useState } from 'react';
import { Users, FileText, ClipboardList, UserCheck } from 'lucide-react';
import { fetchTeacherSummary, fetchAttendanceTrends, fetchGradeDistribution } from '../../services/api';
import type { TeacherSummary, AttendanceTrend, GradeDistribution } from '../../types';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';

const TeacherOverview = () => {
    const [summary, setSummary] = useState<TeacherSummary | null>(null);
    const [attendanceData, setAttendanceData] = useState<AttendanceTrend[]>([]);
    const [gradeData, setGradeData] = useState<GradeDistribution[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [summaryRes, attRes, gradeRes] = await Promise.all([
                    fetchTeacherSummary(),
                    fetchAttendanceTrends(),
                    fetchGradeDistribution()
                ]);
                
                if (summaryRes.success && summaryRes.data) {
                    setSummary(summaryRes.data);
                }
                if (attRes.success && attRes.data) {
                    setAttendanceData(attRes.data);
                }
                if (gradeRes.success && gradeRes.data) {
                    setGradeData(gradeRes.data);
                }
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="glass-page-enter space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Overview</h1>
                    <p className="glass-muted">Here's what's happening in your classes today.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card hover:-translate-y-1 transition-transform cursor-pointer p-6">
                    <div className="flex items-center gap-4">
                        <div className="glass-stat-icon glass-stat-icon-purple flex h-10 w-10 items-center justify-center rounded-lg">
                            <Users size={20} />
                        </div>
                        <div>
                            <p className="glass-muted text-sm font-medium">Total Students</p>
                            <h3 className="glass-stat-value text-xl font-bold">{summary?.totalStudents || 0}</h3>
                        </div>
                    </div>
                </div>

                <div className="glass-card hover:-translate-y-1 transition-transform cursor-pointer p-6">
                    <div className="flex items-center gap-4">
                        <div className="glass-stat-icon glass-stat-icon-blue flex h-10 w-10 items-center justify-center rounded-lg">
                            <FileText size={20} />
                        </div>
                        <div>
                            <p className="glass-muted text-sm font-medium">Total Exams</p>
                            <h3 className="glass-stat-value text-xl font-bold">{summary?.totalExams || 0}</h3>
                        </div>
                    </div>
                </div>

                <div className="glass-card hover:-translate-y-1 transition-transform cursor-pointer p-6">
                    <div className="flex items-center gap-4">
                        <div className="glass-stat-icon glass-stat-icon-orange flex h-10 w-10 items-center justify-center rounded-lg">
                            <ClipboardList size={20} />
                        </div>
                        <div>
                            <p className="glass-muted text-sm font-medium">Assignments</p>
                            <h3 className="glass-stat-value text-xl font-bold">{summary?.totalAssignments || 0}</h3>
                        </div>
                    </div>
                </div>

                <div className="glass-card hover:-translate-y-1 transition-transform cursor-pointer p-6">
                    <div className="flex items-center gap-4">
                        <div className="glass-stat-icon glass-stat-icon-green flex h-10 w-10 items-center justify-center rounded-lg">
                            <UserCheck size={20} />
                        </div>
                        <div>
                            <p className="glass-muted text-sm font-medium">Avg Attendance</p>
                            <h3 className="glass-stat-value text-xl font-bold">{summary?.avgAttendance || 0}%</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card flex flex-col h-96 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Attendance Trends (Last 7 Days)</h2>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={attendanceData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: 'rgba(20,20,30,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="attendance" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-card flex flex-col h-96 p-6">
                    <h2 className="text-xl font-semibold text-white mb-6">Class Grade Distribution</h2>
                    <div className="flex-1 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={gradeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="grade" stroke="rgba(255,255,255,0.5)" />
                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                <RechartsTooltip 
                                    contentStyle={{ backgroundColor: 'rgba(20,20,30,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                                />
                                <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <button className="glass-btn-primary px-6 py-3">Create Exam</button>
                    <button className="glass-btn-primary px-6 py-3">Post Assignment</button>
                    <button className="glass-btn-primary px-6 py-3">Mark Attendance</button>
                </div>
            </div>
        </div>
    );
};

export default TeacherOverview;
