import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  children?: React.ReactNode;
  as?: 'input' | 'textarea' | 'select';
}

const inputClasses = "w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition-colors";
const labelClasses = "block text-white font-semibold mb-1 text-xs md:text-sm";

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  rows,
  children,
  as = 'input'
}: FormFieldProps) {
  return (
    <div>
      <label className={labelClasses} style={{ fontFamily: 'Dosis, sans-serif' }}>
        {label} {required && '*'}
      </label>
      {as === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows || 3}
          placeholder={placeholder}
          className={`${inputClasses} resize-none text-sm`}
          style={{ fontFamily: 'Dosis, sans-serif' }}
        />
      ) : as === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={inputClasses}
          style={{ fontFamily: 'Dosis, sans-serif' }}
        >
          {children}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={inputClasses}
          style={{ fontFamily: 'Dosis, sans-serif' }}
        />
      )}
    </div>
  );
}
