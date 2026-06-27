import React, { useEffect, useState } from 'react';
import { fetchAssignments } from '../services/api';
import type { AssignmentApi } from '../types';

const AssignmentsPage: React.FC = () => {
    const [assignments, setAssignments] = useState<AssignmentApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [submittingAssignment, setSubmittingAssignment] = useState<AssignmentApi | null>(null);
    const [submissionContent, setSubmissionContent] = useState('');

    const loadAssignments = () => {
        setLoading(true);
        fetchAssignments()
            .then((data) => {
                if (data.success) setAssignments(data.data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : 'Failed to load assignments');
                setLoading(false);
            });
    };

    useEffect(() => {
        loadAssignments();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!submittingAssignment) return;
        try {
            const { submitAssignment } = await import('../services/api');
            await submitAssignment(submittingAssignment.uuid, submissionContent);
            setSubmittingAssignment(null);
            setSubmissionContent('');
            alert('Assignment submitted successfully!');
            loadAssignments();
        } catch (error) {
            alert('Failed to submit assignment');
        }
    };

    if (loading) return <div className="glass-loading">Loading assignments…</div>;
    if (error) return <div className="auth-error rounded-xl p-4 text-center text-sm">{error}</div>;

    return (
        <div className="space-y-4">
            {assignments.length === 0 ? (
                <div className="glass-card p-8 text-center glass-muted">No assignments found.</div>
            ) : (
                assignments.map((assignment) => {
                    const due = new Date(assignment.dueDate);
                    const isOverdue = !assignment.completed && due < new Date();
                    const status = assignment.completed ? 'Done' : isOverdue ? 'Overdue' : 'Pending';
                    const stripe = assignment.completed ? 'glass-stripe-green' : isOverdue ? 'glass-stripe-red' : 'glass-stripe-orange';

                    return (
                        <div key={assignment.uuid} className="glass-card flex items-center justify-between p-6">
                            <div className="flex items-center gap-4">
                                <div className={`h-12 w-1.5 rounded-full ${stripe}`} />
                                <div>
                                    <h3 className="glass-heading text-sm">{assignment.title}</h3>
                                    <p className="glass-muted text-sm">
                                        {assignment.subjectName} • {due.toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="hidden text-right sm:block">
                                    <p className="glass-muted text-xs font-medium uppercase tracking-wider">Status</p>
                                    <p className={`text-sm font-semibold ${assignment.completed ? 'text-green-400' : isOverdue ? 'text-red-400' : 'text-orange-400'}`}>
                                        {status}
                                    </p>
                                </div>
                                <button onClick={() => setSubmittingAssignment(assignment)} className="glass-btn-primary px-4 py-2 text-sm">
                                    Submit
                                </button>
                            </div>
                        </div>
                    );
                })
            )}

            {submittingAssignment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="glass-modal w-full max-w-md p-6">
                        <h2 className="glass-heading mb-6 text-xl">Submit Assignment</h2>
                        <h3 className="text-white font-medium mb-4">{submittingAssignment.title}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="glass-muted mb-1 block text-sm">Your Submission Content</label>
                                <textarea required className="glass-modal-input w-full min-h-[150px]" value={submissionContent} onChange={e => setSubmissionContent(e.target.value)} placeholder="Type your answer or provide a link to your work here..." />
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setSubmittingAssignment(null)} className="glass-btn-icon px-4">Cancel</button>
                                <button type="submit" className="glass-btn-primary px-4">Submit Work</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignmentsPage;
