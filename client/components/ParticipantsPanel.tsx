import { MessageCircle, MoreVertical } from "lucide-react";
import { useState } from "react";

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isHost?: boolean;
  isMuted?: boolean;
  isVideoOn?: boolean;
}

interface ParticipantsPanelProps {
  count?: number;
}

export default function ParticipantsPanel({ count = 5 }: ParticipantsPanelProps) {
  const [activeTab, setActiveTab] = useState<"participants" | "chat">("participants");

  const participants: Participant[] = [
    {
      id: "1",
      name: "Akbar Husain",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop",
      isHost: true,
      isVideoOn: true,
      isMuted: false,
    },
    {
      id: "2",
      name: "Ameesh Menon",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop",
      isVideoOn: true,
      isMuted: false,
    },
    {
      id: "3",
      name: "Jonathan Sasi",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop",
      isVideoOn: false,
      isMuted: true,
    },
    {
      id: "4",
      name: "Riska Thakur",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop",
      isVideoOn: true,
      isMuted: false,
    },
    {
      id: "5",
      name: "Natalia",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop",
      isVideoOn: true,
      isMuted: true,
    },
    {
      id: "6",
      name: "Aila Thakur",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=48&h=48&fit=crop",
      isVideoOn: true,
      isMuted: false,
    },
  ];

  return (
    <div className="w-80 border-l border-border/30 bg-white/40 backdrop-blur-md flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-border/20 bg-white/50">
        <button
          onClick={() => setActiveTab("participants")}
          className={`flex-1 px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
            activeTab === "participants"
              ? "text-brand-500 border-brand-500"
              : "text-text-sub border-transparent hover:text-foreground"
          }`}
        >
          Participant ({count})
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === "chat"
              ? "text-brand-500 border-brand-500"
              : "text-text-sub border-transparent hover:text-foreground"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Chat Room
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "participants" ? (
          <div className="divide-y divide-border/20">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="px-4 py-3 hover:bg-white/40 transition-colors group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {participant.name}
                      </p>
                      {participant.isHost && (
                        <span className="text-xs text-brand-500 font-medium">Host</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {participant.isVideoOn ? (
                      <div className="w-5 h-5 rounded bg-brand-500/20 flex items-center justify-center text-xs text-brand-500">
                        📹
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded bg-gray-200/30 flex items-center justify-center text-xs">
                        ✕
                      </div>
                    )}
                    {participant.isMuted ? (
                      <div className="w-5 h-5 rounded bg-gray-200/30 flex items-center justify-center text-xs">
                        🔇
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded bg-brand-500/20 flex items-center justify-center text-xs text-brand-500">
                        🔊
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-sm text-text-sub">Chat messages will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
