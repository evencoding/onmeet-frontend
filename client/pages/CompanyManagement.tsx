import { useState } from "react";
import Layout from "@/components/Layout";
import { Building2, Users, Mail, Phone, MapPin, ArrowLeft, Edit2, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  employees: number;
  industry: string;
}

export default function CompanyManagement() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"info" | "members" | "billing">("info");
  const [editMode, setEditMode] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyInfo>({
    name: "Tech Company Inc.",
    email: "contact@techcompany.com",
    phone: "+82 (02) 1234-5678",
    location: "Seoul, South Korea",
    employees: 250,
    industry: "Software Development",
  });

  const [formData, setFormData] = useState(companyData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setCompanyData(formData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData(companyData);
    setEditMode(false);
  };

  return (
    <Layout showRecentPanel={false}>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-sm p-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="p-4 dark:bg-purple-500/20 light:bg-purple-100 rounded-2xl">
                <Building2 className="w-8 h-8 dark:text-purple-400 light:text-purple-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
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
                <p className="dark:text-white/60 light:text-purple-600">회사 정보 및 팀 관리</p>
              </div>
            </div>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-4 py-2 dark:bg-purple-600 light:bg-purple-600 text-white rounded-xl font-medium hover:dark:bg-purple-700 hover:light:bg-purple-700 transition-all"
              >
                <Edit2 className="w-4 h-4" />
                정보 수정
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b dark:border-purple-500/20 light:border-purple-300/40">
          {[
            { id: "info" as const, label: "회사 정보", icon: Building2 },
            { id: "members" as const, label: "팀원 관리", icon: Users },
            { id: "billing" as const, label: "청구", icon: Mail },
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

        {/* Company Info Tab */}
        {activeTab === "info" && (
          <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-sm p-8">
            <div className="space-y-6">
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
                <label className="flex items-center gap-2 text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
                  <Mail className="w-4 h-4" />
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
                <label className="flex items-center gap-2 text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
                  <Phone className="w-4 h-4" />
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

              {/* Location */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
                  <MapPin className="w-4 h-4" />
                  위치
                </label>
                {editMode ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border dark:border-purple-500/30 light:border-purple-300/50 rounded-xl dark:bg-purple-500/10 light:bg-purple-50 dark:text-white light:text-purple-900 focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/30 transition-all"
                  />
                ) : (
                  <p className="text-lg dark:text-white/70 light:text-purple-700">{formData.location}</p>
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
                <label className="flex items-center gap-2 text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
                  <Users className="w-4 h-4" />
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

              {/* Save Button */}
              {editMode && (
                <div className="flex gap-3 pt-4">
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

        {/* Team Members Tab */}
        {activeTab === "members" && (
          <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-sm p-8">
            <div className="space-y-4">
              <p className="dark:text-white/70 light:text-purple-700 mb-6">
                회사에 속한 팀원을 관리합니다.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "김철수", role: "CEO", department: "경영진" },
                  { name: "이영희", role: "CTO", department: "개발" },
                  { name: "박민준", role: "마케팅 매니저", department: "마케팅" },
                  { name: "정준호", role: "HR 담당", department: "인사" },
                ].map((member, idx) => (
                  <div
                    key={idx}
                    className="p-4 dark:bg-purple-500/10 light:bg-purple-50 rounded-xl border dark:border-purple-500/30 light:border-purple-300/50"
                  >
                    <p className="font-semibold dark:text-white light:text-purple-900">{member.name}</p>
                    <p className="text-sm dark:text-white/60 light:text-purple-600">{member.role}</p>
                    <p className="text-xs dark:text-white/40 light:text-purple-600/70 mt-1">{member.department}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-sm p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold dark:text-white/90 light:text-purple-900 mb-4">
                  현재 요금제
                </h3>
                <div className="p-6 dark:bg-purple-500/10 light:bg-purple-50 rounded-2xl border dark:border-purple-500/30 light:border-purple-300/50">
                  <p className="text-2xl font-bold dark:text-purple-400 light:text-purple-600 mb-2">
                    Pro Plan
                  </p>
                  <p className="dark:text-white/70 light:text-purple-700">
                    월 $99 • 최대 500명 사용자
                  </p>
                </div>
              </div>

              <div className="border-t dark:border-purple-500/20 light:border-purple-300/40 pt-6">
                <h3 className="text-lg font-semibold dark:text-white/90 light:text-purple-900 mb-4">
                  청구 내역
                </h3>
                <button className="w-full px-6 py-3 dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700 rounded-xl font-medium dark:hover:bg-purple-500/30 light:hover:bg-purple-200 transition-all">
                  청구 내역 보기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
