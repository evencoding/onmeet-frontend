import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  subtitle: string;
  children: ReactNode;
  colorTheme?: "purple" | "blue";
  maxWidth?: string;
  showCard?: boolean;
}

const themes = {
  purple: {
    bg: "from-purple-950 via-black to-purple-900",
    blob1: "bg-purple-500",
    blob2: "bg-blue-500",
    blob3: "bg-pink-500",
    badge: "from-purple-500 to-pink-500",
    badgeAnim: "from-purple-400 to-pink-400",
    title: "from-purple-400 to-pink-400",
    glow: "from-purple-500/20 to-pink-500/20",
    cardBg: "from-purple-900/40 via-pink-900/20 to-black/60",
    cardBorder: "border-purple-500/30",
    cardBorderHover: "hover:border-purple-500/60",
  },
  blue: {
    bg: "from-blue-950 via-black to-purple-900",
    blob1: "bg-blue-500",
    blob2: "bg-purple-500",
    blob3: "bg-cyan-500",
    badge: "from-blue-500 to-purple-500",
    badgeAnim: "from-blue-400 to-purple-400",
    title: "from-blue-400 to-purple-400",
    glow: "from-blue-500/20 to-purple-500/20",
    cardBg: "from-blue-900/40 via-purple-900/20 to-black/60",
    cardBorder: "border-blue-500/30",
    cardBorderHover: "hover:border-blue-500/60",
  },
};

export default function AuthLayout({
  subtitle,
  children,
  colorTheme = "purple",
  maxWidth = "max-w-md",
  showCard = true,
}: AuthLayoutProps) {
  const t = themes[colorTheme];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex items-center justify-center p-4">
      {/* Animated gradient background */}
      <div className={`fixed inset-0 -z-10 bg-gradient-to-br ${t.bg}`}>
        <div className="absolute inset-0 opacity-40">
          <div
            className={`absolute top-0 -left-4 w-96 h-96 ${t.blob1} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob`}
          />
          <div
            className={`absolute top-0 -right-4 w-96 h-96 ${t.blob2} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000`}
          />
          <div
            className={`absolute -bottom-8 left-20 w-96 h-96 ${t.blob3} rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000`}
          />
        </div>
      </div>

      <motion.div
        className={`${maxWidth} w-full relative z-10`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo and Header */}
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
            className="text-white/70"
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
            {/* Glow effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${t.glow} rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100`}
            />

            <div
              className={`relative bg-gradient-to-br ${t.cardBg} border ${t.cardBorder} rounded-2xl p-8 backdrop-blur-xl ${t.cardBorderHover} transition-all duration-300`}
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
