// components/Select.tsx
import React from "react";

export type Option = {
  label: string;
  value: string;
};

export type SelectProps = {
  /** Visible label above the select */
  label: string;
  /** Current selected value (empty string "" means “none selected”) */
  value: string;
  /** Options to render */
  options: Option[];
  /** Called with the new value whenever the user changes selection */
  onChange: (nextValue: string) => void;
  /** Show a dimmed placeholder at the top */
  placeholder?: string;
  /** Disable interaction (e.g., disable city until country picked) */
  disabled?: boolean;
  /** Optional id to pair <label htmlFor> and <select id> for accessibility */
  id?: string;
};

export default function Select({
  label,
  value,
  options,
  onChange,
  placeholder,
  disabled = false,
  id,
}: SelectProps) {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <select
        id={id}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
