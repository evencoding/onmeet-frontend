import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Users, ArrowRight, Sparkles } from "lucide-react";

export default function SignupFlow() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("token");

  // If user has invite token, go directly to employee signup
  if (inviteToken) {
    navigate(`/signup/employee?token=${inviteToken}`);
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
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
        className="max-w-4xl w-full relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo and Header */}
        <div className="text-center mb-6">
          <motion.div
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-2 relative overflow-hidden"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0"
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="relative text-lg font-bold">O</span>
          </motion.div>

          <motion.h1
            className="text-3xl md:text-4xl font-black mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            가입 방법을 선택하세요
          </motion.h1>

          <motion.p
            className="text-sm text-white/70"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            ONMEET과 함께 회의의 미래를 시작하세요
          </motion.p>
        </div>

        {/* Signup Type Selection */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Company Signup */}
          <motion.button
            onClick={() => navigate("/signup/company")}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="group relative"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />

            <div className="relative bg-gradient-to-br from-purple-900/40 via-purple-900/20 to-black/60 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-xl hover:border-purple-500/60 transition-all duration-300 h-full overflow-hidden">
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300" />

              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-6"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Building2 className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <h2 className="text-2xl font-bold text-white mb-3 text-left">
                  기업 회원가입
                </h2>
                <p className="text-white/70 text-left mb-6 leading-relaxed">
                  새로운 팀을 만들고
                  <br />
                  사원들을 초대하세요
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8 text-left">
                  {["팀 생성 및 관리", "사원 초대", "팀 회의 관리"].map(
                    (feature, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-center gap-3 text-white/80"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-2 h-2 rounded-full bg-purple-400 flex-shrink-0" />
                        {feature}
                      </motion.div>
                    )
                  )}
                </div>

                {/* Button */}
                <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
                  <span className="text-sm font-semibold text-purple-300">
                    시작하기
                  </span>
                  <motion.div
                    className="text-purple-300"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.button>

          {/* Employee Signup */}
          <motion.button
            onClick={() => navigate("/signup/employee")}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="group relative"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />

            <div className="relative bg-gradient-to-br from-pink-900/40 via-blue-900/20 to-black/60 border border-pink-500/30 rounded-2xl p-8 backdrop-blur-xl hover:border-pink-500/60 transition-all duration-300 h-full overflow-hidden">
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-blue-500/0 group-hover:from-pink-500/10 group-hover:to-blue-500/10 transition-all duration-300" />

              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-blue-500 mb-6"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Users className="w-8 h-8 text-white" />
                </motion.div>

                {/* Content */}
                <h2 className="text-2xl font-bold text-white mb-3 text-left">
                  사원 회원가입
                </h2>
                <p className="text-white/70 text-left mb-6 leading-relaxed">
                  초대받은 사원으로
                  <br />
                  팀에 참여하세요
                </p>

                {/* Features */}
                <div className="space-y-3 mb-8 text-left">
                  {["초대 링크로 가입", "팀 회의 참여", "회의록 접근"].map(
                    (feature, idx) => (
                      <motion.div
                        key={idx}
                        className="flex items-center gap-3 text-white/80"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="w-2 h-2 rounded-full bg-pink-400 flex-shrink-0" />
                        {feature}
                      </motion.div>
                    )
                  )}
                </div>

                {/* Button */}
                <div className="flex items-center justify-between pt-4 border-t border-pink-500/20">
                  <span className="text-sm font-semibold text-pink-300">
                    계속하기
                  </span>
                  <motion.div
                    className="text-pink-300"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* Demo Note */}
        <motion.p
          className="text-center text-sm text-white/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          이미 계정이 있으신가요?{" "}
          <motion.button
            onClick={() => navigate("/login")}
            className="text-purple-300 font-semibold hover:text-pink-300 transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            로그인하기
          </motion.button>
        </motion.p>
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
