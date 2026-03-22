import { useState, useRef, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  getDay,
  addDays,
  subDays,
  addMonths,
  subMonths,
  isSameMonth,
} from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface DatePickerCalendarProps {
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  className?: string;
}

export default function DatePickerCalendar({
  value,
  onChange,
  placeholder = "날짜를 선택하세요",
  className,
}: DatePickerCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ?? new Date());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (value) setCurrentMonth(startOfMonth(value));
  }, [value]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDay = getDay(monthStart);
  const calendarStart = subDays(monthStart, startDay);
  const endDay = getDay(monthEnd);
  const calendarEnd = addDays(monthEnd, 6 - endDay);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const handleSelect = (date: Date) => {
    onChange(date);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 dark:border dark:border-purple-500/30 light:border-2 light:border-purple-400/50 rounded-xl dark:bg-purple-500/10 light:bg-white dark:text-white light:text-purple-900 flex items-center gap-2 text-left text-sm transition-all duration-200 dark:hover:bg-purple-500/20 light:hover:bg-purple-50 focus:outline-none focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/40 focus:border-purple-400"
      >
        <Calendar className="w-4 h-4 dark:text-purple-400 light:text-purple-600 flex-shrink-0" />
        <span className={value ? "" : "dark:text-white/40 light:text-purple-700/60"}>
          {value ? format(value, "yyyy년 M월 d일 (EEE)", { locale: ko }) : placeholder}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full dark:bg-purple-900/95 light:bg-white dark:border dark:border-purple-500/30 light:border-2 light:border-purple-300/70 rounded-xl p-4 z-50 shadow-xl dark:shadow-purple-500/20 light:shadow-purple-300/40 backdrop-blur-md">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1.5 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4 dark:text-white/70 light:text-purple-700" />
            </button>
            <span className="text-sm font-semibold dark:text-white/90 light:text-purple-900">
              {format(currentMonth, "yyyy년 M월", { locale: ko })}
            </span>
            <button
              type="button"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1.5 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4 dark:text-white/70 light:text-purple-700" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium dark:text-white/50 light:text-purple-600 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {days.map((date, idx) => {
              const isCurrentMonth = isSameMonth(date, currentMonth);
              const isSelected = value && isSameDay(date, value);
              const isTodayDate = isToday(date);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(date)}
                  className={`p-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isSelected
                      ? "dark:bg-purple-600 light:bg-purple-600 text-white shadow-md"
                      : isTodayDate
                        ? "dark:bg-purple-500/30 light:bg-purple-100 dark:text-purple-300 light:text-purple-700 font-bold ring-1 dark:ring-purple-400 light:ring-purple-500"
                        : isCurrentMonth
                          ? "dark:text-white/80 light:text-purple-900 dark:hover:bg-purple-500/20 light:hover:bg-purple-100"
                          : "dark:text-white/30 light:text-purple-400 dark:hover:bg-purple-500/10 light:hover:bg-purple-50"
                  }`}
                >
                  {format(date, "d")}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
