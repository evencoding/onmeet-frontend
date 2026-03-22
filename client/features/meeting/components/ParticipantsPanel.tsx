import { MessageCircle, Send } from "lucide-react";
import { memo, useState, useRef, useEffect, useMemo } from "react";
import { useAuth } from "@/features/auth/context";

interface Participant {
  id: string;
  name: string;
  isHost?: boolean;
  isMuted?: boolean;
  isVideoOn?: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isOwn?: boolean;
}

interface ParticipantsPanelProps {
  count?: number;
  participants?: Participant[];
}

const AVATAR_COLORS = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-rose-500 to-red-500",
  "from-violet-500 to-indigo-500",
];

function getAvatarColor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function InitialAvatar({ name, id, size = "w-10 h-10 text-sm" }: { name: string; id: string; size?: string }) {
  return (
    <div className={`${size} rounded-full bg-gradient-to-br ${getAvatarColor(id)} flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {name?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
}

export default memo(function ParticipantsPanel({
  count,
  participants: propsParticipants,
}: ParticipantsPanelProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"participants" | "chat">(
    "participants",
  );
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousParticipantsRef = useRef<Participant[]>([]);

  const participants = useMemo(() => propsParticipants ?? [], [propsParticipants]);
  const displayCount = count ?? participants.length;

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
        sender: user?.name ?? "나",
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

  useEffect(() => {
    if (!participants || participants.length === 0) return;

    const previousParticipants = previousParticipantsRef.current;

    const newParticipants = participants.filter(
      (p) => !previousParticipants.find((prev) => prev.id === p.id),
    );

    const leftParticipants = previousParticipants.filter(
      (p) => !participants.find((curr) => curr.id === p.id),
    );

    newParticipants.forEach((participant) => {
      const systemMessage: ChatMessage = {
        id: `system-join-${Date.now()}-${participant.id}`,
        sender: `${participant.name}님이 입장하셨습니다`,
        message: "",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, systemMessage]);
    });

    leftParticipants.forEach((participant) => {
      const systemMessage: ChatMessage = {
        id: `system-leave-${Date.now()}-${participant.id}`,
        sender: `${participant.name}님이 퇴장하셨습니다`,
        message: "",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, systemMessage]);
    });

    previousParticipantsRef.current = participants;
  }, [participants]);

  return (
    <div className="w-80 border-l border-purple-500/20 bg-purple-900/20 backdrop-blur-md flex flex-col">
      <div className="flex border-b border-purple-500/20 bg-black/40">
        <button
          onClick={() => setActiveTab("participants")}
          className={`flex-1 px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 ${
            activeTab === "participants"
              ? "text-purple-300 border-purple-500"
              : "text-white/50 border-transparent hover:text-white/70"
          }`}
        >
          Participant ({displayCount})
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

      <div className="flex-1 overflow-y-auto">
        {activeTab === "participants" ? (
          <div className="divide-y divide-purple-500/20">
            {participants.length > 0 ? (
              participants.map((participant) => (
                <div
                  key={participant.id}
                  className="px-4 py-3 hover:bg-purple-500/10 transition-colors group"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="relative">
                        <InitialAvatar name={participant.name} id={participant.id} />
                        {participant.isHost && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-xs font-bold text-white border-2 border-purple-900">
                            H
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold dark:text-white/90 light:text-purple-900 truncate">
                          {participant.name}
                        </p>
                        {participant.isHost && (
                          <span className="text-xs dark:text-purple-400 light:text-purple-600 font-medium">
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
              ))
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-white/50">참가자가 없습니다</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-full bg-black/40">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-white/40">채팅을 시작해보세요</p>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.message ? (
                    <div
                      className={`flex gap-2 ${msg.isOwn ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <InitialAvatar name={msg.sender} id={msg.id} size="w-8 h-8 text-xs" />

                      <div
                        className={`flex flex-col max-w-xs ${msg.isOwn ? "items-end" : "items-start"}`}
                      >
                        <span className="text-xs dark:text-white/50 light:text-purple-600 mb-1">
                          {msg.sender} {msg.timestamp}
                        </span>

                        <div
                          className={`px-3 py-2 rounded-2xl text-sm font-medium ${
                            msg.isOwn
                              ? "bg-purple-600 text-white rounded-br-none"
                              : "rounded-bl-none dark:bg-purple-500/30 dark:text-white light:bg-purple-100 light:text-purple-900"
                          }`}
                        >
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center py-2">
                      <span className="text-xs dark:text-white/40 light:text-purple-600 italic dark:bg-purple-500/20 light:bg-purple-100/50 px-3 py-1 rounded-full">
                        {msg.sender}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-purple-500/20 p-4 bg-purple-900/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
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
});
