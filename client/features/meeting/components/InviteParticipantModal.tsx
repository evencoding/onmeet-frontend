import { useState, useMemo } from "react";
import { X, Check, Search, Copy, Link2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useToast } from "@/shared/hooks/use-toast";
import { useAllEmployees } from "@/features/auth/hooks";

interface TeamMember {
  id: string;
  name: string;
  email: string;
}

interface InviteParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (members: TeamMember[]) => void;
  teamMembers?: TeamMember[];
  alreadyInvited?: string[];
  meetingId?: string;
}

const AVATAR_COLORS = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-red-500",
  "from-violet-500 to-indigo-500",
];

function getAvatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function InitialAvatar({ name, id, size = "w-10 h-10 text-sm" }: { name: string; id: string; size?: string }) {
  return (
    <div className={`${size} rounded-full bg-gradient-to-br ${getAvatarColor(id)} flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
}

const generateGuestLink = (meetingId?: string): string => {
  const id = meetingId || Math.random().toString(36).substring(2, 11);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  return `${baseUrl}/meeting/${id}`;
};

export default function InviteParticipantModal({
  isOpen,
  onClose,
  onInvite,
  teamMembers: propMembers,
  alreadyInvited = [],
  meetingId,
}: InviteParticipantModalProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"team" | "guest">("team");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const { data: employeesData } = useAllEmployees({ page: 0, size: 100 });

  const teamMembers = useMemo(() => {
    if (propMembers) return propMembers;
    if (!employeesData?.content) return [];
    return employeesData.content.map((emp) => ({
      id: String(emp.id),
      name: emp.name,
      email: emp.email,
    }));
  }, [propMembers, employeesData]);

  const guestLink = generateGuestLink(meetingId);

  const filteredMembers = teamMembers.filter(
    (member) =>
      !alreadyInvited.includes(member.id) &&
      (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const handleSelectMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  const handleInvite = () => {
    const membersToInvite = teamMembers.filter((member) =>
      selectedMembers.includes(member.id),
    );
    onInvite(membersToInvite);
    setSelectedMembers([]);
    setSearchTerm("");
    onClose();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(guestLink);
      setCopied(true);
      toast({
        title: "복사되었습니다",
        description: "게스트 링크가 클립보드에 복사되었습니다",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "복사 실패",
        description: "링크 복사에 실패했습니다",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-purple-900/40 via-black/80 to-pink-900/30 rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[600px] flex flex-col overflow-hidden border border-purple-500/30 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500/20 bg-gradient-to-b from-purple-900/40 to-black/60">
          <h2 className="text-lg font-bold text-white/90">팀원 초대</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-purple-500/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        <div className="flex border-b border-purple-500/20 px-6 bg-black/40">
          <button
            onClick={() => setActiveTab("team")}
            className={cn(
              "flex-1 py-3 text-sm font-semibold transition-all relative",
              activeTab === "team"
                ? "text-purple-300"
                : "text-white/50 hover:text-white/70",
            )}
          >
            팀원 초대
            {activeTab === "team" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("guest")}
            className={cn(
              "flex-1 py-3 text-sm font-semibold transition-all relative",
              activeTab === "guest"
                ? "text-purple-300"
                : "text-white/50 hover:text-white/70",
            )}
          >
            게스트 초대
            {activeTab === "guest" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
            )}
          </button>
        </div>

        {activeTab === "team" && (
          <>
            <div className="px-6 py-3 border-b border-purple-500/20 bg-black/40">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="이름 또는 이메일로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-purple-500/30 rounded-lg bg-purple-500/10 focus:bg-purple-500/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm text-white placeholder-white/40"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2 bg-black/40">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => handleSelectMember(member.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                      selectedMembers.includes(member.id)
                        ? "bg-purple-600/30 border border-purple-500/50"
                        : "hover:bg-purple-500/10 border border-transparent",
                    )}
                  >
                    <InitialAvatar name={member.name} id={member.id} />

                    <div className="flex-1 text-left min-w-0">
                      <div className="text-sm font-semibold text-white/90">
                        {member.name}
                      </div>
                      <div className="text-xs text-white/50 truncate">
                        {member.email}
                      </div>
                    </div>

                    <div
                      className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
                        selectedMembers.includes(member.id)
                          ? "bg-purple-500 border-purple-500"
                          : "border-purple-500/30 group-hover:border-purple-400",
                      )}
                    >
                      {selectedMembers.includes(member.id) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-white/50">
                    {teamMembers.length === 0 ? "등록된 사원이 없습니다." : "검색 결과가 없습니다."}
                  </p>
                </div>
              )}
            </div>

            <div className="border-t border-purple-500/20 px-6 py-4 bg-purple-900/20 flex gap-3 backdrop-blur-md">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-purple-500/30 text-white/90 text-sm font-semibold rounded-lg hover:bg-purple-500/10 transition-all duration-200"
              >
                취소
              </button>
              <button
                onClick={handleInvite}
                disabled={selectedMembers.length === 0}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                초대하기 ({selectedMembers.length})
              </button>
            </div>
          </>
        )}

        {activeTab === "guest" && (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-black/40">
              <div>
                <h3 className="text-sm font-semibold text-white/90 mb-2">
                  게스트 초대 링크
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  아래 링크를 게스트와 공유하면 게스트 계정으로 회의에 참석할 수
                  있습니다.
                </p>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Link2 className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-semibold text-white/70">
                    게스트 링크
                  </span>
                </div>

                <div className="bg-black/40 border border-purple-500/30 rounded-lg px-4 py-3 flex items-center justify-between group">
                  <code className="text-xs text-white/60 font-mono truncate">
                    {guestLink}
                  </code>
                  <button
                    onClick={handleCopyLink}
                    className={cn(
                      "p-2 rounded transition-all duration-200 ml-2 flex-shrink-0",
                      copied
                        ? "bg-purple-600/30 text-purple-300"
                        : "hover:bg-purple-500/20 text-white/60",
                    )}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>

                {copied && (
                  <div className="text-xs text-purple-300 font-medium">
                    ✓ 링크가 복사되었습니다
                  </div>
                )}
              </div>

              <div className="bg-purple-600/20 border border-purple-500/30 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-white/90 mb-3">
                  게스트 권한
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-xs text-white/70">
                    <span className="text-purple-400 font-bold mt-0.5">✓</span>
                    <span>회의 실시간 참석</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-white/70">
                    <span className="text-purple-400 font-bold mt-0.5">✓</span>
                    <span>음성 및 영상 참여</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-white/70">
                    <span className="text-purple-400 font-bold mt-0.5">✓</span>
                    <span>채팅 및 파일 공유</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-white/70">
                    <span className="text-pink-400 font-bold mt-0.5">✗</span>
                    <span>회의 녹화 및 기록 접근 불가</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-purple-500/20 px-6 py-4 bg-purple-900/20 flex gap-3 backdrop-blur-md">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-purple-500/30 text-white/90 text-sm font-semibold rounded-lg hover:bg-purple-500/10 transition-all duration-200"
              >
                닫기
              </button>
              <button
                onClick={handleCopyLink}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Copy className="w-4 h-4" />
                링크 복사
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
