import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sparkles } from "lucide-react";

interface IntroCardProps {
  onCreateMeeting?: () => void;
}

export default function IntroCard({ onCreateMeeting }: IntroCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/60 dark:to-pink-900/30 light:bg-gradient-to-br light:from-purple-50 light:via-white light:to-pink-100/30 dark:border dark:border-purple-500/30 light:border light:border-purple-300/40 dark:backdrop-blur-md light:backdrop-blur-sm">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top right gradient orb */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-blue-500/10 rounded-full blur-3xl animate-pulse" />

        {/* Bottom left gradient orb */}
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse animation-delay-2000" />

        {/* Center subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold dark:bg-gradient-to-r dark:from-purple-300 dark:via-pink-300 dark:to-purple-300 light:text-purple-900 dark:bg-clip-text dark:text-transparent mb-2 leading-tight">
              회의에만 집중하세요
              <br />
              나머지는 AI가&nbsp;
              <br />
              처리합니다
            </h3>
            <p className="text-base dark:text-white/60 light:text-purple-700 mb-8 font-medium">
              영상 자동 기록 & AI 회의록 생성
            </p>
          </div>

          <div className="p-3 rounded-full dark:bg-gradient-to-br dark:from-purple-500/30 dark:to-pink-500/20 light:bg-gradient-to-br light:from-purple-200 light:to-pink-200 hidden md:flex items-center justify-center">
            <Sparkles className="w-6 h-6 dark:text-purple-300 light:text-purple-600" />
          </div>
        </div>

        {/* Spacer with subtle decoration */}
        <div className="mb-8 h-px dark:bg-gradient-to-r dark:from-purple-500/20 dark:via-pink-500/30 dark:to-transparent light:bg-gradient-to-r light:from-purple-300/30 light:via-pink-300/40 light:to-transparent" />

        {/* Single action button */}
        <button
          onClick={onCreateMeeting}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 active:scale-95 uppercase letter-spacing-wider"
        >
          회의 생성하기
        </button>

        {/* Decorative text */}
        <p className="text-xs dark:text-purple-300/60 light:text-purple-600/60 text-center mt-6 font-medium">
          지금 바로 회의를 시작하세요
        </p>
      </div>
    </div>
  );
}
