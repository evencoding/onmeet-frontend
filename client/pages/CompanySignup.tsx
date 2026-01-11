import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building2, Mail, Lock, Globe, ArrowRight } from "lucide-react";

export default function CompanySignup() {
  const [companyName, setCompanyName] = useState("");
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!companyName || !domain || !email || !password || !confirmPassword) {
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

      // TODO: API call to create company and admin user
      // const response = await createCompany({
      //   companyName,
      //   domain,
      //   email,
      //   password,
      // });

      // For now, just simulate success
      console.log("Company created:", { companyName, domain, email });
      navigate("/signup/invite-members", {
        state: { companyId: "test-company-id" },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "기업 가입 실패");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-bg-grad to-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white mb-4">
            <span className="text-xl font-bold">O</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">ONMEET</h1>
          <p className="text-text-sub">기업 회원가입</p>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-white via-white/80 to-surface-subtle border-2 border-brand-500 rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            새로운 팀 만들기
          </h2>
          <p className="text-text-sub mb-6">기업 정보를 입력해주세요</p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Building2 className="w-4 h-4 text-brand-500" />
                회사명
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="회사명을 입력해주세요"
                className="w-full px-4 py-3 border border-border/50 rounded-xl bg-white/60 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 text-foreground placeholder-text-sub"
              />
            </div>

            {/* Domain */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-500" />
                회사 도메인
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="example"
                  className="flex-1 px-4 py-3 border border-r-0 border-border/50 rounded-l-xl bg-white/60 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 text-foreground placeholder-text-sub"
                />
                <div className="px-4 py-3 border border-l-0 border-border/50 rounded-r-xl bg-surface-subtle text-text-sub font-medium">
                  .com
                </div>
              </div>
              <p className="text-xs text-text-sub mt-1">
                사원들의 회사 이메일 도메인 (예: name@example.com)
              </p>
            </div>

            {/* Admin Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-500" />
                담당자 이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-4 py-3 border border-border/50 rounded-xl bg-white/60 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 text-foreground placeholder-text-sub"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-500" />
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-border/50 rounded-xl bg-white/60 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 text-foreground placeholder-text-sub"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-500" />
                비밀번호 확인
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-border/50 rounded-xl bg-white/60 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 text-foreground placeholder-text-sub"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-sm font-semibold rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? "생성 중..." : "기업 등록"}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border/30"></div>
            <span className="text-xs text-text-sub">또는</span>
            <div className="flex-1 h-px bg-border/30"></div>
          </div>

          {/* Switch to Employee Signup */}
          <p className="text-center text-sm text-text-sub">
            초대받은 사원이신가요?{" "}
            <Link
              to="/signup"
              className="text-brand-500 font-semibold hover:text-brand-600 transition-colors"
            >
              사원 가입하기
            </Link>
          </p>

          {/* Back Link */}
          <p className="text-center text-sm text-text-sub mt-4">
            <Link
              to="/signup"
              className="text-muted-foreground hover:text-foreground transition-colors underline"
            >
              뒤로가기
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
