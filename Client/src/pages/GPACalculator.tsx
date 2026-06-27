import React, { useEffect, useState } from 'react';
import { Calculator, Plus, Trash2 } from 'lucide-react';
import { fetchGrades, saveGrade, deleteGrade } from '../services/api';
import type { GradeApi } from '../types';

const GPACalculatorPage: React.FC = () => {
    const [courses, setCourses] = useState<GradeApi[]>([]);
    const [loading, setLoading] = useState(true);

    const gradePoints: Record<string, number> = {
        A: 4.0, 'A-': 3.7, 'B+': 3.3, B: 3.0, 'B-': 2.7, 'C+': 2.3, C: 2.0, D: 1.0, F: 0.0,
    };

    useEffect(() => {
        loadGrades();
    }, []);

    const loadGrades = async () => {
        try {
            const data = await fetchGrades();
            if (data.success) {
                setCourses(data.data);
            }
        } catch (error) {
            console.error("Failed to load grades:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateGPA = () => {
        let totalPoints = 0;
        let totalCredits = 0;
        courses.forEach((c) => {
            totalPoints += (gradePoints[c.gradeLetter] || 0) * c.credits;
            totalCredits += c.credits;
        });
        return totalCredits === 0 ? '0.00' : (totalPoints / totalCredits).toFixed(2);
    };

    const handleAddCourse = async () => {
        const newCourse: GradeApi = { courseName: 'New Course', credits: 3, gradeLetter: 'A' };
        try {
            const res = await saveGrade(newCourse);
            if (res.success && res.data) {
                setCourses([...courses, res.data]);
            }
        } catch (err) {
            console.error("Failed to save course", err);
        }
    };

    const handleUpdateCourse = async (idx: number, field: keyof GradeApi, value: any) => {
        const courseToUpdate = { ...courses[idx], [field]: value };
        
        // Optimistic UI update
        const next = [...courses];
        next[idx] = courseToUpdate;
        setCourses(next);

        // Update backend
        if (courseToUpdate.id) {
            try {
                await saveGrade(courseToUpdate);
            } catch (err) {
                console.error("Failed to update course", err);
                loadGrades(); // Revert on failure
            }
        }
    };

    const handleDeleteCourse = async (idx: number) => {
        const course = courses[idx];
        if (!course.id) return;
        
        // Optimistic update
        setCourses(courses.filter((_, i) => i !== idx));
        
        try {
            await deleteGrade(course.id);
        } catch (err) {
            console.error("Failed to delete course", err);
            loadGrades(); // Revert on failure
        }
    };

    if (loading) return <div className="glass-loading">Loading grades…</div>;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="glass-card md:col-span-2 p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h3 className="glass-heading text-base">Current Semester Courses</h3>
                        <button
                            type="button"
                            onClick={handleAddCourse}
                            className="flex items-center gap-2 text-sm font-medium text-cyan-400 hover:text-cyan-300"
                        >
                            <Plus className="h-4 w-4" /> Add course
                        </button>
                    </div>
                    <div className="space-y-3">
                        {courses.length === 0 ? (
                            <p className="glass-muted text-sm text-center py-4">No courses added yet.</p>
                        ) : (
                            courses.map((course, idx) => (
                                <div key={course.id || idx} className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={course.courseName}
                                        placeholder="Course name"
                                        onChange={(e) => handleUpdateCourse(idx, 'courseName', e.target.value)}
                                        className="glass-modal-input flex-1 text-sm"
                                    />
                                    <select
                                        value={course.credits}
                                        onChange={(e) => handleUpdateCourse(idx, 'credits', Number(e.target.value))}
                                        className="glass-modal-input w-20 text-sm"
                                    >
                                        {[1, 2, 3, 4, 5].map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={course.gradeLetter}
                                        onChange={(e) => handleUpdateCourse(idx, 'gradeLetter', e.target.value)}
                                        className="glass-modal-input w-20 text-sm"
                                    >
                                        {Object.keys(gradePoints).map((g) => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteCourse(idx)}
                                        className="glass-btn-icon !p-2 text-red-400"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="glass-card flex flex-col items-center justify-center p-8 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/30 to-indigo-500/30 ring-1 ring-white/20">
                        <Calculator className="h-8 w-8 text-cyan-300" />
                    </div>
                    <p className="glass-muted mb-1 text-sm font-medium">Your Semester GPA</p>
                    <h2 className="glass-heading mb-4 bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-5xl font-bold text-transparent">
                        {calculateGPA()}
                    </h2>
                    <p className="glass-muted text-xs uppercase tracking-widest">Target: 3.90</p>
                </div>
            </div>
        </div>
    );
};

export default GPACalculatorPage;
