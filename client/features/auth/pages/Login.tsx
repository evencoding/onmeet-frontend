import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { motion } from "framer-motion";
import { useLogin, useFindPassword } from "@/features/auth/hooks";
import type { ErrorResponse } from "@/features/auth/api";
import { Mail, Lock, ArrowRight, Sparkles, KeyRound, ArrowLeft } from "lucide-react";
import AuthLayout from "@/shared/components/AuthLayout";

export default function Login() {
  useDocumentTitle("로그인 - OnMeet");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const isLoading = loginMutation.isPending;

  // Find password states
  const [showFindPassword, setShowFindPassword] = useState(false);
  const [fpEmail, setFpEmail] = useState("");
  const [fpError, setFpError] = useState("");
  const [fpSuccess, setFpSuccess] = useState("");
  const findPasswordMutation = useFindPassword();

  const handleSubmit = async (e: FormEvent) => {
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
      { email, password },
      {
        onSuccess: () => navigate("/"),
        onError: (err: unknown) => {
          const apiError = err as ErrorResponse;
          setError(apiError?.message || "로그인에 실패했습니다");
        },
      },
    );
  };

  const handleFindPassword = async (e: FormEvent) => {
    e.preventDefault();
    setFpError("");
    setFpSuccess("");

    if (!fpEmail) {
      setFpError("이메일을 입력해주세요");
      return;
    }
    if (!fpEmail.includes("@")) {
      setFpError("올바른 이메일 형식을 입력해주세요");
      return;
    }

    findPasswordMutation.mutate(
      { email: fpEmail },
      {
        onSuccess: () => {
          setFpSuccess("임시 비밀번호가 이메일로 전송되었습니다. 이메일을 확인해주세요.");
        },
        onError: (err: unknown) => {
          const apiError = err as ErrorResponse;
          setFpError(apiError?.message || "비밀번호 찾기에 실패했습니다");
        },
      },
    );
  };

  const switchToFindPassword = () => {
    setShowFindPassword(true);
    setError("");
    setFpError("");
    setFpSuccess("");
    setFpEmail(email);
  };

  const switchToLogin = () => {
    setShowFindPassword(false);
    setFpError("");
    setFpSuccess("");
  };

  if (showFindPassword) {
    return (
      <AuthLayout subtitle="회의에만 집중하세요, 기록은 AI가" colorTheme="purple" onBack={switchToLogin}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-white">비밀번호 찾기</h2>
            <KeyRound className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-white/60 mb-6">가입한 이메일로 임시 비밀번호를 전송합니다</p>
        </motion.div>

        {fpError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm"
          >
            <p className="text-sm text-red-300 font-medium">{fpError}</p>
          </motion.div>
        )}

        {fpSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg backdrop-blur-sm"
          >
            <p className="text-sm text-green-300 font-medium">{fpSuccess}</p>
          </motion.div>
        )}

        <form onSubmit={handleFindPassword} className="space-y-4">
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
              value={fpEmail}
              onChange={(e) => setFpEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-purple-500/30 rounded-xl bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 text-white placeholder-white/40"
            />
          </motion.div>

          <motion.button
            type="submit"
            disabled={findPasswordMutation.isPending}
            className="w-full px-6 py-3 mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {findPasswordMutation.isPending ? "전송 중..." : "임시 비밀번호 전송"}
            {!findPasswordMutation.isPending && <ArrowRight className="w-4 h-4" />}
          </motion.button>
        </form>

        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
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
    <AuthLayout subtitle="회의에만 집중하세요, 기록은 AI가" colorTheme="purple" onBack={() => navigate("/")}>
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
            onClick={switchToFindPassword}
            className="text-purple-300 font-semibold hover:text-pink-300 transition-colors"
          >
            비밀번호 찾기
          </button>
        </p>
      </motion.div>
    </AuthLayout>
  );
}
