import { useNavigate } from "react-router-dom";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  MessageCircle,
  Zap,
  Maximize,
  Users,
  Send,
  X,
  Loader,
  Camera,
  Share2,
  FileText,
  Minimize,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import AIRecordingModal from "@/components/AIRecordingModal";
import InviteParticipantModal from "@/components/InviteParticipantModal";
import MeetingPreparationModal from "@/components/MeetingPreparationModal";

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isHost?: boolean;
  isMuted?: boolean;
  isVideoOn?: boolean;
  isSpeaking?: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  avatar: string;
  message: string;
  timestamp: string;
}

export default function MeetingRoom() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const screenShareRef = useRef<MediaStream | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPIPMode, setIsPIPMode] = useState(false);
  const [viewMode, setViewMode] = useState<"gallery" | "speaker">("gallery");
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [isAIRecording, setIsAIRecording] = useState(false);
  const [isAIRecordingModalOpen, setIsAIRecordingModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [showPreparationModal, setShowPreparationModal] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [currentSpeaker, setCurrentSpeaker] = useState(0);

  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "1",
      name: "Akbar Husain",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      isHost: true,
      isVideoOn: true,
      isMuted: false,
      isSpeaking: true,
    },
    {
      id: "2",
      name: "Ameesh Menon",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      isVideoOn: true,
      isMuted: false,
      isSpeaking: false,
    },
    {
      id: "3",
      name: "Jonathan Sasi",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      isVideoOn: true,
      isMuted: true,
      isSpeaking: false,
    },
    {
      id: "4",
      name: "Riska Thakur",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      isVideoOn: true,
      isMuted: false,
      isSpeaking: false,
    },
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "Akbar Husain",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
      message: "Good morning everyone!",
      timestamp: "10:30",
    },
    {
      id: "2",
      sender: "Ameesh Menon",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop",
      message: "Hi! Ready to start the meeting",
      timestamp: "10:31",
    },
  ]);

  // Initialize camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: !isMuted,
        });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media:", err);
      }
    };

    if (isVideoOn) {
      startCamera();
    }

    return () => {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isVideoOn]);

  // Toggle fullscreen
  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "You",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
        message: chatMessage,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatMessages([...chatMessages, newMessage]);
      setChatMessage("");
    }
  };

  const handleStartAIRecording = () => {
    setIsAIRecording(true);
  };

  const handleEndAIRecording = () => {
    setIsAIRecording(false);
  };

  // Screenshot functionality
  const handleScreenshot = async () => {
    try {
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        const video = localVideoRef.current;

        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext("2d");
          if (ctx) {
            canvasRef.current.width = video.videoWidth;
            canvasRef.current.height = video.videoHeight;
            ctx.drawImage(video, 0, 0);

            canvasRef.current.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `screenshot-${Date.now()}.png`;
                a.click();
                URL.revokeObjectURL(url);
              }
            });
          }
        }
      }
    } catch (err) {
      console.error("Screenshot error:", err);
    }
  };

  // Screen sharing functionality
  const handleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        // Stop screen sharing
        if (screenShareRef.current) {
          screenShareRef.current.getTracks().forEach((track) => track.stop());
          screenShareRef.current = null;
        }
        setIsScreenSharing(false);
      } else {
        // Start screen sharing
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { cursor: "always" },
          audio: false,
        });
        screenShareRef.current = stream;
        setIsScreenSharing(true);

        // Stop sharing when user stops from system dialog
        stream.getVideoTracks()[0].addEventListener("ended", () => {
          setIsScreenSharing(false);
          screenShareRef.current = null;
        });
      }
    } catch (err) {
      console.error("Screen share error:", err);
    }
  };

  // Add note to chat
  const handleAddNote = () => {
    if (noteText.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: "You",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop",
        message: `📝 ${noteText}`,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setChatMessages([...chatMessages, newMessage]);
      setNoteText("");
      setShowNoteInput(false);
    }
  };

  // PIP 모드 UI
  if (isPIPMode) {
    return (
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-purple-950 via-black to-purple-900 rounded-2xl shadow-2xl w-96 h-72 border border-purple-500/30 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-purple-500/20 bg-purple-900/40 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">회의 진행 중</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPIPMode(false)}
                className="p-1 hover:bg-purple-500/20 rounded-lg transition-colors text-white"
                title="전체보기로 돌아가기"
              >
                <Maximize className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate("/")}
                className="p-1 hover:bg-red-600/30 rounded-lg transition-colors text-red-400"
                title="회의 나가기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Video Preview */}
          <div className="flex-1 relative bg-black overflow-hidden">
            {isVideoOn ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/40 to-black">
                <VideoOff className="w-12 h-12 text-white/30" />
              </div>
            )}

            {/* Floating Controls */}
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 px-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-2 rounded-full transition-all ${
                  isMuted
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
                title={isMuted ? "음성 켜기" : "음성 끄기"}
              >
                {isMuted ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-2 rounded-full transition-all ${
                  !isVideoOn
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
                title={isVideoOn ? "카메라 끄기" : "카메라 켜기"}
              >
                {isVideoOn ? (
                  <Video className="w-4 h-4" />
                ) : (
                  <VideoOff className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* AI Recording Indicator */}
            {isAIRecording && (
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-red-600 px-2 py-1 rounded-full text-xs font-semibold text-white">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                녹화 중
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="px-4 py-2 border-t border-purple-500/20 bg-purple-900/40 text-xs text-white/70">
            {participants.length}명 참여 중
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-950 via-black to-purple-900 text-white overflow-hidden">
      {/* Hidden canvas for screenshots */}
      <canvas ref={canvasRef} className="hidden" />
      {/* Main Video Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          showChat && showParticipants ? "w-1/2" : showChat || showParticipants ? "w-2/3" : "w-full"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-purple-500/20 bg-purple-900/20 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
              title="Back to home"
            >
              <Phone className="w-5 h-5 rotate-180" />
            </button>
            <h1 className="text-2xl font-bold">Meeting Title</h1>
            <button
              onClick={() => setIsPIPMode(true)}
              className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
              title="PIP 모드로 이동 (연결 유지)"
            >
              <Minimize className="w-5 h-5 text-purple-400" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/60">{participants.length} 명 참여 중</span>
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
              title="전체화면"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Content */}
        <div className="flex-1 overflow-hidden p-4">
          {viewMode === "gallery" ? (
            // Gallery View - Grid of participants (2x2)
            <div className="grid grid-cols-2 gap-4 h-full overflow-auto max-w-4xl mx-auto">
              {participants.slice(0, 4).map((participant, idx) => (
                <div
                  key={participant.id}
                  className={`relative rounded-2xl overflow-hidden bg-black border-2 transition-all aspect-video ${
                    participant.isSpeaking
                      ? "border-purple-500 ring-2 ring-purple-500/50"
                      : "border-purple-500/20"
                  }`}
                >
                  {/* Participant Video / Avatar */}
                  <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-black flex items-center justify-center relative">
                    {idx === 0 && isVideoOn ? (
                      <video
                        ref={localVideoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={participant.avatar}
                        alt={participant.name}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* Speaking indicator */}
                    {participant.isSpeaking && (
                      <div className="absolute top-2 left-2">
                        <div className="flex items-center gap-1 bg-green-600 px-2 py-1 rounded-full text-xs font-semibold">
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                          Speaking
                        </div>
                      </div>
                    )}

                    {/* Name and Status */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <p className="text-sm font-semibold">{participant.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-white/70">
                        {participant.isMuted && <MicOff className="w-3 h-3" />}
                        {!participant.isVideoOn && <VideoOff className="w-3 h-3" />}
                      </div>
                    </div>

                    {/* Host Badge */}
                    {participant.isHost && (
                      <div className="absolute top-2 right-2 bg-blue-600 px-2 py-1 rounded-full text-xs font-semibold">
                        Host
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Speaker View
            <div className="flex h-full gap-4">
              {/* Main Speaker */}
              <div className="flex-1 rounded-2xl overflow-hidden border-2 border-purple-500 ring-2 ring-purple-500/30 relative">
                <div className="w-full h-full bg-gradient-to-br from-purple-900/40 to-black flex items-center justify-center">
                  {currentSpeaker === 0 && isVideoOn ? (
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={participants[currentSpeaker].avatar}
                      alt={participants[currentSpeaker].name}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Speaker Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                    <p className="text-2xl font-bold">{participants[currentSpeaker].name}</p>
                    <p className="text-white/70 mt-1">Now speaking</p>
                  </div>

                  {/* AI Recording Indicator */}
                  {isAIRecording && (
                    <div className="absolute top-6 left-6 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-full text-white font-semibold">
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                      AI 회의록
                    </div>
                  )}
                </div>
              </div>

              {/* Side Thumbnails */}
              <div className="w-32 flex flex-col gap-2 overflow-y-auto">
                {participants.map((participant, idx) => (
                  <button
                    key={participant.id}
                    onClick={() => setCurrentSpeaker(idx)}
                    className={`relative w-full h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      currentSpeaker === idx
                        ? "border-purple-400"
                        : "border-purple-500/30 hover:border-purple-400"
                    }`}
                  >
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-1">
                      <p className="text-xs font-semibold line-clamp-1">
                        {participant.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Control Bar */}
        <div className="px-6 py-4 border-t border-purple-500/20 bg-purple-900/20 backdrop-blur-md flex items-center justify-center gap-4">
          {/* Mic Button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full transition-all duration-200 ${
              isMuted
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-purple-500/30 text-white hover:bg-purple-500/50"
            }`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <MicOff className="w-6 h-6" />
            ) : (
              <Mic className="w-6 h-6" />
            )}
          </button>

          {/* Video Button */}
          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-4 rounded-full transition-all duration-200 ${
              !isVideoOn
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-purple-500/30 text-white hover:bg-purple-500/50"
            }`}
            title={isVideoOn ? "Turn off video" : "Turn on video"}
          >
            {isVideoOn ? (
              <Video className="w-6 h-6" />
            ) : (
              <VideoOff className="w-6 h-6" />
            )}
          </button>

          {/* AI Recording Button */}
          <button
            onClick={() => setIsAIRecordingModalOpen(true)}
            className={`p-4 rounded-full transition-all duration-200 flex items-center gap-2 ${
              isAIRecording
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                : "bg-purple-500/30 text-white hover:bg-purple-500/50"
            }`}
            title="AI 회의록 시작"
          >
            <Zap className="w-5 h-5" />
          </button>

          {/* View Mode Toggle */}
          <button
            onClick={() => setViewMode(viewMode === "gallery" ? "speaker" : "gallery")}
            className="p-4 bg-purple-500/30 text-white hover:bg-purple-500/50 rounded-full transition-all duration-200"
            title="Toggle view mode"
          >
            <Users className="w-6 h-6" />
          </button>

          {/* Screenshot Button */}
          <button
            onClick={handleScreenshot}
            className="p-4 bg-purple-500/30 text-white hover:bg-purple-500/50 rounded-full transition-all duration-200"
            title="Take screenshot"
          >
            <Camera className="w-6 h-6" />
          </button>

          {/* Screen Share Button */}
          <button
            onClick={handleScreenShare}
            className={`p-4 rounded-full transition-all duration-200 ${
              isScreenSharing
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-purple-500/30 text-white hover:bg-purple-500/50"
            }`}
            title={isScreenSharing ? "Stop screen share" : "Share screen"}
          >
            <Share2 className="w-6 h-6" />
          </button>

          {/* Chat Button */}
          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-4 rounded-full transition-all duration-200 ${
              showChat
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-purple-500/30 text-white hover:bg-purple-500/50"
            }`}
            title="Toggle chat"
          >
            <MessageCircle className="w-6 h-6" />
          </button>

          {/* Participants Button */}
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className={`p-4 rounded-full transition-all duration-200 ${
              showParticipants
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-purple-500/30 text-white hover:bg-purple-500/50"
            }`}
            title="Toggle participants"
          >
            <Users className="w-6 h-6" />
          </button>

          {/* Leave Button */}
          <button
            onClick={() => navigate("/")}
            className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-200 ml-auto"
            title="Leave meeting"
          >
            <Phone className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Chat Panel */}
      {showChat && (
        <div className="w-80 border-l border-purple-500/20 bg-purple-900/30 backdrop-blur-md flex flex-col">
          {/* Chat Header */}
          <div className="px-4 py-4 border-b border-purple-500/20 flex items-center justify-between">
            <h3 className="font-semibold">Chat</h3>
            <button
              onClick={() => setShowChat(false)}
              className="p-1 hover:bg-purple-500/20 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                <img
                  src={msg.avatar}
                  alt={msg.sender}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{msg.sender}</p>
                    <p className="text-xs text-white/50">{msg.timestamp}</p>
                  </div>
                  <p className="text-sm text-white/90 bg-purple-500/20 rounded-lg p-2 mt-1">
                    {msg.message}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Note Input */}
          {showNoteInput && (
            <div className="px-4 py-3 border-t border-purple-500/20 bg-purple-500/10 space-y-2">
              <p className="text-xs text-white/60 font-semibold">Add a note</p>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write a note..."
                className="w-full px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm text-white placeholder-white/50 focus:outline-none focus:border-purple-400 resize-none h-20"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddNote}
                  className="flex-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition-colors"
                >
                  Save Note
                </button>
                <button
                  onClick={() => {
                    setShowNoteInput(false);
                    setNoteText("");
                  }}
                  className="px-3 py-1 bg-purple-500/30 hover:bg-purple-500/50 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="px-4 py-4 border-t border-purple-500/20 flex gap-2">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-sm text-white placeholder-white/50 focus:outline-none focus:border-purple-400"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowNoteInput(!showNoteInput)}
              className="p-2 bg-purple-500/30 hover:bg-purple-500/50 rounded-lg transition-colors"
              title="Add note"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Participants Panel */}
      {showParticipants && (
        <div className="w-80 border-l border-purple-500/20 bg-purple-900/30 backdrop-blur-md flex flex-col">
          {/* Header */}
          <div className="px-4 py-4 border-b border-purple-500/20 flex items-center justify-between">
            <h3 className="font-semibold">Participants ({participants.length})</h3>
            <button
              onClick={() => setShowParticipants(false)}
              className="p-1 hover:bg-purple-500/20 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Participants List */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  participant.isSpeaking
                    ? "bg-purple-500/30 border border-purple-400"
                    : "bg-purple-500/10 hover:bg-purple-500/20"
                }`}
              >
                <div className="relative">
                  <img
                    src={participant.avatar}
                    alt={participant.name}
                    className="w-10 h-10 rounded-full"
                  />
                  {participant.isSpeaking && (
                    <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-pulse"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {participant.name}
                    {participant.isHost && " (Host)"}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    {participant.isMuted && <MicOff className="w-3 h-3" />}
                    {!participant.isVideoOn && <VideoOff className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Invite Button */}
          <div className="px-4 py-4 border-t border-purple-500/20">
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-semibold transition-all"
            >
              Invite Participant
            </button>
          </div>
        </div>
      )}


      {/* Modals */}
      <MeetingPreparationModal
        isOpen={showPreparationModal}
        onStart={() => setShowPreparationModal(false)}
        onInitialState={{
          isMuted,
          isVideoOn,
        }}
        onStateChange={{ isMuted, setIsMuted, isVideoOn, setIsVideoOn }}
      />

      <AIRecordingModal
        isOpen={isAIRecordingModalOpen}
        onClose={() => setIsAIRecordingModalOpen(false)}
        onStart={handleStartAIRecording}
        onEnd={handleEndAIRecording}
        isRecording={isAIRecording}
      />

      <InviteParticipantModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={(newMembers) => {
          const newParticipants = newMembers.map((member) => ({
            id: member.id,
            name: member.name,
            avatar: member.avatar,
            isHost: false,
            isVideoOn: true,
            isMuted: false,
            isSpeaking: false,
          }));
          setParticipants((prev) => [...prev, ...newParticipants]);
        }}
        alreadyInvited={participants.map((p) => p.id)}
      />
    </div>
  );
}
