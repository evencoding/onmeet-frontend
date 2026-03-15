import React from "react";
import { Mail, Lock, Edit2, Save, X, Eye, EyeOff, Plus, Check, Loader2, Users } from "lucide-react";

interface Team {
  id: number;
  name: string;
  color?: string;
  status?: string;
}

interface ProfileTabProps {
  formData: {
    name: string;
    email: string;
    position: string;
    avatar: string;
  };
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  updateProfileIsPending: boolean;
  teams?: Team[];
  showCreateTeam: boolean;
  setShowCreateTeam: (value: boolean) => void;
  newTeamName: string;
  setNewTeamName: (value: string) => void;
  handleCreateTeam: () => void;
  createTeamIsPending: boolean;
  showPasswordSection: boolean;
  setShowPasswordSection: (value: boolean) => void;
  passwordForm: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  setPasswordForm: React.Dispatch<React.SetStateAction<{
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>>;
  showPasswords: {
    old: boolean;
    new: boolean;
    confirm: boolean;
  };
  setShowPasswords: React.Dispatch<React.SetStateAction<{
    old: boolean;
    new: boolean;
    confirm: boolean;
  }>>;
  passwordError: string;
  passwordSuccess: string;
  setPasswordError: (value: string) => void;
  setPasswordSuccess: (value: string) => void;
  handlePasswordChange: () => void;
  changePasswordIsPending: boolean;
}

export default function ProfileTab({
  formData,
  editMode,
  setEditMode,
  handleInputChange,
  handleImageChange,
  handleSave,
  updateProfileIsPending,
  teams,
  showCreateTeam,
  setShowCreateTeam,
  newTeamName,
  setNewTeamName,
  handleCreateTeam,
  createTeamIsPending,
  showPasswordSection,
  setShowPasswordSection,
  passwordForm,
  setPasswordForm,
  showPasswords,
  setShowPasswords,
  passwordError,
  passwordSuccess,
  setPasswordError,
  setPasswordSuccess,
  handlePasswordChange,
  changePasswordIsPending,
}: ProfileTabProps) {
  return (
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
            {teams && teams.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {teams.map((t) => (
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
                  disabled={createTeamIsPending || !newTeamName.trim()}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-medium hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                >
                  {createTeamIsPending ? (
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
                    disabled={changePasswordIsPending}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50"
                  >
                    {changePasswordIsPending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    {changePasswordIsPending ? "변경 중..." : "비밀번호 변경"}
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
                disabled={updateProfileIsPending}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {updateProfileIsPending ? "저장 중..." : "저장"}
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
  );
}
