import { useEffect, useState } from 'react';
import { fetchStudentRoster, markAttendance } from '../../services/api';
import type { StudentInfo } from '../../types';
import { UserCheck, XCircle, CheckCircle2 } from 'lucide-react';

const MarkAttendance = () => {
    const [students, setStudents] = useState<StudentInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [subjectUuid, setSubjectUuid] = useState('00000000-0000-0000-0000-000000000000'); // Mock default
    const [attendanceState, setAttendanceState] = useState<Record<string, boolean>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchStudentRoster()
            .then(res => {
                if (res.success && res.data) {
                    setStudents(res.data);
                    const initial: Record<string, boolean> = {};
                    res.data.forEach(s => { initial[s.uuid] = true; }); // Default all present
                    setAttendanceState(initial);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const toggleAttendance = (uuid: string) => {
        setAttendanceState(prev => ({ ...prev, [uuid]: !prev[uuid] }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const promises = students.map(student => 
                markAttendance({
                    studentUuid: student.uuid,
                    subjectUuid,
                    date,
                    present: attendanceState[student.uuid]
                })
            );
            await Promise.all(promises);
            alert('Attendance submitted successfully!');
        } catch (error) {
            alert('Failed to submit attendance. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="glass-page-enter space-y-6">
            <div className="glass-card flex flex-wrap items-center gap-6 p-6">
                <div className="flex-1">
                    <label className="glass-muted mb-2 block text-sm font-medium">Date</label>
                    <input 
                        type="date" 
                        value={date} 
                        onChange={e => setDate(e.target.value)}
                        className="glass-modal-input w-full"
                    />
                </div>
                <div className="flex-1">
                    <label className="glass-muted mb-2 block text-sm font-medium">Subject UUID</label>
                    <input 
                        type="text" 
                        value={subjectUuid}
                        onChange={e => setSubjectUuid(e.target.value)}
                        placeholder="Enter Subject UUID"
                        className="glass-modal-input w-full"
                    />
                </div>
            </div>

            <div className="glass-card p-6">
                <h3 className="glass-heading mb-6 flex items-center gap-2 text-lg">
                    <UserCheck className="text-cyan-400" />
                    Student Roster ({students.length})
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {students.map(student => {
                        const isPresent = attendanceState[student.uuid];
                        return (
                            <div 
                                key={student.uuid} 
                                onClick={() => toggleAttendance(student.uuid)}
                                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all duration-300 ${
                                    isPresent 
                                        ? 'border-green-500/30 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.15)]' 
                                        : 'border-red-500/30 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="glass-avatar h-10 w-10 text-lg">
                                        {student.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{student.username}</p>
                                        <p className="text-xs text-white/60">{student.email}</p>
                                    </div>
                                </div>
                                <div>
                                    {isPresent ? (
                                        <CheckCircle2 className="text-green-400" size={24} />
                                    ) : (
                                        <XCircle className="text-red-400" size={24} />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 flex justify-end gap-4 border-t border-white/10 pt-6">
                    <button 
                        onClick={() => {
                            import('../../services/api').then(module => module.downloadCsv().catch(err => alert(err.message)));
                        }} 
                        className="rounded-lg border border-white/20 bg-white/5 px-8 py-3 text-lg text-white hover:bg-white/10 transition-colors"
                    >
                        Export CSV Report
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting || students.length === 0}
                        className="glass-btn-primary px-8 py-3 text-lg"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MarkAttendance;
