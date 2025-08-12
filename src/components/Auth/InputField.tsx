import { FieldError, UseFormRegister } from 'react-hook-form';
import React from 'react';

interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  error?: FieldError;
  required?: boolean;
}

export function InputField({ label, name, type, register, error, required }: InputFieldProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-medium text-gray-800"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className={[
          'group relative rounded-xl border bg-white/80 transition',
          error ? 'border-red-300 ring-1 ring-red-300' : 'border-black/10 hover:border-black/20',
          'focus-within:border-[var(--brand)]/60 focus-within:ring-2 focus-within:ring-[var(--brand)]/50',
        ].join(' ')}
      >
        {/* optional decorative icon area (kept empty to avoid functional change) */}
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-50">
          {/* you can drop an inline SVG here if you like */}
        </div>

        <input
          type={type}
          id={name}
          {...register(name, { required: required ? `${label} is required` : false })}
          className={[
            'w-full rounded-xl bg-transparent px-3 py-2.5 outline-none',
            // add left padding only if you place an icon above (e.g. pl-10)
            'text-gray-900 placeholder:text-gray-400',
          ].join(' ')}
          aria-invalid={!!error}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
}
