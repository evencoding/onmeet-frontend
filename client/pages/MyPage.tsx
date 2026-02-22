import { useState } from "react";
import Layout from "@/components/Layout";
import { User, Mail, Phone, MapPin, LogOut, Settings, Lock, Bell } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "settings" | "security">("profile");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+82 (010) 1234-5678",
    location: "Seoul, South Korea",
    bio: "Product Manager | Meeting enthusiast",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        {/* Profile Header */}
        <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-sm p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-24 h-24 rounded-full object-cover border-4 dark:border-purple-500/30 light:border-purple-300/50"
              />
              <div>
                <h1 className="text-3xl font-bold dark:text-white/90 light:text-purple-900 mb-2">
                  {user?.name}
                </h1>
                <p className="dark:text-white/60 light:text-purple-600">Premium Member</p>
              </div>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 dark:bg-purple-600 light:bg-purple-600 text-white rounded-xl font-medium hover:dark:bg-purple-700 hover:light:bg-purple-700 transition-all"
            >
              {editMode ? "취소" : "정보 수정"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b dark:border-purple-500/20 light:border-purple-300/40">
          {[
            { id: "profile" as const, label: "프로필", icon: User },
            { id: "settings" as const, label: "설정", icon: Settings },
            { id: "security" as const, label: "보안", icon: Lock },
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

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-sm p-8">
            <div className="space-y-6">
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

              {/* Save Button */}
              {editMode && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex-1 px-6 py-3 dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700 rounded-xl font-medium dark:hover:bg-purple-500/30 light:hover:bg-purple-200 transition-all"
                  >
                    취소
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-sm p-8">
            <div className="space-y-4">
              {[
                { icon: Bell, title: "알림 설정", description: "회의 알림 및 메시지 설정" },
                { icon: Settings, title: "개인 설정", description: "언어, 테마 및 기타 설정" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 dark:bg-purple-500/10 light:bg-purple-50 rounded-2xl"
                  >
                    <div className="flex items-center gap-4">
                      <Icon className="w-6 h-6 dark:text-purple-400 light:text-purple-600" />
                      <div>
                        <p className="font-semibold dark:text-white/90 light:text-purple-900">
                          {item.title}
                        </p>
                        <p className="text-sm dark:text-white/50 light:text-purple-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 dark:bg-purple-600 light:bg-purple-600 text-white rounded-lg hover:dark:bg-purple-700 hover:light:bg-purple-700 transition-all">
                      설정
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-sm p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold dark:text-white/90 light:text-purple-900 mb-4">
                  계정 보안
                </h3>
                <button className="w-full px-6 py-3 dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700 rounded-xl font-medium dark:hover:bg-purple-500/30 light:hover:bg-purple-200 transition-all">
                  비밀번호 변경
                </button>
              </div>

              <div className="border-t dark:border-purple-500/20 light:border-purple-300/40 pt-6">
                <h3 className="text-lg font-semibold dark:text-white/90 light:text-purple-900 mb-4">
                  로그인 세션
                </h3>
                <p className="dark:text-white/60 light:text-purple-700 mb-4">
                  현재 1개의 활성 세션
                </p>
                <button className="w-full px-6 py-3 dark:bg-red-600/20 light:bg-red-100 dark:text-red-300 light:text-red-700 rounded-xl font-medium dark:hover:bg-red-600/30 light:hover:bg-red-200 transition-all">
                  모든 세션에서 로그아웃
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Section */}
        <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-sm p-8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 dark:bg-red-600/20 light:bg-red-100 dark:text-red-300 light:text-red-700 rounded-xl font-semibold hover:dark:bg-red-600/30 hover:light:bg-red-200 transition-all"
          >
            <LogOut className="w-5 h-5" />
            로그아웃
          </button>
        </div>
      </div>
    </Layout>
  );
}
