import { useState } from "react";
import { Loader2, Pencil, Check, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";

interface CompanyInfoTabProps {
  companyName?: string;
  employeeCount?: number;
  teamCount: number;
  isLoading: boolean;
  onUpdateCompany: (name: string) => void;
  updatePending: boolean;
}

export default function CompanyInfoTab({
  companyName,
  employeeCount,
  teamCount,
  isLoading,
  onUpdateCompany,
  updatePending,
}: CompanyInfoTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");

  const handleEditStart = () => {
    setEditName(companyName ?? "");
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editName.trim()) return;
    onUpdateCompany(editName.trim());
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-sm p-8">
      <div className="flex gap-8">

        <div className="flex flex-col items-center gap-3 flex-shrink-0">
          <Avatar className="w-24 h-24 rounded-xl border-4 dark:border-purple-500/30 light:border-purple-300/50">
            <AvatarFallback className="text-2xl font-bold dark:bg-purple-600/30 light:bg-purple-100 dark:text-white light:text-purple-700 rounded-xl">
              {companyName?.charAt(0) ?? "C"}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <label className="block text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
              회사명
            </label>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSave();
                    if (e.key === "Escape") handleCancel();
                  }}
                  autoFocus
                  className="px-4 py-2 border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg dark:bg-purple-500/10 light:bg-white dark:text-white light:text-purple-900 text-sm focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/30 transition-all"
                />
                <button
                  onClick={handleSave}
                  disabled={updatePending || !editName.trim()}
                  className="p-2 dark:bg-purple-600 light:bg-purple-600 text-white rounded-lg hover:dark:bg-purple-700 hover:light:bg-purple-700 transition-all disabled:opacity-50"
                >
                  {updatePending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 dark:bg-purple-500/20 light:bg-purple-100 dark:text-white/70 light:text-purple-600 rounded-lg hover:dark:bg-purple-500/40 hover:light:bg-purple-200 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="text-lg dark:text-white/70 light:text-purple-700">
                  {companyName ?? "-"}
                </p>
                <button
                  onClick={handleEditStart}
                  className="p-1.5 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 rounded-lg transition-colors"
                  title="회사명 수정"
                >
                  <Pencil className="w-4 h-4 dark:text-white/40 light:text-purple-400" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
              총 직원 수
            </label>
            <p className="text-lg dark:text-white/70 light:text-purple-700">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin inline" />
              ) : (
                `${employeeCount ?? 0}명`
              )}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
              팀 수
            </label>
            <p className="text-lg dark:text-white/70 light:text-purple-700">
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin inline" />
              ) : (
                `${teamCount}개`
              )}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
