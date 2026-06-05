import React from 'react';
import { Search, MessageCircle, Bell, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

import type { UpcomingExam } from '../types';

interface RightSidebarProps {
  darkMode: boolean;
  upcomingExams: UpcomingExam[];
}

const RightSidebar: React.FC<RightSidebarProps> = ({ darkMode, upcomingExams }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const today = new Date();

  return (
    <div className={`h-full w-full flex-shrink-0 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-l p-6 overflow-y-auto custom-scrollbar`}>
      {/* Top Icons */}
      <div className="flex items-center justify-end gap-3 mb-6">
        <button className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg`}>
          <Search className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
        <button className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg`}>
          <MessageCircle className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
        <button className={`p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-lg`}>
          <Bell className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* Calendar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className={`p-1 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded`}>
              <ChevronLeft className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className={`p-1 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded`}>
              <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <div key={day} className={`text-center text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'} font-medium`}>
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 42 }, (_, i) => {
            const date = i - firstDayOfMonth + 1;
            const isCurrentMonth = date > 0 && date <= daysInMonth;
            const isToday = isCurrentMonth && date === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
            
            // Check if there's an exam on this date
            const hasEvent = isCurrentMonth && upcomingExams.some(exam => {
              const examDate = new Date(exam.date + ", " + currentDate.getFullYear()); // simplified check
              return examDate.getDate() === date && examDate.getMonth() === currentDate.getMonth();
            });

            return (
              <div key={i} className="aspect-square flex flex-col items-center justify-center">
                {isCurrentMonth && (
                  <>
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${isToday
                        ? darkMode
                          ? 'bg-gray-100 text-gray-900 font-medium'
                          : 'bg-black text-white font-medium'
                        : darkMode
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                      {date}
                    </div>
                    {hasEvent && !isToday && (
                      <div className="w-1 h-1 bg-blue-500 rounded-full mt-1"></div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Exams */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Upcoming exams</h3>
          <button className={`text-sm ${darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-900'} flex items-center gap-1`}>
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {upcomingExams.length === 0 && (
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No upcoming exams.</p>
          )}
          {upcomingExams.map((exam, idx) => (
            <div key={idx} className={`${exam.color} p-4 rounded-2xl`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'} mb-1`}>{exam.subject}</h4>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{exam.date}</p>
                </div>
                <span className={`${darkMode ? 'bg-white/10 text-gray-300' : 'bg-white text-gray-700'} text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap`}>
                  {exam.daysLeft}
                </span>
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{exam.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;