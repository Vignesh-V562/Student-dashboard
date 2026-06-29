import { useState, useRef, useEffect } from 'react';
import LeftSidebar from './components/LeftSidebar';
import MainContent from './components/MainContent';
import RightSidebar from './components/RightSidebar';
import ResizeHandle from './components/ResizeHandle';
import { useSidebarResizing } from './hooks/useSidebarResizing';
import { STUDENT_MENU_ITEMS, TEACHER_MENU_ITEMS, daysUntil } from './constants/dashboard';
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
import TeacherOverview from './pages/teacher/TeacherOverview';
import ManageExams from './pages/teacher/ManageExams';
import ManageAssignments from './pages/teacher/ManageAssignments';
import MarkAttendance from './pages/teacher/MarkAttendance';
import StudentRoster from './pages/teacher/StudentRoster';
import AiStudyAssistant from './components/AiStudyAssistant';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';

const ExamDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') !== 'false');
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
            res.data.content.map((exam) => {
              const scheduled = new Date(exam.scheduledAt);
              const end = new Date(scheduled.getTime() + (exam.durationMinutes ?? 60) * 60_000);
              return {
                subject: exam.title,
                date: scheduled.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                time: `${scheduled.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`,
                daysLeft: daysUntil(scheduled),
                color: '',
              };
            })
          );
        }
      })
      .catch(() => setUpcomingExams([]));
  }, []);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'Overview':
        return user?.role === 'TEACHER' ? <TeacherOverview /> : <OverviewPage />;
      case 'Exams':
      case 'Assessments':
        return <ExamsPage />;
      case 'Assignments':
      case 'Projects':
        return <AssignmentsPage />;
      case 'Attendance':
        return <AttendancePage />;
      case 'Schedule':
        return <SchedulePage />;
      case 'GPA Calculator':
      case 'Skill Growth':
        return <GPACalculatorPage />;
      case 'Messages':
      case 'Ask AI':
        return <MessagesPage />;
      case 'Manage Exams':
        return <ManageExams />;
      case 'Manage Assignments':
      case 'Manage Projects':
        return <ManageAssignments />;
      case 'Mark Attendance':
      case 'Track Attendance':
        return <MarkAttendance />;
      case 'Student Roster':
      case 'Mentee Roster':
        return <StudentRoster />;
      default:
        return (
          <div className="glass-card flex flex-col items-center justify-center h-64 p-8">
            <p className="glass-heading text-lg mb-2">{activeTab}</p>
            <p className="glass-muted">This section is currently under development.</p>
          </div>
        );
    }
  };

  const menuItems = user?.role === 'TEACHER' ? TEACHER_MENU_ITEMS : STUDENT_MENU_ITEMS;

  return (
    <div
      ref={containerRef}
      data-theme={darkMode ? 'dark' : 'light'}
      className="dashboard-scene relative flex h-screen overflow-hidden"
    >
      <div className="dashboard-mesh pointer-events-none absolute inset-0" aria-hidden />
      <div className="dashboard-orb dashboard-orb-a absolute" aria-hidden />
      <div className="dashboard-orb dashboard-orb-b absolute" aria-hidden />

      <div style={{ width: `${leftWidth}px` }} className="relative z-10 h-full shrink-0">
        <LeftSidebar
          menuItems={menuItems}
          activeTab={activeTab}
          onPageChange={setActiveTab}
          user={user}
          onLogout={logout}
        />
      </div>

      <ResizeHandle
        onMouseDown={() => setIsDraggingLeft(true)}
        isDragging={isDraggingLeft}
      />

      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <MainContent
          activeTab={activeTab}
          setDarkMode={setDarkMode}
          darkMode={darkMode}
          username={user?.username}
          userRole={user?.role}
        >
          <div className="glass-page-enter">{renderActivePage()}</div>
        </MainContent>
        <button
          onClick={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
          className="glass-btn-icon absolute top-6 right-6 z-20"
          title={isRightSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isRightSidebarCollapsed ? <PanelRightOpen size={20} /> : <PanelRightClose size={20} />}
        </button>
      </div>

      {!isRightSidebarCollapsed && (
        <ResizeHandle
          onMouseDown={() => setIsDraggingRight(true)}
          isDragging={isDraggingRight}
        />
      )}

      <div
        style={{ width: isRightSidebarCollapsed ? '0' : `${rightWidth}px` }}
        className="relative z-10 h-full shrink-0 overflow-hidden transition-all duration-300"
      >
        <RightSidebar upcomingExams={upcomingExams} />
      </div>

      {user?.role !== 'TEACHER' && <AiStudyAssistant />}
    </div>
  );
};

export default ExamDashboard;
