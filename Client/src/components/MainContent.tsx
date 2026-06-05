import React, { useState } from 'react';
import { Sun, Moon, Plus } from 'lucide-react';
import CreateExamModal from './CreateExamModal';

interface MainContentProps {
  darkMode: boolean;
  activeTab: string;
  setDarkMode: (dark: boolean) => void;
  username?: string;
  children?: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ darkMode, activeTab, setDarkMode, username, children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getPageTitle = () => {
    switch (activeTab) {
      case 'Exams': return 'Exams';
      case 'Overview': return 'Dashboard Overview';
      case 'Class Preparation': return 'Class Preparation';
      case 'Attendance': return 'Attendance Records';
      case 'Assignments': return 'Assignments';
      case 'Schedule': return 'Weekly Schedule';
      case 'GPA Calculator': return 'GPA Calculator';
      case 'Analytics': return 'Academic Analytics';
      case 'Reports': return 'Academic Reports';
      case 'Messages': return 'Messages';
      default: return activeTab;
    }
  };

  const getPageSubtitle = () => {
    switch (activeTab) {
      case 'Exams': return 'View your upcoming examination schedule and details.';
      case 'Overview': return `Welcome back, ${username ?? 'Student'}! Here is what is happening with your studies.`;
      default: return `Manage your ${activeTab.toLowerCase()} and tracks.`;
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>Home › {activeTab}</p>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all ${darkMode
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 hover:scale-110 active:scale-95'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 shadow-sm hover:scale-110 active:scale-95'
                }`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-2`}>
                {getPageTitle()}
              </h1>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                {getPageSubtitle()}
              </p>
            </div>
            {activeTab === 'Exams' && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full transition-all font-medium ${darkMode
                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20'
                : 'bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/10'
                } active:scale-95`}>
                <Plus className="w-4 h-4" />
                Add new exam
              </button>
            )}
          </div>
        </div>

        {children}
      </div>
      
      {isModalOpen && (
        <CreateExamModal
          darkMode={darkMode}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            // Can't easily refresh exams from here without a context/prop change,
            // but the page can be forced to reload or just let the user see it on next fetch.
            window.location.reload(); 
          }}
        />
      )}
    </div>
  );
};

export default MainContent;