import { Bell, Lock, AlertTriangle } from "lucide-react";
import type { NotificationSettingDto } from "@/features/notification/api";

interface SettingsTabProps {
  settingItems: { key: keyof NotificationSettingDto; label: string; description: string }[];
  notiSettings: NotificationSettingDto | undefined;
  onToggleSetting: (key: keyof NotificationSettingDto) => void;
  onGoToPasswordSection: () => void;
  onOpenDeleteModal: () => void;
}

export default function SettingsTab({
  settingItems,
  notiSettings,
  onToggleSetting,
  onGoToPasswordSection,
  onOpenDeleteModal,
}: SettingsTabProps) {
  return (
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
                  onChange={() => onToggleSetting(item.key)}
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
          onClick={onGoToPasswordSection}
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
          onClick={onOpenDeleteModal}
          className="w-full px-6 py-3 dark:bg-red-600/30 light:bg-red-100 dark:text-red-300 light:text-red-700 rounded-xl font-medium dark:hover:bg-red-600/40 light:hover:bg-red-200 transition-all"
        >
          계정 삭제하기
        </button>
      </div>
    </div>
  );
}
