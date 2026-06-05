import type {
    ApiResponse,
    AssignmentApi,
    AttendanceOverview,
    DashboardSummary,
    ExamApi,
    MessageApi,
    PageResponse,
    ScheduleEntryApi,
    UserProfile,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1';

function getToken(): string | null {
    return localStorage.getItem('token');
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

    const data = await response.json().catch(() => ({
        success: false,
        message: 'Invalid server response',
        data: null,
    }));

    if (!response.ok) {
        throw new Error(data.message || `Request failed (${response.status})`);
    }
    return data;
}

export const login = async (credentials: { username: string; password: string }) => {
    const data = await apiFetch<{ token: string; username: string; email: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
    if (data.success && data.data?.token) {
        localStorage.setItem('token', data.data.token);
    }
    return data;
};

export const signup = async (userData: { username: string; email: string; password: string }) => {
    return apiFetch<null>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

export const fetchCurrentUser = () => apiFetch<UserProfile>('/auth/me');

export const fetchExams = (params: { title?: string; startDate?: string; endDate?: string; page?: number; size?: number } = {}) => {
    const query = new URLSearchParams();
    if (params.title) query.append('title', params.title);
    if (params.startDate) query.append('startDate', params.startDate);
    if (params.endDate) query.append('endDate', params.endDate);
    query.append('page', String(params.page ?? 0));
    query.append('size', String(params.size ?? 50));
    return apiFetch<PageResponse<ExamApi>>(`/exams?${query.toString()}`);
};

export const fetchUpcomingExams = (size = 5) =>
    apiFetch<PageResponse<ExamApi>>(`/exams/upcoming?page=0&size=${size}`);

export const createExam = (exam: Partial<ExamApi>) => apiFetch<ExamApi>('/exams', { method: 'POST', body: JSON.stringify(exam) });
export const updateExam = (uuid: string, exam: Partial<ExamApi>) => apiFetch<ExamApi>(`/exams/${uuid}`, { method: 'PUT', body: JSON.stringify(exam) });
export const deleteExam = (uuid: string) => apiFetch<void>(`/exams/${uuid}`, { method: 'DELETE' });

export const fetchAssignments = () => apiFetch<AssignmentApi[]>('/assignments');
export const createAssignment = (assignment: Partial<AssignmentApi>) => apiFetch<AssignmentApi>('/assignments', { method: 'POST', body: JSON.stringify(assignment) });
export const updateAssignment = (uuid: string, assignment: Partial<AssignmentApi>) => apiFetch<AssignmentApi>(`/assignments/${uuid}`, { method: 'PUT', body: JSON.stringify(assignment) });
export const deleteAssignment = (uuid: string) => apiFetch<void>(`/assignments/${uuid}`, { method: 'DELETE' });

export const fetchAttendanceOverview = (year?: number, month?: number) => {
    const query = new URLSearchParams();
    if (year) query.append('year', String(year));
    if (month) query.append('month', String(month));
    const qs = query.toString();
    return apiFetch<AttendanceOverview>(`/attendance/overview${qs ? `?${qs}` : ''}`);
};

export const fetchSchedule = () => apiFetch<ScheduleEntryApi[]>('/schedule');

export const fetchMessages = () => apiFetch<MessageApi[]>('/messages');
export const sendMessage = (receiverUuid: string, content: string) => apiFetch<MessageApi>('/messages', { method: 'POST', body: JSON.stringify({ receiverUuid, content }) });

export const fetchDashboardSummary = () => apiFetch<DashboardSummary>('/dashboard/summary');


