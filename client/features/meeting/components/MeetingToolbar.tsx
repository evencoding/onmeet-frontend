import { memo, useRef, useCallback } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  MessageCircle,
  Zap,
  Users,
  Camera,
  Share2,
} from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/shared/ui/tooltip";
import { useMeetingRoomStore } from "../store";
import { useMeetingMedia } from "../hooks/useMeetingMedia";

interface MeetingToolbarProps {
  isHost: boolean;
}

export default memo(function MeetingToolbar({ isHost }: MeetingToolbarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toggleMic, toggleCamera, toggleScreenShare, isScreenSharing } =
    useMeetingMedia();

  const { isMuted, isVideoOn, isAIRecording, showChat, showParticipants } =
    useMeetingRoomStore(
      useShallow((s) => ({
        isMuted: s.isMuted,
        isVideoOn: s.isVideoOn,
        isAIRecording: s.isAIRecording,
        showChat: s.showChat,
        showParticipants: s.showParticipants,
      })),
    );

  const handleScreenshot = useCallback(async () => {
    try {
      // html2canvas 없이 네이티브 API로 회의 전체 화면 캡처
      const meetingArea = document.querySelector("[data-meeting-capture]") as HTMLElement;
      if (!meetingArea) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      // 모든 video 엘리먼트를 canvas에 합성
      const rect = meetingArea.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.fillStyle = "#0f0a1e";
      ctx.fillRect(0, 0, rect.width, rect.height);

      // 화면의 모든 video 태그를 순회하며 그리기
      const videos = meetingArea.querySelectorAll("video");
      for (const videoEl of videos) {
        if (videoEl.videoWidth === 0) continue;
        const vRect = videoEl.getBoundingClientRect();
        const x = vRect.left - rect.left;
        const y = vRect.top - rect.top;
        ctx.drawImage(videoEl, x, y, vRect.width, vRect.height);
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `meeting-screenshot-${Date.now()}.png`;
          a.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (err) {
      console.error("Screenshot failed:", err);
    }
  }, []);

  return (
    <TooltipProvider>
      <canvas ref={canvasRef} className="hidden" />
      <div className="px-6 py-4 border-t border-purple-500/20 bg-purple-900/20 backdrop-blur-md flex items-center justify-center gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleMic}
              aria-label={isMuted ? "음성 켜기" : "음성 끄기"}
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
          </TooltipTrigger>
          <TooltipContent side="top">
            {isMuted ? "음성 켜기" : "음성 끄기"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleCamera}
              aria-label={isVideoOn ? "카메라 끄기" : "카메라 켜기"}
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
          </TooltipTrigger>
          <TooltipContent side="top">
            {isVideoOn ? "카메라 끄기" : "카메라 켜기"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => useMeetingRoomStore.getState().setIsAIRecordingRequestModalOpen(true)}
              aria-label={isHost ? "AI 회의록 관리" : "AI 회의록 요청"}
              className={`p-4 rounded-full transition-all duration-200 flex items-center gap-2 ${
                isAIRecording
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                  : "bg-purple-500/30 text-white hover:bg-purple-500/50"
              }`}
            >
              <Zap className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            {isHost ? "AI 회의록 관리" : "AI 회의록 요청"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                const { viewMode, setViewMode } = useMeetingRoomStore.getState();
                setViewMode(viewMode === "gallery" ? "speaker" : "gallery");
              }}
              aria-label="화면 전환"
              className="p-4 bg-purple-500/30 text-white hover:bg-purple-500/50 rounded-full transition-all duration-200"
            >
              <Users className="w-6 h-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">화면 전환</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleScreenshot}
              aria-label="스크린샷 촬영"
              className="p-4 bg-purple-500/30 text-white hover:bg-purple-500/50 rounded-full transition-all duration-200"
            >
              <Camera className="w-6 h-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">스크린샷 촬영</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleScreenShare}
              aria-label={isScreenSharing ? "화면 공유 중지" : "화면 공유"}
              className={`p-4 rounded-full transition-all duration-200 ${
                isScreenSharing
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-purple-500/30 text-white hover:bg-purple-500/50"
              }`}
            >
              <Share2 className="w-6 h-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            {isScreenSharing ? "화면 공유 중지" : "화면 공유"}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => useMeetingRoomStore.getState().toggleChat()}
              aria-label="채팅"
              className={`p-4 rounded-full transition-all duration-200 ${
                showChat
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-purple-500/30 text-white hover:bg-purple-500/50"
              }`}
            >
              <MessageCircle className="w-6 h-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">채팅</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => useMeetingRoomStore.getState().toggleParticipants()}
              aria-label="참여자"
              className={`p-4 rounded-full transition-all duration-200 ${
                showParticipants
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-purple-500/30 text-white hover:bg-purple-500/50"
              }`}
            >
              <Users className="w-6 h-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">참여자</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => useMeetingRoomStore.getState().setShowExitModal(true)}
              aria-label="회의 나가기"
              className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-200 ml-auto"
            >
              <Phone className="w-6 h-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">회의 나가기</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
});
