import Layout from "@/components/Layout";
import { Clock, MapPin, Users, Download, Share2, Play, Search, Filter } from "lucide-react";
import { useState } from "react";

interface Participant {
  name: string;
  avatar: string;
}

interface MeetingRecord {
  id: string;
  title: string;
  date: string;
  duration: string;
  location: string;
  participants: number;
  participantList: Participant[];
  recordingUrl?: string;
  notes?: string;
  transcript?: string;
  hasTranscript?: boolean;
}

export default function MeetingRecords() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  const records: MeetingRecord[] = [
    {
      id: "1",
      title: "팀 스탠드업",
      date: "2024년 1월 15일 10:00 AM",
      duration: "30분",
      location: "회의실 A",
      participants: 5,
      participantList: [
        { name: "김철수", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop" },
        { name: "이영희", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop" },
        { name: "박민준", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop" },
        { name: "정호준", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop" },
        { name: "조예성", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop" },
      ],
      recordingUrl: "#",
      notes: "주간 목표 검토 및 진도 확인",
      hasTranscript: true,
    },
    {
      id: "2",
      title: "프로젝트 리뷰",
      date: "2024년 1월 14일 2:00 PM",
      duration: "1시간",
      location: "온라인",
      participants: 8,
      participantList: [
        { name: "김철수", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop" },
        { name: "이영희", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop" },
        { name: "박민준", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop" },
        { name: "정호준", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop" },
      ],
      recordingUrl: "#",
      notes: "Q1 프로젝트 진행 상황 논의",
      hasTranscript: true,
    },
    {
      id: "3",
      title: "디자인 피드백",
      date: "2024년 1월 13일 3:30 PM",
      duration: "45분",
      location: "회의실 B",
      participants: 4,
      participantList: [
        { name: "김철수", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop" },
        { name: "이영희", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop" },
      ],
      recordingUrl: "#",
      notes: "신규 UI 디자인 검토",
      hasTranscript: false,
    },
    {
      id: "4",
      title: "클라이언트 프레젠테이션",
      date: "2024년 1월 12일 11:00 AM",
      duration: "1.5시간",
      location: "온라인",
      participants: 6,
      participantList: [
        { name: "김철수", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop" },
        { name: "이영희", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop" },
        { name: "박민준", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop" },
      ],
      recordingUrl: "#",
      notes: "월간 진행 상황 보고",
      hasTranscript: true,
    },
  ];

  const filteredRecords = records.filter((record) => {
    const matchesSearch = record.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      (filterType === "transcript" && record.hasTranscript);
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">회의 기록</h1>
          <p className="text-text-sub">지난 회의 기록을 확인하고 관리하세요</p>
        </div>

        {/* Records List */}
        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-gradient-to-br from-white via-white/80 to-surface-subtle border border-border/40 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {record.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm text-text-sub">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-brand-500" />
                      {record.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-500" />
                      {record.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-brand-500" />
                      {record.participants}명
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-brand-500">⏱</span>
                      {record.duration}
                    </div>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full whitespace-nowrap ml-4">
                  기록 완료
                </span>
              </div>

              {record.notes && (
                <div className="mb-4 pb-4 border-t border-border/20 pt-4">
                  <p className="text-sm text-text-sub">{record.notes}</p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-sm font-semibold rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-200">
                  <Download className="w-4 h-4" />
                  다운로드
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-border/60 text-foreground text-sm font-semibold rounded-lg hover:bg-white/60 transition-all duration-200">
                  <Share2 className="w-4 h-4" />
                  공유
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
