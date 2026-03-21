import { useState, useMemo } from "react";
import { Building2, Users, Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
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
import CompanyInfoTab from "@/features/settings/components/CompanyInfoTab";
import EmployeesTab from "@/features/settings/components/EmployeesTab";
import TeamsTab from "@/features/settings/components/TeamsTab";
import type { DerivedTeam } from "@/features/settings/components/TeamsTab";

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
    const isManager = user?.roles?.includes("MANAGER") ?? false;
    const teamPayload = isManager && user?.id
      ? { name: newTeamName.trim(), memberIds: [user.id], leaderId: user.id }
      : { name: newTeamName.trim() };
    createTeam.mutate(
      teamPayload,
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
          <CompanyInfoTab
            companyName={user?.company?.name}
            employeeCount={employeesPage?.totalElements}
            teamCount={derivedTeams.length}
            isLoading={isEmployeesLoading}
          />
        )}

        {/* ── Employees Tab ── */}
        {activeTab === "employees" && (
          <EmployeesTab
            employees={employees}
            currentUserId={user?.id}
            isLoading={isEmployeesLoading}
            inviteEmail={inviteEmail}
            setInviteEmail={setInviteEmail}
            onInvite={handleInvite}
            onToggleStatus={handleToggleStatus}
            invitePending={inviteMember.isPending}
            togglePending={activateUser.isPending || deactivateUser.isPending}
            managerCount={managerCount}
          />
        )}

        {/* ── Teams Tab ── */}
        {activeTab === "teams" && (
          <TeamsTab
            pendingTeams={pendingTeams}
            activeTeams={activeTeams}
            expandedTeam={expandedTeam}
            setExpandedTeam={setExpandedTeam}
            isLoading={isEmployeesLoading}
            showCreateTeam={showCreateTeam}
            setShowCreateTeam={setShowCreateTeam}
            newTeamName={newTeamName}
            setNewTeamName={setNewTeamName}
            onCreateTeam={handleCreateTeam}
            onApproveTeam={handleApproveTeam}
            onRejectTeam={handleRejectTeam}
            onAssignLeader={handleAssignLeader}
            findTeamLeader={findTeamLeader}
            createPending={createTeam.isPending}
            approvePending={approveTeam.isPending}
            rejectPending={rejectTeam.isPending}
            assignPending={assignLeader.isPending}
          />
        )}
      </div>
    </>
  );
}
