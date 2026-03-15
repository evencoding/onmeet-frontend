import React, { useState } from "react";
import { User, Mail, Phone, Settings, Lock, Bell, Building2, Edit2, Save, X, AlertTriangle, Eye, EyeOff, Plus, Check, Loader2, Users } from "lucide-react";
import { useAuth } from "@/features/auth/context";
import { useNavigate } from "react-router-dom";
import { useUpdateProfile, useWithdraw, useChangePasswordMutation, useCreateTeam } from "@/features/auth/hooks";
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from "@/features/notification/hooks";
import type { NotificationSettingDto } from "@/features/notification/api";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

export default function MyPage() {
  useDocumentTitle("설정 - OnMeet");
  const { user, logout, isManager } = useAuth();
  const navigate = useNavigate();
  const { data: notiSettings } = useNotificationSettings(user?.id ?? 0);
  const updateSettingsMutation = useUpdateNotificationSettings();
  const updateProfileMutation = useUpdateProfile();
  const withdrawMutation = useWithdraw();
  const changePasswordMutation = useChangePasswordMutation();
  const createTeamMutation = useCreateTeam();

  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return;
    createTeamMutation.mutate(
      { name: newTeamName.trim() },
      {
        onSuccess: () => {
          setNewTeamName("");
          setShowCreateTeam(false);
        },
      },
    );
  };

  const settingItems: { key: keyof NotificationSettingDto; label: string; description: string }[] = [
    { key: "pushEnabled", label: "푸시 알림", description: "전체 푸시 알림 활성화" },
    { key: "meetingInviteNotification", label: "회의 초대 알림", description: "새로운 회의 초대 알림" },
    { key: "meetingStartNotification", label: "회의 시작 알림", description: "회의 시작 시 알림" },
    { key: "meetingRemindNotification", label: "회의 리마인더", description: "예정된 회의 리마인더 알림" },
    { key: "minutesCompletedNotification", label: "회의록 완성 알림", description: "회의록 완성 시 알림" },
    { key: "systemNoticeNotification", label: "시스템 알림", description: "시스템 공지 및 업데이트" },
    { key: "doNotDisturbEnabled", label: "방해금지 모드", description: "특정 시간대 알림 무음" },
  ];

  const handleToggleSetting = (key: keyof NotificationSettingDto) => {
    if (!user || !notiSettings) return;
    updateSettingsMutation.mutate({
      userId: user.id,
      data: { ...notiSettings, [key]: !notiSettings[key] },
    });
  };
  const [activeTab, setActiveTab] = useState<"profile" | "settings">("profile");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [profileImage, setProfileImage] = useState<File | undefined>();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    position: user?.jobTitle?.name || "",
    avatar: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, avatar: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateProfileMutation.mutate(
      {
        data: { name: formData.name },
        profileImage,
      },
      {
        onSuccess: () => {
          setEditMode(false);
          setProfileImage(undefined);
        },
      },
    );
  };

  const handlePasswordChange = () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("모든 항목을 입력해주세요.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("새 비밀번호는 8자 이상이어야 합니다.");
      return;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/.test(passwordForm.newPassword)) {
      setPasswordError("비밀번호는 영문, 숫자, 특수문자(@$!%*#?&)를 포함해야 합니다.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    changePasswordMutation.mutate(
      {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      },
      {
        onSuccess: () => {
          setPasswordSuccess("비밀번호가 변경되었습니다.");
          setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
          setTimeout(() => {
            setShowPasswordSection(false);
            setPasswordSuccess("");
          }, 2000);
        },
        onError: (err: unknown) => {
          const error = err as { message?: string };
          setPasswordError(error.message || "비밀번호 변경에 실패했습니다.");
        },
      },
    );
  };

  const handleDeleteAccount = () => {
    if (!deletePassword) {
      setDeleteError("비밀번호를 입력해주세요.");
      return;
    }
    withdrawMutation.mutate(
      { password: deletePassword },
      {
        onSuccess: async () => {
          await logout();
          navigate("/login");
        },
        onError: (err: unknown) => {
          const error = err as { message?: string };
          setDeleteError(error.message || "계정 삭제에 실패했습니다.");
        },
      },
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <div className="max-w-4xl space-y-6">

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
          {isManager && (
            <button
              onClick={() => navigate("/company")}
              className="flex items-center gap-2 px-4 py-2 dark:bg-purple-600 light:bg-purple-600 text-white rounded-lg font-medium hover:dark:bg-purple-700 hover:light:bg-purple-700 transition-all whitespace-nowrap"
            >
              <Building2 className="w-4 h-4" />
              회사 관리
            </button>
          )}
        </div>

        {activeTab === "profile" && (
          <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-gradient-to-br light:from-white light:via-purple-50/40 light:to-pink-100/30 dark:border dark:border-purple-500/30 light:border-2 light:border-purple-300/70 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-md light:shadow-xl light:shadow-purple-300/30 p-8">
            <div className="flex gap-8">

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

              <div className="flex-1 space-y-6">

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
                      className="w-full px-4 py-3 dark:border dark:border-purple-500/30 light:border-2 light:border-purple-400/50 rounded-xl dark:bg-purple-500/10 light:bg-white light:shadow-md light:shadow-purple-200/20 dark:text-white light:text-purple-900 focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/40 transition-all"
                    />
                  ) : (
                    <p className="text-lg dark:text-white/70 light:text-purple-700">{formData.name}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
                    <Mail className="w-4 h-4" />
                    이메일
                  </label>
                  <p className="text-lg dark:text-white/70 light:text-purple-700">{formData.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
                    직급
                  </label>
                  <p className="text-lg dark:text-white/70 light:text-purple-700">{formData.position || "-"}</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold dark:text-white/90 light:text-purple-900 mb-2">
                    <Users className="w-4 h-4" />
                    소속 팀
                  </label>
                  {user?.teams && user.teams.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {user.teams.map((t) => (
                        <span
                          key={t.id}
                          className="inline-flex items-center gap-2 px-3 py-1.5 dark:bg-purple-500/20 light:bg-purple-100 dark:text-purple-300 light:text-purple-700 rounded-lg text-sm font-medium"
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: t.color || "#a855f7" }}
                          />
                          {t.name}
                          {t.status === "PENDING" && (
                            <span className="text-xs dark:text-yellow-400 light:text-yellow-600">(승인 대기)</span>
                          )}
                        </span>
                      ))}
                    </div>
                  ) : !showCreateTeam ? (
                    <div className="flex items-center gap-3">
                      <p className="dark:text-white/40 light:text-purple-400 text-sm">소속된 팀이 없습니다.</p>
                      <button
                        onClick={() => setShowCreateTeam(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm dark:bg-purple-500/20 light:bg-purple-100 dark:text-purple-300 light:text-purple-600 rounded-lg font-medium hover:dark:bg-purple-500/30 hover:light:bg-purple-200 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        팀 만들기
                      </button>
                    </div>
                  ) : null}
                  {showCreateTeam && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        placeholder="새 팀 이름"
                        className="flex-1 px-4 py-2 dark:border dark:border-purple-500/30 light:border-2 light:border-purple-400/50 rounded-xl dark:bg-purple-500/10 light:bg-white dark:text-white light:text-purple-900 text-sm focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/40 transition-all"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleCreateTeam();
                        }}
                      />
                      <button
                        onClick={handleCreateTeam}
                        disabled={createTeamMutation.isPending || !newTeamName.trim()}
                        className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                      >
                        {createTeamMutation.isPending ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        생성
                      </button>
                      <button
                        onClick={() => { setShowCreateTeam(false); setNewTeamName(""); }}
                        className="flex items-center gap-1.5 px-3 py-2 dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700 rounded-xl text-sm font-medium hover:dark:bg-purple-500/30 hover:light:bg-purple-200 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t dark:border-purple-500/20 light:border-purple-300/40">
                  <button
                    onClick={() => {
                      setShowPasswordSection(!showPasswordSection);
                      setPasswordError("");
                      setPasswordSuccess("");
                      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
                    }}
                    className="flex items-center gap-2 text-sm font-semibold dark:text-purple-400 light:text-purple-600 hover:dark:text-purple-300 hover:light:text-purple-700 transition-all"
                  >
                    <Lock className="w-4 h-4" />
                    비밀번호 변경
                  </button>

                  {showPasswordSection && (
                    <div className="mt-4 space-y-4">
                      {[
                        { key: "old" as const, name: "oldPassword" as const, label: "현재 비밀번호", placeholder: "현재 비밀번호를 입력하세요" },
                        { key: "new" as const, name: "newPassword" as const, label: "새 비밀번호", placeholder: "새 비밀번호를 입력하세요 (8자 이상)" },
                        { key: "confirm" as const, name: "confirmPassword" as const, label: "새 비밀번호 확인", placeholder: "새 비밀번호를 다시 입력하세요" },
                      ].map((field) => (
                        <div key={field.key}>
                          <label className="block text-sm font-medium dark:text-white/70 light:text-purple-800 mb-1.5">
                            {field.label}
                          </label>
                          <div className="relative">
                            <input
                              type={showPasswords[field.key] ? "text" : "password"}
                              value={passwordForm[field.name]}
                              onChange={(e) =>
                                setPasswordForm((prev) => ({ ...prev, [field.name]: e.target.value }))
                              }
                              placeholder={field.placeholder}
                              className="w-full px-4 py-3 pr-12 dark:border dark:border-purple-500/30 light:border-2 light:border-purple-400/50 rounded-xl dark:bg-purple-500/10 light:bg-white light:shadow-md light:shadow-purple-200/20 dark:text-white light:text-purple-900 focus:border-purple-400 focus:ring-2 dark:focus:ring-purple-500/20 light:focus:ring-purple-300/40 transition-all placeholder:dark:text-white/30 placeholder:light:text-purple-400"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPasswords((prev) => ({ ...prev, [field.key]: !prev[field.key] }))
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-white/40 light:text-purple-400 hover:dark:text-white/70 hover:light:text-purple-600 transition-all"
                            >
                              {showPasswords[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      ))}

                      {passwordError && (
                        <p className="text-sm text-red-400">{passwordError}</p>
                      )}
                      {passwordSuccess && (
                        <p className="text-sm text-green-400">{passwordSuccess}</p>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={handlePasswordChange}
                          disabled={changePasswordMutation.isPending}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50"
                        >
                          {changePasswordMutation.isPending ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                          {changePasswordMutation.isPending ? "변경 중..." : "비밀번호 변경"}
                        </button>
                        <button
                          onClick={() => setShowPasswordSection(false)}
                          className="px-6 py-3 dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700 rounded-xl font-medium dark:hover:bg-purple-500/30 light:hover:bg-purple-200 transition-all"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {editMode && (
                  <div className="flex gap-3 pt-6">
                    <button
                      onClick={handleSave}
                      disabled={updateProfileMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {updateProfileMutation.isPending ? "저장 중..." : "저장"}
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
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">

            <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-gradient-to-br light:from-white light:via-purple-50/40 light:to-pink-100/20 dark:border dark:border-purple-500/30 light:border-2 light:border-purple-300/70 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-md light:shadow-xl light:shadow-purple-300/30 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Bell className="w-6 h-6 dark:text-purple-400 light:text-purple-600" />
                <h3 className="text-lg font-semibold dark:text-white/90 light:text-purple-900">
                  알림 설정
                </h3>
              </div>
              <div className="space-y-4">
                {settingItems.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 dark:bg-purple-500/10 light:bg-purple-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium dark:text-white light:text-purple-900">
                        {item.label}
                      </p>
                      <p className="text-sm dark:text-white/50 light:text-purple-600">
                        {item.description}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!notiSettings?.[item.key]}
                        onChange={() => handleToggleSetting(item.key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 dark:bg-purple-500/30 light:bg-purple-200 peer-focus:outline-none rounded-full peer dark:peer-checked:bg-purple-600 light:peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/80 dark:to-pink-900/30 light:bg-gradient-to-br light:from-white light:via-purple-50/40 light:to-pink-100/20 dark:border dark:border-purple-500/30 light:border-2 light:border-purple-300/70 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-md light:shadow-xl light:shadow-purple-300/30 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 dark:text-purple-400 light:text-purple-600" />
                <h3 className="text-lg font-semibold dark:text-white/90 light:text-purple-900">
                  계정 보안
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveTab("profile");
                  setTimeout(() => setShowPasswordSection(true), 100);
                }}
                className="w-full px-6 py-3 dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700 rounded-xl font-medium dark:hover:bg-purple-500/30 light:hover:bg-purple-200 transition-all"
              >
                비밀번호 변경
              </button>
            </div>

            <div className="dark:bg-gradient-to-br dark:from-red-900/20 dark:via-black/80 dark:to-red-900/10 light:bg-gradient-to-br light:from-white light:via-red-50/40 light:to-pink-100/20 dark:border dark:border-red-500/20 light:border-2 light:border-red-300/60 rounded-3xl dark:backdrop-blur-md light:backdrop-blur-md light:shadow-xl light:shadow-red-200/30 p-8">
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

        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="dark:bg-black/90 light:bg-gradient-to-br light:from-white light:to-red-50/30 dark:border dark:border-red-500/30 light:border-2 light:border-red-300/60 rounded-2xl shadow-2xl max-w-md w-full p-8 dark:backdrop-blur-md light:backdrop-blur-md light:shadow-xl light:shadow-red-200/30">
              <div className="flex items-center justify-center w-12 h-12 rounded-full dark:bg-red-500/20 light:bg-red-100 mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 dark:text-red-400 light:text-red-600" />
              </div>

              <h2 className="text-xl font-bold dark:text-white light:text-red-900 text-center mb-2">
                정말 계정을 삭제하시겠습니까?
              </h2>

              <p className="dark:text-white/60 light:text-red-700 text-center text-sm mb-6">
                이 작업은 되돌릴 수 없습니다. 계정의 모든 데이터가 영구적으로 삭제됩니다.
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium dark:text-white/70 light:text-red-800 mb-1.5">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full px-4 py-3 dark:border dark:border-red-500/30 light:border-2 light:border-red-400/50 rounded-xl dark:bg-red-500/10 light:bg-white dark:text-white light:text-red-900 focus:border-red-400 focus:ring-2 dark:focus:ring-red-500/20 light:focus:ring-red-300/40 transition-all placeholder:dark:text-white/30 placeholder:light:text-red-400"
                />
                {deleteError && (
                  <p className="text-sm text-red-400 mt-2">{deleteError}</p>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword("");
                    setDeleteError("");
                  }}
                  className="w-full px-4 py-3 dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700 rounded-xl font-medium dark:hover:bg-purple-500/30 light:hover:bg-purple-200 transition-all"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={withdrawMutation.isPending}
                  className="w-full px-4 py-3 dark:bg-red-600 light:bg-red-600 dark:text-white light:text-white rounded-xl font-medium dark:hover:bg-red-700 light:hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {withdrawMutation.isPending ? "삭제 중..." : "계정 삭제하기"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
