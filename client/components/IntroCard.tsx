export default function IntroCard() {
  return (
    <div className="bg-gradient-to-br from-white via-surface-subtle to-white border border-border/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-xs">
      <h3 className="text-lg font-semibold text-foreground mb-2 bg-gradient-to-r from-foreground to-text-sub bg-clip-text text-transparent">
        회의에만 집중하세요
      </h3>
      <p className="text-sm text-muted-foreground mb-6">기록은 AI가</p>

      <div className="flex gap-3">
        <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-sm font-medium rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95">
          회의 생성하기
        </button>
        <button className="flex-1 px-4 py-2.5 border border-border/70 bg-white/50 text-foreground text-sm font-medium rounded-lg hover:bg-white/80 hover:border-border transition-all duration-200">
          회의 참여하기
        </button>
      </div>
    </div>
  );
}
