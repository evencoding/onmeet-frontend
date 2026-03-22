import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, Users, ArrowRight } from "lucide-react";
import AuthLayout from "@/shared/components/AuthLayout";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

export default function SignupFlow() {
  useDocumentTitle("회원가입 - OnMeet");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteToken = searchParams.get("token");
  const email = searchParams.get("email");

  if (inviteToken) {
    navigate(`/signup/employee?token=${inviteToken}${email ? `&email=${encodeURIComponent(email)}` : ""}`);
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
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  };

  return (
    <AuthLayout
      subtitle="가입 방법을 선택하세요"
      colorTheme="purple"
      maxWidth="max-w-4xl"
      showCard={false}
      onBack={() => navigate("/")}
    >

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        <motion.button
          onClick={() => navigate("/signup/company")}
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="group relative"
        >

          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />

          <div className="relative bg-gradient-to-br from-purple-900/40 via-purple-900/20 to-black/60 border border-purple-500/30 rounded-xl p-5 backdrop-blur-xl hover:border-purple-500/60 transition-all duration-300 h-full overflow-hidden">

            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300" />

            <div className="relative z-10">

              <motion.div
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 mb-3"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Building2 className="w-6 h-6 text-white" />
              </motion.div>

              <h2 className="text-lg font-bold text-white mb-2 text-left">
                기업 회원가입
              </h2>
              <p className="text-white/70 text-xs text-left mb-3 leading-relaxed">
                새로운 팀을 만들고
                <br />
                사원들을 초대하세요
              </p>

              <div className="space-y-1.5 mb-4 text-left">
                {["팀 생성 및 관리", "사원 초대", "팀 회의 관리"].map(
                  (feature, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-2 text-white/80 text-xs"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0" />
                      {feature}
                    </motion.div>
                  ),
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-purple-500/20">
                <span className="text-xs font-semibold text-purple-300">
                  시작하기
                </span>
                <motion.div
                  className="text-purple-300"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.button>

        <motion.button
          onClick={() => navigate("/signup/employee")}
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="group relative"
        >

          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />

          <div className="relative bg-gradient-to-br from-pink-900/40 via-blue-900/20 to-black/60 border border-pink-500/30 rounded-xl p-5 backdrop-blur-xl hover:border-pink-500/60 transition-all duration-300 h-full overflow-hidden">

            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/0 to-blue-500/0 group-hover:from-pink-500/10 group-hover:to-blue-500/10 transition-all duration-300" />

            <div className="relative z-10">

              <motion.div
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-blue-500 mb-3"
                whileHover={{ scale: 1.1, rotate: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Users className="w-6 h-6 text-white" />
              </motion.div>

              <h2 className="text-lg font-bold text-white mb-2 text-left">
                사원 회원가입
              </h2>
              <p className="text-white/70 text-xs text-left mb-3 leading-relaxed">
                초대받은 사원으로
                <br />
                팀에 참여하세요
              </p>

              <div className="space-y-1.5 mb-4 text-left">
                {["초대 링크로 가입", "팀 회의 참여", "회의록 접근"].map(
                  (feature, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-2 text-white/80 text-xs"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-400 flex-shrink-0" />
                      {feature}
                    </motion.div>
                  ),
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-pink-500/20">
                <span className="text-xs font-semibold text-pink-300">
                  계속하기
                </span>
                <motion.div
                  className="text-pink-300"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.button>
      </motion.div>

      <motion.p
        className="text-center text-xs text-white/60"
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
    </AuthLayout>
  );
}
