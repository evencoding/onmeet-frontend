import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight, KeyRound, AlertTriangle } from "lucide-react";
import AuthLayout from "@/shared/components/AuthLayout";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { useChangePasswordMutation } from "@/features/auth/hooks";
import { useAuth } from "@/features/auth/context";
import type { ErrorResponse } from "@/features/auth/api";

export default function PasswordReset() {
  useDocumentTitle("비밀번호 변경 - OnMeet");
  const { user } = useAuth();
  const changePasswordMutation = useChangePasswordMutation();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!oldPassword || !newPassword || !newPasswordConfirm) {
      setError("모든 필드를 입력해주세요");
      return;
    }
    if (newPassword.length < 8) {
      setError("새 비밀번호는 8자 이상이어야 합니다");
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/.test(newPassword)) {
      setError("비밀번호는 영문, 숫자, 특수문자(@$!%*#?&)를 포함해야 합니다");
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setError("새 비밀번호가 일치하지 않습니다");
      return;
    }

    changePasswordMutation.mutate(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
          setSuccess("비밀번호가 변경되었습니다. 잠시 후 이동합니다...");
          setOldPassword("");
          setNewPassword("");
          setNewPasswordConfirm("");
        },
        onError: (err: unknown) => {
          const apiError = err as ErrorResponse;
          setError(apiError?.message || "비밀번호 변경에 실패했습니다");
        },
      },
    );
  };

  return (
    <AuthLayout subtitle="비밀번호를 변경해주세요" colorTheme="purple">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl font-bold text-white">비밀번호 변경</h2>
          <KeyRound className="w-5 h-5 text-purple-400" />
        </div>
      </motion.div>

      <motion.div
        className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg backdrop-blur-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-yellow-200">
            임시 비밀번호로 로그인하셨습니다. 계속 사용하려면 새 비밀번호를 설정해주세요.
          </p>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm"
        >
          <p className="text-sm text-red-300 font-medium">{error}</p>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg backdrop-blur-sm"
        >
          <p className="text-sm text-green-300 font-medium">{success}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {user && (
          <motion.div
            className="text-sm text-white/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {user.email}
          </motion.div>
        )}

        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.55 }}
        >
          <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-400" />
            현재 비밀번호 (임시 비밀번호)
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="임시 비밀번호를 입력하세요"
            className="w-full px-4 py-3 border border-purple-500/30 rounded-xl bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 text-white placeholder-white/40"
          />
        </motion.div>

        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-400" />
            새 비밀번호
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="8자 이상, 영문+숫자+특수문자"
            className="w-full px-4 py-3 border border-purple-500/30 rounded-xl bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 text-white placeholder-white/40"
          />
        </motion.div>

        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.65 }}
        >
          <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
            <Lock className="w-4 h-4 text-purple-400" />
            새 비밀번호 확인
          </label>
          <input
            type="password"
            value={newPasswordConfirm}
            onChange={(e) => setNewPasswordConfirm(e.target.value)}
            placeholder="새 비밀번호를 다시 입력"
            className="w-full px-4 py-3 border border-purple-500/30 rounded-xl bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 text-white placeholder-white/40"
          />
        </motion.div>

        <motion.button
          type="submit"
          disabled={changePasswordMutation.isPending}
          className="w-full px-6 py-3 mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {changePasswordMutation.isPending ? "변경 중..." : "비밀번호 변경"}
          {!changePasswordMutation.isPending && <ArrowRight className="w-4 h-4" />}
        </motion.button>
      </form>
    </AuthLayout>
  );
}
