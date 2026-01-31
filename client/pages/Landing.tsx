import { useNavigate } from "react-router-dom";
import { Video, Brain, Shield, Users, ArrowRight, CheckCircle, Zap } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Video className="w-8 h-8" />,
      title: "영상 회의 자동 기록",
      description: "모든 회의를 자동으로 녹화하고 정리합니다",
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI 회의록 생성",
      description: "AI가 자동으로 회의 요점을 정리해줍니다",
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
  ];

  const stats = [
    { number: "10,000+", label: "활성 사용자" },
    { number: "1M+", label: "기록된 회의" },
    { number: "99.9%", label: "가용성" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
      {/* Navigation Bar */}
      <nav className="border-b border-purple-200/50 bg-white/60 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 text-white flex items-center justify-center font-bold text-lg">
              O
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-700 to-purple-600 bg-clip-text text-transparent">
              ONMEET
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 text-slate-700 font-medium hover:text-purple-600 transition-colors"
            >
              로그인
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              가입하기
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full mb-6">
            스마트 회의 솔루션
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
          <span className="block">영상 회의에</span>
          <span className="bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
            AI 회의록
          </span>
          <span className="block">더해보세요</span>
        </h1>

        <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
          ONMEET은 당신의 회의를 자동으로 기록하고 AI가 정리해주는 차세대 회의 플랫폼입니다.
          <br />
          회의에만 집중하고, 나머지는 AI가 처리합니다.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-lg font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
          >
            무료로 시작하기
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 border-2 border-purple-600 text-purple-600 text-lg font-semibold rounded-lg hover:bg-purple-50 transition-all duration-300"
          >
            로그인
          </button>
        </div>

        {/* Hero Image */}
        <div className="mb-20">
          <div className="rounded-2xl overflow-hidden border border-purple-200/40 shadow-2xl">
            <img
              src="https://images.pexels.com/photos/4226261/pexels-photo-4226261.jpeg?w=1200&h=600&fit=crop"
              alt="Video conference meeting"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto bg-white/60 backdrop-blur-sm rounded-2xl p-12 border border-purple-200/30">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <p className="text-slate-600 font-medium text-sm md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Value Proposition Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            두 가지가 만나 완벽해진다
          </h2>
          <p className="text-xl text-slate-600">
            영상 회의와 AI 회의록의 강력한 조합
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Video Conference */}
          <div className="bg-gradient-to-br from-white via-purple-50/50 to-white border border-purple-200/50 rounded-2xl p-12 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-purple-600 mb-6">
              <Video className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              영상 회의 자동 기록
            </h3>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              모든 회의를 자동으로 녹화하여 나중에 언제든지 확인할 수 있습니다. 회의 중에 놓친 부분이나 중요한 결정 사항을 다시 확인하세요.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span>자동 녹화 및 저장</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span>고품질 비디오 압축</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span>언제든 재생 가능</span>
              </li>
            </ul>
          </div>

          {/* AI Meeting Minutes */}
          <div className="bg-gradient-to-br from-white via-purple-50/50 to-white border border-purple-200/50 rounded-2xl p-12 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-purple-600 mb-6">
              <Brain className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              AI 회의록 자동 생성
            </h3>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              첨단 AI가 회의 내용을 분석하여 핵심 내용, 결정사항, 할일 항목을 자동으로 정리해줍니다. 시간 낭비 없이 결과에 집중하세요.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span>자동 요약 생성</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span>주요 내용 추출</span>
              </li>
              <li className="flex items-center gap-3 text-slate-700">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span>할일 자동 할당</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            강력한 기능
          </h2>
          <p className="text-xl text-slate-600">
            당신의 회의를 더 효율적으로 관리하세요
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white/60 backdrop-blur-sm border border-purple-200/40 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:border-purple-200/70 hover:bg-white/80"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-purple-600 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-8">
              왜 ONMEET을 선택하나요?
            </h2>

            <div className="space-y-4">
              {[
                "자동 영상 기록 및 AI 요약",
                "강력한 검색 기능으로 빠른 정보 찾기",
                "팀 협업을 위한 공유 기능",
                "군급 보안과 암호화",
                "24/7 언제든 접근 가능",
                "전담 기술 지원",
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-purple-600 flex-shrink-0" />
                  <span className="text-lg text-slate-700 font-medium">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-purple-200/40 shadow-xl">
            <img
              src="https://images.pexels.com/photos/7691691/pexels-photo-7691691.jpeg?w=600&h=600&fit=crop"
              alt="Team video collaboration"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            투명한 요금제
          </h2>
          <p className="text-xl text-slate-600">
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
                "고급 AI 요약",
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
                "사용자 정의 기능",
                "SSO & API",
              ],
            },
          ].map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-xl border transition-all duration-300 p-8 ${
                plan.popular
                  ? "border-purple-600 bg-gradient-to-br from-white via-purple-50 to-white shadow-xl scale-105"
                  : "border-purple-200/40 bg-white/60 backdrop-blur-sm hover:shadow-lg hover:border-purple-200/70"
              }`}
            >
              {plan.popular && (
                <div className="mb-4 inline-block px-3 py-1 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs font-semibold rounded-full">
                  가장 인기
                </div>
              )}
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-slate-600 font-medium">
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fidx) => (
                  <li key={fidx} className="flex items-center gap-2 text-slate-700">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/signup")}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                  plan.popular
                    ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-md hover:shadow-lg"
                    : "border-2 border-purple-600 text-purple-600 hover:bg-purple-50"
                }`}
              >
                시작하기
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-br from-purple-700 via-purple-600 to-purple-700 rounded-3xl p-16 text-center text-white shadow-2xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-10 text-white/90 max-w-2xl mx-auto leading-relaxed">
            ONMEET과 함께 더 효율적인 회의 문화를 만들어보세요.
            <br />
            영상 회의와 AI 회의록으로 시간을 절약하세요.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="px-10 py-4 bg-white text-purple-700 font-bold rounded-lg hover:bg-white/95 transition-all duration-200 text-lg shadow-lg"
          >
            무료로 시작하기
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-200/30 bg-white/40 backdrop-blur-lg mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center text-slate-600">
          <p>&copy; 2024 ONMEET. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}
