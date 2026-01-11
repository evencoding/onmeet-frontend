import { useNavigate, useSearchParams } from "react-router-dom";
import { Building2, Users, ArrowRight } from "lucide-react";

export default function SignupFlow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("token");

  // If user has invite token, go directly to employee signup
  if (inviteToken) {
    navigate(`/signup/employee?token=${inviteToken}`);
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-bg-grad to-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white mb-4">
            <span className="text-xl font-bold">O</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">ONMEET</h1>
          <p className="text-text-sub text-lg">회의에만 집중하세요, 기록은 AI가</p>
        </div>

        {/* Signup Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Company Signup */}
          <button
            onClick={() => navigate("/signup/company")}
            className="group bg-gradient-to-br from-white via-white/80 to-surface-subtle border-2 border-brand-500 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden relative"
          >
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-50 mb-4">
                <Building2 className="w-8 h-8 text-brand-600" />
              </div>

              {/* Content */}
              <h2 className="text-2xl font-bold text-foreground mb-2 text-left">
                기업 회원가입
              </h2>
              <p className="text-text-sub text-left mb-6 leading-relaxed">
                새로운 팀을 만들고 <br />
                사원들을 초대하세요
              </p>

              {/* Features */}
              <div className="space-y-2 mb-6 text-left">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <div className="w-2 h-2 rounded-full bg-brand-500" />
                  팀 생성 및 관리
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <div className="w-2 h-2 rounded-full bg-brand-500" />
                  사원 초대
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <div className="w-2 h-2 rounded-full bg-brand-500" />
                  팀 회의 관리
                </div>
              </div>

              {/* Button */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-brand-600">
                  시작하기
                </span>
                <ArrowRight className="w-5 h-5 text-brand-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>

          {/* Employee Signup */}
          <button
            onClick={() => navigate("/signup/employee")}
            className="group bg-gradient-to-br from-white via-white/80 to-surface-subtle border-2 border-blue-400 rounded-3xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden relative"
          >
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>

              {/* Content */}
              <h2 className="text-2xl font-bold text-foreground mb-2 text-left">
                사원 회원가입
              </h2>
              <p className="text-text-sub text-left mb-6 leading-relaxed">
                초대받은 사원으로 <br />
                팀에 참여하세요
              </p>

              {/* Features */}
              <div className="space-y-2 mb-6 text-left">
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  초대 링크로 가입
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  팀 회의 참여
                </div>
                <div className="flex items-center gap-2 text-sm text-foreground">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  회의록 접근
                </div>
              </div>

              {/* Button */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-blue-600">
                  계속하기
                </span>
                <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        </div>

        {/* Demo Note */}
        <p className="text-center text-xs text-text-sub">
          💡 이미 계정이 있으신가요?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-brand-500 font-semibold hover:text-brand-600 transition-colors"
          >
            로그인하기
          </button>
        </p>
      </div>
    </div>
  );
}
