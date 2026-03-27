import { useState } from "react";
import { X, ChevronRight, Check } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { toast } from "@/shared/hooks/use-toast";
import { getErrorMessage } from "@/shared/utils/apiFetch";
import DatePickerCalendar from "@/shared/components/DatePickerCalendar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { useAuth } from "@/features/auth/context";
import { useAllEmployees } from "@/features/auth/hooks";
import { useScheduleRoom, useBulkInviteToRoom } from "@/features/meeting/hooks";
import type { UserResponseDto } from "@/features/auth/api";

interface MeetingBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
}

type BookingStep = "team" | "date" | "participants";

export default function MeetingBookingModal({
  isOpen,
  onClose,
  selectedDate,
}: MeetingBookingModalProps) {
  const { user } = useAuth();
  const userId = user ? String(user.id) : "";
  const teams = user?.teams ?? [];

  const { data: employeesData } = useAllEmployees({ size: 100 });
  const employees: UserResponseDto[] = employeesData?.content ?? [];

  const scheduleRoomMutation = useScheduleRoom();
  const bulkInviteMutation = useBulkInviteToRoom();

  const [step, setStep] = useState<BookingStep>("team");
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [meetingDate, setMeetingDate] = useState(selectedDate || new Date());
  const [meetingTime, setMeetingTime] = useState("10:00");
  const [selectedParticipants, setSelectedParticipants] = useState<UserResponseDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [meetingTitle, setMeetingTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const selectedTeam = teams.find((t) => t.id === selectedTeamId);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectTeam = (teamId: number) => {
    setSelectedTeamId(teamId);
    setStep("date");
  };

  const handleParticipantToggle = (employee: UserResponseDto) => {
    const isSelected = selectedParticipants.some((p) => p.id === employee.id);
    if (isSelected) {
      setSelectedParticipants(selectedParticipants.filter((p) => p.id !== employee.id));
    } else {
      setSelectedParticipants([...selectedParticipants, employee]);
    }
  };

  const handleRemoveParticipant = (id: number) => {
    setSelectedParticipants(selectedParticipants.filter((p) => p.id !== id));
  };

  const handleBookMeeting = async () => {
    if (!selectedTeamId) {
      toast({ title: "팀을 선택해주세요", variant: "destructive" });
      setStep("team");
      return;
    }
    if (!meetingTitle.trim()) {
      toast({ title: "회의 제목을 입력해주세요", variant: "destructive" });
      setStep("team");
      return;
    }

    const scheduledAt = `${format(meetingDate, "yyyy-MM-dd")}T${meetingTime}:00`;
    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate <= new Date()) {
      toast({ title: "예약 시간은 현재 시간 이후여야 합니다", variant: "destructive" });
      setStep("date");
      return;
    }

    setIsLoading(true);
    let room;
    try {
      room = await scheduleRoomMutation.mutateAsync({
        userId,
        data: {
          title: meetingTitle,
          scheduledAt,
          teamId: selectedTeamId,
        },
      });
    } catch (err) {
      const errorObj = err as { status?: number };
      if (errorObj.status === 409) {
        toast({ title: "해당 시간대에 이미 예약된 회의가 있습니다", description: "다른 시간을 선택해주세요", variant: "destructive" });
        setStep("date");
      } else {
        toast({ title: "회의 예약 실패", description: getErrorMessage(err, "회의 예약에 실패했습니다"), variant: "destructive" });
      }
      setIsLoading(false);
      return;
    }

    if (selectedParticipants.length > 0) {
      try {
        await bulkInviteMutation.mutateAsync({
          roomId: room.id,
          userId,
          data: {
            inviteeUserIds: selectedParticipants.map((p) => p.id),
          },
        });
        toast({ title: `${selectedParticipants.length}명에게 초대를 보냈습니다` });
      } catch (err) {
        console.error("Bulk invite failed:", err);
        toast({ title: "회의는 생성되었지만 참여자 초대에 실패했습니다", description: getErrorMessage(err, "일정에서 다시 초대해주세요"), variant: "destructive" });
      }
    }

    setIsLoading(false);
    setMeetingTitle("");
    setSelectedTeamId(null);
    setSelectedParticipants([]);
    setSearchQuery("");
    setStep("team");
    onClose();
  };

  const handleClose = () => {
    setMeetingTitle("");
    setSelectedTeamId(null);
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
          {step === "team" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-3 block">
                  팀 선택 <span className="text-red-500">*</span>
                </label>
                {teams.length === 0 ? (
                  <p className="text-sm dark:text-white/60 light:text-purple-700 py-4 text-center">
                    소속된 팀이 없습니다
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {teams.map((team) => (
                      <button
                        key={team.id}
                        onClick={() => handleSelectTeam(team.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left font-semibold ${
                          selectedTeamId === team.id
                            ? "dark:border-purple-600 dark:bg-purple-600/20 light:border-purple-600 light:bg-purple-100"
                            : "dark:border-purple-500/30 dark:bg-purple-500/10 light:border-purple-300/50 light:bg-purple-50"
                        } hover:dark:border-purple-500 hover:light:border-purple-500 transition-colors`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="dark:text-white light:text-purple-900">
                            {team.name}
                          </span>
                          {team.color && (
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: team.color }}
                            />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
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

              {(meetingTitle || selectedTeam) && (
                <div className="p-4 dark:bg-gradient-to-br dark:from-purple-500/10 dark:to-pink-500/10 light:bg-gradient-to-br light:from-purple-100 light:to-pink-100 rounded-lg border dark:border-purple-500/30 light:border-purple-300/50">
                  <p className="text-xs font-semibold dark:text-white/60 light:text-purple-700 mb-2">
                    예시
                  </p>
                  <p className="text-sm dark:text-white/90 light:text-purple-900 font-medium">
                    {meetingTitle || "회의 제목을 입력해주세요"}
                  </p>
                  {selectedTeam && (
                    <p className="text-xs dark:text-white/60 light:text-purple-600 mt-1">
                      팀 · {selectedTeam.name}
                    </p>
                  )}
                </div>
              )}

              <button
                onClick={() => setStep("date")}
                disabled={!selectedTeamId || !meetingTitle.trim()}
                className="w-full mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === "date" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2 block">
                  날짜 <span className="text-red-500">*</span>
                </label>
                <DatePickerCalendar
                  value={meetingDate}
                  onChange={(date) => setMeetingDate(date)}
                  placeholder="날짜를 선택하세요"
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

          {step === "participants" && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2 block">
                  회의 요약
                </label>
                <div className="p-3 dark:bg-purple-500/10 light:bg-purple-50 rounded-lg border dark:border-purple-500/20 light:border-purple-300/50">
                  <p className="text-sm dark:text-white/90 light:text-purple-900">
                    <span className="font-semibold">{meetingTitle}</span> · {selectedTeam?.name}
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
                  placeholder="이름, 이메일로 검색"
                  className="w-full px-4 py-2 border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg dark:bg-purple-500/10 light:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-600/50"
                />
              </div>

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

              <div className="border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg overflow-hidden max-h-48 overflow-y-auto dark:bg-black/40 light:bg-purple-50/30">
                {filteredEmployees.length === 0 ? (
                  <div className="p-4 text-center text-sm dark:text-white/60 light:text-purple-600">
                    검색 결과가 없습니다
                  </div>
                ) : (
                  filteredEmployees.map((employee) => {
                    const isSelected = selectedParticipants.some(
                      (p) => p.id === employee.id,
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
                          <AvatarFallback>
                            {employee.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium dark:text-white/90 light:text-purple-900">
                            {employee.name}
                          </p>
                          <p className="text-xs dark:text-white/50 light:text-purple-600">
                            {employee.jobTitle?.name ?? ""} · {employee.email}
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
