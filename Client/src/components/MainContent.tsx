import React, { useState } from 'react';
import { Sun, Moon, Plus } from 'lucide-react';
import CreateExamModal from './CreateExamModal';

interface MainContentProps {
  darkMode: boolean;
  activeTab: string;
  setDarkMode: (dark: boolean) => void;
  username?: string;
  userRole?: string;
  children?: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ darkMode, activeTab, setDarkMode, username, userRole, children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getPageTitle = () => {
    switch (activeTab) {
      case 'Exams': return 'Exams';
      case 'Overview': return 'Dashboard Overview';
      case 'Attendance': return 'Attendance Records';
      case 'Assignments': return 'Assignments';
      case 'Schedule': return 'Weekly Schedule';
      case 'GPA Calculator': return 'GPA Calculator';
      case 'Messages': return 'Messages';
      case 'Manage Exams': return 'Manage Exams';
      case 'Manage Assignments': return 'Manage Assignments';
      case 'Mark Attendance': return 'Mark Attendance';
      case 'Student Roster': return 'Student Roster';
      default: return activeTab;
    }
  };

  const getPageSubtitle = () => {
    switch (activeTab) {
      case 'Exams': return 'View your upcoming examination schedule and details.';
      case 'Overview': return `Welcome back, ${username ?? 'User'}! Here is what is happening with your studies.`;
      case 'Manage Exams': return 'Create and manage examinations for your students.';
      case 'Manage Assignments': return 'Assign homework and track student submissions.';
      case 'Mark Attendance': return 'Record daily attendance for your classes.';
      case 'Student Roster': return 'View all enrolled students and their academic standing.';
      default: return `Manage your ${activeTab.toLowerCase()} and progress.`;
    }
  };

  return (
    <div className="h-full flex-1 overflow-y-auto custom-scrollbar">
      <div className="mx-auto max-w-5xl p-8">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <p className="glass-breadcrumb">Home › {activeTab}</p>
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="glass-btn-icon"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun className="h-5 w-5 text-amber-300" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
          <div className="mb-2 flex items-start justify-between gap-4">
            <div>
              <h1 className="glass-heading mb-2 text-3xl">{getPageTitle()}</h1>
              <p className="glass-subtext">{getPageSubtitle()}</p>
            </div>
            {activeTab === 'Manage Exams' && userRole === 'TEACHER' && (
              <button type="button" onClick={() => setIsModalOpen(true)} className="glass-btn-primary shrink-0">
                <Plus className="h-4 w-4" />
                Add exam
              </button>
            )}
          </div>
        </div>

        {children}
      </div>

      {isModalOpen && (
        <CreateExamModal
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
};

export default MainContent;
