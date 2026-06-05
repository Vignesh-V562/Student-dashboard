import { useState, useRef, useEffect } from 'react';
import LeftSidebar from './components/LeftSidebar';
import MainContent from './components/MainContent';
import RightSidebar from './components/RightSidebar';
import ResizeHandle from './components/ResizeHandle';
import { useSidebarResizing } from './hooks/useSidebarResizing';
import { MENU_ITEMS, daysUntil, examCardColor } from './constants/dashboard';
import { useAuth } from './context/AuthContext';
import { fetchUpcomingExams } from './services/api';
import type { UpcomingExam } from './types';

import OverviewPage from './pages/Overview';
import ExamsPage from './pages/Exams';
import AssignmentsPage from './pages/Assignments';
import AttendancePage from './pages/Attendance';
import SchedulePage from './pages/Schedule';
import GPACalculatorPage from './pages/GPACalculator';
import MessagesPage from './pages/Messages';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';

const ExamDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [upcomingExams, setUpcomingExams] = useState<UpcomingExam[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  const {
    leftWidth,
    rightWidth,
    isDraggingLeft,
    isDraggingRight,
    setIsDraggingLeft,
    setIsDraggingRight,
  } = useSidebarResizing({ containerRef });

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  useEffect(() => {
    fetchUpcomingExams(5)
      .then((res) => {
        if (res.success && res.data.content) {
          setUpcomingExams(
            res.data.content.map((exam, idx) => {
              const scheduled = new Date(exam.scheduledAt);
              const end = new Date(scheduled.getTime() + (exam.durationMinutes ?? 60) * 60_000);
              return {
                subject: exam.title,
                date: scheduled.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                time: `${scheduled.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`,
                daysLeft: daysUntil(scheduled),
                color: examCardColor(darkMode, idx),
              };
            })
          );
        }
      })
      .catch(() => setUpcomingExams([]));
  }, [darkMode]);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'Overview':
        return <OverviewPage darkMode={darkMode} />;
      case 'Exams':
        return <ExamsPage darkMode={darkMode} />;
      case 'Assignments':
        return <AssignmentsPage darkMode={darkMode} />;
      case 'Attendance':
        return <AttendancePage darkMode={darkMode} />;
      case 'Schedule':
        return <SchedulePage darkMode={darkMode} />;
      case 'GPA Calculator':
        return <GPACalculatorPage darkMode={darkMode} />;
      case 'Messages':
        return <MessagesPage darkMode={darkMode} />;
      default:
        return (
          <div className={`flex flex-col items-center justify-center h-64 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <p className="text-lg font-medium mb-2">{activeTab}</p>
            <p>This section is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex h-screen overflow-hidden font-sans ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
    >
      <div style={{ width: `${leftWidth}px` }} className="h-full">
        <LeftSidebar
          darkMode={darkMode}
          menuItems={MENU_ITEMS}
          activeTab={activeTab}
          onPageChange={setActiveTab}
          user={user}
          onLogout={logout}
        />
      </div>

      <ResizeHandle
        onMouseDown={() => setIsDraggingLeft(true)}
        isDragging={isDraggingLeft}
        darkMode={darkMode}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <MainContent
          darkMode={darkMode}
          activeTab={activeTab}
          setDarkMode={setDarkMode}
          username={user?.username}
        >
          {renderActivePage()}
        </MainContent>
        <button
          onClick={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
          className={`absolute top-6 right-6 p-2 rounded-lg transition-colors z-10 ${darkMode
            ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-100'
            : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900 shadow-sm border border-gray-100'
            }`}
          title={isRightSidebarCollapsed ? 'Expand Right Sidebar' : 'Collapse Right Sidebar'}
        >
          {isRightSidebarCollapsed ? <PanelRightOpen size={20} /> : <PanelRightClose size={20} />}
        </button>
      </div>

      {!isRightSidebarCollapsed && (
        <ResizeHandle
          onMouseDown={() => setIsDraggingRight(true)}
          isDragging={isDraggingRight}
          darkMode={darkMode}
        />
      )}

      <div
        style={{ width: isRightSidebarCollapsed ? '0' : `${rightWidth}px` }}
        className="h-full transition-all duration-300 overflow-hidden"
      >
        <RightSidebar darkMode={darkMode} upcomingExams={upcomingExams} />
      </div>
    </div>
  );
};

export default ExamDashboard;
