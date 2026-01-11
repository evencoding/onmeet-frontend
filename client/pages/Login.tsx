import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error("이메일과 비밀번호를 입력해주세요");
      }
      if (!email.includes("@")) {
        throw new Error("올바른 이메일 형식을 입력해주세요");
      }

      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인 실패");
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
          <p className="text-text-sub">회의에만 집중하세요, 기록은 AI가</p>
        </div>

        {/* Form Card */}
        <div className="bg-gradient-to-br from-white via-white/80 to-surface-subtle border-2 border-brand-500 rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-1">로그인</h2>
          <p className="text-text-sub mb-6">계정으로 로그인하세요</p>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-500" />
                이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-border/50 rounded-xl bg-white/60 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 text-foreground placeholder-text-sub"
              />
            </div>

            {/* Password Input */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-sm font-semibold rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border/30"></div>
            <span className="text-xs text-text-sub">또는</span>
            <div className="flex-1 h-px bg-border/30"></div>
          </div>

          {/* Signup Link */}
          <p className="text-center text-sm text-text-sub">
            계정이 없으신가요?{" "}
            <Link
              to="/signup"
              className="text-brand-500 font-semibold hover:text-brand-600 transition-colors"
            >
              가입하기
            </Link>
          </p>
        </div>

        {/* Demo Note */}
        <p className="mt-6 text-center text-xs text-text-sub">
          💡 데모: 이메일과 비밀번호를 입력하면 로그인됩니다
        </p>
      </div>
    </div>
  );
}
