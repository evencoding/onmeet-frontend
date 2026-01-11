import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sparkles } from "lucide-react";

interface IntroCardProps {
  onCreateMeeting?: () => void;
}

export default function IntroCard({ onCreateMeeting }: IntroCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-50 via-white to-surface-subtle border border-brand-200">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top right gradient orb */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-brand-300/20 to-brand-100/10 rounded-full blur-3xl animate-pulse" />
        
        {/* Bottom left gradient orb */}
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-brand-200/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Center subtle grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-brand-600 via-brand-500 to-brand-600 bg-clip-text text-transparent mb-2 leading-tight">
              회의에만 집중하세요
            </h3>
            <p className="text-base text-text-sub mb-8 font-medium">기록은 AI가</p>
          </div>
          
          <div className="p-3 rounded-full bg-gradient-to-br from-brand-100 to-brand-50 hidden md:flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-brand-600" />
          </div>
        </div>

        {/* Spacer with subtle decoration */}
        <div className="mb-8 h-px bg-gradient-to-r from-brand-300/20 via-brand-200/30 to-transparent" />

        {/* Single action button */}
        <button
          onClick={onCreateMeeting}
          className="w-full px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-sm font-semibold rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 uppercase letter-spacing-wider"
        >
          회의 생성하기
        </button>

        {/* Decorative text */}
        <p className="text-xs text-brand-500/60 text-center mt-6 font-medium">
          지금 바로 회의를 시작하세요
        </p>
      </div>
    </div>
  );
}
