import React, { useEffect, useState } from 'react';
import { Users, BookOpen, GraduationCap } from 'lucide-react';
import { fetchDashboardSummary } from '../services/api';

const OverviewPage: React.FC = () => {
    const [summary, setSummary] = useState<{ pendingExams?: number; completedExams?: number; enrolledCourses?: number; totalExams?: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardSummary()
            .then((data) => {
                if (data.success) setSummary(data.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const stats = [
        { label: 'Pending Exams', value: summary?.pendingExams?.toString() ?? '0', icon: GraduationCap, iconClass: 'glass-stat-icon-purple' },
        { label: 'Completed Exams', value: summary?.completedExams?.toString() ?? '0', icon: Users, iconClass: 'glass-stat-icon-blue' },
        { label: 'Enrolled Courses', value: summary?.enrolledCourses?.toString() ?? '0', icon: BookOpen, iconClass: 'glass-stat-icon-green' },
        { label: 'Total Exams', value: summary?.totalExams?.toString() ?? '0', icon: GraduationCap, iconClass: 'glass-stat-icon-orange' },
    ];

    if (loading) return <div className="glass-loading">Loading summary…</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="glass-card p-6">
                        <div className={`glass-stat-icon mb-4 ${stat.iconClass}`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <p className="glass-muted mb-1 text-sm">{stat.label}</p>
                        <h3 className="glass-stat-value">{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className="glass-card p-6">
                <h3 className="glass-heading mb-4 text-base">Performance Overview</h3>
                <div className="glass-card-inner flex h-64 items-end justify-between px-4 pb-4 pt-8">
                    {[
                        { month: 'Sep', height: '60%' },
                        { month: 'Oct', height: '75%' },
                        { month: 'Nov', height: '65%' },
                        { month: 'Dec', height: '85%' },
                        { month: 'Jan', height: '90%' },
                        { month: 'Feb', height: '80%' },
                    ].map((data) => (
                        <div key={data.month} className="group flex w-1/6 flex-col items-center">
                            <div className="flex w-full flex-col justify-end px-1" style={{ height: '200px' }}>
                                <div className="glass-chart-bar w-full" style={{ height: data.height }} />
                            </div>
                            <span className="glass-muted mt-2 text-xs font-medium">{data.month}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OverviewPage;
