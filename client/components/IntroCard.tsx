interface IntroCardProps {
  onCreateMeeting?: () => void;
}

export default function IntroCard({ onCreateMeeting }: IntroCardProps) {
  return (
    <div className="bg-gradient-to-br from-white via-white/80 to-surface-subtle border border-border/40 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 backdrop-blur-sm group overflow-hidden relative">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

      <div className="relative z-10">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground to-text-body bg-clip-text text-transparent mb-2 leading-tight">
          회의에만 집중하세요
        </h3>
        <p className="text-base text-text-sub mb-8 font-medium">기록은 AI가</p>

        <div className="flex gap-3">
          <button
            onClick={onCreateMeeting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-sm font-semibold rounded-xl hover:from-brand-600 hover:to-brand-700 transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 uppercase letter-spacing-wider">
            회의 생성하기
          </button>
          <button className="flex-1 px-6 py-3 border border-border/60 bg-white/70 text-foreground text-sm font-semibold rounded-xl hover:bg-white hover:border-border hover:shadow-md transition-all duration-300 uppercase letter-spacing-wider">
            회의 참여하기
          </button>
        </div>
      </div>
    </div>
  );
}
