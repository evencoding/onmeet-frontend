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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:from-white light:to-purple-50 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 dark:backdrop-blur-md light:backdrop-blur-sm">
        {/* Header */}
        <div className="sticky top-0 z-20 dark:bg-gradient-to-b dark:from-purple-900/40 dark:via-black/60 dark:to-black/40 light:bg-white light:border-b light:border-purple-300/50 px-8 py-6 dark:border-b dark:border-purple-500/20 flex items-center justify-between dark:backdrop-blur-md light:backdrop-blur-sm">
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900">회의 제목</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="회의 제목을 입력하세요"
              className="w-full px-4 py-3 border dark:border-purple-500/30 light:border-purple-300/50 rounded-xl dark:bg-purple-500/10 dark:focus:bg-purple-500/20 light:bg-purple-50 light:focus:bg-white focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/30 transition-all duration-200 dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-600/50"
            />
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 dark:text-purple-400 light:text-purple-600" />
                날짜
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border dark:border-purple-500/30 light:border-purple-300/50 rounded-xl dark:bg-purple-500/10 dark:focus:bg-purple-500/20 light:bg-purple-50 light:focus:bg-white focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/30 transition-all duration-200 dark:text-white light:text-purple-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900 flex items-center gap-2">
                <Clock className="w-4 h-4 dark:text-purple-400 light:text-purple-600" />
                시간
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border dark:border-purple-500/30 light:border-purple-300/50 rounded-xl dark:bg-purple-500/10 dark:focus:bg-purple-500/20 light:bg-purple-50 light:focus:bg-white focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/30 transition-all duration-200 dark:text-white light:text-purple-900"
              />
            </div>
          </div>

          {/* Description */}
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
              className="w-full px-4 py-3 border dark:border-purple-500/30 light:border-purple-300/50 rounded-xl dark:bg-purple-500/10 dark:focus:bg-purple-500/20 light:bg-purple-50 light:focus:bg-white focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/30 transition-all duration-200 dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-600/50 resize-none"
            />
          </div>

          {/* Invitees */}
          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900 flex items-center gap-2">
              <Users className="w-4 h-4 dark:text-purple-400 light:text-purple-600" />
              초대 대상 (이메일)
            </label>
            <input
              type="text"
              name="invitees"
              value={formData.invitees}
              onChange={handleInputChange}
              placeholder="이메일을 쉼표로 구분하여 입력하세요"
              className="w-full px-4 py-3 border dark:border-purple-500/30 light:border-purple-300/50 rounded-xl dark:bg-purple-500/10 dark:focus:bg-purple-500/20 light:bg-purple-50 light:focus:bg-white focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/30 transition-all duration-200 dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-600/50"
            />
          </div>

          {/* Divider */}
          <div className="border-t dark:border-purple-500/20 light:border-purple-300/30 pt-6" />

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border dark:border-purple-500/30 light:border-purple-300/50 dark:bg-purple-500/10 light:bg-purple-100/50 dark:text-white/90 light:text-purple-700 text-sm font-semibold rounded-xl dark:hover:bg-purple-500/20 light:hover:bg-purple-100 hover:border-purple-400 transition-all duration-300"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              회의 생성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
