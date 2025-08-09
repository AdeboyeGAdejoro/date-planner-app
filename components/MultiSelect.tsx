import React, { JSX } from "react";

export type MultiSelectProps = {
  /** Label shown above the options, e.g. "Select Date Type" */
  label: string;
  /** The list of options to render as selectable chips */
  options: string[];
  /** The currently selected values (controlled by the parent) */
  value: string[];
  /** Called whenever the selection changes; parent updates `value` */
  onChange: (nextSelected: string[]) => void;
};

export default function MultiSelect({
  label,
  options,
  value,
  onChange,
}: MultiSelectProps): JSX.Element {
  const toggle = (opt: string): void => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active: boolean = value.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={[
                "px-3 py-2 rounded-full text-sm border transition",
                active
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50",
              ].join(" ")}
              aria-pressed={active}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
