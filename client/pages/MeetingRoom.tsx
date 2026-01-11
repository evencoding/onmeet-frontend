import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import MeetingRoomHeader from "@/components/MeetingRoomHeader";
import ParticipantsPanel from "@/components/ParticipantsPanel";
import { ChevronLeft, ChevronRight, Mic, MicOff, Video, VideoOff, Phone } from "lucide-react";
import { useState } from "react";

export default function MeetingRoom() {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [currentSpeaker, setCurrentSpeaker] = useState(0);

  const speakers = [
    {
      name: "Akbar Husain",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    },
    {
      name: "Ameesh Menon",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=600&fit=crop",
    },
    {
      name: "Riska Thakur",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    },
  ];

  const thumbnailSpeakers = [
    {
      name: "Speaker 1",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop",
    },
    {
      name: "Speaker 2",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=150&fit=crop",
    },
    {
      name: "Speaker 3",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop",
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:block md:w-72">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <MeetingRoomHeader title="meeting title" />

        {/* Meeting Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Video Area */}
          <div className="flex-1 flex flex-col bg-gradient-to-br from-bg-DEFAULT via-white/20 to-bg-DEFAULT">
            {/* Main Video Feed */}
            <div className="flex-1 p-6 flex flex-col">
              {/* Thumbnail Carousel */}
              <div className="flex items-center gap-3 mb-6">
                <button className="p-2 hover:bg-white/40 rounded-lg transition-colors">
                  <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>

                <div className="flex gap-2 flex-1 overflow-x-auto">
                  {thumbnailSpeakers.map((speaker, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSpeaker(idx)}
                      className={`flex-shrink-0 w-32 h-24 rounded-2xl overflow-hidden transition-all duration-200 border-2 ${
                        currentSpeaker === idx
                          ? "border-brand-500 ring-2 ring-brand-500/30"
                          : "border-border/40 hover:border-border/60"
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

                <button className="p-2 hover:bg-white/40 rounded-lg transition-colors">
                  <ChevronRight className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Main Video Display */}
              <div className="flex-1 rounded-3xl overflow-hidden shadow-lg border border-border/30 group">
                <img
                  src={speakers[currentSpeaker].image}
                  alt={speakers[currentSpeaker].name}
                  className="w-full h-full object-cover"
                />
                {/* Recording Indicator */}
                <div className="absolute top-6 left-6 flex items-center gap-2 bg-red-500/80 px-3 py-1.5 rounded-full text-white text-sm font-semibold">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  REC
                </div>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="px-6 py-4 border-t border-border/30 bg-white/40 backdrop-blur-md flex items-center justify-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full transition-all duration-200 ${
                  isMuted
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-white/70 text-foreground hover:bg-white"
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
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-white/70 text-foreground hover:bg-white"
                }`}
              >
                {isVideoOn ? (
                  <Video className="w-6 h-6" />
                ) : (
                  <VideoOff className="w-6 h-6" />
                )}
              </button>

              <button
                onClick={() => navigate("/")}
                className="p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200"
              >
                <Phone className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Right Panel - Participants */}
          <ParticipantsPanel count={6} />
        </div>
      </main>
    </div>
  );
}
