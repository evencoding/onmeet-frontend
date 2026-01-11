import { X, Calendar, Clock, Users, Settings } from "lucide-react";
import { useState } from "react";

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateMeetingModal({ isOpen, onClose }: CreateMeetingModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
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
    console.log("Meeting created:", formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white via-white/95 to-surface-subtle rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border/30">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-b from-white via-white to-white/80 px-8 py-6 border-b border-border/20 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">새 회의 생성</h2>
            <p className="text-sm text-text-sub mt-1">회의 세부정보를 입력하세요</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors text-foreground hover:text-foreground/70"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">회의 제목</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="회의 제목을 입력하세요"
              className="w-full px-4 py-3 border border-border/50 rounded-xl bg-white/60 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 text-foreground placeholder-text-sub"
            />
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-500" />
                날짜
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-border/50 rounded-xl bg-white/60 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-500" />
                시간
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-border/50 rounded-xl bg-white/60 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 text-foreground"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Settings className="w-4 h-4 text-brand-500" />
              설명
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="회의 설명을 입력하세요"
              rows={3}
              className="w-full px-4 py-3 border border-border/50 rounded-xl bg-white/60 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 text-foreground placeholder-text-sub resize-none"
            />
          </div>

          {/* Invitees */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-500" />
              초대 대상 (이메일)
            </label>
            <input
              type="text"
              name="invitees"
              value={formData.invitees}
              onChange={handleInputChange}
              placeholder="이메일을 쉼표로 구분하여 입력하세요"
              className="w-full px-4 py-3 border border-border/50 rounded-xl bg-white/60 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 text-foreground placeholder-text-sub"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border/20 pt-6" />

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-border/60 bg-white/70 text-foreground text-sm font-semibold rounded-xl hover:bg-white hover:border-border hover:shadow-md transition-all duration-300"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-sm font-semibold rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              회의 생성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
