import { AlertTriangle } from "lucide-react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletePassword: string;
  setDeletePassword: (value: string) => void;
  deleteError: string;
  onDelete: () => void;
  isPending: boolean;
}

export default function DeleteAccountModal({
  isOpen,
  onClose,
  deletePassword,
  setDeletePassword,
  deleteError,
  onDelete,
  isPending,
}: DeleteAccountModalProps) {
  if (!isOpen) return null;

  return (
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
            onClick={onClose}
            className="w-full px-4 py-3 dark:bg-purple-500/20 light:bg-purple-100 dark:text-white light:text-purple-700 rounded-xl font-medium dark:hover:bg-purple-500/30 light:hover:bg-purple-200 transition-all"
          >
            취소
          </button>
          <button
            onClick={onDelete}
            disabled={isPending}
            className="w-full px-4 py-3 dark:bg-red-600 light:bg-red-600 dark:text-white light:text-white rounded-xl font-medium dark:hover:bg-red-700 light:hover:bg-red-700 transition-all disabled:opacity-50"
          >
            {isPending ? "삭제 중..." : "계정 삭제하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
