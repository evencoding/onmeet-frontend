import { X, Calendar, FileText, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface Meeting {
  id: string;
  title: string;
  date: Date;
  time: string;
  duration: string;
  location: string;
  participants: number;
  description: string;
  summary?: string;
  key_points?: string[];
  attendees: {
    name: string;
    avatar: string;
  }[];
}

interface MeetingDetailPanelProps {
  meeting: Meeting | null;
  onClose: () => void;
}

export default function MeetingDetailPanel({ meeting, onClose }: MeetingDetailPanelProps) {
  if (!meeting) return null;

  const authorName = meeting.attendees[0]?.name || "Unknown";
  const authorAvatar = meeting.attendees[0]?.avatar || "";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/20 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in Panel */}
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-2xl overflow-y-auto transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border/20 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground flex-1">회의 상세</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-subtle rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text-sub" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Title */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">{meeting.title}</h3>
          </div>

          {/* Main Info Grid */}
          <div className="space-y-5">
            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={authorAvatar} alt={authorName} />
                  <AvatarFallback>{authorName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground">작성자</span>
              </div>
              <span className="text-sm font-medium text-foreground">{authorName}</span>
            </div>

            {/* Meeting Date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-500" />
                <span className="text-sm font-medium text-foreground">회의 날짜</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {format(meeting.date, "yyyy/MM/dd", { locale: ko })}
              </span>
            </div>

            {/* Meeting Description */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand-500" />
                <span className="text-sm font-medium text-foreground">회의 내용</span>
              </div>
              <span className="text-sm font-medium text-foreground">{meeting.description}</span>
            </div>

            {/* Issues Badge */}
            {meeting.key_points && meeting.key_points.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-brand-500" />
                  <span className="text-sm font-medium text-foreground">추가된 이슈</span>
                </div>
                <span className="px-3 py-1 bg-pink-100 text-pink-600 text-xs font-semibold rounded-full">
                  이슈 {meeting.key_points.length}
                </span>
              </div>
            )}
          </div>

          {/* Meeting Minutes Section */}
          <div className="pt-4 border-t border-border/20">
            <h4 className="text-lg font-bold text-foreground mb-4">회의록</h4>
            <div className="space-y-3">
              {meeting.key_points && meeting.key_points.length > 0 ? (
                <ul className="space-y-2">
                  {meeting.key_points.map((point, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-text-sub leading-relaxed">
                      <span className="text-brand-500 flex-shrink-0 mt-0.5">-</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-text-sub">
                  {meeting.summary || "회의록 내용이 없습니다"}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-6 border-t border-border/20">
            <Button className="w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-full">
              회의록 수정하기
            </Button>
            <Button
              variant="outline"
              className="w-full border-brand-500 text-brand-500 hover:bg-brand-50 font-semibold rounded-full"
            >
              회의록 원본보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
