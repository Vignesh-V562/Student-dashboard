import { forwardRef, type InputHTMLAttributes } from 'react';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ReactNode;
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
    ({ label, icon, id, className = '', ...props }, ref) => {
        const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="auth-field group">
                <label
                    htmlFor={inputId}
                    className="auth-label mb-2 block text-sm font-medium text-slate-200"
                >
                    {label}
                </label>
                <div className="relative">
                    {icon && (
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                            {icon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        {...props}
                        className={`auth-input w-full rounded-xl border py-3.5 text-base font-medium text-slate-900 shadow-inner transition-all duration-300 placeholder:text-slate-400 focus:outline-none ${icon ? 'pl-11 pr-4' : 'px-4'} ${className}`}
                    />
                </div>
            </div>
        );
    }
);

GlassInput.displayName = 'GlassInput';

export default GlassInput;
