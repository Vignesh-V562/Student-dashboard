import { Home, UserCheck, Calendar, Calculator, FileText, ClipboardList, MessageSquare, Users, CheckSquare } from 'lucide-react';
import type { MenuItem } from '../types';

export const STUDENT_MENU_ITEMS: MenuItem[] = [
    { icon: Home, label: 'Overview', active: true },
    { icon: FileText, label: 'Assessments', active: false },
    { icon: ClipboardList, label: 'Projects', active: false },
    { icon: UserCheck, label: 'Attendance', active: false },
    { icon: Calendar, label: 'Schedule', active: false },
    { icon: Calculator, label: 'Skill Growth', active: false },
    { icon: MessageSquare, label: 'Ask AI', active: false },
];

export const TEACHER_MENU_ITEMS: MenuItem[] = [
    { icon: Home, label: 'Overview', active: true },
    { icon: FileText, label: 'Assessments', active: false },
    { icon: ClipboardList, label: 'Manage Projects', active: false },
    { icon: CheckSquare, label: 'Track Attendance', active: false },
    { icon: Users, label: 'Mentee Roster', active: false },
    { icon: MessageSquare, label: 'Messages', active: false },
];

export function daysUntil(date: Date): string {
    const diff = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return 'Today';
    if (diff === 1) return '1 Day left';
    return `${diff} Days left`;
}
