import { useState, useEffect, useMemo } from "react";
import { X, Search, Copy, Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { useAllEmployees, useCreateTeam } from "@/features/auth/hooks";
import type { UserResponseDto } from "@/features/auth/api";

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function getLuminance(hex: string): number {
  const rgb = parseInt(hex.replace("#", ""), 16);
  const r = (rgb >> 16) & 255;
  const g = (rgb >> 8) & 255;
  const b = rgb & 255;

  const [rs, gs, bs] = [r, g, b].map((channel) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getOptimalTextColor(bgColor: string): string {
  const luminance = getLuminance(bgColor);
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

export default function AddTeamModal({
  isOpen,
  onClose,
}: AddTeamModalProps) {
  const defaultColor = "#A855F7";
  const [teamName, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedBgColor, setSelectedBgColor] = useState(defaultColor);
  const [selectedTextColor, setSelectedTextColor] = useState(
    getOptimalTextColor(defaultColor),
  );
  const [customColor, setCustomColor] = useState("");
  const [copiedHex, setCopiedHex] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<UserResponseDto[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: employeesData } = useAllEmployees({ size: 100 });
  const createTeamMutation = useCreateTeam();

  const allEmployees: UserResponseDto[] = employeesData?.content ?? [];

  useEffect(() => {
    const autoTextColor = getOptimalTextColor(selectedBgColor);
    setSelectedTextColor(autoTextColor);
  }, [selectedBgColor]);

  const filteredEmployees = useMemo(
    () =>
      allEmployees.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [allEmployees, searchQuery],
  );

  const handleToggleMember = (employee: UserResponseDto) => {
    const isSelected = selectedMembers.some((m) => m.id === employee.id);
    if (isSelected) {
      setSelectedMembers(selectedMembers.filter((m) => m.id !== employee.id));
    } else {
      setSelectedMembers([...selectedMembers, employee]);
    }
    setTimeout(() => {
      const searchInput = document.querySelector(
        'input[placeholder="이름, 이메일로 검색"]',
      ) as HTMLInputElement;
      if (searchInput) searchInput.focus();
    }, 0);
  };

  const handleRemoveMember = (id: number) => {
    setSelectedMembers(selectedMembers.filter((member) => member.id !== id));
  };

  const handleCustomColorChange = (hex: string) => {
    if (!hex.startsWith("#")) {
      setCustomColor("#" + hex.replace(/^#+/, ""));
    } else {
      setCustomColor(hex);
    }

    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      setSelectedBgColor(hex);
    }
  };

  const handleCopyColor = () => {
    const colorToCopy = customColor || selectedBgColor;
    navigator.clipboard.writeText(colorToCopy);
    setCopiedHex(true);
    setTimeout(() => setCopiedHex(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim()) {
      alert("팀 이름을 입력해주세요");
      return;
    }

    createTeamMutation.mutate(
      { name: teamName.trim() },
      {
        onSuccess: () => {
          resetForm();
          onClose();
        },
      },
    );
  };

  const resetForm = () => {
    setTeamName("");
    setDescription("");
    setSelectedBgColor(defaultColor);
    setSelectedTextColor(getOptimalTextColor(defaultColor));
    setCustomColor("");
    setSelectedMembers([]);
    setSearchQuery("");
  };

  const handleClose = () => {
    resetForm();
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
              disabled={createTeamMutation.isPending}
              autoFocus
            />
          </div>

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
              disabled={createTeamMutation.isPending}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900">
              팀 색상
            </label>

            <div className="flex items-center gap-3">
              <input
                type="color"
                value={selectedBgColor}
                onChange={(e) => {
                  setSelectedBgColor(e.target.value);
                  setCustomColor("");
                }}
                disabled={createTeamMutation.isPending}
                className="w-14 h-12 rounded-lg cursor-pointer border-2 dark:border-purple-500/30 light:border-purple-300/50 transition-transform hover:scale-105"
                title="색상 선택"
              />

              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  value={selectedBgColor}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!value.startsWith("#")) {
                      handleCustomColorChange("#" + value.replace(/^#+/, ""));
                    } else {
                      handleCustomColorChange(value);
                    }
                  }}
                  placeholder="#000000"
                  maxLength={7}
                  disabled={createTeamMutation.isPending}
                  className="flex-1 px-3 py-2 text-sm border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg dark:bg-purple-500/10 light:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-600/50 font-mono uppercase"
                />
                <button
                  type="button"
                  onClick={handleCopyColor}
                  disabled={createTeamMutation.isPending}
                  className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors dark:text-white/70 light:text-purple-600"
                  title="색상 코드 복사"
                >
                  {copiedHex ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs dark:text-white/50 light:text-purple-600">
                미리보기
              </p>
              <div
                className="w-full px-6 py-4 rounded-lg font-semibold transition-all"
                style={{
                  backgroundColor: selectedBgColor,
                  color: selectedTextColor,
                }}
              >
                팀 이름 예시
              </div>
              <p className="text-xs dark:text-white/50 light:text-purple-600">
                <span className="font-mono">{selectedBgColor}</span> (배경)
                <span className="mx-1">·</span>
                <span className="font-mono">{selectedTextColor}</span> (텍스트 - 자동 선택)
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold dark:text-white/90 light:text-purple-900">
              팀원 선택
            </label>

            <div className="relative">
              <div className="flex flex-wrap items-center gap-2 pl-10 pr-4 py-2 border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg dark:bg-purple-500/10 light:bg-purple-50 focus-within:ring-2 focus-within:ring-purple-500 transition-all">
                <Search className="absolute left-3 w-4 h-4 dark:text-white/40 light:text-purple-600" />

                {selectedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-1 px-2 py-1 dark:bg-purple-600/40 light:bg-purple-200/60 rounded-full border dark:border-purple-500/50 light:border-purple-300/50 text-xs bg-compact"
                  >
                    <Avatar className="w-4 h-4">
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="dark:text-white/90 light:text-purple-900 font-medium whitespace-nowrap">
                      {member.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      disabled={createTeamMutation.isPending}
                      className="p-0 dark:text-white/60 dark:hover:text-red-400 light:text-purple-600 light:hover:text-red-600 hover:dark:bg-red-500/20 hover:light:bg-red-100/50 rounded-full transition-colors flex-shrink-0"
                      title="제거"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={selectedMembers.length === 0 ? "이름, 이메일로 검색" : "검색..."}
                  className="flex-1 min-w-0 py-0 border-0 dark:bg-transparent light:bg-transparent focus:outline-none focus:ring-0 text-sm dark:text-white light:text-purple-900 dark:placeholder-white/40 light:placeholder-purple-600/50"
                  disabled={createTeamMutation.isPending}
                />
              </div>
            </div>

            <div className="border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg overflow-hidden max-h-48 overflow-y-auto dark:bg-black/40 light:bg-purple-50/30">
              {filteredEmployees.length === 0 ? (
                <div className="p-4 text-center text-sm dark:text-white/60 light:text-purple-600">
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
                      disabled={createTeamMutation.isPending}
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
                        disabled={createTeamMutation.isPending}
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
                          {employee.jobTitle?.name ?? "-"} · {employee.email}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {selectedMembers.length > 0 && (
              <p className="text-xs dark:text-white/50 light:text-purple-600">
                {selectedMembers.length}명 선택됨
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createTeamMutation.isPending}
              className="flex-1 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-white/90 dark:hover:bg-purple-500/20 light:border-purple-300/50 light:bg-purple-100/50 light:text-purple-700 light:hover:bg-purple-100"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={createTeamMutation.isPending}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
            >
              {createTeamMutation.isPending ? "요청 중..." : "팀 생성 요청"}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
