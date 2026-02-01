import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import MeetingRoomHeader from "@/components/MeetingRoomHeader";
import ParticipantsPanel from "@/components/ParticipantsPanel";
import InviteParticipantModal from "@/components/InviteParticipantModal";
import {
  ChevronLeft,
  ChevronRight,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  Circle,
} from "lucide-react";
import { useState, useEffect } from "react";

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isHost?: boolean;
  isMuted?: boolean;
  isVideoOn?: boolean;
}

interface GuestInfo {
  name: string;
  description: string;
  isGuest: boolean;
}

export default function MeetingRoom() {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [currentSpeaker, setCurrentSpeaker] = useState(0);
  const [showParticipants, setShowParticipants] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // 게스트 정보 로드
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);

  useEffect(() => {
    const storedGuestInfo = sessionStorage.getItem("guestInfo");
    if (storedGuestInfo) {
      setGuestInfo(JSON.parse(storedGuestInfo));
      // 사용된 후 제거
      sessionStorage.removeItem("guestInfo");
    }
  }, []);

  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "1",
      name: "Akbar Husain",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop",
      isHost: true,
      isVideoOn: true,
      isMuted: false,
    },
    {
      id: "2",
      name: "Ameesh Menon",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop",
      isVideoOn: true,
      isMuted: false,
    },
    {
      id: "3",
      name: "Jonathan Sasi",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop",
      isVideoOn: false,
      isMuted: true,
    },
    {
      id: "4",
      name: "Riska Thakur",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop",
      isVideoOn: true,
      isMuted: false,
    },
    {
      id: "5",
      name: "Natalia",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop",
      isVideoOn: true,
      isMuted: true,
    },
    {
      id: "6",
      name: "Aila Thakur",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop",
      isVideoOn: true,
      isMuted: false,
    },
  ]);

  const handleInviteParticipants = (newMembers: any[]) => {
    const newParticipants = newMembers.map((member) => ({
      id: member.id,
      name: member.name,
      avatar: member.avatar,
      isHost: false,
      isVideoOn: true,
      isMuted: false,
    }));
    setParticipants((prev) => [...prev, ...newParticipants]);
  };

  const speakers = [
    {
      name: "Akbar Husain",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    },
    {
      name: "Ameesh Menon",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop",
    },
    {
      name: "Riska Thakur",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    },
  ];

  const thumbnailSpeakers = [
    {
      name: "Speaker 1",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop",
    },
    {
      name: "Speaker 2",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=150&fit=crop",
    },
    {
      name: "Speaker 3",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop",
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - 게스트는 숨김 */}
      {!guestInfo && (
        <div className="hidden md:block transition-all duration-300">
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <MeetingRoomHeader
          title={guestInfo ? `${guestInfo.name} (게스트)` : "meeting title"}
          onInvite={() => setIsInviteModalOpen(true)}
          onToggleParticipants={() => setShowParticipants(!showParticipants)}
          isGuest={!!guestInfo}
        />

        {/* Meeting Content */}
        <div className="flex-1 overflow-hidden flex relative">
          {/* Animated background */}
          <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-950 via-black to-purple-900">
            <div className="absolute inset-0 opacity-40">
              <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
              <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>
          </div>

          {/* Video Area */}
          <div
            className={`${showParticipants ? "flex-1" : "w-full"} flex flex-col bg-gradient-to-br from-purple-950/30 via-black/60 to-purple-950/30 relative z-10`}
          >
            {/* Main Video Feed */}
            <div className="flex-1 overflow-hidden p-6 flex flex-col justify-between">
              {/* Thumbnail Carousel */}
              <div className="flex items-center gap-3 mb-6">
                <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
                  <ChevronLeft className="w-5 h-5 text-white/70" />
                </button>

                <div className="flex gap-2 flex-1 overflow-x-auto">
                  {thumbnailSpeakers.map((speaker, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSpeaker(idx)}
                      className={`flex-shrink-0 w-32 h-24 rounded-2xl overflow-hidden transition-all duration-200 border-2 ${
                        currentSpeaker === idx
                          ? "border-purple-400 ring-2 ring-purple-500/30"
                          : "border-purple-500/30 hover:border-purple-400"
                      }`}
                    >
                      <img
                        src={speaker.image}
                        alt={speaker.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                <button className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors">
                  <ChevronRight className="w-5 h-5 text-white/70" />
                </button>
              </div>

              {/* Main Video Display */}
              <div className="rounded-3xl overflow-hidden shadow-lg border border-purple-500/30 group relative w-full h-full">
                <img
                  src={speakers[currentSpeaker].image}
                  alt={speakers[currentSpeaker].name}
                  className="w-full h-full object-cover"
                />
                {/* Recording Indicator */}
                {isRecording && (
                  <div className="absolute top-6 left-6 flex items-center gap-2 bg-red-500/80 px-3 py-1.5 rounded-full text-white text-sm font-semibold">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                    REC
                  </div>
                )}
              </div>
            </div>

            {/* Controls Bar - Fixed at bottom */}
            <div className="px-6 py-4 border-t border-purple-500/20 bg-purple-900/20 backdrop-blur-md flex items-center justify-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full transition-all duration-200 ${
                  isMuted
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-purple-500/30 text-white hover:bg-purple-500/50"
                }`}
              >
                {isMuted ? (
                  <MicOff className="w-6 h-6" />
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-4 rounded-full transition-all duration-200 ${
                  !isVideoOn
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-purple-500/30 text-white hover:bg-purple-500/50"
                }`}
              >
                {isVideoOn ? (
                  <Video className="w-6 h-6" />
                ) : (
                  <VideoOff className="w-6 h-6" />
                )}
              </button>

              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-4 rounded-full transition-all duration-200 flex items-center gap-2 ${
                  isRecording
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-purple-500/30 text-white hover:bg-purple-500/50"
                }`}
                title={isRecording ? "녹화 중지" : "녹화 시작"}
              >
                <Circle className="w-3 h-3 fill-current" />
                <span className="text-xs font-semibold">REC</span>
              </button>

              <button
                onClick={() => navigate("/")}
                className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-200"
              >
                <Phone className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Right Panel - Participants */}
          {showParticipants && (
            <ParticipantsPanel
              participants={participants}
              count={participants.length}
            />
          )}
        </div>
      </main>

      {/* Invite Participant Modal */}
      <InviteParticipantModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInviteParticipants}
        alreadyInvited={participants.map((p) => p.id)}
      />
    </div>
  );
}
