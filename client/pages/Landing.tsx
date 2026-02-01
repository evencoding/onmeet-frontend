import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Video,
  Brain,
  Zap,
  Shield,
  Users,
  ArrowRight,
  CheckCircle,
  Sparkles,
  TrendingUp,
  BarChart3,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Spring animation for smooth transitions
  const springScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  // Parallax effects
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const parallaxY2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.5], [1, 0.5, 0]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

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
    { number: "10,000+", label: "활성 사용자", icon: Users },
    { number: "1M+", label: "기록된 회의", icon: BarChart3 },
    { number: "99.9%", label: "가용성", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-950 via-black to-purple-900">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-black/30 backdrop-blur-xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold text-lg relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="relative">O</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ONMEET
            </span>
          </motion.div>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 text-white/80 font-medium hover:text-white transition-colors"
            >
              로그인
            </button>
            <motion.button
              onClick={() => navigate("/signup")}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              가입하기
            </motion.button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated elements */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
          style={{ y: parallaxY }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"
          style={{ y: parallaxY2 }}
        />

        <motion.div
          className="max-w-5xl mx-auto px-6 text-center relative z-10"
          style={{ scale: scaleHero, opacity }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-6 px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full backdrop-blur-sm"
          >
            <span className="flex items-center gap-2 text-purple-300 font-semibold">
              <Sparkles className="w-4 h-4" /> 미래의 회의 솔루션
            </span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-black mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="block mb-2">회의의</span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              미래를 만나보세요
            </span>
            <span className="block mt-2 text-4xl md:text-6xl">
              <span className="text-white">영상</span>
              <span className="text-purple-400"> + </span>
              <span className="text-pink-400">AI</span>
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            회의에만 집중하세요. 영상 기록과 AI 회의록은 ONMEET이 자동으로 처리합니다.
            <br />
            <span className="text-purple-300 font-semibold">기술과 신뢰가 만나는 순간</span>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.button
              onClick={() => navigate("/signup")}
              className="px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-lg hover:shadow-2xl hover:shadow-purple-500/50 flex items-center gap-2 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              무료로 시작하기
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            <motion.button
              onClick={() => navigate("/login")}
              className="px-10 py-4 border-2 border-purple-500 text-white text-lg font-semibold rounded-lg hover:bg-purple-500/10 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              로그인
            </motion.button>
          </motion.div>

          {/* Animated hero image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-500/20 backdrop-blur-sm"
          >
            <motion.img
              src="https://images.pexels.com/photos/4226261/pexels-photo-4226261.jpeg?w=1200&h=600&fit=crop"
              alt="Video conference meeting"
              className="w-full h-auto object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-white/60 text-sm font-semibold">스크롤하세요</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
              <motion.div
                className="w-1 h-2 bg-white/60 rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Stats Section with scroll trigger */}
      <motion.section
        className="relative py-20 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm hover:border-purple-500/60 transition-all"
                >
                  <motion.div
                    className="text-purple-400 mb-4"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Icon className="w-8 h-8" />
                  </motion.div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <p className="text-white/70 font-medium">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Core Features Section */}
      <motion.section
        className="relative py-32 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              <span className="text-white">강력한</span>{" "}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                기능들
              </span>
            </h2>
            <p className="text-xl text-white/60">
              ONMEET의 고급 기능으로 회의를 완전히 다르게 경험하세요
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300 overflow-hidden"
              >
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300" />

                <motion.div
                  className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-4 relative z-10"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {feature.icon}
                </motion.div>

                <h3 className="text-lg font-bold text-white mb-2 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-white/60 relative z-10">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Two Pillars Section - Video + AI */}
      <motion.section
        className="relative py-32 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                완벽한 조합
              </span>
            </h2>
            <p className="text-xl text-white/60">
              영상 회의와 AI 회의록이 만나 새로운 경험을 만듭니다
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Video Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/0 rounded-3xl blur-2xl group-hover:from-purple-500/30 transition-all duration-500" />

              <div className="relative bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-3xl p-12 backdrop-blur-sm hover:border-purple-500/60 transition-all">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-6"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Video className="w-8 h-8" />
                </motion.div>

                <h3 className="text-3xl font-bold text-white mb-4">
                  영상 회의 자동 기록
                </h3>
                <p className="text-white/70 text-lg mb-8 leading-relaxed">
                  모든 회의를 자동으로 녹화하여 나중에 언제든지 확인할 수 있습니다. 회의 중에 놓친 부분이나 중요한 결정 사항을 다시 확인하세요.
                </p>

                <ul className="space-y-3">
                  {["자동 녹화 및 저장", "고품질 비디오 압축", "언제든 재생 가능"].map(
                    (item, idx) => (
                      <motion.li
                        key={idx}
                        className="flex items-center gap-3 text-white/80"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0" />
                        {item}
                      </motion.li>
                    )
                  )}
                </ul>
              </div>
            </motion.div>

            {/* AI Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-blue-500/0 rounded-3xl blur-2xl group-hover:from-pink-500/30 transition-all duration-500" />

              <div className="relative bg-gradient-to-br from-pink-500/10 to-blue-500/10 border border-pink-500/30 rounded-3xl p-12 backdrop-blur-sm hover:border-pink-500/60 transition-all">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-blue-500 flex items-center justify-center text-white mb-6"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                >
                  <Brain className="w-8 h-8" />
                </motion.div>

                <h3 className="text-3xl font-bold text-white mb-4">
                  AI 회의록 자동 생성
                </h3>
                <p className="text-white/70 text-lg mb-8 leading-relaxed">
                  첨단 AI가 회의 내용을 분석하여 핵심 내용, 결정사항, 할일 항목을 자동으로 정리해줍니다. 시간 낭비 없이 결과에 집중하세요.
                </p>

                <ul className="space-y-3">
                  {["자동 요약 생성", "주요 내용 추출", "할일 자동 할당"].map(
                    (item, idx) => (
                      <motion.li
                        key={idx}
                        className="flex items-center gap-3 text-white/80"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0" />
                        {item}
                      </motion.li>
                    )
                  )}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="relative py-32 px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 via-pink-600/50 to-blue-600/50 rounded-3xl blur-2xl group-hover:blur-3xl transition-all duration-500" />

            <div className="relative bg-gradient-to-br from-purple-900/50 via-pink-900/30 to-blue-900/50 border border-purple-500/50 rounded-3xl p-16 text-center backdrop-blur-sm">
              <motion.h2
                className="text-5xl md:text-6xl font-black mb-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                지금 시작하세요
              </motion.h2>

              <motion.p
                className="text-xl md:text-2xl text-white/80 mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                ONMEET과 함께 회의의 미래를 경험하세요.
                <br />
                <span className="text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">
                  영상 회의와 AI 회의록으로 시간을 절약하세요.
                </span>
              </motion.p>

              <motion.button
                onClick={() => navigate("/signup")}
                className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                무료로 시작하기
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 bg-black/40 backdrop-blur-md py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-white/60">
          <p>&copy; 2024 ONMEET. 모든 권리 보유.</p>
        </div>
      </footer>

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
