import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sparkles } from "lucide-react";

interface IntroCardProps {
  onCreateMeeting?: () => void;
}

export default function IntroCard({ onCreateMeeting }: IntroCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/40 via-black/60 to-pink-900/30 border border-purple-500/30 backdrop-blur-md">
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
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent mb-2 leading-tight">
              회의에만 집중하세요
              <br />
              나머지는 AI가&nbsp;
              <br />
              처리합니다
            </h3>
            <p className="text-base text-white/60 mb-8 font-medium">
              영상 자동 기록 & AI 회의록 생성
            </p>
          </div>

          <div className="p-3 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/20 hidden md:flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-purple-300" />
          </div>
        </div>

        {/* Spacer with subtle decoration */}
        <div className="mb-8 h-px bg-gradient-to-r from-purple-500/20 via-pink-500/30 to-transparent" />

        {/* Single action button */}
        <button
          onClick={onCreateMeeting}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/50 hover:scale-105 active:scale-95 uppercase letter-spacing-wider"
        >
          회의 생성하기
        </button>

        {/* Decorative text */}
        <p className="text-xs text-purple-300/60 text-center mt-6 font-medium">
          지금 바로 회의를 시작하세요
        </p>
      </div>
    </div>
  );
}
