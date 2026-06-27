import type { ReactNode } from 'react';
import { GraduationCap } from 'lucide-react';

interface AuthShellProps {
    title: string;
    subtitle: string;
    children: ReactNode;
    footer: ReactNode;
}

export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
    return (
        <div className="auth-scene relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
            {/* Animated gradient mesh */}
            <div className="auth-mesh pointer-events-none absolute inset-0" aria-hidden />

            {/* Floating glass orbs */}
            <div className="auth-orb auth-orb-1 pointer-events-none absolute" aria-hidden />
            <div className="auth-orb auth-orb-2 pointer-events-none absolute" aria-hidden />
            <div className="auth-orb auth-orb-3 pointer-events-none absolute" aria-hidden />

            {/* Grid overlay */}
            <div className="auth-grid pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden />

            <div className="auth-card-enter relative z-10 w-full max-w-[440px]">
                <div className="auth-glass-card rounded-3xl p-8 sm:p-10">
                    {/* Brand mark */}
                    <div className="mb-8 flex flex-col items-center text-center">
                        <div className="auth-logo-ring mb-5 flex h-16 w-16 items-center justify-center rounded-2xl">
                            <GraduationCap className="h-8 w-8 text-cyan-300" strokeWidth={1.75} />
                        </div>
                        <p className="auth-eyebrow mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/90">
                            Student Portal
                        </p>
                        <h1 className="auth-title text-3xl font-bold tracking-tight text-white sm:text-[2rem]">
                            {title}
                        </h1>
                        <p className="auth-subtitle mt-2 max-w-xs text-sm leading-relaxed text-slate-300/90">
                            {subtitle}
                        </p>
                    </div>

                    {children}

                    <div className="auth-footer mt-8 text-center text-sm text-slate-400">{footer}</div>
                </div>

                <p className="auth-copyright mt-6 text-center text-xs text-slate-500/80">
                    Secure access to your academic dashboard
                </p>
            </div>
        </div>
    );
}
