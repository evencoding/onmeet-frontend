import { useState, useEffect, type FormEvent } from "react";
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
import { useEmployeeSignup } from "@/features/auth/hooks";
import { validateInvitation } from "@/features/auth/api";
import { getErrorMessage } from "@/shared/utils/apiFetch";
import AuthLayout from "@/shared/components/AuthLayout";

export default function EmployeeSignup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("token") || "";
  const inviteEmailParam = searchParams.get("email") || "";

  const [inviteEmail, setInviteEmail] = useState(inviteEmailParam);
  const [inviteCode, setInviteCode] = useState(inviteToken);
  const [companyName, setCompanyName] = useState("");
  const [step, setStep] = useState<"verify" | "register">("verify");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    memberNum: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const employeeSignupMutation = useEmployeeSignup();

  const hasPrefilledParams = !!(inviteToken && inviteEmailParam);

  useEffect(() => {
    if (!hasPrefilledParams) return;

    let cancelled = false;

    const autoValidate = async () => {
      setIsLoading(true);
      setError("");
      try {
        const invitation = await validateInvitation(inviteEmailParam, inviteToken);
        if (cancelled) return;
        setCompanyName(invitation.companyName);
        setFormData((prev) => ({ ...prev, email: inviteEmailParam }));
        setStep("register");
      } catch (err) {
        if (cancelled) return;
        setError(getErrorMessage(err, "초대 코드 검증에 실패했습니다"));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    autoValidate();
    return () => { cancelled = true; };
  }, [hasPrefilledParams, inviteEmailParam, inviteToken]);

  const handleVerifySubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!inviteEmail) {
      setError("이메일을 입력해주세요");
      return;
    }
    if (!inviteEmail.includes("@")) {
      setError("올바른 이메일 형식을 입력해주세요");
      return;
    }
    if (!inviteCode) {
      setError("초대 코드를 입력해주세요");
      return;
    }

    setIsLoading(true);
    try {
      const invitation = await validateInvitation(inviteEmail, inviteCode);
      setCompanyName(invitation.companyName);
      setFormData((prev) => ({ ...prev, email: inviteEmail }));
      setStep("register");
    } catch (err) {
      setError(getErrorMessage(err, "초대 코드 검증에 실패했습니다"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const { name, password, confirmPassword, memberNum } = formData;

    if (!name || !password || !confirmPassword) {
      setError("모든 필드를 입력해주세요");
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

    employeeSignupMutation.mutate(
      {
        data: {
          email: formData.email || inviteEmail,
          code: inviteCode,
          password,
          name,
          employeeId: memberNum || undefined,
        },
      },
      {
        onSuccess: () => navigate("/login"),
        onError: (err: unknown) => {
          setError(getErrorMessage(err, "가입에 실패했습니다"));
        },
      },
    );
  };

  if (step === "verify") {
    return (
      <AuthLayout subtitle="사원 회원가입" colorTheme="blue" onBack={() => navigate("/signup")}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-0">
            <h2 className="text-lg font-bold dark:text-white light:text-purple-950">계정 인증</h2>
            <Sparkles className="w-4 h-4 dark:text-blue-400 light:text-blue-600" />
          </div>
          <p className="dark:text-white/60 light:text-purple-600 text-xs mb-4">
            회사 이메일을 입력해주세요
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 dark:bg-red-500/20 dark:border dark:border-red-500/50 light:bg-red-50 light:border-2 light:border-red-200 rounded-lg backdrop-blur-sm"
          >
            <p className="text-sm dark:text-red-300 light:text-red-600 font-medium">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleVerifySubmit} className="space-y-2.5">

          <motion.div
            className="space-y-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label className="text-xs font-semibold dark:text-white/90 light:text-purple-900 flex items-center gap-2">
              <Mail className="w-3 h-3 dark:text-blue-400 light:text-blue-600" />
              회사 이메일
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="your@company.com"
              disabled={hasPrefilledParams}
              className={`w-full px-4 py-3 rounded-xl transition-all duration-200 dark:border dark:border-blue-500/30 dark:bg-white/5 dark:backdrop-blur-sm dark:focus:bg-white/10 dark:focus:border-blue-500/60 dark:focus:ring-2 dark:focus:ring-blue-500/30 dark:text-white dark:placeholder-white/40 light:border-2 light:border-blue-200/70 light:bg-blue-50/30 light:focus:bg-white light:focus:border-blue-400 light:focus:ring-2 light:focus:ring-blue-300/40 light:text-purple-950 light:placeholder-blue-400/60 ${hasPrefilledParams ? "cursor-not-allowed opacity-60" : ""}`}
            />
            <p className="text-xs dark:text-white/50 light:text-purple-500">
              회사에서 초대한 이메일을 입력해주세요
            </p>
          </motion.div>

          <motion.div
            className="space-y-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.55 }}
          >
            <label className="text-xs font-semibold dark:text-white/90 light:text-purple-900 flex items-center gap-2">
              <Lock className="w-3 h-3 dark:text-blue-400 light:text-blue-600" />
              초대 코드
            </label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              placeholder="INV-123456"
              disabled={hasPrefilledParams}
              className={`w-full px-4 py-3 rounded-xl transition-all duration-200 dark:border dark:border-blue-500/30 dark:bg-white/5 dark:backdrop-blur-sm dark:focus:bg-white/10 dark:focus:border-blue-500/60 dark:focus:ring-2 dark:focus:ring-blue-500/30 dark:text-white dark:placeholder-white/40 light:border-2 light:border-blue-200/70 light:bg-blue-50/30 light:focus:bg-white light:focus:border-blue-400 light:focus:ring-2 light:focus:ring-blue-300/40 light:text-purple-950 light:placeholder-blue-400/60 ${hasPrefilledParams ? "cursor-not-allowed opacity-60" : ""}`}
            />
          </motion.div>

          {hasPrefilledParams && isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-2"
            >
              <p className="text-sm dark:text-blue-300 light:text-blue-600">자동 검증 중...</p>
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 mt-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {isLoading ? "확인 중..." : "다음"}
            {!isLoading && <ArrowRight className="w-3 h-3" />}
          </motion.button>
        </form>

        <motion.div
          className="my-3 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex-1 h-px dark:bg-blue-500/20 light:bg-blue-200"></div>
          <span className="text-xs dark:text-white/40 light:text-purple-400">또는</span>
          <div className="flex-1 h-px dark:bg-blue-500/20 light:bg-blue-200"></div>
        </motion.div>

        <motion.p
          className="text-center text-xs dark:text-white/70 light:text-purple-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            to="/signup"
            className="dark:text-blue-300 light:text-blue-600 font-semibold hover:text-purple-300 transition-colors"
          >
            뒤로가기
          </Link>
        </motion.p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout subtitle="사원 정보 입력" colorTheme="blue" onBack={() => setStep("verify")}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-bold dark:text-white light:text-purple-950 mb-0">{companyName}</h2>
        <p className="dark:text-white/60 light:text-purple-600 text-xs mb-4">사원 정보를 입력해주세요</p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 dark:bg-red-500/20 dark:border dark:border-red-500/50 light:bg-red-50 light:border-2 light:border-red-200 rounded-lg backdrop-blur-sm"
        >
          <p className="text-sm dark:text-red-300 light:text-red-600 font-medium">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleRegisterSubmit} className="space-y-2">

        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <label className="text-xs font-semibold dark:text-white/90 light:text-purple-900 flex items-center gap-2">
            <User className="w-3 h-3 dark:text-blue-400 light:text-blue-600" />
            이름
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="홍길동"
            className="w-full px-4 py-3 rounded-xl transition-all duration-200 dark:border dark:border-blue-500/30 dark:bg-white/5 dark:backdrop-blur-sm dark:focus:bg-white/10 dark:focus:border-blue-500/60 dark:focus:ring-2 dark:focus:ring-blue-500/30 dark:text-white dark:placeholder-white/40 light:border-2 light:border-blue-200/70 light:bg-blue-50/30 light:focus:bg-white light:focus:border-blue-400 light:focus:ring-2 light:focus:ring-blue-300/40 light:text-purple-950 light:placeholder-blue-400/60"
          />
        </motion.div>

        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.55 }}
        >
          <label className="text-xs font-semibold dark:text-white/90 light:text-purple-900 flex items-center gap-2">
            <Mail className="w-3 h-3 dark:text-blue-400 light:text-blue-600" />
            이메일
          </label>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full px-4 py-3 rounded-xl transition-all duration-200 dark:border dark:border-blue-500/30 dark:bg-white/5 dark:text-white/70 light:border-2 light:border-blue-200/70 light:bg-blue-50/30 light:text-purple-700 cursor-not-allowed opacity-60 text-sm"
          />
        </motion.div>

        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <label className="text-xs font-semibold dark:text-white/90 light:text-purple-900 flex items-center gap-2">
            <Building2 className="w-3 h-3 dark:text-blue-400 light:text-blue-600" />
            직원번호 (선택)
          </label>
          <input
            type="text"
            value={formData.memberNum}
            onChange={(e) =>
              setFormData({ ...formData, memberNum: e.target.value })
            }
            placeholder="EMP-001"
            className="w-full px-4 py-3 rounded-xl transition-all duration-200 dark:border dark:border-blue-500/30 dark:bg-white/5 dark:backdrop-blur-sm dark:focus:bg-white/10 dark:focus:border-blue-500/60 dark:focus:ring-2 dark:focus:ring-blue-500/30 dark:text-white dark:placeholder-white/40 light:border-2 light:border-blue-200/70 light:bg-blue-50/30 light:focus:bg-white light:focus:border-blue-400 light:focus:ring-2 light:focus:ring-blue-300/40 light:text-purple-950 light:placeholder-blue-400/60"
          />
        </motion.div>

        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <label className="text-xs font-semibold dark:text-white/90 light:text-purple-900 flex items-center gap-2">
            <Lock className="w-3 h-3 dark:text-blue-400 light:text-blue-600" />
            비밀번호
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl transition-all duration-200 dark:border dark:border-blue-500/30 dark:bg-white/5 dark:backdrop-blur-sm dark:focus:bg-white/10 dark:focus:border-blue-500/60 dark:focus:ring-2 dark:focus:ring-blue-500/30 dark:text-white dark:placeholder-white/40 light:border-2 light:border-blue-200/70 light:bg-blue-50/30 light:focus:bg-white light:focus:border-blue-400 light:focus:ring-2 light:focus:ring-blue-300/40 light:text-purple-950 light:placeholder-blue-400/60"
          />
        </motion.div>

        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.75 }}
        >
          <label className="text-xs font-semibold dark:text-white/90 light:text-purple-900 flex items-center gap-2">
            <Lock className="w-3 h-3 dark:text-blue-400 light:text-blue-600" />
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
            className="w-full px-4 py-3 rounded-xl transition-all duration-200 dark:border dark:border-blue-500/30 dark:bg-white/5 dark:backdrop-blur-sm dark:focus:bg-white/10 dark:focus:border-blue-500/60 dark:focus:ring-2 dark:focus:ring-blue-500/30 dark:text-white dark:placeholder-white/40 light:border-2 light:border-blue-200/70 light:bg-blue-50/30 light:focus:bg-white light:focus:border-blue-400 light:focus:ring-2 light:focus:ring-blue-300/40 light:text-purple-950 light:placeholder-blue-400/60"
          />
        </motion.div>

        <motion.button
          type="submit"
          disabled={employeeSignupMutation.isPending}
          className="w-full px-4 py-2 mt-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {employeeSignupMutation.isPending ? "가입 중..." : "계정 만들기"}
          {!employeeSignupMutation.isPending && (
            <ArrowRight className="w-3 h-3" />
          )}
        </motion.button>
      </form>

      <motion.div
        className="my-3 flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <div className="flex-1 h-px dark:bg-blue-500/20 light:bg-blue-200"></div>
        <span className="text-xs dark:text-white/40 light:text-purple-400">또는</span>
        <div className="flex-1 h-px dark:bg-blue-500/20 light:bg-blue-200"></div>
      </motion.div>

      <motion.p
        className="text-center text-xs dark:text-white/70 light:text-purple-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <button
          type="button"
          onClick={() => setStep("verify")}
          className="dark:text-blue-300 light:text-blue-600 font-semibold hover:text-purple-300 transition-colors flex items-center justify-center gap-1 mx-auto"
        >
          <ArrowLeft className="w-3 h-3" /> 이전 단계로
        </button>
      </motion.p>
    </AuthLayout>
  );
}
