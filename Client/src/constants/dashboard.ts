import { Home, UserCheck, Calendar, Calculator, FileText, ClipboardList, MessageSquare } from 'lucide-react';
import type { MenuItem } from '../types';

export const MENU_ITEMS: MenuItem[] = [
    { icon: Home, label: 'Overview', active: true },
    { icon: FileText, label: 'Exams', active: false },
    { icon: ClipboardList, label: 'Assignments', active: false },
    { icon: UserCheck, label: 'Attendance', active: false },
    { icon: Calendar, label: 'Schedule', active: false },
    { icon: Calculator, label: 'GPA Calculator', active: false },
    { icon: MessageSquare, label: 'Messages', active: false },
];

export function daysUntil(date: Date): string {
    const diff = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return 'Today';
    if (diff === 1) return '1 Day left';
    return `${diff} Days left`;
}

export function examCardColor(darkMode: boolean, index: number): string {
    const colors = darkMode
        ? ['bg-purple-500/30', 'bg-green-500/30', 'bg-blue-500/30', 'bg-orange-500/30']
        : ['bg-purple-200', 'bg-green-200', 'bg-blue-200', 'bg-orange-200'];
    return colors[index % colors.length];
}
