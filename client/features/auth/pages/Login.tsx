import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { motion } from "framer-motion";
import { useLogin } from "@/features/auth/hooks";
import { login as loginApi, changePassword, type ErrorResponse } from "@/features/auth/api";
import { Mail, Lock, ArrowRight, Sparkles, KeyRound, ArrowLeft } from "lucide-react";
import AuthLayout from "@/shared/components/AuthLayout";

export default function Login() {
  useDocumentTitle("로그인 - OnMeet");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const isLoading = loginMutation.isPending;

  // Password change states
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [pwEmail, setPwEmail] = useState("");
  const [pwOldPassword, setPwOldPassword] = useState("");
  const [pwNewPassword, setPwNewPassword] = useState("");
  const [pwNewPasswordConfirm, setPwNewPasswordConfirm] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요");
      return;
    }
    if (!email.includes("@")) {
      setError("올바른 이메일 형식을 입력해주세요");
      return;
    }

    loginMutation.mutate(
      { email, password, rememberMe },
      {
        onSuccess: () => navigate("/"),
        onError: (err: unknown) => {
          const apiError = err as ErrorResponse;
          setError(apiError?.message || "로그인에 실패했습니다");
        },
      },
    );
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (!pwEmail || !pwOldPassword || !pwNewPassword || !pwNewPasswordConfirm) {
      setPwError("모든 필드를 입력해주세요");
      return;
    }
    if (!pwEmail.includes("@")) {
      setPwError("올바른 이메일 형식을 입력해주세요");
      return;
    }
    if (pwNewPassword.length < 8) {
      setPwError("새 비밀번호는 8자 이상이어야 합니다");
      return;
    }
    if (pwNewPassword !== pwNewPasswordConfirm) {
      setPwError("새 비밀번호가 일치하지 않습니다");
      return;
    }

    setPwLoading(true);
    try {
      await loginApi({ email: pwEmail, password: pwOldPassword });
      await changePassword({ oldPassword: pwOldPassword, newPassword: pwNewPassword });
      setPwSuccess("비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.");
      setPwOldPassword("");
      setPwNewPassword("");
      setPwNewPasswordConfirm("");
      setTimeout(() => {
        setShowPasswordChange(false);
        setPwSuccess("");
      }, 2000);
    } catch (err: unknown) {
      const apiError = err as ErrorResponse;
      setPwError(apiError?.message || "비밀번호 변경에 실패했습니다");
    } finally {
      setPwLoading(false);
    }
  };

  const switchToPasswordChange = () => {
    setShowPasswordChange(true);
    setError("");
    setPwError("");
    setPwSuccess("");
    setPwEmail(email);
    setPwOldPassword("");
    setPwNewPassword("");
    setPwNewPasswordConfirm("");
  };

  const switchToLogin = () => {
    setShowPasswordChange(false);
    setPwError("");
    setPwSuccess("");
  };

  if (showPasswordChange) {
    return (
      <AuthLayout subtitle="회의에만 집중하세요, 기록은 AI가" colorTheme="purple">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-white">비밀번호 변경</h2>
            <KeyRound className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-white/60 mb-6">새로운 비밀번호를 설정하세요</p>
        </motion.div>

        {pwError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm"
          >
            <p className="text-sm text-red-300 font-medium">{pwError}</p>
          </motion.div>
        )}

        {pwSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg backdrop-blur-sm"
          >
            <p className="text-sm text-green-300 font-medium">{pwSuccess}</p>
          </motion.div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-400" />
              이메일
            </label>
            <input
              type="email"
              value={pwEmail}
              onChange={(e) => setPwEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-purple-500/30 rounded-xl bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 text-white placeholder-white/40"
            />
          </motion.div>

          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
          >
            <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              현재 비밀번호
            </label>
            <input
              type="password"
              value={pwOldPassword}
              onChange={(e) => setPwOldPassword(e.target.value)}
              placeholder="••••••••"
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
              value={pwNewPassword}
              onChange={(e) => setPwNewPassword(e.target.value)}
              placeholder="8자 이상 입력"
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
              value={pwNewPasswordConfirm}
              onChange={(e) => setPwNewPasswordConfirm(e.target.value)}
              placeholder="새 비밀번호를 다시 입력"
              className="w-full px-4 py-3 border border-purple-500/30 rounded-xl bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 text-white placeholder-white/40"
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={pwLoading}
            className="w-full px-6 py-3 mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {pwLoading ? "변경 중..." : "비밀번호 변경"}
            {!pwLoading && <ArrowRight className="w-4 h-4" />}
          </motion.button>
        </form>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={switchToLogin}
            className="flex items-center gap-2 text-sm text-purple-300 font-semibold hover:text-pink-300 transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            로그인으로 돌아가기
          </button>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout subtitle="회의에만 집중하세요, 기록은 AI가" colorTheme="purple">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl font-bold text-white">로그인</h2>
          <Sparkles className="w-5 h-5 text-purple-400" />
        </div>
        <p className="text-white/60 mb-6">계정으로 로그인하세요</p>
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

      <form onSubmit={handleSubmit} className="space-y-4">

        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
            <Mail className="w-4 h-4 text-purple-400" />
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
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
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-purple-500/30 rounded-xl bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 text-white placeholder-white/40"
          />
        </motion.div>

        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.65 }}
        >
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-purple-500/30 bg-white/5 text-purple-600 focus:ring-purple-500/30 focus:ring-offset-0 cursor-pointer"
          />
          <label htmlFor="rememberMe" className="text-sm text-white/70 cursor-pointer select-none">
            자동 로그인
          </label>
        </motion.div>

        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full px-6 py-3 mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {isLoading ? "로그인 중..." : "로그인"}
          {!isLoading && <ArrowRight className="w-4 h-4" />}
        </motion.button>
      </form>

      <motion.div
        className="my-6 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex-1 h-px bg-purple-500/20"></div>
        <span className="text-xs text-white/40">또는</span>
        <div className="flex-1 h-px bg-purple-500/20"></div>
      </motion.div>

      <motion.div
        className="text-center space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <p className="text-sm text-white/70">
          계정이 없으신가요?{" "}
          <Link
            to="/signup"
            className="text-purple-300 font-semibold hover:text-pink-300 transition-colors"
          >
            가입하기
          </Link>
        </p>
        <p className="text-sm text-white/70">
          <button
            onClick={switchToPasswordChange}
            className="text-purple-300 font-semibold hover:text-pink-300 transition-colors"
          >
            비밀번호 변경
          </button>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
