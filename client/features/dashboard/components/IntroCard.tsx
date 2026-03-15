import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sparkles } from "lucide-react";

interface IntroCardProps {
  onCreateMeeting?: () => void;
}

export default function IntroCard({ onCreateMeeting }: IntroCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50/40 to-purple-50/20 dark:from-purple-950/30 dark:to-slate-900/50 border border-border/30 dark:border-border/20 shadow-card">
      {/* Content */}
      <div className="relative z-10 p-8 md:p-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-2 leading-tight">
              회의에만 집중하세요
              <br />
              <span className="text-brand-500">나머지는 AI가</span>
              <br />
              처리합니다
            </h3>
            <p className="text-base text-muted-foreground font-medium">
              영상 자동 기록 & AI 회의록 생성
            </p>
          </div>

          <div className="p-3 rounded-lg bg-brand-50/60 dark:bg-brand-500/10 hidden md:flex items-center justify-center ml-6 flex-shrink-0">
            <Sparkles className="w-6 h-6 text-brand-500" />
          </div>
        </div>

        {/* Separator */}
        <div className="mb-6 h-px bg-border/20" />

        {/* Single action button */}
        <button
          onClick={onCreateMeeting}
          className="w-full px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white text-base font-semibold rounded-lg transition-all duration-200 shadow-card hover:shadow-hover active:scale-95"
        >
          회의 생성하기
        </button>

        {/* Decorative text */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          지금 바로 회의를 시작하세요
        </p>
      </div>
    </div>
  );
}
