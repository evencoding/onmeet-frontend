import { Shield, Loader2, Mail } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import type { UserResponseDto } from "@/features/auth/api";

interface EmployeesTabProps {
  employees: UserResponseDto[];
  currentUserId?: number;
  isLoading: boolean;
  inviteEmail: string;
  setInviteEmail: (value: string) => void;
  onInvite: () => void;
  onToggleStatus: (employee: UserResponseDto) => void;
  invitePending: boolean;
  togglePending: boolean;
  managerCount: number;
  inviteRole: string;
  setInviteRole: (role: string) => void;
  onInviteSingle: () => void;
  inviteSinglePending: boolean;
}

export default function EmployeesTab({
  employees,
  currentUserId,
  isLoading,
  inviteEmail,
  setInviteEmail,
  onInvite,
  onToggleStatus,
  invitePending,
  togglePending,
  managerCount,
  inviteRole,
  setInviteRole,
  onInviteSingle,
  inviteSinglePending,
}: EmployeesTabProps) {
  return (
    <div className="om-card rounded-3xl p-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold dark:text-white/90 light:text-purple-900">
            사원 권한 관리
          </h2>
          <span className="px-3 py-1 text-sm dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100 light:text-purple-700 rounded-full font-medium">
            매니저 {managerCount}명
          </span>
        </div>

        {/* Invite Section */}
        <div className="flex flex-col gap-3 mb-4 p-4 dark:bg-purple-500/10 light:bg-purple-50 rounded-xl border dark:border-purple-500/30 light:border-purple-300/50">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 dark:text-purple-400 light:text-purple-600 flex-shrink-0" />
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="초대할 이메일 주소"
              className="flex-1 px-4 py-2 border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg dark:bg-purple-500/10 light:bg-white dark:text-white light:text-purple-900 text-sm focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/30 transition-all"
              onKeyDown={(e) => {
                if (e.key === "Enter") onInvite();
              }}
            />
            <button
              onClick={onInvite}
              disabled={invitePending || !inviteEmail.trim()}
              className="flex items-center gap-2 px-4 py-2 dark:bg-purple-600 light:bg-purple-600 text-white rounded-lg font-medium hover:dark:bg-purple-700 hover:light:bg-purple-700 transition-all whitespace-nowrap disabled:opacity-50"
            >
              {invitePending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Mail className="w-4 h-4" />
              )}
              초대
            </button>
          </div>
          <div className="flex items-center gap-3 pl-9">
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="px-3 py-2 border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg dark:bg-purple-500/10 light:bg-white dark:text-white light:text-purple-900 text-sm focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/30 transition-all"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
              <option value="MANAGER">MANAGER</option>
            </select>
            <button
              onClick={onInviteSingle}
              disabled={inviteSinglePending || !inviteEmail.trim()}
              className="flex items-center gap-2 px-4 py-2 dark:bg-purple-500/30 light:bg-purple-100 dark:text-purple-300 light:text-purple-700 rounded-lg font-medium hover:dark:bg-purple-500/50 hover:light:bg-purple-200 transition-all whitespace-nowrap disabled:opacity-50"
            >
              {inviteSinglePending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
              역할 지정 초대
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin dark:text-purple-400 light:text-purple-600" />
          </div>
        ) : (
          employees.map((employee) => (
            <div
              key={employee.id}
              className="flex items-center justify-between p-4 dark:bg-purple-500/10 light:bg-purple-50 rounded-xl border dark:border-purple-500/30 light:border-purple-300/50"
            >
              <div className="flex items-center gap-4 flex-1">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="dark:bg-purple-600/30 light:bg-purple-200 dark:text-white light:text-purple-700 font-semibold">
                    {employee.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold dark:text-white light:text-purple-900">
                    {employee.name}
                  </p>
                  <p className="text-sm dark:text-white/60 light:text-purple-600">
                    {employee.jobTitle?.name ?? "-"} {employee.teams[0] ? `• ${employee.teams[0].name}` : ""}
                  </p>
                  <p className="text-xs dark:text-white/40 light:text-purple-600/70">
                    {employee.email}
                  </p>
                </div>
              </div>
              {employee.id === currentUserId ? (
                <span className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium dark:bg-purple-500/10 light:bg-purple-50 dark:text-white/40 light:text-purple-400 cursor-not-allowed" title="자기 자신의 계정은 비활성화할 수 없습니다">
                  <Shield className="w-4 h-4" />
                  본인
                </span>
              ) : (
                <button
                  onClick={() => onToggleStatus(employee)}
                  disabled={togglePending}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 ${
                    employee.status === "ACTIVE"
                      ? "dark:bg-purple-600 light:bg-purple-600 text-white"
                      : "dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700"
                  }`}
                >
                  {togglePending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Shield className="w-4 h-4" />
                  )}
                  {employee.status === "ACTIVE" ? "활성" : "비활성"}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
