import { useEffect, useState } from 'react';
import { fetchStudentRoster } from '../../services/api';
import type { StudentInfo } from '../../types';
import { Search, Mail, Shield } from 'lucide-react';

const StudentRoster = () => {
    const [students, setStudents] = useState<StudentInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchStudentRoster()
            .then(res => {
                if (res.success && res.data) {
                    setStudents(res.data);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const filteredStudents = students.filter(s => 
        s.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <input 
                    type="text" 
                    placeholder="Search mentees by name or email..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="glass-modal-input w-full pl-12"
                />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredStudents.map(student => (
                    <div key={student.uuid} className="glass-card flex flex-col items-center p-8 text-center transition-transform duration-300 hover:-translate-y-1">
                        <div className="glass-avatar mb-4 h-20 w-20 text-2xl shadow-lg">
                            {student.username.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="glass-heading text-xl">{student.username}</h3>
                        
                        <div className="mt-4 flex flex-col gap-2 w-full">
                            <div className="flex items-center justify-center gap-2 text-sm text-white/70">
                                <Mail size={16} />
                                <span className="truncate">{student.email}</span>
                            </div>
                            <div className="flex items-center justify-center gap-2 text-sm text-white/70">
                                <Shield size={16} className="text-cyan-400" />
                                <span className="capitalize">{student.role.toLowerCase()}</span>
                            </div>
                        </div>
                        
                        <div className="mt-6 flex w-full gap-2">
                            <button className="glass-btn-primary flex-1 py-2 text-sm">View Portfolio</button>
                            <button className="glass-btn-icon">
                                <Mail size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {filteredStudents.length === 0 && (
                    <div className="col-span-full py-12 text-center text-white/50">
                        No mentees found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentRoster;
