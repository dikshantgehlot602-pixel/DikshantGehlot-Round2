import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export function inputClassName(hasError) {
  return hasError ? 'field-input field-input-error' : 'field-input';
}

export function FormField({ label, htmlFor, error, hint, children }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-navy-900">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p role="alert" className="text-xs text-rose-600">
          {error}
        </p>
      ) : (
        hint && <p className="text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}

export const PasswordInput = forwardRef(function PasswordInput({ id, error, ...props }, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        ref={ref}
        type={visible ? 'text' : 'password'}
        autoComplete={props.autoComplete}
        className={`${inputClassName(Boolean(error))} pr-11`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 transition-colors hover:text-navy-900"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  );
});
