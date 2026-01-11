import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";
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

export default function CalendarView({ onSelectDate, meetings = [] }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad with previous month's days
  const startDate = monthStart.getDay() === 0 ? subMonths(monthStart, 1) : monthStart;
  const paddedDays = eachDayOfInterval({
    start: new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - (monthStart.getDay() || 6) + 1),
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
    <div className="bg-white/40 backdrop-blur-md border border-border/30 rounded-3xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-foreground">
          {format(currentDate, "MMMM yyyy", { locale: ko })}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
            className="p-2 hover:bg-white/40 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
            className="p-2 hover:bg-white/40 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-3 mb-3">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-text-sub py-2">
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
                  ? "bg-brand-500 text-white border-brand-500 shadow-lg"
                  : isCurrentMonth
                  ? "bg-white/60 hover:bg-white/80 border-border/30 hover:border-brand-400"
                  : "bg-white/20 border-border/20 text-text-sub"
              }`}
            >
              <span className={`text-xs font-semibold mb-1 ${isSelected ? "text-white" : "text-foreground"}`}>
                {format(date, "d")}
              </span>
              <div className="text-xs space-y-1 w-full flex-1">
                {dateMeetings.slice(0, 2).map((meeting) => (
                  <div
                    key={meeting.id}
                    className={`text-xs font-medium px-1.5 py-1 rounded ${
                      isSelected
                        ? "bg-white/20"
                        : "bg-brand-500/20 text-brand-600"
                    }`}
                  >
                    <div className="truncate text-xs font-semibold">
                      {meeting.title}
                    </div>
                    <div className={`truncate text-xs font-normal ${
                      isSelected
                        ? "text-white/80"
                        : "text-brand-600/80"
                    }`}>
                      {meeting.time}
                    </div>
                  </div>
                ))}
                {dateMeetings.length > 2 && (
                  <div className={`text-xs px-1.5 ${isSelected ? "text-white/70" : "text-text-sub"}`}>
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
