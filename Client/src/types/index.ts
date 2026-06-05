import type { LucideIcon } from 'lucide-react';

export interface MenuItem {
    icon: LucideIcon;
    label: string;
    active: boolean;
    badge?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    timestamp?: string;
}

export interface UserProfile {
    uuid: string;
    username: string;
    email: string;
    role: string;
}

export interface ExamApi {
    uuid: string;
    title: string;
    description?: string;
    scheduledAt: string;
    durationMinutes: number;
    courseName?: string;
    subjectName?: string;
    status: string;
    participants?: number;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export interface AssignmentApi {
    uuid: string;
    title: string;
    description?: string;
    dueDate: string;
    subjectName: string;
    completed: boolean;
    score?: number;
}

export interface AttendanceSummary {
    subjectUuid: string;
    subjectName: string;
    presentCount: number;
    totalCount: number;
    percentage: number;
}

export interface AttendanceOverview {
    dayStatus: Record<string, 'present' | 'absent'>;
    subjectBreakdown: AttendanceSummary[];
}

export interface ScheduleEntryApi {
    uuid: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    subjectName: string;
    room?: string;
}

export interface MessageApi {
    uuid: string;
    senderName: string;
    receiverName: string;
    content: string;
    read: boolean;
    createdAt: string;
}

export interface DashboardSummary {
    totalExams: number;
    pendingExams: number;
    completedExams: number;
    enrolledCourses: number;
}

export interface Exam {
    class: string;
    time: string;
    subject: string;
    status: string;
    color: string;
    participants: number;
}

export interface UpcomingExam {
    subject: string;
    date: string;
    time: string;
    daysLeft: string;
    color: string;
}
