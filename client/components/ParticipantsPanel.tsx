import { MessageCircle, MoreVertical, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isHost?: boolean;
  isMuted?: boolean;
  isVideoOn?: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  message: string;
  timestamp: string;
  isOwn?: boolean;
}

interface ParticipantsPanelProps {
  count?: number;
  participants?: Participant[];
}

export default function ParticipantsPanel({
  count = 5,
  participants: propsParticipants,
}: ParticipantsPanelProps) {
  const [activeTab, setActiveTab] = useState<"participants" | "chat">(
    "participants",
  );
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "시용지",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
      message: "Can u hear my voice",
      timestamp: "9:04 AM",
      isOwn: false,
    },
    {
      id: "2",
      sender: "나",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
      message: "Ok wait, 5 min",
      timestamp: "9:05 AM",
      isOwn: true,
    },
    {
      id: "3",
      sender: "시용지",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
      message: "Can u hear my voice",
      timestamp: "9:04 AM",
      isOwn: false,
    },
    {
      id: "4",
      sender: "나",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
      message: "Ok wait, 5 min",
      timestamp: "9:05 AM",
      isOwn: true,
    },
    {
      id: "5",
      sender: "아무개",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
      message: "Thanks ...",
      timestamp: "9:04 AM",
      isOwn: false,
    },
    {
      id: "6",
      sender: "시용지",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
      message: "Can u hear my voice",
      timestamp: "9:04 AM",
      isOwn: false,
    },
    {
      id: "7",
      sender: "나",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
      message: "Ok wait, 5 min",
      timestamp: "9:05 AM",
      isOwn: true,
    },
    {
      id: "8",
      sender: "아무개",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
      message: "Thanks ...",
      timestamp: "9:04 AM",
      isOwn: false,
    },
    {
      id: "9",
      sender: "시용지가 님이 입장했습니다",
      avatar: "",
      message: "",
      timestamp: "9:04 AM",
      isOwn: false,
    },
    {
      id: "10",
      sender: "아무개",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop",
      message: "Hi!...",
      timestamp: "9:04 AM",
      isOwn: false,
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousParticipantsRef = useRef<Participant[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "나",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop",
        message: messageInput,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
      setMessageInput("");
    }
  };

  const defaultParticipants: Participant[] = [
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
  ];

  const participants = propsParticipants || defaultParticipants;

  // 참가자 변화 감시 - 입장/퇴장 메시지 자동 추가
  useEffect(() => {
    if (!participants || participants.length === 0) return;

    const previousParticipants = previousParticipantsRef.current;

    // 새로 입장한 참가자 찾기
    const newParticipants = participants.filter(
      (p) => !previousParticipants.find((prev) => prev.id === p.id),
    );

    // 퇴장한 참가자 찾기
    const leftParticipants = previousParticipants.filter(
      (p) => !participants.find((curr) => curr.id === p.id),
    );

    // 입장 메시지 추가
    newParticipants.forEach((participant) => {
      const systemMessage: ChatMessage = {
        id: `system-join-${Date.now()}-${participant.id}`,
        sender: `${participant.name}님이 입장하셨습니다`,
        avatar: "",
        message: "",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, systemMessage]);
    });

    // 퇴장 메시지 추가
    leftParticipants.forEach((participant) => {
      const systemMessage: ChatMessage = {
        id: `system-leave-${Date.now()}-${participant.id}`,
        sender: `${participant.name}님이 퇴장하셨습니다`,
        avatar: "",
        message: "",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, systemMessage]);
    });

    // 현재 참가자 목록을 이전 목록으로 업데이트
    previousParticipantsRef.current = participants;
  }, [participants]);

  return (
    <div className="w-80 border-l border-purple-500/20 bg-purple-900/20 backdrop-blur-md flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-purple-500/20 bg-black/40">
        <button
          onClick={() => setActiveTab("participants")}
          className={`flex-1 px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
            activeTab === "participants"
              ? "text-purple-300 border-purple-500"
              : "text-white/50 border-transparent hover:text-white/70"
          }`}
        >
          Participant ({count})
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === "chat"
              ? "text-purple-300 border-purple-500"
              : "text-white/50 border-transparent hover:text-white/70"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Chat Room
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "participants" ? (
          <div className="divide-y divide-purple-500/20">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="px-4 py-3 hover:bg-purple-500/10 transition-colors group"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative">
                      <img
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {participant.isHost && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-purple-900">
                          H
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white/90 truncate">
                        {participant.name}
                      </p>
                      {participant.isHost && (
                        <span className="text-xs text-purple-400 font-medium">
                          Host
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {participant.isVideoOn ? (
                      <div className="w-5 h-5 rounded bg-purple-500/30 flex items-center justify-center text-xs text-purple-300">
                        V
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-xs text-white/40">
                        ✕
                      </div>
                    )}
                    {participant.isMuted ? (
                      <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-xs text-white/40">
                        M
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded bg-purple-500/30 flex items-center justify-center text-xs text-purple-300">
                        A
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col h-full bg-black/40">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <div key={msg.id}>
                  {msg.message ? (
                    <div
                      className={`flex gap-2 ${msg.isOwn ? "flex-row-reverse" : "flex-row"}`}
                    >
                      {/* Avatar */}
                      {msg.avatar && (
                        <img
                          src={msg.avatar}
                          alt={msg.sender}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                      )}

                      {/* Message Content */}
                      <div
                        className={`flex flex-col max-w-xs ${msg.isOwn ? "items-end" : "items-start"}`}
                      >
                        {/* Sender and Timestamp on same line */}
                        <span className="text-xs text-white/50 mb-1">
                          {msg.sender} {msg.timestamp}
                        </span>

                        {/* Message Bubble */}
                        <div
                          className={`px-3 py-2 rounded-2xl text-sm font-medium ${
                            msg.isOwn
                              ? "bg-purple-600 text-white rounded-br-none"
                              : "rounded-bl-none bg-purple-500/30 text-white"
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  ) : (
                    // System message - centered
                    <div className="flex justify-center py-2">
                      <span className="text-xs text-white/40 italic bg-purple-500/20 px-3 py-1 rounded-full">
                        {msg.sender}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-purple-500/20 p-4 bg-purple-900/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                  placeholder="Message..."
                  className="flex-1 px-4 py-2.5 border border-purple-500/30 rounded-full bg-purple-500/10 focus:bg-purple-500/20 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all text-sm text-white placeholder-white/40"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
