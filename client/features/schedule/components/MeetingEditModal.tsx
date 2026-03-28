import { useState } from "react";
import { X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/shared/hooks/use-toast";
import { getErrorMessage } from "@/shared/utils/apiFetch";
import DatePickerCalendar from "@/shared/components/DatePickerCalendar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { useAuth } from "@/features/auth/context";
import { useUpdateRoom } from "@/features/meeting/hooks";
import { useUpdateSchedule } from "@/features/meeting/hooks";

interface MeetingEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: string;
  initialTitle: string;
  initialDescription: string;
  initialDate: Date;
  initialTime: string;
}

export default function MeetingEditModal({
  isOpen,
  onClose,
  meetingId,
  initialTitle,
  initialDescription,
  initialDate,
  initialTime,
}: MeetingEditModalProps) {
  const { user } = useAuth();
  const userId = user ? String(user.id) : "";

  const updateRoomMutation = useUpdateRoom();
  const updateScheduleMutation = useUpdateSchedule();

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [meetingDate, setMeetingDate] = useState(initialDate);
  const [meetingTime, setMeetingTime] = useState(initialTime);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({ title: "회의 제목을 입력해주세요", variant: "destructive" });
      return;
    }

    const scheduledAt = `${format(meetingDate, "yyyy-MM-dd")}T${meetingTime}:00`;
    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate <= new Date()) {
      toast({ title: "예약 시간은 현재 시간 이후여야 합니다", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      await updateRoomMutation.mutateAsync({
        roomId: Number(meetingId),
        userId,
        data: {
          title: title.trim(),
          description: description.trim() || undefined,
        },
      });

      const originalScheduledAt = `${format(initialDate, "yyyy-MM-dd")}T${initialTime}:00`;
      if (scheduledAt !== originalScheduledAt) {
        await updateScheduleMutation.mutateAsync({
          roomId: Number(meetingId),
          userId,
          scheduledAt,
        });
      }

      toast({ title: "회의가 수정되었습니다" });
      onClose();
    } catch (err) {
      const errorObj = err as { status?: number };
      if (errorObj.status === 409) {
        toast({ title: "해당 시간대에 이미 예약된 회의가 있습니다", description: "다른 시간을 선택해주세요", variant: "destructive" });
      } else {
        toast({ title: "회의 수정 실패", description: getErrorMessage(err, "회의 수정에 실패했습니다"), variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md om-modal-card">
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="dark:text-white/90 light:text-purple-900">
              회의 수정
            </AlertDialogTitle>
            <button
              onClick={onClose}
              className="p-1 dark:hover:bg-purple-500/20 light:hover:bg-purple-200/40 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 dark:text-white/70 light:text-purple-600" />
            </button>
          </div>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900">
              회의 제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg dark:bg-purple-500/10 light:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-600/50"
              disabled={isLoading}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900">
              설명
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg dark:bg-purple-500/10 light:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-600/50 resize-none"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900">
              날짜 <span className="text-red-500">*</span>
            </label>
            <DatePickerCalendar
              value={meetingDate}
              onChange={(date) => setMeetingDate(date)}
              placeholder="날짜를 선택하세요"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900">
              시간 <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              className="w-full px-4 py-2 border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg dark:bg-purple-500/10 light:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white light:text-purple-900"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700 rounded-lg font-semibold hover:dark:bg-purple-500/30 hover:light:bg-purple-200 transition-all"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
            >
              {isLoading ? "수정 중..." : "수정"}
            </button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
