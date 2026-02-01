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
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">회의 기록</h1>
          <p className="text-text-sub">지난 회의 기록을 확인하고 관리하세요</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="회의 제목 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border/50 rounded-xl bg-white/60 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-sm"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-10 pr-4 py-3 border border-border/50 rounded-xl bg-white/60 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all text-sm appearance-none cursor-pointer"
              >
                <option value="all">모든 기록</option>
                <option value="transcript">자막 있음</option>
              </select>
            </div>
          </div>
        </div>

        {/* Records List */}
        <div className="space-y-4">
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <div
                key={record.id}
                onClick={() => setSelectedRecord(selectedRecord === record.id ? null : record.id)}
                className="bg-gradient-to-br from-white via-white/80 to-surface-subtle border border-border/40 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground mb-3">
                      {record.title}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-text-sub mb-4">
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
                        <Clock className="w-4 h-4 text-brand-500" />
                        {record.duration}
                      </div>
                    </div>

                    {/* Participant Avatars */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs font-semibold text-text-sub mr-2">참가자:</span>
                      <div className="flex -space-x-2">
                        {record.participantList.map((participant, idx) => (
                          <img
                            key={idx}
                            src={participant.avatar}
                            alt={participant.name}
                            title={participant.name}
                            className="w-8 h-8 rounded-full border-2 border-white object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full whitespace-nowrap">
                      기록 완료
                    </span>
                    {record.hasTranscript && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full whitespace-nowrap">
                        자막 있음
                      </span>
                    )}
                  </div>
                </div>

                {record.notes && (
                  <div className="mb-4 pb-4 border-t border-border/20 pt-4">
                    <p className="text-sm text-text-sub">{record.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-sm font-semibold rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-200">
                    <Play className="w-4 h-4" />
                    재생
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-primary-foreground text-sm font-semibold rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all duration-200">
                    <Download className="w-4 h-4" />
                    다운로드
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-border/60 text-foreground text-sm font-semibold rounded-lg hover:bg-white/60 transition-all duration-200">
                    <Share2 className="w-4 h-4" />
                    공유
                  </button>
                </div>

                {/* Expandable Transcript Section */}
                {selectedRecord === record.id && record.hasTranscript && (
                  <div className="mt-4 pt-4 border-t border-border/20 space-y-3">
                    <h4 className="font-semibold text-foreground">회의 자막</h4>
                    <div className="bg-white/60 rounded-lg p-4 text-sm text-text-sub max-h-64 overflow-y-auto">
                      <p>
                        안녕하세요, 이번 주 팀 회의를 시작하겠습니다. 먼저 지난주 진행상황을 정리하고, 이번주 목표를 설정해보겠습니다.
                      </p>
                      <p className="mt-3">
                        현재 프로젝트는 일정대로 진행되고 있으며, 몇 가지 이슈가 있어 함께 논의하고 싶습니다.
                      </p>
                      <p className="mt-3">
                        각 팀별로 현황을 공유해주시기 바랍니다.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-text-sub">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
