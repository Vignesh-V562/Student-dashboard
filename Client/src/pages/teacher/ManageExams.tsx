import { useEffect, useState } from 'react';
import { fetchExams, deleteExam } from '../../services/api';
import type { ExamApi } from '../../types';
import { Trash2, Edit2, Clock } from 'lucide-react';
import CreateExamModal from '../../components/CreateExamModal';

const ManageExams = () => {
    const [exams, setExams] = useState<ExamApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadExams = () => {
        setLoading(true);
        fetchExams()
            .then(res => {
                if (res.success && res.data?.content) {
                    setExams(res.data.content);
                }
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadExams();
    }, []);

    const handleDelete = (uuid: string) => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
            deleteExam(uuid).then(() => loadExams());
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
        <div className="space-y-6">
            <div className="flex justify-end">
                <button onClick={() => setIsModalOpen(true)} className="glass-btn-primary">
                    Create Exam
                </button>
            </div>

            {exams.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <p className="glass-muted">No exams created yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {exams.map(exam => (
                        <div key={exam.uuid} className="glass-card flex items-center justify-between p-6">
                            <div>
                                <h3 className="glass-heading text-lg">{exam.title}</h3>
                                <div className="glass-muted mt-2 flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1">
                                        <Clock size={16} />
                                        {new Date(exam.scheduledAt).toLocaleDateString()}
                                    </span>
                                    <span>{exam.durationMinutes} minutes</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="glass-btn-icon text-cyan-300" title="Edit">
                                    <Edit2 size={18} />
                                </button>
                                <button onClick={() => handleDelete(exam.uuid)} className="glass-btn-icon text-red-400" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <CreateExamModal onClose={() => setIsModalOpen(false)} onSuccess={loadExams} />
            )}
        </div>
    );
};

export default ManageExams;
