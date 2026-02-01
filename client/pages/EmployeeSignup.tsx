import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Building2,
  ArrowRight,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

export default function EmployeeSignup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("token");

  const [inviteEmail, setInviteEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [step, setStep] = useState<"verify" | "register">("verify");
  const [formData, setFormData] = useState({
    name: "",
    email: inviteEmail,
    password: "",
    confirmPassword: "",
    memberNum: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // If have invite token, verify it automatically
  useEffect(() => {
    if (inviteToken) {
      verifyInviteToken();
    }
  }, [inviteToken]);

  const verifyInviteToken = async () => {
    setIsLoading(true);
    try {
      // For demo purposes
      setInviteEmail("employee@example.com");
      setCompanyName("Tech Company");
      setFormData((prev) => ({ ...prev, email: "employee@example.com" }));
      setStep("register");
    } catch (err) {
      setError("유효하지 않은 초대 링크입니다");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!inviteEmail) {
        throw new Error("이메일을 입력해주세요");
      }
      if (!inviteEmail.includes("@")) {
        throw new Error("올바른 이메일 형식을 입력해주세요");
      }

      // For demo purposes
      setFormData((prev) => ({ ...prev, email: inviteEmail }));
      setCompanyName("Tech Company");
      setStep("register");
    } catch (err) {
      setError(err instanceof Error ? err.message : "이메일 검증 실패");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { name, email, password, confirmPassword, memberNum, role } =
        formData;

      if (!name || !password || !confirmPassword) {
        throw new Error("모든 필드를 입력해주세요");
      }
      if (password.length < 6) {
        throw new Error("비밀번호는 최소 6자 이상이어야 합니다");
      }
      if (password !== confirmPassword) {
        throw new Error("비밀번호가 일치하지 않습니다");
      }

      console.log("Employee registered:", { name, email, memberNum, role });
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "가입 실패");
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "verify") {
    return (
      <div className="min-h-screen bg-black text-white overflow-hidden flex items-center justify-center p-4">
        {/* Animated gradient background */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-950 via-black to-purple-900">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
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
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white mb-4 relative overflow-hidden"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="relative text-xl font-bold">O</span>
            </motion.div>

            <motion.h1
              className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
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
              사원 회원가입
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
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />

            <div className="relative bg-gradient-to-br from-blue-900/40 via-purple-900/20 to-black/60 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-xl hover:border-blue-500/60 transition-all duration-300">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-white">계정 인증</h2>
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-white/60 mb-6">회사 이메일을 입력해주세요</p>
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

              <form onSubmit={handleVerifySubmit} className="space-y-4">
                {/* Email Input */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    회사 이메일
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="your@company.com"
                    className="w-full px-4 py-3 border border-blue-500/30 rounded-xl bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 text-white placeholder-white/40"
                  />
                  <p className="text-xs text-white/50">
                    회사에서 초대한 이메일을 입력해주세요
                  </p>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {isLoading ? "확인 중..." : "다음"}
                  {!isLoading && <ArrowRight className="w-4 h-4" />}
                </motion.button>
              </form>

              {/* Divider */}
              <motion.div
                className="my-6 flex items-center gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex-1 h-px bg-blue-500/20"></div>
                <span className="text-xs text-white/40">또는</span>
                <div className="flex-1 h-px bg-blue-500/20"></div>
              </motion.div>

              {/* Back Link */}
              <motion.p
                className="text-center text-sm text-white/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Link
                  to="/signup"
                  className="text-blue-300 font-semibold hover:text-purple-300 transition-colors"
                >
                  뒤로가기
                </Link>
              </motion.p>
            </div>
          </motion.div>
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

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex items-center justify-center p-4">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-950 via-black to-purple-900">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
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
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white mb-4 relative overflow-hidden"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="relative text-xl font-bold">O</span>
          </motion.div>

          <motion.h1
            className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
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
            사원 정보 입력
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
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />

          <div className="relative bg-gradient-to-br from-blue-900/40 via-purple-900/20 to-black/60 border border-blue-500/30 rounded-2xl p-8 backdrop-blur-xl hover:border-blue-500/60 transition-all duration-300">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-white mb-1">
                {companyName}
              </h2>
              <p className="text-white/60 mb-6">사원 정보를 입력해주세요</p>
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

            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              {/* Name */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  이름
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="홍길동"
                  className="w-full px-4 py-3 border border-blue-500/30 rounded-xl bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 text-white placeholder-white/40"
                />
              </motion.div>

              {/* Email (readonly) */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 }}
              >
                <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-400" />
                  이메일
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-4 py-3 border border-blue-500/30 rounded-xl bg-white/5 text-white/70 cursor-not-allowed opacity-60"
                />
              </motion.div>

              {/* Member Number */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  직원번호 (선택)
                </label>
                <input
                  type="text"
                  value={formData.memberNum}
                  onChange={(e) =>
                    setFormData({ ...formData, memberNum: e.target.value })
                  }
                  placeholder="EMP-001"
                  className="w-full px-4 py-3 border border-blue-500/30 rounded-xl bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 text-white placeholder-white/40"
                />
              </motion.div>

              {/* Role */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 }}
              >
                <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  직급 (선택)
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-blue-500/30 rounded-xl bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 text-white"
                >
                  <option value="">선택해주세요</option>
                  <option value="user">사원</option>
                  <option value="team-lead">팀장</option>
                  <option value="manager">매니저</option>
                  <option value="director">이사</option>
                </select>
              </motion.div>

              {/* Password */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-400" />
                  비밀번호
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-blue-500/30 rounded-xl bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 text-white placeholder-white/40"
                />
              </motion.div>

              {/* Confirm Password */}
              <motion.div
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.75 }}
              >
                <label className="text-sm font-semibold text-white/90 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-400" />
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-blue-500/30 rounded-xl bg-white/5 backdrop-blur-sm focus:bg-white/10 focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 text-white placeholder-white/40"
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
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
              transition={{ delay: 0.9 }}
            >
              <div className="flex-1 h-px bg-blue-500/20"></div>
              <span className="text-xs text-white/40">또는</span>
              <div className="flex-1 h-px bg-blue-500/20"></div>
            </motion.div>

            {/* Back Link */}
            <motion.p
              className="text-center text-sm text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <button
                type="button"
                onClick={() => setStep("verify")}
                className="text-blue-300 font-semibold hover:text-purple-300 transition-colors flex items-center justify-center gap-1 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" /> 이전 단계로
              </button>
            </motion.p>
          </div>
        </motion.div>
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
