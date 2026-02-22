import { useState } from "react";
import Layout from "@/components/Layout";
import { Building2, Users, Shield, ArrowLeft, Edit2, Save, X, ChevronDown, Check, ChevronUp, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  employees: number;
  industry: string;
  logo: string;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  position: string;
  team: string;
  isManager: boolean;
  avatar: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  position: string;
}

interface Team {
  id: string;
  name: string;
  memberCount: number;
  leader: string;
  members: TeamMember[];
}

interface TeamCreationRequest {
  id: string;
  teamName: string;
  requestedBy: string;
  requestedDate: string;
}

export default function CompanyManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"info" | "employees" | "teams">("info");
  const [editMode, setEditMode] = useState(false);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  
  const [companyData, setCompanyData] = useState<CompanyInfo>({
    name: "Tech Company Inc.",
    email: "contact@techcompany.com",
    phone: "+82 (02) 1234-5678",
    employees: 250,
    industry: "Software Development",
    logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=80&h=80&fit=crop",
  });

  const [formData, setFormData] = useState(companyData);

  const [employeeList, setEmployeeList] = useState<Employee[]>([
    {
      id: "1",
      name: "김철수",
      email: "kim@example.com",
      position: "CEO",
      team: "경영진",
      isManager: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
    },
    {
      id: "2",
      name: "이영희",
      email: "lee@example.com",
      position: "CTO",
      team: "개발",
      isManager: true,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
    },
    {
      id: "3",
      name: "박민준",
      email: "park@example.com",
      position: "마케팅 매니저",
      team: "마케팅",
      isManager: true,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
    },
    {
      id: "4",
      name: "정준호",
      email: "jung@example.com",
      position: "개발자",
      team: "개발",
      isManager: false,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop",
    },
    {
      id: "5",
      name: "최수진",
      email: "choi@example.com",
      position: "HR 담당",
      team: "인사",
      isManager: false,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop",
    },
  ]);

  const [teamList, setTeamList] = useState<Team[]>([
    {
      id: "1",
      name: "마케팅",
      memberCount: 12,
      leader: "박민준",
      members: [
        { id: "m1", name: "박민준", email: "park@example.com", position: "마케팅 매니저" },
        { id: "m2", name: "한지은", email: "han@example.com", position: "마케팅 스페셜리스트" },
        { id: "m3", name: "유혜정", email: "yu@example.com", position: "소셜미디어 담당" },
      ],
    },
    {
      id: "2",
      name: "개발",
      memberCount: 18,
      leader: "이영희",
      members: [
        { id: "d1", name: "이영희", email: "lee@example.com", position: "CTO" },
        { id: "d2", name: "정준호", email: "jung@example.com", position: "개발자" },
        { id: "d3", name: "임상현", email: "lim@example.com", position: "개발자" },
      ],
    },
    {
      id: "3",
      name: "디자인",
      memberCount: 8,
      leader: "미지정",
      members: [
        { id: "de1", name: "한지은", email: "han@example.com", position: "UI 디자이너" },
        { id: "de2", name: "유혜정", email: "yu@example.com", position: "UX 디자이너" },
      ],
    },
  ]);

  const [teamCreationRequests, setTeamCreationRequests] = useState<TeamCreationRequest[]>([
    {
      id: "r1",
      teamName: "데이터 분석팀",
      requestedBy: "이영희",
      requestedDate: "2024-01-15",
    },
    {
      id: "r2",
      teamName: "고객 성공팀",
      requestedBy: "박민준",
      requestedDate: "2024-01-14",
    },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, logo: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setCompanyData(formData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData(companyData);
    setEditMode(false);
  };

  const toggleEmployeeManager = (id: string) => {
    const managerCount = employeeList.filter((e) => e.isManager).length;
    
    // Check if trying to remove the last manager
    const employee = employeeList.find((e) => e.id === id);
    if (employee?.isManager && managerCount === 1) {
      alert("최소 1명 이상의 매니저가 필요합니다.");
      return;
    }

    setEmployeeList(
      employeeList.map((emp) =>
        emp.id === id ? { ...emp, isManager: !emp.isManager } : emp
      )
    );
  };

  const toggleTeamLeader = (teamId: string, leaderName: string) => {
    setTeamList(
      teamList.map((team) =>
        team.id === teamId ? { ...team, leader: team.leader === leaderName ? "미지정" : leaderName } : team
      )
    );
  };

  const approveTeamCreation = (requestId: string) => {
    const request = teamCreationRequests.find((r) => r.id === requestId);
    if (request) {
      // Add new team
      setTeamList([
        ...teamList,
        {
          id: Date.now().toString(),
          name: request.teamName,
          memberCount: 0,
          leader: "미지정",
          members: [],
        },
      ]);
      // Remove request
      setTeamCreationRequests(teamCreationRequests.filter((r) => r.id !== requestId));
    }
  };

  const rejectTeamCreation = (requestId: string) => {
    setTeamCreationRequests(teamCreationRequests.filter((r) => r.id !== requestId));
  };

  const managerCount = employeeList.filter((e) => e.isManager).length;

  return (
    <Layout showRecentPanel={false}>
      <div className="max-w-4xl space-y-6">
        {/* Back Button and Title */}
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

        {/* Tabs */}
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
          {activeTab === "info" && !editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 dark:bg-purple-600 light:bg-purple-600 text-white rounded-lg font-medium hover:dark:bg-purple-700 hover:light:bg-purple-700 transition-all whitespace-nowrap"
            >
              <Edit2 className="w-4 h-4" />
              정보 수정
            </button>
          )}
        </div>

        {/* Company Info Tab */}
        {activeTab === "info" && (
          <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-sm p-8">
            <div className="flex gap-8">
              {/* Logo Section */}
              <div className="flex flex-col items-center gap-3 flex-shrink-0">
                <div className="relative">
                  <img
                    src={formData.logo}
                    alt={formData.name}
                    className="w-24 h-24 rounded-xl object-cover border-4 dark:border-purple-500/30 light:border-purple-300/50"
                  />
                  {editMode && (
                    <label className="absolute bottom-0 right-0 p-1.5 dark:bg-purple-600 light:bg-purple-600 text-white rounded-full cursor-pointer hover:dark:bg-purple-700 hover:light:bg-purple-700 transition-all">
                      <Edit2 className="w-3 h-3" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    수정
                  </button>
                )}
              </div>

              {/* Information Section */}
              <div className="flex-1 space-y-6">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
                  회사명
                </label>
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border dark:border-purple-500/30 light:border-purple-300/50 rounded-xl dark:bg-purple-500/10 light:bg-purple-50 dark:text-white light:text-purple-900 focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/30 transition-all"
                  />
                ) : (
                  <p className="text-lg dark:text-white/70 light:text-purple-700">{formData.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
                  이메일
                </label>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border dark:border-purple-500/30 light:border-purple-300/50 rounded-xl dark:bg-purple-500/10 light:bg-purple-50 dark:text-white light:text-purple-900 focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/30 transition-all"
                  />
                ) : (
                  <p className="text-lg dark:text-white/70 light:text-purple-700">{formData.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
                  전화
                </label>
                {editMode ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border dark:border-purple-500/30 light:border-purple-300/50 rounded-xl dark:bg-purple-500/10 light:bg-purple-50 dark:text-white light:text-purple-900 focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/30 transition-all"
                  />
                ) : (
                  <p className="text-lg dark:text-white/70 light:text-purple-700">{formData.phone}</p>
                )}
              </div>

              {/* Industry */}
              <div>
                <label className="block text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
                  업종
                </label>
                {editMode ? (
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border dark:border-purple-500/30 light:border-purple-300/50 rounded-xl dark:bg-purple-500/10 light:bg-purple-50 dark:text-white light:text-purple-900 focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/30 transition-all"
                  />
                ) : (
                  <p className="text-lg dark:text-white/70 light:text-purple-700">{formData.industry}</p>
                )}
              </div>

              {/* Employee Count */}
              <div>
                <label className="block text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
                  직원 수
                </label>
                {editMode ? (
                  <input
                    type="number"
                    name="employees"
                    value={formData.employees}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border dark:border-purple-500/30 light:border-purple-300/50 rounded-xl dark:bg-purple-500/10 light:bg-purple-50 dark:text-white light:text-purple-900 focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/30 transition-all"
                  />
                ) : (
                  <p className="text-lg dark:text-white/70 light:text-purple-700">{formData.employees}명</p>
                )}
              </div>

              </div>

              {/* Save Button */}
              {editMode && (
                <div className="flex gap-3 pt-4 mt-8">
                  <button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30"
                  >
                    <Save className="w-4 h-4" />
                    저장
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700 rounded-xl font-medium dark:hover:bg-purple-500/30 light:hover:bg-purple-200 transition-all"
                  >
                    <X className="w-4 h-4" />
                    취소
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Employee Management Tab */}
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
              {employeeList.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-4 dark:bg-purple-500/10 light:bg-purple-50 rounded-xl border dark:border-purple-500/30 light:border-purple-300/50"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={employee.avatar} alt={employee.name} />
                      <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold dark:text-white light:text-purple-900">
                        {employee.name}
                      </p>
                      <p className="text-sm dark:text-white/60 light:text-purple-600">
                        {employee.position} • {employee.team}
                      </p>
                      <p className="text-xs dark:text-white/40 light:text-purple-600/70">
                        {employee.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleEmployeeManager(employee.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      employee.isManager
                        ? "dark:bg-purple-600 light:bg-purple-600 text-white"
                        : "dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700"
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    {employee.isManager ? "매니저" : "일반"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Management Tab */}
        {activeTab === "teams" && (
          <div className="space-y-6">
            {/* Team Creation Requests Section */}
            {teamCreationRequests.length > 0 && (
              <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-sm p-8">
                <h2 className="text-lg font-semibold dark:text-white/90 light:text-purple-900 mb-6 flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  팀 생성 승인
                </h2>
                <div className="space-y-3">
                  {teamCreationRequests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 dark:bg-purple-500/10 light:bg-purple-50 rounded-xl border dark:border-purple-500/30 light:border-purple-300/50"
                    >
                      <div className="flex-1">
                        <p className="font-semibold dark:text-white light:text-purple-900">
                          {request.teamName}
                        </p>
                        <p className="text-sm dark:text-white/60 light:text-purple-600">
                          요청자: {request.requestedBy} • {request.requestedDate}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveTeamCreation(request.id)}
                          className="flex items-center gap-2 px-4 py-2 dark:bg-green-600/20 light:bg-green-100 dark:text-green-300 light:text-green-700 rounded-lg font-medium hover:dark:bg-green-600/30 hover:light:bg-green-200 transition-all"
                        >
                          <Check className="w-4 h-4" />
                          승인
                        </button>
                        <button
                          onClick={() => rejectTeamCreation(request.id)}
                          className="flex items-center gap-2 px-4 py-2 dark:bg-red-600/20 light:bg-red-100 dark:text-red-300 light:text-red-700 rounded-lg font-medium hover:dark:bg-red-600/30 hover:light:bg-red-200 transition-all"
                        >
                          <X className="w-4 h-4" />
                          거절
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Teams List */}
            <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-sm p-8">
              <h2 className="text-lg font-semibold dark:text-white/90 light:text-purple-900 mb-6">
                팀 목록
              </h2>
              <div className="space-y-3">
                {teamList.map((team) => (
                  <div
                    key={team.id}
                    className="dark:bg-purple-500/10 light:bg-purple-50 rounded-xl border dark:border-purple-500/30 light:border-purple-300/50 overflow-hidden"
                  >
                    {/* Team Header */}
                    <button
                      onClick={() => setExpandedTeam(expandedTeam === team.id ? null : team.id)}
                      className="w-full flex items-center justify-between p-4 dark:hover:bg-purple-500/20 light:hover:bg-purple-100/50 transition-colors"
                    >
                      <div className="flex-1 text-left">
                        <p className="font-semibold dark:text-white light:text-purple-900">
                          {team.name}
                        </p>
                        <p className="text-sm dark:text-white/60 light:text-purple-600">
                          팀 리더: {team.leader} • {team.memberCount}명
                        </p>
                      </div>
                      {expandedTeam === team.id ? (
                        <ChevronUp className="w-5 h-5 dark:text-white/70 light:text-purple-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 dark:text-white/70 light:text-purple-600" />
                      )}
                    </button>

                    {/* Team Members Accordion */}
                    {expandedTeam === team.id && (
                      <div className="border-t dark:border-purple-500/30 light:border-purple-300/50 p-4 space-y-4">
                        <div className="space-y-3">
                          {team.members.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-3 dark:bg-purple-500/20 light:bg-purple-100/30 rounded-lg"
                            >
                              <div className="flex-1">
                                <p className="font-medium dark:text-white light:text-purple-900">
                                  {member.name}
                                </p>
                                <p className="text-xs dark:text-white/60 light:text-purple-600">
                                  {member.position} • {member.email}
                                </p>
                              </div>
                              <button
                                onClick={() => toggleTeamLeader(team.id, member.name)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
                                  team.leader === member.name
                                    ? "dark:bg-purple-600 light:bg-purple-600 text-white"
                                    : "dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700"
                                }`}
                              >
                                {team.leader === member.name ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    리더
                                  </>
                                ) : (
                                  "리더 지정"
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
