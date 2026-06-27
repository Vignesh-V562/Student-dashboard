import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    children: ReactNode;
}

export default function GlassButton({ loading, children, disabled, className = '', ...props }: GlassButtonProps) {
    return (
        <button
            type="submit"
            disabled={disabled || loading}
            className={`auth-button group relative mt-2 w-full overflow-hidden rounded-xl py-3.5 text-base font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
            {...props}
        >
            <span className="auth-button-shine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="relative flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                {children}
            </span>
        </button>
    );
}
