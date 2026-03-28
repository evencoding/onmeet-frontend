import { X, Clock, Settings } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/context";
import { useCreateRoom, useScheduleRoom } from "@/features/meeting/hooks";
import { toast } from "@/shared/hooks/use-toast";
import { getErrorMessage } from "@/shared/utils/apiFetch";
import DatePickerCalendar from "@/shared/components/DatePickerCalendar";

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateMeetingModal({ isOpen, onClose }: CreateMeetingModalProps) {
  const { user } = useAuth();
  const userId = user ? String(user.id) : "";
  const navigate = useNavigate();
  const createRoomMutation = useCreateRoom();
  const scheduleRoomMutation = useScheduleRoom();

  const [formData, setFormData] = useState({
    title: "",
    date: null as Date | null,
    time: "",
    description: "",
    invitees: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (formData.date && formData.time) {
      const scheduledAt = `${format(formData.date, "yyyy-MM-dd")}T${formData.time}:00`;
      scheduleRoomMutation.mutate(
        {
          userId,
          data: {
            title: formData.title,
            description: formData.description || undefined,
            scheduledAt,
          },
        },
        {
          onSuccess: () => {
            setFormData({ title: "", date: null, time: "", description: "", invitees: "" });
            onClose();
          },
          onError: (err) => {
            toast({ title: "회의 예약 실패", description: getErrorMessage(err, "회의 예약에 실패했습니다"), variant: "destructive" });
          },
        },
      );
    } else {
      createRoomMutation.mutate(
        {
          userId,
          data: {
            title: formData.title,
            description: formData.description || undefined,
            type: "INSTANT",
          },
        },
        {
          onSuccess: (room) => {
            setFormData({ title: "", date: null, time: "", description: "", invitees: "" });
            onClose();
            navigate(`/meeting/${room.id}`);
          },
          onError: (err) => {
            toast({ title: "회의 생성 실패", description: getErrorMessage(err, "회의 생성에 실패했습니다"), variant: "destructive" });
          },
        },
      );
    }
  };

  const isPending = createRoomMutation.isPending || scheduleRoomMutation.isPending;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="om-modal-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-20 dark:bg-purple-950/80 light:bg-white/90 px-8 py-6 border-b dark:border-purple-500/20 light:border-purple-200/50 flex items-center justify-between backdrop-blur-xl">
          <div>
            <h2 className="text-2xl font-bold dark:text-white/90 light:text-purple-900">새 회의 생성</h2>
            <p className="text-sm dark:text-white/50 light:text-purple-600 mt-1">회의 세부정보를 입력하세요</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 dark:hover:bg-purple-500/20 light:hover:bg-purple-200/40 rounded-full transition-colors dark:text-white/70 dark:hover:text-white/90 light:text-purple-600 light:hover:text-purple-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900">회의 제목</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="회의 제목을 입력하세요"
              required
              className="w-full px-4 py-3 dark:border dark:border-purple-500/30 light:border-2 light:border-purple-400/50 rounded-xl dark:bg-purple-500/10 dark:focus:bg-purple-500/20 light:bg-white light:focus:bg-purple-50 focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/40 light:shadow-md light:shadow-purple-200/20 transition-all duration-200 dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-700/60"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900">
                날짜 (선택)
              </label>
              <DatePickerCalendar
                value={formData.date}
                onChange={(date) => setFormData((prev) => ({ ...prev, date }))}
                placeholder="날짜를 선택하세요"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900 flex items-center gap-2">
                <Clock className="w-4 h-4 dark:text-purple-400 light:text-purple-600" />
                시간 (선택)
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-4 py-3 dark:border dark:border-purple-500/30 light:border-2 light:border-purple-400/50 rounded-xl dark:bg-purple-500/10 dark:focus:bg-purple-500/20 light:bg-white light:focus:bg-purple-50 focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/40 light:shadow-md light:shadow-purple-200/20 transition-all duration-200 dark:text-white light:text-purple-900"
              />
            </div>
          </div>

          {!formData.date && !formData.time && (
            <p className="text-xs dark:text-purple-400 light:text-purple-600">
              날짜와 시간을 비워두면 즉시 회의가 생성됩니다.
            </p>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900 flex items-center gap-2">
              <Settings className="w-4 h-4 dark:text-purple-400 light:text-purple-600" />
              설명
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="회의 설명을 입력하세요"
              rows={3}
              className="w-full px-4 py-3 dark:border dark:border-purple-500/30 light:border-2 light:border-purple-400/50 rounded-xl dark:bg-purple-500/10 dark:focus:bg-purple-500/20 light:bg-white light:focus:bg-purple-50 focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/40 light:shadow-md light:shadow-purple-200/20 transition-all duration-200 dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-700/60 resize-none"
            />
          </div>

          <div className="dark:border-t dark:border-purple-500/20 light:border-t-2 light:border-purple-300/50 pt-6" />

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 dark:border dark:border-purple-500/30 light:border-2 light:border-purple-400/50 dark:bg-purple-500/10 light:bg-white light:shadow-md light:shadow-purple-200/20 dark:text-white/90 light:text-purple-700 text-sm font-semibold rounded-xl dark:hover:bg-purple-500/20 light:hover:bg-purple-100/70 transition-all duration-300"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl light:shadow-purple-400/40 hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isPending
                ? "생성 중..."
                : formData.date && formData.time
                  ? "회의 예약"
                  : "즉시 회의 생성"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
