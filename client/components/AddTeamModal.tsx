import { useState } from "react";
import { X, Search } from "lucide-react";
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
      emp.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleMember = (employee: Employee) => {
    const isSelected = selectedMembers.some((m) => m.id === employee.id);
    if (isSelected) {
      setSelectedMembers(selectedMembers.filter((m) => m.id !== employee.id));
    } else {
      setSelectedMembers([...selectedMembers, employee]);
    }
    // Keep search input focused and don't clear it
    setTimeout(() => {
      const searchInput = document.querySelector(
        'input[placeholder="이름, 이메일, 부서로 검색"]'
      ) as HTMLInputElement;
      if (searchInput) searchInput.focus();
    }, 0);
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
      alert("팀 생성 요청에 실패했습니다");
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
      <AlertDialogContent className="max-w-lg max-h-[90vh] overflow-y-auto dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 dark:backdrop-blur-md light:backdrop-blur-sm">
        <AlertDialogHeader>
          <div className="flex items-center justify-between">
            <AlertDialogTitle className="dark:text-white/90 light:text-purple-900">
              팀 생성 요청
            </AlertDialogTitle>
            <button
              onClick={handleClose}
              className="p-1 dark:hover:bg-purple-500/20 light:hover:bg-purple-200/40 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 dark:text-white/70 light:text-purple-600" />
            </button>
          </div>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900">
              팀 이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="예: 마케팅 팀"
              className="w-full px-4 py-2 border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg dark:bg-purple-500/10 light:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-600/50"
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Description Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900">
              설명
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="팀의 목적과 역할을 설명해주세요"
              className="w-full px-4 py-2 border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg dark:bg-purple-500/10 light:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-600/50"
              rows={3}
              disabled={isLoading}
            />
          </div>

          {/* Color Selection - GitHub Style */}
          <div className="space-y-3">
            <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900">
              팀 색상
            </label>
            <div className="flex flex-wrap items-center gap-3 p-3 border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg dark:bg-purple-500/10 light:bg-purple-50">
              {teamColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  title={color.name}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-sm transition-all ${
                    selectedColor === color.value
                      ? "ring-2 ring-offset-2 dark:ring-white light:ring-purple-700 scale-110"
                      : "opacity-70 hover:opacity-100"
                  } text-white dark:ring-offset-purple-900/40 light:ring-offset-purple-50`}
                  style={{ backgroundColor: color.hex }}
                >
                  <div className="w-2.5 h-2.5 rounded-full dark:bg-white light:bg-white/80"></div>
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          {/* Members Section */}
          <div className="space-y-3">
            <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900">
              팀원 선택
            </label>

            {/* Search Bar with Inline Tags */}
            <div className="relative">
              <div className="flex flex-wrap items-center gap-2 pl-10 pr-4 py-2 border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg dark:bg-purple-500/10 light:bg-purple-50 focus-within:ring-2 focus-within:ring-purple-500 transition-all">
                <Search className="absolute left-3 w-4 h-4 dark:text-white/40 light:text-purple-600" />

                {/* Selected Member Tags Inside Input */}
                {selectedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-1 px-2 py-1 dark:bg-purple-600/40 light:bg-purple-200/60 rounded-full border dark:border-purple-500/50 light:border-purple-300/50 text-xs bg-compact"
                  >
                    <Avatar className="w-4 h-4">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="dark:text-white/90 light:text-purple-900 font-medium whitespace-nowrap">
                      {member.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={isLoading}
                      className="p-0 dark:text-white/60 dark:hover:text-red-400 light:text-purple-600 light:hover:text-red-600 hover:dark:bg-red-500/20 hover:light:bg-red-100/50 rounded-full transition-colors flex-shrink-0"
                      title="제거"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Search Input */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={selectedMembers.length === 0 ? "이름, 이메일, 부서로 검색" : "검색..."}
                  className="flex-1 min-w-0 py-0 border-0 dark:bg-transparent light:bg-transparent focus:outline-none focus:ring-0 text-sm dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-600/50"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Employee List */}
            <div className="border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg overflow-hidden max-h-48 overflow-y-auto dark:bg-black/40 light:bg-purple-50/30">
              {filteredEmployees.length === 0 ? (
                <div className="p-4 text-center text-sm dark:text-white/60 light:text-purple-600">
                  검색 결과가 없습니다
                </div>
              ) : (
                filteredEmployees.map((employee) => {
                  const isSelected = selectedMembers.some(
                    (m) => m.id === employee.id
                  );
                  return (
                    <button
                      key={employee.id}
                      type="button"
                      onClick={() => handleToggleMember(employee)}
                      disabled={isLoading}
                      className={`w-full flex items-center gap-3 p-3 dark:border-b dark:border-purple-500/20 light:border-b light:border-purple-300/30 transition-colors ${
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
                        <p className="text-sm font-medium dark:text-white/90 light:text-purple-900">
                          {employee.name}
                        </p>
                        <p className="text-xs dark:text-white/50 light:text-purple-600">
                          {employee.department} · {employee.email}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Member Count Info */}
            {selectedMembers.length > 0 && (
              <p className="text-xs dark:text-white/50 light:text-purple-600">
                {selectedMembers.length}명 선택됨
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-white/90 dark:hover:bg-purple-500/20 light:border-purple-300/50 light:bg-purple-100/50 light:text-purple-700 light:hover:bg-purple-100"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
            >
              {isLoading ? "요청 중..." : "팀 생성 요청"}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
