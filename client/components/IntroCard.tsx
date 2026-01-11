export default function IntroCard() {
  return (
    <div className="bg-white border border-border rounded-2xl p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-2">
        회의에만 집중하세요
      </h3>
      <p className="text-sm text-muted-foreground mb-4">기록은 AI가</p>
      
      <div className="flex gap-3">
        <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors">
          회의 생성하기
        </button>
        <button className="flex-1 px-4 py-2 border border-border text-foreground text-sm font-medium rounded-lg hover:bg-secondary transition-colors">
          회의 참여하기
        </button>
      </div>
    </div>
  );
}
