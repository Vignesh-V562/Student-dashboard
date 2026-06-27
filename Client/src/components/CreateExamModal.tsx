import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createExam } from '../services/api';

interface CreateExamModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateExamModal: React.FC<CreateExamModalProps> = ({ onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const scheduledAt = new Date(`${date}T${time}:00`).toISOString();
      const res = await createExam({
        title,
        scheduledAt,
        durationMinutes: parseInt(duration),
        maxMarks: 100,
        passingMarks: 50,
      });

      if (res.success) {
        onSuccess();
        onClose();
      } else {
        setError(res.message || 'Failed to create exam');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="glass-modal w-full max-w-md p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="glass-heading text-xl text-white">Create New Exam</h2>
          <button type="button" onClick={onClose} className="glass-btn-icon text-slate-400">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="auth-error mb-4 rounded-xl px-4 py-3 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Exam Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="glass-modal-input"
              placeholder="e.g. Midterm Mathematics"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Date</label>
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="glass-modal-input" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Time</label>
              <input type="time" required value={time} onChange={(e) => setTime(e.target.value)} className="glass-modal-input" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Duration (minutes)</label>
            <input
              type="number"
              required
              min="15"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="glass-modal-input"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="glass-btn-icon px-4 py-2 text-sm">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="auth-button rounded-xl px-5 py-2.5 text-sm font-semibold disabled:opacity-50">
              {loading ? 'Creating…' : 'Create Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExamModal;
