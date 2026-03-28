import { ChevronDown, Check, ChevronUp, Plus, Loader2, X, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import type { UserResponseDto } from "@/features/auth/api";

export interface DerivedTeam {
  id: number;
  name: string;
  color?: string;
  status?: string;
  members: UserResponseDto[];
}

interface TeamsTabProps {
  pendingTeams: DerivedTeam[];
  activeTeams: DerivedTeam[];
  expandedTeam: number | null;
  setExpandedTeam: (id: number | null) => void;
  isLoading: boolean;
  showCreateTeam: boolean;
  setShowCreateTeam: (value: boolean) => void;
  newTeamName: string;
  setNewTeamName: (value: string) => void;
  onCreateTeam: () => void;
  onApproveTeam: (teamId: number) => void;
  onRejectTeam: (teamId: number) => void;
  onAssignLeader: (teamId: number, userId: number) => void;
  findTeamLeader: (team: DerivedTeam) => UserResponseDto | undefined;
  createPending: boolean;
  approvePending: boolean;
  rejectPending: boolean;
  assignPending: boolean;
}

export default function TeamsTab({
  pendingTeams,
  activeTeams,
  expandedTeam,
  setExpandedTeam,
  isLoading,
  showCreateTeam,
  setShowCreateTeam,
  newTeamName,
  setNewTeamName,
  onCreateTeam,
  onApproveTeam,
  onRejectTeam,
  onAssignLeader,
  findTeamLeader,
  createPending,
  approvePending,
  rejectPending,
  assignPending,
}: TeamsTabProps) {
  return (
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
                      onClick={() => onApproveTeam(team.id)}
                      disabled={approvePending}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm dark:bg-green-600/20 light:bg-green-100 dark:text-green-300 light:text-green-700 rounded-lg font-medium hover:dark:bg-green-600/30 hover:light:bg-green-200 transition-all disabled:opacity-50"
                    >
                      {approvePending ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      승인
                    </button>
                    <button
                      onClick={() => onRejectTeam(team.id)}
                      disabled={rejectPending}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm dark:bg-red-600/20 light:bg-red-100 dark:text-red-300 light:text-red-700 rounded-lg font-medium hover:dark:bg-red-600/30 hover:light:bg-red-200 transition-all disabled:opacity-50"
                    >
                      {rejectPending ? (
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
      <div className="om-card rounded-3xl p-8">
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
                if (e.key === "Enter") onCreateTeam();
              }}
            />
            <button
              onClick={onCreateTeam}
              disabled={createPending || !newTeamName.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
            >
              {createPending ? (
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

        {isLoading ? (
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
                                onClick={() => onAssignLeader(team.id, member.id)}
                                disabled={assignPending}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg font-medium transition-all disabled:opacity-50 ${
                                  isLeader
                                    ? "dark:bg-purple-600 light:bg-purple-600 text-white"
                                    : "dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700"
                                }`}
                              >
                                {assignPending ? (
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
  );
}
