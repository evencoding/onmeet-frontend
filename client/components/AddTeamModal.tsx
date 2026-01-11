import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TeamMember {
  id: string;
  name: string;
  email: string;
}

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamAdded?: (team: {
    name: string;
    description: string;
    color: string;
    members: TeamMember[];
  }) => void;
}

const teamColors = [
  { name: "Purple", value: "bg-purple-500", hex: "#a855f7" },
  { name: "Blue", value: "bg-blue-500", hex: "#3b82f6" },
  { name: "Pink", value: "bg-pink-500", hex: "#ec4899" },
  { name: "Green", value: "bg-green-500", hex: "#22c55e" },
];

export default function AddTeamModal({
  isOpen,
  onClose,
  onTeamAdded,
}: AddTeamModalProps) {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(teamColors[0].value);
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMember = () => {
    if (!memberName.trim() || !memberEmail.trim()) {
      alert("이름과 이메일을 입력해주세요");
      return;
    }

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: memberName,
      email: memberEmail,
    };

    setMembers([...members, newMember]);
    setMemberName("");
    setMemberEmail("");
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      alert("팀 이름을 입력해주세요");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Call the callback with new team data
      onTeamAdded?.({
        name: teamName,
        description,
        color: selectedColor,
        members,
      });

      // Reset form and close modal
      setTeamName("");
      setDescription("");
      setSelectedColor(teamColors[0].value);
      setMembers([]);
      setMemberName("");
      setMemberEmail("");
      onClose();
    } catch (error) {
      console.error("Failed to create team:", error);
      alert("팀 생성에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTeamName("");
    setDescription("");
    setSelectedColor(teamColors[0].value);
    setMembers([]);
    setMemberName("");
    setMemberEmail("");
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle>새 팀 추가</AlertDialogTitle>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-surface-subtle rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              팀 이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="예: 마케팅 팀"
              className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              설명
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="팀의 목적과 역할을 설명해주세요"
              className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              팀 색상
            </label>
            <div className="grid grid-cols-2 gap-3">
              {teamColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-full h-12 rounded-lg transition-all border-2 flex items-center justify-center font-semibold text-sm ${
                    selectedColor === color.value
                      ? "border-foreground shadow-lg scale-105"
                      : "border-transparent hover:scale-102"
                  } text-white`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                  disabled={isLoading}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          {/* Members Section */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">
              팀원 추가
            </label>

            {/* Member Input Fields */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="이름"
                  className="flex-1 px-3 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-sm"
                  disabled={isLoading}
                />
                <input
                  type="email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="이메일"
                  className="flex-1 px-3 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-sm"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  disabled={isLoading || !memberName.trim() || !memberEmail.trim()}
                  className="px-3 py-2 bg-brand-50 text-brand-600 border border-brand-200 rounded-lg hover:bg-brand-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Members List */}
            {members.length > 0 && (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                <div className="text-xs font-semibold text-text-sub uppercase">
                  추가된 팀원 ({members.length})
                </div>
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-surface-subtle rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-text-sub truncate">
                        {member.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={isLoading}
                      className="p-1 ml-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "생성 중..." : "팀 생성"}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
