import React, { useState } from 'react';
import { Calculator, Plus, Trash2 } from 'lucide-react';

interface GPACalculatorPageProps {
    darkMode: boolean;
}

const GPACalculatorPage: React.FC<GPACalculatorPageProps> = ({ darkMode }) => {
    const [courses, setCourses] = useState([
        { name: 'Mathematics', credits: 4, grade: 'A' },
        { name: 'Physics', credits: 4, grade: 'B+' },
        { name: 'English', credits: 3, grade: 'A-' },
    ]);

    const gradePoints: { [key: string]: number } = {
        'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'D': 1.0, 'F': 0.0
    };

    const calculateGPA = () => {
        let totalPoints = 0;
        let totalCredits = 0;
        courses.forEach(c => {
            totalPoints += (gradePoints[c.grade] || 0) * c.credits;
            totalCredits += c.credits;
        });
        return totalCredits === 0 ? '0.00' : (totalPoints / totalCredits).toFixed(2);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`md:col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-sm border ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Current Semester Courses</h3>
                        <button
                            onClick={() => setCourses([...courses, { name: '', credits: 3, grade: 'A' }])}
                            className={`flex items-center gap-2 text-sm font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
                        >
                            <Plus className="w-4 h-4" /> Add Course
                        </button>
                    </div>
                    <div className="space-y-3">
                        {courses.map((course, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={course.name}
                                    placeholder="Course Name"
                                    onChange={(e) => {
                                        const newCourses = [...courses];
                                        newCourses[idx].name = e.target.value;
                                        setCourses(newCourses);
                                    }}
                                    className={`flex-1 px-4 py-2 rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-800'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                                <select
                                    value={course.credits}
                                    onChange={(e) => {
                                        const newCourses = [...courses];
                                        newCourses[idx].credits = Number(e.target.value);
                                        setCourses(newCourses);
                                    }}
                                    className={`w-20 px-4 py-2 rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
                                >
                                    {[1, 2, 3, 4, 5].map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <select
                                    value={course.grade}
                                    onChange={(e) => {
                                        const newCourses = [...courses];
                                        newCourses[idx].grade = e.target.value;
                                        setCourses(newCourses);
                                    }}
                                    className={`w-20 px-4 py-2 rounded-xl border ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
                                >
                                    {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                                <button
                                    onClick={() => setCourses(courses.filter((_, i) => i !== idx))}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`${darkMode ? 'bg-blue-600' : 'bg-blue-600'} p-8 rounded-2xl shadow-lg text-white flex flex-col items-center justify-center text-center`}>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                        <Calculator className="w-8 h-8" />
                    </div>
                    <p className="text-blue-100 text-sm mb-1 font-medium">Your Semester GPA</p>
                    <h2 className="text-5xl font-bold mb-4">{calculateGPA()}</h2>
                    <p className="text-blue-100 text-xs opacity-80 uppercase tracking-widest">Target: 3.90</p>
                </div>
            </div>
        </div>
    );
};

export default GPACalculatorPage;
