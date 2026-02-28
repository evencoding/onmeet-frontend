import { useState } from "react";
import { X, ChevronRight, Check } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Team {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department?: string;
}

interface MeetingBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
}

const teams: Team[] = [
  { id: "marketing", name: "Marketing", color: "bg-pink-500" },
  { id: "product", name: "Product", color: "bg-blue-500" },
  { id: "design", name: "Design", color: "bg-purple-500" },
  { id: "engineering", name: "Engineering", color: "bg-green-500" },
];

const mockEmployees: Employee[] = [
  {
    id: "1",
    name: "김철수",
    email: "kim@example.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
    department: "마케팅",
  },
  {
    id: "2",
    name: "이영희",
    email: "lee@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
    department: "제품",
  },
  {
    id: "3",
    name: "박민준",
    email: "park@example.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
    department: "마케팅",
  },
  {
    id: "4",
    name: "정준호",
    email: "jung@example.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
    department: "엔지니어링",
  },
  {
    id: "5",
    name: "최수진",
    email: "choi@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
    department: "제품",
  },
];

type BookingStep = "team" | "date" | "participants";

export default function MeetingBookingModal({
  isOpen,
  onClose,
  selectedDate,
}: MeetingBookingModalProps) {
  const [step, setStep] = useState<BookingStep>("team");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [meetingDate, setMeetingDate] = useState(selectedDate || new Date());
  const [meetingTime, setMeetingTime] = useState("10:00");
  const [selectedParticipants, setSelectedParticipants] = useState<Employee[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredEmployees = mockEmployees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectTeam = (team: Team) => {
    setSelectedTeam(team);
    setStep("date");
  };

  const handleParticipantToggle = (employee: Employee) => {
    const isSelected = selectedParticipants.some((p) => p.id === employee.id);
    if (isSelected) {
      setSelectedParticipants(selectedParticipants.filter((p) => p.id !== employee.id));
    } else {
      setSelectedParticipants([...selectedParticipants, employee]);
    }
  };

  const handleRemoveParticipant = (id: string) => {
    setSelectedParticipants(selectedParticipants.filter((p) => p.id !== id));
  };

  const handleBookMeeting = async () => {
    if (!selectedTeam || !meetingTitle.trim()) {
      alert("팀과 회의 제목을 입력해주세요");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Meeting booked:", {
        title: meetingTitle,
        team: selectedTeam.name,
        date: meetingDate,
        time: meetingTime,
        participants: selectedParticipants.map((p) => p.name),
      });
      // Reset and close
      setMeetingTitle("");
      setSelectedTeam(null);
      setSelectedParticipants([]);
      setSearchQuery("");
      setStep("team");
      onClose();
    } catch (error) {
      console.error("Failed to book meeting:", error);
      alert("회의 예약에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMeetingTitle("");
    setSelectedTeam(null);
    setSelectedParticipants([]);
    setSearchQuery("");
    setStep("team");
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-lg max-h-[90vh] overflow-y-auto dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 dark:backdrop-blur-md light:backdrop-blur-sm">
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="dark:text-white/90 light:text-purple-900">
              회의 예약
            </AlertDialogTitle>
            <button
              onClick={handleClose}
              className="p-1 dark:hover:bg-purple-500/20 light:hover:bg-purple-200/40 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 dark:text-white/70 light:text-purple-600" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4">
            <div
              className={`flex-1 h-2 rounded-full transition-colors ${
                step === "team" || step === "date" || step === "participants"
                  ? "dark:bg-purple-600 light:bg-purple-600"
                  : "dark:bg-purple-500/30 light:bg-purple-200"
              }`}
            />
            <div
              className={`flex-1 h-2 rounded-full transition-colors ${
                step === "date" || step === "participants"
                  ? "dark:bg-purple-600 light:bg-purple-600"
                  : "dark:bg-purple-500/30 light:bg-purple-200"
              }`}
            />
            <div
              className={`flex-1 h-2 rounded-full transition-colors ${
                step === "participants"
                  ? "dark:bg-purple-600 light:bg-purple-600"
                  : "dark:bg-purple-500/30 light:bg-purple-200"
              }`}
            />
          </div>
        </AlertDialogHeader>

        <div className="space-y-6">
          {/* Step 1: Team Selection */}
          {step === "team" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-3 block">
                  팀 선택 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {teams.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => handleSelectTeam(team)}
                      className={`p-4 rounded-xl border-2 transition-all text-left font-semibold ${
                        selectedTeam?.id === team.id
                          ? "dark:border-purple-600 dark:bg-purple-600/20 light:border-purple-600 light:bg-purple-100"
                          : "dark:border-purple-500/30 dark:bg-purple-500/10 light:border-purple-300/50 light:bg-purple-50"
                      } hover:dark:border-purple-500 hover:light:border-purple-500 transition-colors`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="dark:text-white light:text-purple-900">
                          {team.name}
                        </span>
                        <div className={`w-3 h-3 rounded-full ${team.color}`} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2 block">
                  회의 제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="예: 팀 스탠드업"
                  className="w-full px-4 py-2 border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg dark:bg-purple-500/10 light:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-600/50"
                />
              </div>

              <button
                onClick={() => setStep("date")}
                disabled={!selectedTeam || !meetingTitle.trim()}
                className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {step === "date" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2 block">
                  날짜 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={format(meetingDate, "yyyy-MM-dd")}
                  onChange={(e) => setMeetingDate(new Date(e.target.value))}
                  className="w-full px-4 py-2 border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg dark:bg-purple-500/10 light:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white light:text-purple-900"
                />
              </div>

              <div>
                <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2 block">
                  시간 <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full px-4 py-2 border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg dark:bg-purple-500/10 light:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white light:text-purple-900"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep("team")}
                  className="flex-1 px-6 py-3 dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700 rounded-lg font-semibold hover:dark:bg-purple-500/30 hover:light:bg-purple-200 transition-all"
                >
                  이전
                </button>
                <button
                  onClick={() => setStep("participants")}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  다음 <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Participants Selection */}
          {step === "participants" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2 block">
                  회의 요약
                </label>
                <div className="p-3 dark:bg-purple-500/10 light:bg-purple-50 rounded-lg border dark:border-purple-500/20 light:border-purple-300/50">
                  <p className="text-sm dark:text-white/90 light:text-purple-900">
                    <span className="font-semibold">{meetingTitle}</span> • {selectedTeam?.name}
                  </p>
                  <p className="text-xs dark:text-white/60 light:text-purple-700 mt-1">
                    {format(meetingDate, "M월 d일 (EEEE)", { locale: ko })} · {meetingTime}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2 block">
                  참여자 검색
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="이름, 이메일, 부서로 검색"
                  className="w-full px-4 py-2 border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg dark:bg-purple-500/10 light:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-600/50"
                />
              </div>

              {/* Selected Participants */}
              {selectedParticipants.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold dark:text-white/60 light:text-purple-700">
                    선택된 참여자 ({selectedParticipants.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedParticipants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 dark:bg-purple-600/40 light:bg-purple-200/60 rounded-full border dark:border-purple-500/50 light:border-purple-300/50 text-xs"
                      >
                        <Avatar className="w-4 h-4">
                          <AvatarImage
                            src={participant.avatar}
                            alt={participant.name}
                          />
                          <AvatarFallback>
                            {participant.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="dark:text-white/90 light:text-purple-900 font-medium">
                          {participant.name}
                        </span>
                        <button
                          onClick={() => handleRemoveParticipant(participant.id)}
                          className="p-0 dark:text-white/60 dark:hover:text-red-400 light:text-purple-600 light:hover:text-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Employee List */}
              <div className="border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg overflow-hidden max-h-48 overflow-y-auto dark:bg-black/40 light:bg-purple-50/30">
                {filteredEmployees.length === 0 ? (
                  <div className="p-4 text-center text-sm dark:text-white/60 light:text-purple-600">
                    검색 결과가 없습니다
                  </div>
                ) : (
                  filteredEmployees.map((employee) => {
                    const isSelected = selectedParticipants.some(
                      (p) => p.id === employee.id
                    );
                    return (
                      <button
                        key={employee.id}
                        onClick={() => handleParticipantToggle(employee)}
                        className={`w-full flex items-center gap-3 p-3 dark:border-b dark:border-purple-500/20 light:border-b light:border-purple-300/30 transition-colors text-left ${
                          isSelected
                            ? "dark:bg-purple-600/30 light:bg-purple-100/50"
                            : "dark:hover:bg-purple-500/10 light:hover:bg-purple-100/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="cursor-pointer"
                        />
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={employee.avatar}
                            alt={employee.name}
                          />
                          <AvatarFallback>
                            {employee.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium dark:text-white/90 light:text-purple-900">
                            {employee.name}
                          </p>
                          <p className="text-xs dark:text-white/50 light:text-purple-600">
                            {employee.department} · {employee.email}
                          </p>
                        </div>
                        {isSelected && (
                          <Check className="w-5 h-5 dark:text-purple-400 light:text-purple-600" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep("date")}
                  className="flex-1 px-6 py-3 dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700 rounded-lg font-semibold hover:dark:bg-purple-500/30 hover:light:bg-purple-200 transition-all"
                >
                  이전
                </button>
                <button
                  onClick={handleBookMeeting}
                  disabled={isLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "예약 중..." : "회의 예약"}
                </button>
              </div>
            </div>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
