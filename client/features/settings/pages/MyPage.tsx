import React, { useState, useEffect } from "react";
import { User, Settings, Building2 } from "lucide-react";
import { useAuth } from "@/features/auth/context";
import { useNavigate } from "react-router-dom";
import { useUpdateProfile, useWithdraw, useChangePasswordMutation, useCreateTeam } from "@/features/auth/hooks";
import {
  useNotificationSettings,
  useUpdateNotificationSettings,
} from "@/features/notification/hooks";
import type { NotificationSettingDto } from "@/features/notification/api";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { useProfileImage } from "@/shared/hooks/useProfileImage";
import { getErrorMessage } from "@/shared/utils/apiFetch";
import ProfileTab from "@/features/settings/components/ProfileTab";
import SettingsTab from "@/features/settings/components/SettingsTab";
import DeleteAccountModal from "@/features/settings/components/DeleteAccountModal";

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
  const { data: profileImageUrl } = useProfileImage(user?.profileImageId);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    position: user?.jobTitle?.name || "",
    avatar: profileImageUrl || "",
  });

  useEffect(() => {
    if (profileImageUrl) {
      setFormData((prev) => ({ ...prev, avatar: profileImageUrl }));
    }
  }, [profileImageUrl]);

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
          setPasswordError(getErrorMessage(err, "비밀번호 변경에 실패했습니다."));
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
          setDeleteError(getErrorMessage(err, "계정 삭제에 실패했습니다."));
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
          <ProfileTab
            formData={formData}
            editMode={editMode}
            setEditMode={setEditMode}
            handleInputChange={handleInputChange}
            handleImageChange={handleImageChange}
            handleSave={handleSave}
            updateProfileIsPending={updateProfileMutation.isPending}
            teams={user?.teams}
            showCreateTeam={showCreateTeam}
            setShowCreateTeam={setShowCreateTeam}
            newTeamName={newTeamName}
            setNewTeamName={setNewTeamName}
            handleCreateTeam={handleCreateTeam}
            createTeamIsPending={createTeamMutation.isPending}
            showPasswordSection={showPasswordSection}
            setShowPasswordSection={setShowPasswordSection}
            passwordForm={passwordForm}
            setPasswordForm={setPasswordForm}
            showPasswords={showPasswords}
            setShowPasswords={setShowPasswords}
            passwordError={passwordError}
            passwordSuccess={passwordSuccess}
            setPasswordError={setPasswordError}
            setPasswordSuccess={setPasswordSuccess}
            handlePasswordChange={handlePasswordChange}
            changePasswordIsPending={changePasswordMutation.isPending}
          />
        )}

        {activeTab === "settings" && (
          <SettingsTab
            settingItems={settingItems}
            notiSettings={notiSettings}
            onToggleSetting={handleToggleSetting}
            onGoToPasswordSection={() => {
              setActiveTab("profile");
              setTimeout(() => setShowPasswordSection(true), 100);
            }}
            onOpenDeleteModal={() => setShowDeleteModal(true)}
          />
        )}

        <DeleteAccountModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletePassword("");
            setDeleteError("");
          }}
          deletePassword={deletePassword}
          setDeletePassword={setDeletePassword}
          deleteError={deleteError}
          onDelete={handleDeleteAccount}
          isPending={withdrawMutation.isPending}
        />
      </div>
    </>
  );
}
