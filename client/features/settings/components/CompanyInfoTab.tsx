import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";

interface CompanyInfoTabProps {
  companyName?: string;
  employeeCount?: number;
  teamCount: number;
  isLoading: boolean;
}

export default function CompanyInfoTab({
  companyName,
  employeeCount,
  teamCount,
  isLoading,
}: CompanyInfoTabProps) {
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
            <p className="text-lg dark:text-white/70 light:text-purple-700">
              {companyName ?? "-"}
            </p>
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
