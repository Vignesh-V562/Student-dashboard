import { useEffect, useState } from 'react';
import { fetchAssignments, createAssignment, deleteAssignment } from '../../services/api';
import type { AssignmentApi } from '../../types';
import { Trash2, Calendar } from 'lucide-react';

const ManageAssignments = () => {
    const [assignments, setAssignments] = useState<AssignmentApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAssignment, setNewAssignment] = useState({ title: '', description: '', dueDate: '', subjectName: '' });
    const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [gradingSubmission, setGradingSubmission] = useState<string | null>(null);
    const [score, setScore] = useState<string>('');
    const [feedback, setFeedback] = useState<string>('');

    const loadAssignments = () => {
        setLoading(true);
        fetchAssignments()
            .then(res => {
                if (res.success && res.data) {
                    setAssignments(res.data);
                }
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadAssignments();
    }, []);

    const handleViewSubmissions = async (uuid: string) => {
        setSelectedAssignment(uuid);
        try {
            const { fetchSubmissions } = await import('../../services/api');
            const res = await fetchSubmissions(uuid);
            if (res.success && res.data) {
                setSubmissions(res.data);
            }
        } catch (error) {
            alert('Failed to fetch submissions');
        }
    };

    const handleGrade = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!gradingSubmission) return;
        try {
            const { gradeSubmission } = await import('../../services/api');
            await gradeSubmission(gradingSubmission, parseInt(score), feedback);
            setGradingSubmission(null);
            setScore('');
            setFeedback('');
            if (selectedAssignment) handleViewSubmissions(selectedAssignment);
        } catch (error) {
            alert('Failed to grade submission');
        }
    };

    const handleDelete = (uuid: string) => {
        if (window.confirm('Are you sure you want to delete this assignment?')) {
            deleteAssignment(uuid).then(() => loadAssignments());
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createAssignment(newAssignment);
            setIsModalOpen(false);
            setNewAssignment({ title: '', description: '', dueDate: '', subjectName: '' });
            loadAssignments();
        } catch (error) {
            alert('Failed to create assignment');
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
            </div>
        );
    }

    if (selectedAssignment) {
        return (
            <div className="glass-page-enter space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white">Submissions</h2>
                    <button onClick={() => setSelectedAssignment(null)} className="glass-btn-icon px-4">Back to Assignments</button>
                </div>
                {submissions.length === 0 ? (
                    <div className="glass-card p-12 text-center text-white/50">No submissions yet.</div>
                ) : (
                    <div className="grid gap-4">
                        {submissions.map(sub => (
                            <div key={sub.uuid} className="glass-card p-6">
                                <div className="flex justify-between">
                                    <h3 className="font-bold text-white">{sub.studentName}</h3>
                                    <span className="glass-muted text-sm">{new Date(sub.submittedAt).toLocaleString()}</span>
                                </div>
                                <div className="mt-4 p-4 rounded bg-white/5 text-white/90">
                                    {sub.content}
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                    <div>
                                        {sub.score !== null ? (
                                            <span className="glass-badge bg-green-500/20 text-green-300">Grade: {sub.score}/100</span>
                                        ) : (
                                            <span className="glass-badge bg-yellow-500/20 text-yellow-300">Needs Grading</span>
                                        )}
                                    </div>
                                    <button onClick={() => setGradingSubmission(sub.uuid)} className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold">
                                        {sub.score !== null ? 'Update Grade' : 'Grade Submission'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {gradingSubmission && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="glass-modal w-full max-w-md p-6">
                            <h2 className="glass-heading mb-6 text-xl">Grade Submission</h2>
                            <form onSubmit={handleGrade} className="space-y-4">
                                <div>
                                    <label className="glass-muted mb-1 block text-sm">Score (0-100)</label>
                                    <input required type="number" min="0" max="100" className="glass-modal-input w-full" value={score} onChange={e => setScore(e.target.value)} />
                                </div>
                                <div>
                                    <label className="glass-muted mb-1 block text-sm">Feedback</label>
                                    <textarea className="glass-modal-input w-full" value={feedback} onChange={e => setFeedback(e.target.value)} />
                                </div>
                                <div className="mt-6 flex justify-end gap-3">
                                    <button type="button" onClick={() => setGradingSubmission(null)} className="glass-btn-icon px-4">Cancel</button>
                                    <button type="submit" className="glass-btn-primary px-4">Save Grade</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button onClick={() => setIsModalOpen(true)} className="glass-btn-primary">
                    Create Assignment
                </button>
            </div>

            {assignments.length === 0 ? (
                <div className="glass-card p-12 text-center">
                    <p className="glass-muted">No assignments created yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {assignments.map(assignment => (
                        <div key={assignment.uuid} className="glass-card flex items-center justify-between p-6">
                            <div>
                                <h3 className="glass-heading text-lg">{assignment.title}</h3>
                                <div className="glass-muted mt-2 flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={16} />
                                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                    </span>
                                    <span className="glass-badge bg-blue-500/20 text-blue-300">{assignment.subjectName}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button onClick={() => handleViewSubmissions(assignment.uuid)} className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">
                                    View Submissions
                                </button>
                                <button onClick={() => handleDelete(assignment.uuid)} className="glass-btn-icon text-red-400" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="glass-modal w-full max-w-md p-6">
                        <h2 className="glass-heading mb-6 text-xl">Create Assignment</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="glass-muted mb-1 block text-sm">Title</label>
                                <input required type="text" className="glass-modal-input w-full" value={newAssignment.title} onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="glass-muted mb-1 block text-sm">Description</label>
                                <textarea className="glass-modal-input w-full" value={newAssignment.description} onChange={e => setNewAssignment({ ...newAssignment, description: e.target.value })} />
                            </div>
                            <div>
                                <label className="glass-muted mb-1 block text-sm">Due Date</label>
                                <input required type="datetime-local" className="glass-modal-input w-full" value={newAssignment.dueDate} onChange={e => setNewAssignment({ ...newAssignment, dueDate: e.target.value })} />
                            </div>
                            <div>
                                <label className="glass-muted mb-1 block text-sm">Subject</label>
                                <input required type="text" className="glass-modal-input w-full" value={newAssignment.subjectName} onChange={e => setNewAssignment({ ...newAssignment, subjectName: e.target.value })} />
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="glass-btn-icon px-4">Cancel</button>
                                <button type="submit" className="glass-btn-primary px-4">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageAssignments;
