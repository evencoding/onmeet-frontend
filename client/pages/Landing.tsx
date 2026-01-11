import { useNavigate } from "react-router-dom";
import { Video, Zap, Shield, Users, ArrowRight, CheckCircle } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Video className="w-8 h-8" />,
      title: "스마트 회의 녹화",
      description: "모든 회의를 자동으로 기록하고 AI가 요약해줍니다",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "즉시 검색",
      description: "회의 내용을 키워드로 쉽게 찾을 수 있습니다",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "안전한 보관",
      description: "모든 회의 기록은 암호화되어 안전하게 보관됩니다",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "팀 협업",
      description: "팀원과 회의 기록과 요약본을 쉽게 공유하세요",
    },
  ];

  const stats = [
    { number: "10,000+", label: "활성 사용자" },
    { number: "1M+", label: "기록된 회의" },
    { number: "99.9%", label: "가용성" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-bg-grad to-background">
      {/* Navigation Bar */}
      <nav className="border-b border-border/30 bg-white/40 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white flex items-center justify-center font-bold">
              O
            </div>
            <span className="text-xl font-bold text-foreground">ONMEET</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 text-foreground font-medium hover:text-brand-500 transition-colors"
            >
              로그인
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground font-semibold rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-200 shadow-md"
            >
              가입하기
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
          회의에만{" "}
          <span className="bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
            집중하세요
          </span>
          <br />
          <span className="text-4xl md:text-5xl">기록은 AI가</span>
        </h1>

        <p className="text-xl text-text-sub max-w-2xl mx-auto mb-8">
          ONMEET은 당신의 회의를 자동으로 기록하고 정리해주는 스마트 회의 플랫폼입니다.
          <br />
          더 이상 회의 내용을 놓치지 마세요. 모든 것이 자동으로 저장되고 검색됩니다.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-lg font-semibold rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 flex items-center gap-2"
          >
            시작하기
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 border-2 border-brand-500 text-brand-500 text-lg font-semibold rounded-xl hover:bg-brand-50 transition-all duration-300"
          >
            로그인
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-20">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <p className="text-text-sub font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Hero Image Placeholder */}
        <div className="mb-20">
          <div className="rounded-3xl overflow-hidden border border-border/40 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop"
              alt="Meeting screenshot"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            강력한 기능들
          </h2>
          <p className="text-xl text-text-sub">
            당신의 회의를 더 효율적으로 관리하세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/40 backdrop-blur-md border border-border/30 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:border-border/50"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-brand-50 to-brand-100 flex items-center justify-center text-brand-500 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-text-sub">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-foreground mb-6">
              왜 ONMEET을 선택하나요?
            </h2>

            <div className="space-y-4">
              {[
                "자동 녹화 및 AI 요약",
                "강력한 검색 기능",
                "팀 협업 도구",
                "보안 및 프라이버시",
                "언제든 접근 가능",
                "24/7 고객 지원",
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-brand-500 flex-shrink-0" />
                  <span className="text-lg text-foreground font-medium">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden border border-border/40 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=600&fit=crop"
              alt="Team collaboration"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            간단한 요금제
          </h2>
          <p className="text-xl text-text-sub">
            당신에게 맞는 플랜을 선택하세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "기본",
              price: "무료",
              features: ["최대 5개 회의 기록", "기본 검색", "1명 사용자"],
            },
            {
              name: "프로",
              price: "₩9,900",
              period: "/월",
              features: [
                "무제한 회의 기록",
                "고급 검색",
                "팀 협업",
                "우선 지원",
              ],
              popular: true,
            },
            {
              name: "엔터프라이즈",
              price: "맞춤형",
              features: [
                "모든 기능 포함",
                "전담 지원",
                "사용자 정의",
                "SSO & API",
              ],
            },
          ].map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 p-8 ${
                plan.popular
                  ? "border-brand-500 bg-gradient-to-br from-white via-white/80 to-surface-subtle shadow-lg scale-105"
                  : "border-border/40 bg-white/40 backdrop-blur-md hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="mb-4 inline-block px-3 py-1 bg-brand-500 text-white text-xs font-semibold rounded-full">
                  인기 선택
                </div>
              )}
              <h3 className="text-2xl font-bold text-foreground mb-2">
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-text-sub font-medium">
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-center gap-2 text-text-sub">
                    <CheckCircle className="w-5 h-5 text-brand-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/signup")}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                  plan.popular
                    ? "bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground hover:from-brand-600 hover:to-brand-700"
                    : "border-2 border-brand-500 text-brand-500 hover:bg-brand-50"
                }`}
              >
                시작하기
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            지금 바로 시작하세요
          </h2>
          <p className="text-lg mb-8 text-white/90">
            ONMEET과 함께 더 효율적인 회의 문화를 만들어보세요
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-4 bg-white text-brand-600 font-bold rounded-xl hover:bg-white/90 transition-all duration-200 text-lg"
          >
            무료로 시작하기
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-white/40 backdrop-blur-md mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center text-text-sub">
          <p>&copy; 2024 ONMEET. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}
