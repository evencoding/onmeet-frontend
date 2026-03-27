import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useTheme } from "@/shared/contexts/ThemeContext";

interface AuthLayoutProps {
  subtitle: string;
  children: ReactNode;
  colorTheme?: "purple" | "blue";
  maxWidth?: string;
  showCard?: boolean;
  onBack?: () => void;
}

const themes = {
  purple: {
    blob1: "bg-purple-500",
    blob2: "bg-blue-500",
    blob3: "bg-pink-500",
    blob1Light: "bg-purple-300",
    blob2Light: "bg-pink-300",
    blob3Light: "bg-purple-200",
    badge: "from-purple-500 to-pink-500",
    badgeAnim: "from-purple-400 to-pink-400",
    title: "from-purple-400 to-pink-400",
  },
  blue: {
    blob1: "bg-blue-500",
    blob2: "bg-purple-500",
    blob3: "bg-cyan-500",
    blob1Light: "bg-blue-300",
    blob2Light: "bg-purple-300",
    blob3Light: "bg-cyan-200",
    badge: "from-blue-500 to-purple-500",
    badgeAnim: "from-blue-400 to-purple-400",
    title: "from-blue-400 to-purple-400",
  },
};

export default function AuthLayout({
  subtitle,
  children,
  colorTheme = "purple",
  maxWidth = "max-w-md",
  showCard = true,
  onBack,
}: AuthLayoutProps) {
  const t = themes[colorTheme];
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen overflow-hidden flex items-center justify-center p-4 ${
        isDark ? "bg-black text-white" : "text-purple-950"
      }`}
    >
      {/* Background */}
      <div
        className={`fixed inset-0 -z-10 bg-gradient-to-br ${
          isDark
            ? "from-purple-950 via-black to-purple-900"
            : "from-purple-100/80 via-white to-pink-100/60"
        }`}
      >
        <div className={`absolute inset-0 ${isDark ? "opacity-40" : "opacity-70"}`}>
          <div
            className={`absolute top-0 -left-4 w-96 h-96 ${isDark ? t.blob1 : t.blob1Light} rounded-full mix-blend-multiply filter blur-3xl ${isDark ? "opacity-20" : "opacity-40"} animate-blob`}
          />
          <div
            className={`absolute top-0 -right-4 w-96 h-96 ${isDark ? t.blob2 : t.blob2Light} rounded-full mix-blend-multiply filter blur-3xl ${isDark ? "opacity-20" : "opacity-40"} animate-blob animation-delay-2000`}
          />
          <div
            className={`absolute -bottom-8 left-20 w-96 h-96 ${isDark ? t.blob3 : t.blob3Light} rounded-full mix-blend-multiply filter blur-3xl ${isDark ? "opacity-20" : "opacity-30"} animate-blob animation-delay-4000`}
          />
        </div>
      </div>

      <motion.div
        className={`${maxWidth} w-full relative z-10`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {onBack && (
          <motion.button
            onClick={onBack}
            className={`flex items-center gap-2 text-sm transition-colors mb-4 ${
              isDark
                ? "text-white/60 hover:text-white"
                : "text-purple-500 hover:text-purple-700"
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ x: -3 }}
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </motion.button>
        )}

        <div className="text-center mb-6">
          <motion.div
            className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br ${t.badge} text-white mb-3 relative overflow-hidden`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <motion.div
              className={`absolute inset-0 bg-gradient-to-r ${t.badgeAnim} opacity-0`}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="relative text-xl font-bold">O</span>
          </motion.div>

          <motion.h1
            className={`text-3xl font-bold mb-1 bg-gradient-to-r ${t.title} bg-clip-text text-transparent`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            ONMEET
          </motion.h1>

          <motion.p
            className={isDark ? "text-white/70" : "text-purple-600"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {subtitle}
          </motion.p>
        </div>

        {showCard ? (
          <motion.div
            className="relative group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 ${
                isDark
                  ? "from-purple-500/20 to-pink-500/20"
                  : "from-purple-300/30 to-pink-300/30"
              }`}
            />

            <div
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                isDark
                  ? "bg-gradient-to-br from-purple-900/40 via-pink-900/20 to-black/60 border border-purple-500/30 hover:border-purple-500/60 backdrop-blur-xl"
                  : "bg-white/80 border-2 border-purple-200/70 hover:border-purple-300 shadow-xl shadow-purple-200/30 backdrop-blur-md"
              }`}
            >
              {children}
            </div>
          </motion.div>
        ) : (
          children
        )}
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
