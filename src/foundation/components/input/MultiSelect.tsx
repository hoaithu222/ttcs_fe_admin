import React, { useCallback, useMemo, useState } from "react";
import { Check, ChevronDown, Search, X, CheckSquare, Square } from "lucide-react";

export interface Option {
  value: string;
  label: React.ReactNode;
  shortLabel?: React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
}

export interface OptionGroup {
  label: string;
  options: Option[];
}

export interface MultiSelectProps {
  name: string;
  label?: string;
  description?: string;
  error?: string;
  options?: Option[];
  groups?: OptionGroup[];
  required?: boolean;
  disabled?: boolean;
  value?: string[];
  onChange?: (value: string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  className?: string;
  showAllOption?: boolean;
}

const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      name,
      label,
      description,
      error,
      options = [],
      groups,
      required,
      disabled,
      value = [],
      onChange,
      placeholder = "Chọn tùy chọn...",
      searchable = true,
      clearable = true,
      className = "",
      showAllOption = true,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const allOptions = useMemo(
      () => (groups ? groups.flatMap((g) => g.options) : options),
      [groups, options]
    );

    const filteredOptions = useMemo(() => {
      if (!searchTerm) return allOptions;
      return allOptions.filter((opt) =>
        String(opt.label).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }, [allOptions, searchTerm]);

    const selectedLabels = useMemo(
      () =>
        (value || [])
          .map((v) => {
            const found = allOptions.find((o) => o.value === v);
            return found?.shortLabel?.toString() || found?.label?.toString() || v;
          })
          .filter(Boolean),
      [value, allOptions]
    );

    const toggleValue = useCallback(
      (val: string) => {
        const next = value.includes(val) ? value.filter((x) => x !== val) : [...value, val];
        onChange?.(next);
      },
      [value, onChange]
    );

    const allValues = allOptions.map((o) => o.value);
    const allSelected = value.length > 0 && value.length === allValues.length;
    
    const selectAll = useCallback(() => {
      onChange?.(allValues);
    }, [allValues, onChange]);
    
    const clearAll = useCallback(() => {
      onChange?.([]);
      setSearchTerm("");
    }, [onChange]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    return (
      <div ref={ref} className={`relative w-full ${className}`}>
        {label && (
          <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        {/* Trigger Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => !disabled && setOpen(!open)}
          onKeyDown={handleKeyDown}
          className={`
            relative w-full px-4 py-3 text-left rounded-xl border-2 transition-all duration-200
            ${
              error
                ? "border-red-400 bg-red-50 dark:bg-red-950/20"
                : open
                ? "border-blue-500 bg-white dark:bg-gray-800 shadow-lg shadow-blue-500/20"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            focus:outline-none focus:ring-2 focus:ring-blue-500/20
          `}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              {selectedLabels.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {selectedLabels.map((label, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-sm"
                    >
                      {label}
                      {clearable && (
                        <X
                          className="w-3 h-3 hover:bg-white/20 rounded transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            const opt = allOptions.find(
                              (o) =>
                                (o.shortLabel?.toString() || o.label?.toString()) === label
                            );
                            if (opt) toggleValue(opt.value);
                          }}
                        />
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400 dark:text-gray-500">{placeholder}</span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {clearable && selectedLabels.length > 0 && (
                <X
                  className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAll();
                  }}
                />
              )}
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className="absolute z-50 w-full mt-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-2xl overflow-hidden"
            style={{ animation: "slideDown 0.2s ease-out" }}
          >
            {/* Search */}
            {searchable && (
              <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm kiếm..."
                    className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            )}

            {/* Options List */}
            <div className="max-h-64 overflow-y-auto p-2">
              {/* Select All Option */}
              {showAllOption && allOptions.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => (allSelected ? clearAll() : selectAll())}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30 transition-all group"
                  >
                    <div className="shrink-0">
                      {allSelected ? (
                        <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Tất cả
                    </span>
                  </button>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent my-2" />
                </>
              )}

              {/* Options */}
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => {
                  const isSelected = value.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => toggleValue(opt.value)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-950/30 dark:hover:to-indigo-950/30 transition-all group"
                    >
                      <div className="shrink-0">
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div
                          className={`text-sm font-medium transition-colors ${
                            isSelected
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                          }`}
                        >
                          {opt.label}
                        </div>
                        {opt.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {opt.description}
                          </div>
                        )}
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-3 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                  Không tìm thấy kết quả
                </div>
              )}
            </div>

            {/* Description Footer */}
            {description && (
              <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                {description}
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
            <span className="inline-block w-1 h-1 bg-red-600 rounded-full"></span>
            {error}
          </p>
        )}

        {/* Click Outside Handler */}
        {open && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
        )}

        <style>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

export default  React.memo(MultiSelect);