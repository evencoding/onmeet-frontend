import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Sparkles } from "lucide-react";

interface IntroCardProps {
  onCreateMeeting?: () => void;
}

export default function IntroCard({ onCreateMeeting }: IntroCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl dark:bg-gradient-to-br dark:from-purple-900/40 dark:via-black/60 dark:to-pink-900/30 light:bg-gradient-to-br light:from-white light:via-purple-50/40 light:to-pink-100/20 dark:border dark:border-purple-500/30 light:border-2 light:border-purple-300/70 light:shadow-lg light:shadow-purple-200/30 dark:backdrop-blur-md">
      <div className="relative z-10 p-8 md:p-10">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h3 className="text-3xl md:text-4xl font-bold dark:text-white/90 light:text-purple-950 mb-2 leading-tight">
              회의에만 집중하세요
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">나머지는 AI가</span>
              <br />
              처리합니다
            </h3>
            <p className="text-base dark:text-white/60 light:text-purple-700 font-medium">
              영상 자동 기록 & AI 회의록 생성
            </p>
          </div>

          <div className="p-3 rounded-lg dark:bg-purple-500/20 light:bg-purple-100/60 hidden md:flex items-center justify-center ml-6 flex-shrink-0">
            <Sparkles className="w-6 h-6 dark:text-purple-400 light:text-purple-600" />
          </div>
        </div>

        <div className="mb-6 h-px dark:bg-purple-500/20 light:bg-purple-300/50" />

        <button
          onClick={onCreateMeeting}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-base font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/30 hover:shadow-xl light:shadow-purple-400/40 hover:scale-[1.02] active:scale-95"
        >
          회의 생성하기
        </button>

        <p className="text-xs dark:text-white/40 light:text-purple-600 text-center mt-4">
          지금 바로 회의를 시작하세요
        </p>
      </div>
    </div>
  );
}
