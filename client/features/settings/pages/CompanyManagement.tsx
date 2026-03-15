import { useState, useMemo } from "react";
import { Building2, Users, Shield, ArrowLeft, ChevronDown, Check, ChevronUp, Plus, Loader2, Mail, X, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { useAuth } from "@/features/auth/context";
import {
  useAllEmployees,
  useActivateUser,
  useDeactivateUser,
  useApproveTeam,
  useRejectTeam,
  useAssignLeader,
  useCreateTeam,
  useInviteMember,
} from "@/features/auth/hooks";
import type { UserResponseDto } from "@/features/auth/api";

interface DerivedTeam {
  id: number;
  name: string;
  color?: string;
  status?: string;
  members: UserResponseDto[];
}

export default function CompanyManagement() {
  useDocumentTitle("회사 관리 - OnMeet");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"info" | "employees" | "teams">("info");
  const [expandedTeam, setExpandedTeam] = useState<number | null>(null);

  // Invite state
  const [inviteEmail, setInviteEmail] = useState("");

  // Team creation state
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  // ── API Hooks ──
  const { data: employeesPage, isLoading: isEmployeesLoading } = useAllEmployees({ page: 0, size: 50 });
  const activateUser = useActivateUser();
  const deactivateUser = useDeactivateUser();
  const approveTeam = useApproveTeam();
  const rejectTeam = useRejectTeam();
  const assignLeader = useAssignLeader();
  const createTeam = useCreateTeam();
  const inviteMember = useInviteMember();

  const employees: UserResponseDto[] = employeesPage?.content ?? [];

  // Derive teams from employees data
  const derivedTeams = useMemo<DerivedTeam[]>(() => {
    const teamMap = new Map<number, DerivedTeam>();
    for (const emp of employees) {
      for (const t of emp.teams) {
        if (!teamMap.has(t.id)) {
          teamMap.set(t.id, {
            id: t.id,
            name: t.name,
            color: t.color,
            status: t.status,
            members: [],
          });
        }
        teamMap.get(t.id)!.members.push(emp);
      }
    }
    return Array.from(teamMap.values());
  }, [employees]);

  const pendingTeams = useMemo(() => derivedTeams.filter((t) => t.status === "PENDING"), [derivedTeams]);
  const activeTeams = useMemo(() => derivedTeams.filter((t) => t.status !== "PENDING"), [derivedTeams]);

  // Count active managers
  const managerCount = employees.filter((e) => e.roles.includes("MANAGER")).length;

  // Toggle user active/inactive status
  const handleToggleStatus = (employee: UserResponseDto) => {
    if (employee.status === "ACTIVE") {
      deactivateUser.mutate(employee.id);
    } else {
      activateUser.mutate(employee.id);
    }
  };

  // Assign leader
  const handleAssignLeader = (teamId: number, userId: number) => {
    assignLeader.mutate({ teamId, userId });
  };

  // Approve team
  const handleApproveTeam = (teamId: number) => {
    approveTeam.mutate(teamId);
  };

  // Reject team
  const handleRejectTeam = (teamId: number) => {
    rejectTeam.mutate({ teamId });
  };

  // Create team
  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return;
    createTeam.mutate(
      { name: newTeamName.trim() },
      {
        onSuccess: () => {
          setNewTeamName("");
          setShowCreateTeam(false);
        },
      },
    );
  };

  // Invite member
  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    inviteMember.mutate(
      { emails: [inviteEmail.trim()] },
      {
        onSuccess: () => {
          setInviteEmail("");
        },
      },
    );
  };

  // Find leader for a team (employee with LEADER role in that team context - heuristic: first MANAGER in team)
  const findTeamLeader = (team: DerivedTeam): UserResponseDto | undefined => {
    return team.members.find((m) => m.roles.includes("LEADER")) ?? undefined;
  };

  return (
    <>
      <div className="max-w-4xl space-y-6">

        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/mypage")}
            className="p-1.5 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 rounded-lg transition-colors"
            title="뒤로가기"
          >
            <ArrowLeft className="w-5 h-5 dark:text-white/70 light:text-purple-600" />
          </button>
          <h1 className="text-3xl font-bold dark:text-white/90 light:text-purple-900">
            회사 관리
          </h1>
        </div>

        <div className="flex items-center justify-between border-b dark:border-purple-500/20 light:border-purple-300/40">
          <div className="flex gap-2">
            {[
              { id: "info" as const, label: "회사 정보", icon: Building2 },
              { id: "employees" as const, label: "사원 관리", icon: Users },
              { id: "teams" as const, label: "팀 관리", icon: Shield },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                    activeTab === tab.id
                      ? "dark:border-purple-500 dark:text-purple-400 light:border-purple-600 light:text-purple-600"
                      : "dark:border-transparent dark:text-white/50 light:border-transparent light:text-purple-600/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Company Info Tab ── */}
        {activeTab === "info" && (
          <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-sm p-8">
            <div className="flex gap-8">

              <div className="flex flex-col items-center gap-3 flex-shrink-0">
                <Avatar className="w-24 h-24 rounded-xl border-4 dark:border-purple-500/30 light:border-purple-300/50">
                  <AvatarFallback className="text-2xl font-bold dark:bg-purple-600/30 light:bg-purple-100 dark:text-white light:text-purple-700 rounded-xl">
                    {user?.company?.name?.charAt(0) ?? "C"}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <label className="block text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
                    회사명
                  </label>
                  <p className="text-lg dark:text-white/70 light:text-purple-700">
                    {user?.company?.name ?? "-"}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
                    총 직원 수
                  </label>
                  <p className="text-lg dark:text-white/70 light:text-purple-700">
                    {isEmployeesLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin inline" />
                    ) : (
                      `${employeesPage?.totalElements ?? 0}명`
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
                    팀 수
                  </label>
                  <p className="text-lg dark:text-white/70 light:text-purple-700">
                    {isEmployeesLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin inline" />
                    ) : (
                      `${derivedTeams.length}개`
                    )}
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── Employees Tab ── */}
        {activeTab === "employees" && (
          <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-sm p-8">
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
              <div className="flex items-center gap-3 mb-4 p-4 dark:bg-purple-500/10 light:bg-purple-50 rounded-xl border dark:border-purple-500/30 light:border-purple-300/50">
                <Mail className="w-5 h-5 dark:text-purple-400 light:text-purple-600 flex-shrink-0" />
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="초대할 이메일 주소"
                  className="flex-1 px-4 py-2 border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg dark:bg-purple-500/10 light:bg-white dark:text-white light:text-purple-900 text-sm focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/30 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleInvite();
                  }}
                />
                <button
                  onClick={handleInvite}
                  disabled={inviteMember.isPending || !inviteEmail.trim()}
                  className="flex items-center gap-2 px-4 py-2 dark:bg-purple-600 light:bg-purple-600 text-white rounded-lg font-medium hover:dark:bg-purple-700 hover:light:bg-purple-700 transition-all whitespace-nowrap disabled:opacity-50"
                >
                  {inviteMember.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                  초대
                </button>
              </div>

              {isEmployeesLoading ? (
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
                    {employee.id === user?.id ? (
                      <span className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium dark:bg-purple-500/10 light:bg-purple-50 dark:text-white/40 light:text-purple-400 cursor-not-allowed" title="자기 자신의 계정은 비활성화할 수 없습니다">
                        <Shield className="w-4 h-4" />
                        본인
                      </span>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(employee)}
                        disabled={activateUser.isPending || deactivateUser.isPending}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 ${
                          employee.status === "ACTIVE"
                            ? "dark:bg-purple-600 light:bg-purple-600 text-white"
                            : "dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700"
                        }`}
                      >
                        {(activateUser.isPending || deactivateUser.isPending) ? (
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
        )}

        {/* ── Teams Tab ── */}
        {activeTab === "teams" && (
          <div className="space-y-6">

            {/* Pending Teams Section */}
            {pendingTeams.length > 0 && (
              <div className="dark:bg-gradient-to-br dark:from-yellow-900/20 dark:via-black/80 dark:to-purple-900/30 light:bg-white dark:border dark:border-yellow-500/30 light:border light:border-yellow-300/40 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-sm p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Clock className="w-5 h-5 dark:text-yellow-400 light:text-yellow-600" />
                  <h2 className="text-lg font-semibold dark:text-white/90 light:text-purple-900">
                    승인 대기 팀
                  </h2>
                  <span className="px-2.5 py-0.5 text-xs dark:bg-yellow-500/20 dark:text-yellow-300 light:bg-yellow-100 light:text-yellow-700 rounded-full font-medium">
                    {pendingTeams.length}건
                  </span>
                </div>

                <div className="space-y-3">
                  {pendingTeams.map((team) => (
                    <div
                      key={team.id}
                      className="dark:bg-yellow-500/5 light:bg-yellow-50 rounded-xl border dark:border-yellow-500/20 light:border-yellow-300/50 overflow-hidden"
                    >
                      <div className="w-full flex items-center justify-between p-4">
                        <button
                          onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                          className="flex-1 flex items-center justify-between text-left"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className="w-4 h-4 rounded-full flex-shrink-0"
                              style={{ backgroundColor: team.color || "#a855f7" }}
                            />
                            <div>
                              <p className="font-semibold dark:text-white light:text-purple-900">
                                {team.name}
                              </p>
                              <p className="text-sm dark:text-white/60 light:text-purple-600">
                                {team.members.length}명
                              </p>
                            </div>
                          </div>
                          {expandedTeam === team.id ? (
                            <ChevronUp className="w-5 h-5 dark:text-white/70 light:text-purple-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 dark:text-white/70 light:text-purple-600" />
                          )}
                        </button>

                        <div className="ml-4 flex gap-2">
                          <button
                            onClick={() => handleApproveTeam(team.id)}
                            disabled={approveTeam.isPending}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm dark:bg-green-600/20 light:bg-green-100 dark:text-green-300 light:text-green-700 rounded-lg font-medium hover:dark:bg-green-600/30 hover:light:bg-green-200 transition-all disabled:opacity-50"
                          >
                            {approveTeam.isPending ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Check className="w-3.5 h-3.5" />
                            )}
                            승인
                          </button>
                          <button
                            onClick={() => handleRejectTeam(team.id)}
                            disabled={rejectTeam.isPending}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm dark:bg-red-600/20 light:bg-red-100 dark:text-red-300 light:text-red-700 rounded-lg font-medium hover:dark:bg-red-600/30 hover:light:bg-red-200 transition-all disabled:opacity-50"
                          >
                            {rejectTeam.isPending ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <X className="w-3.5 h-3.5" />
                            )}
                            거절
                          </button>
                        </div>
                      </div>

                      {expandedTeam === team.id && (
                        <div className="border-t dark:border-yellow-500/20 light:border-yellow-300/50 p-4">
                          <div className="space-y-3">
                            {team.members.map((member) => (
                              <div
                                key={member.id}
                                className="flex items-center gap-3 p-3 dark:bg-purple-500/10 light:bg-purple-100/30 rounded-lg"
                              >
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="text-sm dark:bg-purple-600/30 light:bg-purple-200 dark:text-white light:text-purple-700 font-semibold">
                                    {member.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium dark:text-white light:text-purple-900">
                                    {member.name}
                                  </p>
                                  <p className="text-xs dark:text-white/60 light:text-purple-600">
                                    {member.jobTitle?.name ?? "-"} • {member.email}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Teams Section */}
            <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-sm p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold dark:text-white/90 light:text-purple-900">
                  팀 목록
                </h2>
                <button
                  onClick={() => setShowCreateTeam(!showCreateTeam)}
                  className="flex items-center gap-2 px-4 py-2 dark:bg-purple-600 light:bg-purple-600 text-white rounded-lg font-medium hover:dark:bg-purple-700 hover:light:bg-purple-700 transition-all whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  팀 생성
                </button>
              </div>

              {/* Create Team Form */}
              {showCreateTeam && (
                <div className="flex items-center gap-3 mb-6 p-4 dark:bg-purple-500/10 light:bg-purple-50 rounded-xl border dark:border-purple-500/30 light:border-purple-300/50">
                  <input
                    type="text"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="새 팀 이름"
                    className="flex-1 px-4 py-2 border dark:border-purple-500/30 light:border-purple-300/50 rounded-lg dark:bg-purple-500/10 light:bg-white dark:text-white light:text-purple-900 text-sm focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/30 transition-all"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateTeam();
                    }}
                  />
                  <button
                    onClick={handleCreateTeam}
                    disabled={createTeam.isPending || !newTeamName.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                  >
                    {createTeam.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    생성
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateTeam(false);
                      setNewTeamName("");
                    }}
                    className="flex items-center gap-2 px-4 py-2 dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700 rounded-lg font-medium dark:hover:bg-purple-500/30 light:hover:bg-purple-200 transition-all"
                  >
                    <X className="w-4 h-4" />
                    취소
                  </button>
                </div>
              )}

              {isEmployeesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin dark:text-purple-400 light:text-purple-600" />
                </div>
              ) : activeTeams.length === 0 ? (
                <p className="text-center py-8 dark:text-white/50 light:text-purple-600/50">
                  등록된 팀이 없습니다.
                </p>
              ) : (
                <div className="space-y-3">
                  {activeTeams.map((team) => {
                    const leader = findTeamLeader(team);
                    return (
                      <div
                        key={team.id}
                        className="dark:bg-purple-500/10 light:bg-purple-50 rounded-xl border dark:border-purple-500/30 light:border-purple-300/50 overflow-hidden"
                      >

                        <button
                          onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                          className="w-full flex items-center justify-between p-4 dark:hover:bg-purple-500/20 light:hover:bg-purple-100/50 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className="w-4 h-4 rounded-full flex-shrink-0"
                              style={{ backgroundColor: team.color || "#a855f7" }}
                            />
                            <div>
                              <p className="font-semibold dark:text-white light:text-purple-900">
                                {team.name}
                              </p>
                              <p className="text-sm dark:text-white/60 light:text-purple-600">
                                팀 리더: {leader?.name ?? "미지정"} • {team.members.length}명
                              </p>
                            </div>
                          </div>
                          {expandedTeam === team.id ? (
                            <ChevronUp className="w-5 h-5 dark:text-white/70 light:text-purple-600" />
                          ) : (
                            <ChevronDown className="w-5 h-5 dark:text-white/70 light:text-purple-600" />
                          )}
                        </button>

                        {expandedTeam === team.id && (
                          <div className="border-t dark:border-purple-500/30 light:border-purple-300/50 p-4 space-y-4">
                            <div className="space-y-3">
                              {team.members.map((member) => {
                                const isLeader = member.roles.includes("LEADER");
                                return (
                                  <div
                                    key={member.id}
                                    className="flex items-center justify-between p-3 dark:bg-purple-500/20 light:bg-purple-100/30 rounded-lg"
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      <Avatar className="w-8 h-8">
                                        <AvatarFallback className="text-sm dark:bg-purple-600/30 light:bg-purple-200 dark:text-white light:text-purple-700 font-semibold">
                                          {member.name.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1">
                                        <p className="font-medium dark:text-white light:text-purple-900">
                                          {member.name}
                                        </p>
                                        <p className="text-xs dark:text-white/60 light:text-purple-600">
                                          {member.jobTitle?.name ?? "-"} • {member.email}
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleAssignLeader(team.id, member.id)}
                                      disabled={assignLeader.isPending}
                                      className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg font-medium transition-all disabled:opacity-50 ${
                                        isLeader
                                          ? "dark:bg-purple-600 light:bg-purple-600 text-white"
                                          : "dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700"
                                      }`}
                                    >
                                      {assignLeader.isPending ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : isLeader ? (
                                        <>
                                          <Check className="w-3.5 h-3.5" />
                                          리더
                                        </>
                                      ) : (
                                        "리더 지정"
                                      )}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
