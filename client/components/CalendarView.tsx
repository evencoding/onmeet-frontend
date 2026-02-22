import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { ko } from "date-fns/locale";

interface Meeting {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: string;
  participants: number;
}

interface CalendarViewProps {
  onSelectDate?: (date: Date) => void;
  meetings?: Meeting[];
}

export default function CalendarView({
  onSelectDate,
  meetings = [],
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad with previous month's days
  const startDate =
    monthStart.getDay() === 0 ? subMonths(monthStart, 1) : monthStart;
  const paddedDays = eachDayOfInterval({
    start: new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() - (monthStart.getDay() || 6) + 1,
    ),
    end: monthEnd,
  });

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    onSelectDate?.(date);
  };

  const getMeetingsForDate = (date: Date) => {
    return meetings.filter((m) => isSameDay(m.date, date));
  };

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className="dark:bg-purple-500/10 light:bg-white dark:border dark:border-purple-500/20 light:border-2 light:border-purple-300 rounded-2xl p-6 light:shadow-lg light:shadow-purple-200/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold dark:text-white/90 light:text-purple-950">
          {format(currentDate, "MMMM yyyy", { locale: ko })}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 dark:text-white/70 light:text-purple-700" />
          </button>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 dark:text-white/70 light:text-purple-700" />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-3 mb-3">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-semibold dark:text-white/60 light:text-purple-700 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-3">
        {paddedDays.map((date, idx) => {
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const dateMeetings = getMeetingsForDate(date);

          return (
            <button
              key={idx}
              onClick={() => handleSelectDate(date)}
              className={`p-4 rounded-lg border transition-all duration-200 min-h-28 flex flex-col items-start justify-start text-left ${
                isSelected
                  ? "dark:bg-purple-600 light:bg-purple-600 text-white dark:border-purple-600 light:border-purple-600 shadow-lg dark:shadow-purple-500/30 light:shadow-purple-400/30"
                  : isCurrentMonth
                    ? "dark:bg-purple-500/20 dark:hover:bg-purple-500/30 dark:border-purple-500/20 light:bg-white light:hover:bg-purple-50 light:border-2 light:border-purple-300 light:hover:border-purple-400"
                    : "dark:bg-purple-500/10 dark:border-purple-500/10 light:bg-purple-50/50 light:border-2 light:border-purple-200/50 dark:text-white/50 light:text-purple-600/50"
              }`}
            >
              <span
                className={`text-xs font-semibold mb-1 ${
                  isSelected
                    ? "text-white"
                    : "dark:text-white/90 light:text-purple-950"
                }`}
              >
                {format(date, "d")}
              </span>
              <div className="text-xs space-y-1 w-full flex-1">
                {dateMeetings.slice(0, 2).map((meeting) => (
                  <div
                    key={meeting.id}
                    className={`text-xs font-medium px-1.5 py-1 rounded ${
                      isSelected
                        ? "dark:bg-white/20 light:bg-white/30"
                        : "dark:bg-purple-600/30 dark:text-purple-300 light:bg-purple-100/80 light:text-purple-700"
                    }`}
                  >
                    <div className="truncate text-xs font-semibold">
                      {meeting.title}
                    </div>
                    <div
                      className={`truncate text-xs font-normal ${
                        isSelected
                          ? "dark:text-white/80 light:text-white/90"
                          : "dark:text-purple-300/80 light:text-purple-700/80"
                      }`}
                    >
                      {meeting.time}
                    </div>
                  </div>
                ))}
                {dateMeetings.length > 2 && (
                  <div
                    className={`text-xs px-1.5 ${
                      isSelected
                        ? "dark:text-white/70 light:text-white/70"
                        : "dark:text-white/50 light:text-purple-600/70"
                    }`}
                  >
                    +{dateMeetings.length - 2}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
