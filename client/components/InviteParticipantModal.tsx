import { useState } from "react";
import { X, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

interface InviteParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (members: TeamMember[]) => void;
  teamMembers: TeamMember[];
  alreadyInvited?: string[];
}

const defaultTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Akbar Husain",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop",
    email: "akbar@example.com",
  },
  {
    id: "2",
    name: "Ameesh Menon",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop",
    email: "ameesh@example.com",
  },
  {
    id: "3",
    name: "Jonathan Sasi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop",
    email: "jonathan@example.com",
  },
  {
    id: "4",
    name: "Riska Thakur",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop",
    email: "riska@example.com",
  },
  {
    id: "5",
    name: "Natalia",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop",
    email: "natalia@example.com",
  },
  {
    id: "6",
    name: "Aila Thakur",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop",
    email: "aila@example.com",
  },
  {
    id: "7",
    name: "김철수",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop",
    email: "kim@example.com",
  },
  {
    id: "8",
    name: "이영희",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop",
    email: "lee@example.com",
  },
];

export default function InviteParticipantModal({
  isOpen,
  onClose,
  onInvite,
  teamMembers = defaultTeamMembers,
  alreadyInvited = [],
}: InviteParticipantModalProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMembers = teamMembers.filter(
    (member) =>
      !alreadyInvited.includes(member.id) &&
      (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleInvite = () => {
    const membersToInvite = teamMembers.filter((member) =>
      selectedMembers.includes(member.id)
    );
    onInvite(membersToInvite);
    setSelectedMembers([]);
    setSearchTerm("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-96 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/20">
          <h2 className="text-lg font-bold text-foreground">팀원 초대</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b border-border/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="이름 또는 이메일로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border/50 rounded-lg bg-white/60 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-sm"
            />
          </div>
        </div>

        {/* Team Members List */}
        <div className="flex-1 overflow-y-auto px-6 py-3 space-y-2">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => handleSelectMember(member.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  selectedMembers.includes(member.id)
                    ? "bg-brand-50 border border-brand-200"
                    : "hover:bg-gray-50 border border-transparent"
                )}
              >
                {/* Avatar */}
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />

                {/* Member Info */}
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-semibold text-foreground">
                    {member.name}
                  </div>
                  <div className="text-xs text-text-sub truncate">
                    {member.email}
                  </div>
                </div>

                {/* Checkbox */}
                <div
                  className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
                    selectedMembers.includes(member.id)
                      ? "bg-brand-500 border-brand-500"
                      : "border-border/40 group-hover:border-brand-300"
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
              <p className="text-sm text-text-sub">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border/20 px-6 py-4 bg-white/50 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border/60 text-foreground text-sm font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            취소
          </button>
          <button
            onClick={handleInvite}
            disabled={selectedMembers.length === 0}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-sm font-semibold rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            초대하기 ({selectedMembers.length})
          </button>
        </div>
      </div>
    </div>
  );
}
