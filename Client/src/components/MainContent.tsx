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
      case 'Assessments': return 'Assessments';
      case 'Overview': return 'Dashboard Overview';
      case 'Attendance': return 'Attendance Records';
      case 'Projects': return 'Projects';
      case 'Schedule': return 'Weekly Schedule';
      case 'Skill Growth': return 'Skill Growth Analytics';
      case 'Ask AI': return 'AI Study Assistant';
      case 'Manage Exams': return 'Manage Assessments';
      case 'Manage Projects': return 'Manage Projects';
      case 'Track Attendance': return 'Track Attendance';
      case 'Mentee Roster': return 'Mentee Roster';
      default: return activeTab;
    }
  };

  const getPageSubtitle = () => {
    switch (activeTab) {
      case 'Assessments': return 'View your upcoming assessment schedule and details.';
      case 'Overview': return `Welcome back, ${username ?? 'User'}! Here is what is happening with your tracks.`;
      case 'Manage Exams': return 'Create and manage assessments for your mentees.';
      case 'Manage Projects': return 'Assign projects and provide feedback on submissions.';
      case 'Track Attendance': return 'Record daily engagement for your cohorts.';
      case 'Mentee Roster': return 'View all your mentees and their academic standing.';
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
