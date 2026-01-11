import { useState } from "react";
import { X, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  department?: string;
}

interface TeamMember extends Employee {}

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

// Mock employee list
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
    department: "마케팅",
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
    department: "제품",
  },
  {
    id: "5",
    name: "최수진",
    email: "choi@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
    department: "제품",
  },
  {
    id: "6",
    name: "임상현",
    email: "lim@example.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
    department: "디자인",
  },
  {
    id: "7",
    name: "한지은",
    email: "han@example.com",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
    department: "디자인",
  },
  {
    id: "8",
    name: "유혜정",
    email: "yu@example.com",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
    department: "디자인",
  },
];

export default function AddTeamModal({
  isOpen,
  onClose,
  onTeamAdded,
}: AddTeamModalProps) {
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(teamColors[0].value);
  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Filter employees based on search query
  const filteredEmployees = mockEmployees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleToggleMember = (employee: Employee) => {
    const isSelected = selectedMembers.some((m) => m.id === employee.id);
    if (isSelected) {
      setSelectedMembers(selectedMembers.filter((m) => m.id !== employee.id));
    } else {
      setSelectedMembers([...selectedMembers, employee]);
    }
  };

  const handleRemoveMember = (id: string) => {
    setSelectedMembers(selectedMembers.filter((member) => member.id !== id));
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
        members: selectedMembers,
      });

      // Reset form and close modal
      setTeamName("");
      setDescription("");
      setSelectedColor(teamColors[0].value);
      setSelectedMembers([]);
      setSearchQuery("");
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
    setSelectedMembers([]);
    setSearchQuery("");
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
              팀원 선택
            </label>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="이름, 이메일, 부서로 검색"
                className="w-full pl-10 pr-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-sm"
                disabled={isLoading}
              />
            </div>

            {/* Employee List */}
            <div className="border border-border/40 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
              {filteredEmployees.length === 0 ? (
                <div className="p-4 text-center text-sm text-text-sub">
                  검색 결과가 없습니다
                </div>
              ) : (
                filteredEmployees.map((employee) => {
                  const isSelected = selectedMembers.some(
                    (m) => m.id === employee.id,
                  );
                  return (
                    <button
                      key={employee.id}
                      type="button"
                      onClick={() => handleToggleMember(employee)}
                      disabled={isLoading}
                      className={`w-full flex items-center gap-3 p-3 border-b border-border/20 hover:bg-surface-subtle transition-colors ${
                        isSelected ? "bg-brand-50" : ""
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="cursor-pointer"
                        disabled={isLoading}
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
                        <p className="text-sm font-medium text-foreground">
                          {employee.name}
                        </p>
                        <p className="text-xs text-text-sub">
                          {employee.department} · {employee.email}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Selected Members */}
            {selectedMembers.length > 0 && (
              <div className="space-y-2 p-3 bg-brand-50 rounded-lg">
                <div className="text-xs font-semibold text-brand-600 uppercase">
                  선택된 팀원 ({selectedMembers.length})
                </div>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 bg-white rounded border border-brand-200"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>
                            {member.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">
                            {member.name}
                          </p>
                          <p className="text-xs text-text-sub truncate">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={isLoading}
                        className="p-1 ml-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
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
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "생성 중..." : "팀 생성"}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
