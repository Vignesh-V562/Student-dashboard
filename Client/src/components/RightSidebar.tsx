import React from 'react';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import type { UpcomingExam } from '../types';

interface RightSidebarProps {
  upcomingExams: UpcomingExam[];
}

const RightSidebar: React.FC<RightSidebarProps> = ({ upcomingExams }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const today = new Date();

  return (
    <div className="glass-sidebar glass-sidebar-right h-full w-full overflow-y-auto p-6 custom-scrollbar">
      <div className="mb-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="glass-heading text-base">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              className="glass-btn-icon !p-1.5"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              className="glass-btn-icon !p-1.5"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className="glass-muted text-center text-xs font-medium">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 42 }, (_, i) => {
            const date = i - firstDayOfMonth + 1;
            const isCurrentMonth = date > 0 && date <= daysInMonth;
            const isToday =
              isCurrentMonth &&
              date === today.getDate() &&
              currentDate.getMonth() === today.getMonth() &&
              currentDate.getFullYear() === today.getFullYear();

            const hasEvent =
              isCurrentMonth &&
              upcomingExams.some((exam) => {
                const examDate = new Date(`${exam.date}, ${currentDate.getFullYear()}`);
                return examDate.getDate() === date && examDate.getMonth() === currentDate.getMonth();
              });

            return (
              <div key={i} className="flex aspect-square flex-col items-center justify-center">
                {isCurrentMonth && (
                  <>
                    <div className={`glass-cal-day ${isToday ? 'glass-cal-today' : ''}`}>{date}</div>
                    {hasEvent && !isToday && <div className="glass-cal-dot" />}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="glass-heading text-base">Upcoming exams</h3>
          <button type="button" className="glass-btn-icon !p-1.5">
            <Filter className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-3">
          {upcomingExams.length === 0 && (
            <p className="glass-muted text-sm">No upcoming exams.</p>
          )}
          {upcomingExams.map((exam, idx) => (
            <div key={idx} className="glass-exam-chip">
              <div className="mb-2 flex items-start justify-between gap-2">
                <div>
                  <h4 className="glass-heading mb-1 text-sm">{exam.subject}</h4>
                  <p className="glass-muted text-xs">{exam.date}</p>
                </div>
                <span className="glass-badge">{exam.daysLeft}</span>
              </div>
              <p className="glass-muted text-xs">{exam.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
