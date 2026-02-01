import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Lock, ArrowRight, Sparkles, CheckCircle } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!name || !email || !password || !confirmPassword) {
        throw new Error("모든 필드를 입력해주세요");
      }
      if (!email.includes("@")) {
        throw new Error("올바른 이메일 형식을 입력해주세요");
      }
      if (password.length < 6) {
        throw new Error("비밀번호는 최소 6자 이상이어야 합니다");
      }
      if (password !== confirmPassword) {
        throw new Error("비밀번호가 일치하지 않습니다");
      }

      await signup(name, email, password);
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "회원가입 실패");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex items-center justify-center p-4">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-950 via-black to-purple-900">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <motion.div
        className="max-w-md w-full relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 text-white mb-4 relative overflow-hidden"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="relative text-xl font-bold">O</span>
          </motion.div>

          <motion.h1
            className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            ONMEET
          </motion.h1>

          <motion.p
            className="text-white/70"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            미래의 회의를 지금 시작하세요
          </motion.p>
        </div>

        {/* Form Card */}
        <motion.div
          className="relative group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />

          <div className="relative bg-gradient-to-br from-pink-900/40 via-purple-900/20 to-black/60 border border-pink-500/30 rounded-2xl p-8 backdrop-blur-xl hover:border-pink-500/60 transition-all duration-300">
            {success ? (
              <motion.div
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 text-white mb-4"
                  animate={{ scale: [0.8, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle className="w-8 h-8" />
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">가입 완료!</h3>
                <p className="text-white/70">로그인 페이지로 이동 중입니다...</p>
              </motion.div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-white">회원가입</h2>
                    <Sparkles className="w-5 h-5 text-pink-400" />
                  </div>
                  <p className="text-white/60 mb-6">새 계정을 만드세요</p>
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

                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Name Input */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                      <User className="w-4 h-4 text-pink-400" />
                      이름
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="홍길동"
                      className="w-full px-4 py-3 border border-pink-500/30 rounded-xl bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/30 transition-all duration-200 text-white placeholder-white/40"
                    />
                  </motion.div>

                  {/* Email Input */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.55 }}
                  >
                    <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-pink-400" />
                      이메일
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-pink-500/30 rounded-xl bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/30 transition-all duration-200 text-white placeholder-white/40"
                    />
                  </motion.div>

                  {/* Password Input */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-pink-400" />
                      비밀번호
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-pink-500/30 rounded-xl bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/30 transition-all duration-200 text-white placeholder-white/40"
                    />
                  </motion.div>

                  {/* Confirm Password Input */}
                  <motion.div
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.65 }}
                  >
                    <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-pink-400" />
                      비밀번호 확인
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-pink-500/30 rounded-xl bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/30 transition-all duration-200 text-white placeholder-white/40"
                    />
                  </motion.div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 py-3 mt-6 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-pink-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    {isLoading ? "가입 중..." : "계정 만들기"}
                    {!isLoading && <ArrowRight className="w-4 h-4" />}
                  </motion.button>
                </form>

                {/* Divider */}
                <motion.div
                  className="my-6 flex items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex-1 h-px bg-pink-500/20"></div>
                  <span className="text-xs text-white/40">또는</span>
                  <div className="flex-1 h-px bg-pink-500/20"></div>
                </motion.div>

                {/* Login Link */}
                <motion.p
                  className="text-center text-sm text-white/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  이미 계정이 있으신가요?{" "}
                  <Link
                    to="/login"
                    className="text-pink-300 font-semibold hover:text-purple-300 transition-colors"
                  >
                    로그인하기
                  </Link>
                </motion.p>
              </>
            )}
          </div>
        </motion.div>

        {!success && (
          <motion.p
            className="mt-6 text-center text-xs text-white/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            💡 데모: 정보를 입력하면 가입됩니다
          </motion.p>
        )}
      </motion.div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
