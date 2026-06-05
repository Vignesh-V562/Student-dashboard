import React, { useEffect, useState } from 'react';
import { Users, BookOpen, GraduationCap } from 'lucide-react';
import { fetchDashboardSummary } from '../services/api';

interface OverviewPageProps {
    darkMode: boolean;
}

const OverviewPage: React.FC<OverviewPageProps> = ({ darkMode }) => {
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardSummary()
            .then(data => {
                if (data.success) {
                    setSummary(data.data);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch summary", err);
                setLoading(false);
            });
    }, []);

    const stats = [
        { label: 'Pending Exams', value: summary?.pendingExams?.toString() || '0', icon: GraduationCap, color: 'bg-purple-100 text-purple-600' },
        { label: 'Completed Exams', value: summary?.completedExams?.toString() || '0', icon: Users, color: 'bg-blue-100 text-blue-600' },
        { label: 'Enrolled Courses', value: summary?.enrolledCourses?.toString() || '0', icon: BookOpen, color: 'bg-green-100 text-green-600' },
        { label: 'Total Exams', value: summary?.totalExams?.toString() || '0', icon: GraduationCap, color: 'bg-orange-100 text-orange-600' },
    ];

    if (loading) return <div className="p-8 text-center text-gray-500">Loading summary...</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                        <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                        <h3 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>{stat.value}</h3>
                    </div>
                ))}
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <h3 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Performance Overview</h3>
                <div className={`h-64 flex items-end justify-between px-4 pt-8 pb-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                    {[
                        { month: 'Sep', height: '60%' },
                        { month: 'Oct', height: '75%' },
                        { month: 'Nov', height: '65%' },
                        { month: 'Dec', height: '85%' },
                        { month: 'Jan', height: '90%' },
                        { month: 'Feb', height: '80%' }
                    ].map((data, i) => (
                        <div key={i} className="flex flex-col items-center w-1/6 group">
                            <div className="w-full px-2 flex flex-col justify-end" style={{ height: '200px' }}>
                                <div 
                                    className={`w-full rounded-t-md transition-all duration-500 ease-out group-hover:opacity-80 ${darkMode ? 'bg-blue-500' : 'bg-blue-600'}`} 
                                    style={{ height: data.height }}
                                ></div>
                            </div>
                            <span className={`text-xs mt-2 font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{data.month}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OverviewPage;
