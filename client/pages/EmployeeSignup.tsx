import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { User, Mail, Lock, Building2, ArrowRight } from "lucide-react";

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
      // TODO: API call to verify invite token and get company/email info
      // const response = await verifyToken(inviteToken);
      // setInviteEmail(response.email);
      // setCompanyName(response.companyName);

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

      // TODO: API call to verify email with company domain
      // const response = await verifyEmployeeEmail(inviteEmail);
      // setCompanyName(response.companyName);

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
      const { name, email, password, confirmPassword, memberNum, role } = formData;

      if (!name || !password || !confirmPassword) {
        throw new Error("모든 필드를 입력해주세요");
      }
      if (password.length < 6) {
        throw new Error("비밀번호는 최소 6자 이상이어야 합니다");
      }
      if (password !== confirmPassword) {
        throw new Error("비밀번호가 일치하지 않습니다");
      }

      // TODO: API call to create employee user and member record
      // const response = await registerEmployee({
      //   name,
      //   email,
      //   password,
      //   memberNum,
      //   role,
      //   inviteToken,
      // });

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
      <div className="min-h-screen bg-gradient-to-br from-background via-bg-grad to-background flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white mb-4">
              <span className="text-xl font-bold">O</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">ONMEET</h1>
            <p className="text-text-sub">사원 회원가입</p>
          </div>

          {/* Form Card */}
          <div className="bg-gradient-to-br from-white via-white/80 to-surface-subtle border-2 border-blue-400 rounded-3xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-foreground mb-1">
              계정 인증
            </h2>
            <p className="text-text-sub mb-6">
              회사 이메일을 입력해주세요
            </p>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleVerifySubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-500" />
                  회사 이메일
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="your@company.com"
                  className="w-full px-4 py-3 border border-border/50 rounded-xl bg-white/60 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-foreground placeholder-text-sub"
                />
                <p className="text-xs text-text-sub">
                  회사에서 초대한 이메일을 입력해주세요
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-primary-foreground text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {isLoading ? "확인 중..." : "다음"}
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-border/30"></div>
              <span className="text-xs text-text-sub">또는</span>
              <div className="flex-1 h-px bg-border/30"></div>
            </div>

            {/* Back Link */}
            <p className="text-center text-sm text-text-sub">
              <Link
                to="/signup"
                className="text-blue-500 font-semibold hover:text-blue-600 transition-colors"
              >
                뒤로가기
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-bg-grad to-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white mb-4">
            <span className="text-xl font-bold">O</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">ONMEET</h1>
          <p className="text-text-sub">사원 정보 입력</p>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-white via-white/80 to-surface-subtle border-2 border-blue-400 rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            {companyName}
          </h2>
          <p className="text-text-sub mb-6">
            사원 정보를 입력해주세요
          </p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-blue-500" />
                이름
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="홍길동"
                className="w-full px-4 py-3 border border-border/50 rounded-xl bg-white/60 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-foreground placeholder-text-sub"
              />
            </div>

            {/* Email (readonly) */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500" />
                이메일
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-3 border border-border/50 rounded-xl bg-surface-subtle text-text-sub cursor-not-allowed"
              />
            </div>

            {/* Member Number */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                직원번호 (선택)
              </label>
              <input
                type="text"
                value={formData.memberNum}
                onChange={(e) =>
                  setFormData({ ...formData, memberNum: e.target.value })
                }
                placeholder="EMP-001"
                className="w-full px-4 py-3 border border-border/50 rounded-xl bg-white/60 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-foreground placeholder-text-sub"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500" />
                직급 (선택)
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-4 py-3 border border-border/50 rounded-xl bg-white/60 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-foreground"
              >
                <option value="">선택해주세요</option>
                <option value="user">사원</option>
                <option value="team-lead">팀장</option>
                <option value="manager">매니저</option>
                <option value="director">이사</option>
              </select>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-500" />
                비밀번호
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-border/50 rounded-xl bg-white/60 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-foreground placeholder-text-sub"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-500" />
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
                className="w-full px-4 py-3 border border-border/50 rounded-xl bg-white/60 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-foreground placeholder-text-sub"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-primary-foreground text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? "가입 중..." : "계정 만들기"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border/30"></div>
            <span className="text-xs text-text-sub">또는</span>
            <div className="flex-1 h-px bg-border/30"></div>
          </div>

          {/* Back Link */}
          <p className="text-center text-sm text-text-sub">
            <button
              type="button"
              onClick={() => setStep("verify")}
              className="text-blue-500 font-semibold hover:text-blue-600 transition-colors underline"
            >
              이전 단계로
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
