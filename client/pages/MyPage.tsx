import { useState } from "react";
import Layout from "@/components/Layout";
import { User, Mail, Phone, Settings, Lock, Bell, Building2, Edit2, Save, X, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "settings">("profile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+82 (010) 1234-5678",
    position: "Product Manager",
    team: "마케팅",
    bio: "Meeting enthusiast",
    avatar: user?.avatar || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, avatar: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    setEditMode(false);
    // API call would go here
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Layout showRecentPanel={false}>
      <div className="max-w-4xl space-y-6">
        {/* Tabs */}
        <div className="flex items-center justify-between border-b dark:border-purple-500/20 light:border-purple-300/40">
          <div className="flex gap-2">
            {[
              { id: "profile" as const, label: "프로필", icon: User },
              { id: "settings" as const, label: "설정 및 보안", icon: Settings },
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
          <button
            onClick={() => navigate("/company")}
            className="flex items-center gap-2 px-4 py-2 dark:bg-purple-600 light:bg-purple-600 text-white rounded-lg font-medium hover:dark:bg-purple-700 hover:light:bg-purple-700 transition-all whitespace-nowrap"
          >
            <Building2 className="w-4 h-4" />
            회사 관리
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-sm p-8">
            <div className="flex gap-8">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center gap-3 flex-shrink-0">
                <div className="relative">
                  <img
                    src={formData.avatar}
                    alt={formData.name}
                    className="w-24 h-24 rounded-full object-cover border-4 dark:border-purple-500/30 light:border-purple-300/50"
                  />
                  {editMode && (
                    <label className="absolute bottom-0 right-0 p-1.5 dark:bg-purple-600 light:bg-purple-600 text-white rounded-full cursor-pointer hover:dark:bg-purple-700 hover:light:bg-purple-700 transition-all">
                      <Edit2 className="w-3 h-3" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
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
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
                  이름
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
                <p className="text-lg dark:text-white/70 light:text-purple-700">{formData.email}</p>
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

              {/* Position */}
              <div>
                <label className="block text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
                  직급
                </label>
                {editMode ? (
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border dark:border-purple-500/30 light:border-purple-300/50 rounded-xl dark:bg-purple-500/10 light:bg-purple-50 dark:text-white light:text-purple-900 focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/30 transition-all"
                  />
                ) : (
                  <p className="text-lg dark:text-white/70 light:text-purple-700">{formData.position}</p>
                )}
              </div>

              {/* Team */}
              <div>
                <label className="block text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
                  소속 팀
                </label>
                {editMode ? (
                  <input
                    type="text"
                    name="team"
                    value={formData.team}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border dark:border-purple-500/30 light:border-purple-300/50 rounded-xl dark:bg-purple-500/10 light:bg-purple-50 dark:text-white light:text-purple-900 focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/30 transition-all"
                  />
                ) : (
                  <p className="text-lg dark:text-white/70 light:text-purple-700">{formData.team}</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
                  소개
                </label>
                {editMode ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border dark:border-purple-500/30 light:border-purple-300/50 rounded-xl dark:bg-purple-500/10 light:bg-purple-50 dark:text-white light:text-purple-900 focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/30 transition-all"
                  />
                ) : (
                  <p className="text-lg dark:text-white/70 light:text-purple-700">{formData.bio}</p>
                )}
              </div>

              </div>

              {/* Save/Cancel Buttons - Only show in edit mode */}
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
                    onClick={() => setEditMode(false)}
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

        {/* Settings & Security Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            {/* Notification Settings */}
            <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 dark:text-purple-400 light:text-purple-600" />
                <h3 className="text-lg font-semibold dark:text-white/90 light:text-purple-900">
                  알림 설정
                </h3>
              </div>
              <div className="space-y-4">
                {[
                  { label: "회의 알림", description: "새로운 회의 초대 및 변경사항" },
                  { label: "회의록 완성 알림", description: "회의 녹음 및 회의록 완성 알림" },
                  { label: "팀 알림", description: "팀 멤버 추가, 팀 설정 변경" },
                ].map((notification, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 dark:bg-purple-500/10 light:bg-purple-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium dark:text-white light:text-purple-900">
                        {notification.label}
                      </p>
                      <p className="text-sm dark:text-white/50 light:text-purple-600">
                        {notification.description}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 dark:bg-purple-500/30 light:bg-purple-200 peer-focus:outline-none rounded-full peer dark:peer-checked:bg-purple-600 light:peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Password Change */}
            <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 dark:text-purple-400 light:text-purple-600" />
                <h3 className="text-lg font-semibold dark:text-white/90 light:text-purple-900">
                  계정 보안
                </h3>
              </div>
              <button className="w-full px-6 py-3 dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700 rounded-xl font-medium dark:hover:bg-purple-500/30 light:hover:bg-purple-200 transition-all">
                비밀번호 변경
              </button>
            </div>

            {/* Account Deletion */}
            <div className="dark:bg-gradient-to-br dark:from-red-900/20 dark:via-black/80 dark:to-red-900/10 light:bg-red-50 dark:border dark:border-red-500/20 light:border light:border-red-300/40 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="w-6 h-6 dark:text-red-400 light:text-red-600" />
                <h3 className="text-lg font-semibold dark:text-white/90 light:text-red-900">
                  계정 삭제
                </h3>
              </div>
              <p className="dark:text-white/60 light:text-red-700 mb-4 text-sm">
                계정을 삭제하면 모든 데이터가 영구적으로 삭제되며, 복구할 수 없습니다.
              </p>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full px-6 py-3 dark:bg-red-600/30 light:bg-red-100 dark:text-red-300 light:text-red-700 rounded-xl font-medium dark:hover:bg-red-600/40 light:hover:bg-red-200 transition-all"
              >
                계정 삭제하기
              </button>
            </div>
          </div>
        )}

        {/* Account Deletion Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="dark:bg-black/90 light:bg-white dark:border dark:border-red-500/30 light:border light:border-red-300/50 rounded-2xl shadow-2xl max-w-md w-full p-8 dark:backdrop-blur-md">
              <div className="flex items-center justify-center w-12 h-12 rounded-full dark:bg-red-500/20 light:bg-red-100 mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 dark:text-red-400 light:text-red-600" />
              </div>

              <h2 className="text-xl font-bold dark:text-white light:text-red-900 text-center mb-2">
                정말 계정을 삭제하시겠습니까?
              </h2>

              <p className="dark:text-white/60 light:text-red-700 text-center text-sm mb-6">
                이 작업은 되돌릴 수 없습니다. 계정의 모든 데이터가 영구적으로 삭제됩니다.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full px-4 py-3 dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700 rounded-xl font-medium dark:hover:bg-purple-500/30 light:hover:bg-purple-200 transition-all"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    // Handle account deletion
                    logout();
                    navigate("/login");
                  }}
                  className="w-full px-4 py-3 dark:bg-red-600 light:bg-red-600 dark:text-white light:text-white rounded-xl font-medium dark:hover:bg-red-700 light:hover:bg-red-700 transition-all"
                >
                  계정 삭제하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
