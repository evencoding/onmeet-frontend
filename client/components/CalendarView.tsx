import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  getDay,
  addDays,
  subDays,
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
  onAddMeeting?: (date: Date) => void;
}

export default function CalendarView({
  onSelectDate,
  meetings = [],
  onAddMeeting,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  // Calculate the starting day for the calendar grid (previous month's last days)
  const startDay = getDay(monthStart); // 0 = Sunday, 6 = Saturday
  const calendarStart = subDays(monthStart, startDay);

  // Calculate the ending day for the calendar grid (next month's first days)
  const endDay = getDay(monthEnd); // 0 = Sunday, 6 = Saturday
  const calendarEnd = addDays(monthEnd, 6 - endDay);

  // Get all days to display in calendar
  const paddedDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
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
    <div className="dark:bg-purple-500/10 light:bg-gradient-to-br light:from-white light:via-purple-50/40 light:to-pink-100/20 dark:border dark:border-purple-500/20 light:border-2 light:border-purple-300/70 rounded-2xl p-6 light:shadow-lg light:shadow-purple-200/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 dark:border-b dark:border-purple-500/20 light:border-b-2 light:border-purple-300/50">
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
          const isHovered = hoveredDate && isSameDay(date, hoveredDate);
          const dateMeetings = getMeetingsForDate(date);

          return (
            <div
              key={idx}
              className="relative"
              onMouseEnter={() => setHoveredDate(date)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              <button
                onClick={() => handleSelectDate(date)}
                className={`w-full p-4 rounded-lg border transition-all duration-200 min-h-28 flex flex-col items-start justify-start text-left ${
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
                <div className="w-full flex-1 flex flex-col gap-1.5">
                  {/* Meeting dots/badges stack */}
                  {dateMeetings.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {dateMeetings.slice(0, 3).map((meeting, idx) => (
                        <div
                          key={meeting.id}
                          className={`w-1.5 h-1.5 rounded-full ${
                            isSelected
                              ? "dark:bg-white light:bg-white"
                              : "dark:bg-purple-400 light:bg-purple-600"
                          }`}
                          title={meeting.title}
                        />
                      ))}
                      {dateMeetings.length > 3 && (
                        <span
                          className={`text-xs font-semibold ${
                            isSelected
                              ? "dark:text-white light:text-white"
                              : "dark:text-purple-300 light:text-purple-700"
                          }`}
                          title={`${dateMeetings.length - 3}개 더보기`}
                        >
                          +{dateMeetings.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* First meeting title (abbreviated) */}
                  {dateMeetings.length > 0 && (
                    <div
                      className={`text-xs font-medium line-clamp-1 ${
                        isSelected
                          ? "dark:text-white light:text-white"
                          : "dark:text-white/80 light:text-purple-800"
                      }`}
                      title={dateMeetings[0].title}
                    >
                      {dateMeetings[0].title}
                    </div>
                  )}
                </div>
              </button>

              {/* Add Meeting Button on Hover */}
              {isHovered && isCurrentMonth && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddMeeting?.(date);
                  }}
                  className="absolute -top-2 -right-2 p-2 dark:bg-purple-600 light:bg-purple-600 text-white rounded-full shadow-lg hover:dark:bg-purple-700 hover:light:bg-purple-700 transition-all transform hover:scale-110 z-10"
                  title="이 날에 회의 추가"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
