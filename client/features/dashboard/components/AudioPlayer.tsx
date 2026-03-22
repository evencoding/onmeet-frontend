import { useRef, useEffect, useState, useCallback } from "react";
import { Play, Download, ChevronDown, Music, FileCode, BookOpen } from "lucide-react";
import { downloadTextFile } from "@/shared/utils/download";

interface AudioPlayerProps {
  recordingUrl: string | null;
  meetingId: string;
  meetingTitle: string;
  hasRecordings: boolean;
  rawTranscript?: string;
  fullText?: string;
  summary?: string;
  onDownloadRecording: (recordingId: number) => void;
  firstRecordingId?: number;
}

export default function AudioPlayer({
  recordingUrl,
  meetingId: _meetingId,
  meetingTitle,
  rawTranscript,
  fullText,
  summary,
  onDownloadRecording,
  firstRecordingId,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(240);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  useEffect(() => {
    if (audioRef.current && recordingUrl) {
      audioRef.current.src = recordingUrl;
    }
  }, [recordingUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress(audio.currentTime / audio.duration);
        setDuration(Math.floor(audio.duration));
      }
    };

    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) / 100;
    setProgress(val);
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = val * audioRef.current.duration;
    }
  }, []);

  const currentTime = Math.floor(progress * duration);

  return (
    <div className="space-y-3">
      <p className="text-sm font-bold dark:text-white/70 light:text-purple-700">음성 녹음</p>

      <audio ref={audioRef} preload="metadata" />

      <div className="dark:bg-gradient-to-br dark:from-purple-900/30 dark:via-purple-900/20 dark:to-black/40 light:bg-gradient-to-br light:from-white/70 light:via-purple-50/50 light:to-white/70 dark:border dark:border-purple-500/15 light:border light:border-purple-200/60 rounded-2xl p-6 light:shadow-lg light:shadow-purple-200/20 dark:shadow-lg dark:shadow-purple-900/20 space-y-5">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="45"
                fill="none" stroke="currentColor" strokeWidth="1.5"
                className="dark:text-purple-500/15 light:text-purple-300/25"
              />
              <circle
                cx="50" cy="50" r="45"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeDasharray={`${45 * 2 * Math.PI}`}
                strokeDashoffset={`${45 * 2 * Math.PI * (1 - progress)}`}
                strokeLinecap="round"
                className="dark:text-purple-500 light:text-purple-600 transition-all duration-200"
                style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
              />
            </svg>
            <button
              onClick={togglePlay}
              className="relative z-10 flex items-center justify-center w-14 h-14 dark:bg-gradient-to-br dark:from-purple-600 dark:to-purple-700 light:bg-gradient-to-br light:from-purple-600 light:to-purple-700 text-white rounded-full shadow-lg dark:shadow-purple-500/40 light:shadow-purple-400/40 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              {isPlaying ? (
                <div className="flex items-center gap-1">
                  <div className="w-1 h-4 dark:bg-white light:bg-white rounded-sm animate-pulse" />
                  <div className="w-1 h-4 dark:bg-white light:bg-white rounded-sm animate-pulse" style={{ animationDelay: "0.2s" }} />
                </div>
              ) : (
                <Play className="w-6 h-6 fill-current ml-0.5" />
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs dark:text-white/50 light:text-purple-600 font-medium mb-1.5">재생 시간</p>
            <p className="text-sm font-bold dark:text-white light:text-purple-950 font-mono tracking-wide">
              {Math.floor(currentTime / 60)}:{String(currentTime % 60).padStart(2, "0")}
              <span className="dark:text-white/30 light:text-purple-600 mx-1.5 text-xs">/</span>
              {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, "0")}
            </p>
          </div>
        </div>

        <div>
          <input
            type="range" min="0" max="100"
            value={progress * 100}
            onChange={handleSeek}
            className="w-full h-1.5 dark:bg-purple-500/20 light:bg-purple-300/40 rounded-full appearance-none cursor-pointer accent-purple-600"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t dark:border-purple-500/10 light:border-purple-200/40">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs dark:text-white/50 light:text-purple-600 font-medium">볼륨</span>
              <span className="text-xs dark:text-white/40 light:text-purple-600 font-semibold">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <input
              type="range" min="0" max="100"
              value={Math.round(volume * 100)}
              onChange={(e) => setVolume(parseInt(e.target.value) / 100)}
              className="w-full h-1 dark:bg-purple-500/20 light:bg-purple-300/40 rounded-full appearance-none cursor-pointer accent-purple-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs dark:text-white/50 light:text-purple-600 font-medium block">속도</label>
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              className="w-full px-2.5 py-1 dark:bg-purple-500/15 light:bg-purple-100/50 dark:text-white light:text-purple-900 dark:border dark:border-purple-500/20 light:border light:border-purple-300/50 rounded-md text-xs font-medium focus:outline-none dark:focus:border-purple-400 light:focus:border-purple-500 transition-all"
            >
              <option value="0.5">0.5x</option>
              <option value="0.75">0.75x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2x</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <button
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            className="flex items-center gap-2 px-4 py-2 dark:bg-purple-600 light:bg-purple-600 dark:text-white light:text-white rounded-lg font-medium dark:hover:bg-purple-700 light:hover:bg-purple-700 transition-all"
          >
            <Download className="w-4 h-4" />
            다운로드
            <ChevronDown className="w-4 h-4" />
          </button>

          {showDownloadMenu && (
            <div className="absolute top-full left-0 mt-2 dark:bg-purple-900 light:bg-white dark:border dark:border-purple-500/30 light:border light:border-purple-300 rounded-lg shadow-lg dark:shadow-purple-900/50 light:shadow-purple-300/30 py-1 z-10">
              <button
                onClick={() => {
                  if (firstRecordingId) onDownloadRecording(firstRecordingId);
                  setShowDownloadMenu(false);
                }}
                className="w-full text-left px-4 py-2 dark:text-white/90 light:text-purple-900 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 transition-colors text-sm flex items-center gap-2"
              >
                <Music className="w-4 h-4" />
                음성 파일
              </button>
              <button
                onClick={() => {
                  if (rawTranscript) {
                    downloadTextFile(rawTranscript, `${meetingTitle}-raw-transcript.txt`);
                  }
                  setShowDownloadMenu(false);
                }}
                className="w-full text-left px-4 py-2 dark:text-white/90 light:text-purple-900 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 transition-colors text-sm flex items-center gap-2"
              >
                <FileCode className="w-4 h-4" />
                로우 텍스트
              </button>
              <button
                onClick={() => {
                  const fullContent = fullText || summary || "";
                  if (fullContent) {
                    downloadTextFile(fullContent, `${meetingTitle}-minutes.txt`);
                  }
                  setShowDownloadMenu(false);
                }}
                className="w-full text-left px-4 py-2 dark:text-white/90 light:text-purple-900 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 transition-colors text-sm flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                전체 회의록
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
