import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { useCompanySignup } from "@/features/auth/hooks";
import type { ErrorResponse } from "@/features/auth/api";
import AuthLayout from "@/shared/components/AuthLayout";

export default function CompanySignup() {
  const [companyName, setCompanyName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const companySignupMutation = useCompanySignup();
  const isLoading = companySignupMutation.isPending;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!companyName || !name || !email || !password || !confirmPassword) {
      setError("모든 필드를 입력해주세요");
      return;
    }
    if (!email.includes("@")) {
      setError("올바른 이메일 형식을 입력해주세요");
      return;
    }
    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다");
      return;
    }

    companySignupMutation.mutate(
      {
        data: { companyName, name, email, password },
      },
      {
        onSuccess: () => {
          navigate("/login", { state: { fromCompanySignup: true } });
        },
        onError: (err: unknown) => {
          const apiError = err as ErrorResponse;
          setError(apiError?.message || "기업 가입에 실패했습니다");
        },
      },
    );
  };

  return (
    <AuthLayout subtitle="기업 회원가입" colorTheme="purple" onBack={() => navigate("/signup")}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-0">
          <h2 className="text-lg font-bold text-white">새로운 팀 만들기</h2>
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>
        <p className="text-white/60 text-xs mb-4">
          기업 정보를 입력해주세요
        </p>
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

      <form onSubmit={handleSubmit} className="space-y-2.5">

        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="text-xs font-semibold text-white/90 flex items-center gap-2">
            <Building2 className="w-3 h-3 text-purple-400" />
            회사명
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="회사명을 입력해주세요"
            className="w-full px-3 py-2 border border-purple-500/30 rounded-lg bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 text-sm text-white placeholder-white/40"
          />
        </motion.div>

        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.55 }}
        >
          <label className="text-xs font-semibold text-white/90 flex items-center gap-2">
            <User className="w-3 h-3 text-purple-400" />
            담당자 이름
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="홍길동"
            className="w-full px-3 py-2 border border-purple-500/30 rounded-lg bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 text-sm text-white placeholder-white/40"
          />
        </motion.div>

        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="text-xs font-semibold text-white/90 flex items-center gap-2">
            <Mail className="w-3 h-3 text-purple-400" />
            담당자 이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            className="w-full px-3 py-2 border border-purple-500/30 rounded-lg bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 text-sm text-white placeholder-white/40"
          />
        </motion.div>

        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.65 }}
        >
          <label className="text-xs font-semibold text-white/90 flex items-center gap-2">
            <Lock className="w-3 h-3 text-purple-400" />
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-purple-500/30 rounded-lg bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 text-sm text-white placeholder-white/40"
          />
        </motion.div>

        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <label className="text-xs font-semibold text-white/90 flex items-center gap-2">
            <Lock className="w-3 h-3 text-purple-400" />
            비밀번호 확인
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-purple-500/30 rounded-lg bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 text-sm text-white placeholder-white/40"
          />
        </motion.div>

        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 mt-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {isLoading ? "생성 중..." : "기업 등록"}
          {!isLoading && <ArrowRight className="w-3 h-3" />}
        </motion.button>
      </form>

      <motion.div
        className="my-3 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <div className="flex-1 h-px bg-purple-500/20"></div>
        <span className="text-xs text-white/40">또는</span>
        <div className="flex-1 h-px bg-purple-500/20"></div>
      </motion.div>

      <motion.p
        className="text-center text-xs text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        초대받은 사원이신가요?{" "}
        <Link
          to="/signup"
          className="text-purple-300 font-semibold hover:text-pink-300 transition-colors"
        >
          사원 가입하기
        </Link>
      </motion.p>

      <motion.p
        className="text-center text-xs text-white/60 mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <Link
          to="/signup"
          className="text-white/50 hover:text-white transition-colors underline"
        >
          뒤로가기
        </Link>
      </motion.p>
    </AuthLayout>
  );
}
