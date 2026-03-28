import { useRef, useEffect, useState, useCallback } from "react";
import { Play, Download, ChevronDown, Music, FileCode, BookOpen, Mic, Clock, User, CheckCircle, AlertCircle } from "lucide-react";
import { downloadTextFile } from "@/shared/utils/download";
import type { RoomRecordingResponse } from "@/features/meeting/api/types";

interface AudioPlayerProps {
  recordingUrl: string | null;
  meetingId: string;
  meetingTitle: string;
  hasRecordings: boolean;
  recordings: RoomRecordingResponse[];
  rawTranscript?: string;
  fullText?: string;
  summary?: string;
  onDownloadRecording: (recordingId: number) => void;
  firstRecordingId?: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatDateTime(dateStr: string): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Asia/Seoul" });
}

function formatDuration(startedAt: string, endedAt: string): string {
  if (!startedAt || !endedAt) return "-";
  const sec = Math.floor((new Date(endedAt).getTime() - new Date(startedAt).getTime()) / 1000);
  if (sec < 60) return `${sec}초`;
  return `${Math.floor(sec / 60)}분 ${sec % 60}초`;
}

export default function AudioPlayer({
  recordingUrl,
  meetingId: _meetingId,
  meetingTitle,
  recordings,
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
  const [expandedRecording, setExpandedRecording] = useState(false);

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

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume]);
  useEffect(() => { if (audioRef.current) audioRef.current.playbackRate = playbackSpeed; }, [playbackSpeed]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play(); setIsPlaying(true); }
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold dark:text-white/70 light:text-purple-700">음성 녹음</p>
        {recordings.length > 0 && (
          <span className="text-xs dark:text-white/40 light:text-purple-500">
            {recordings.length}개 트랙
          </span>
        )}
      </div>

      <audio ref={audioRef} preload="metadata" />

      {/* 플레이어 */}
      <div className="dark:bg-gradient-to-br dark:from-purple-900/30 dark:via-purple-900/20 dark:to-black/40 light:bg-white/80 dark:border dark:border-purple-500/15 light:border light:border-purple-200/60 rounded-2xl p-6 light:shadow-lg light:shadow-purple-200/20 dark:shadow-lg dark:shadow-purple-900/20 space-y-5 light:backdrop-blur-md">
        <div className="flex flex-col items-center gap-5">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" className="dark:text-purple-500/15 light:text-purple-300/25" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeDasharray={`${45 * 2 * Math.PI}`}
                strokeDashoffset={`${45 * 2 * Math.PI * (1 - progress)}`}
                strokeLinecap="round"
                className="dark:text-purple-500 light:text-purple-600 transition-all duration-200"
                style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
              />
            </svg>
            <button onClick={togglePlay}
              className="relative z-10 flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-full shadow-lg shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              {isPlaying ? (
                <div className="flex items-center gap-1">
                  <div className="w-1 h-4 bg-white rounded-sm animate-pulse" />
                  <div className="w-1 h-4 bg-white rounded-sm animate-pulse" style={{ animationDelay: "0.2s" }} />
                </div>
              ) : (
                <Play className="w-6 h-6 fill-current ml-0.5" />
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm font-bold dark:text-white light:text-purple-950 font-mono tracking-wide">
              {formatTime(currentTime)}
              <span className="dark:text-white/30 light:text-purple-400 mx-1.5 text-xs">/</span>
              {formatTime(duration)}
            </p>
          </div>
        </div>

        <input type="range" min="0" max="100" value={progress * 100} onChange={handleSeek}
          className="w-full h-1.5 dark:bg-purple-500/20 light:bg-purple-300/40 rounded-full appearance-none cursor-pointer accent-purple-600"
        />

        <div className="grid grid-cols-2 gap-3 pt-3 border-t dark:border-purple-500/10 light:border-purple-200/40">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs dark:text-white/50 light:text-purple-600 font-medium">볼륨</span>
              <span className="text-xs dark:text-white/40 light:text-purple-500 font-semibold">{Math.round(volume * 100)}%</span>
            </div>
            <input type="range" min="0" max="100" value={Math.round(volume * 100)}
              onChange={(e) => setVolume(parseInt(e.target.value) / 100)}
              className="w-full h-1 dark:bg-purple-500/20 light:bg-purple-300/40 rounded-full appearance-none cursor-pointer accent-purple-600"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs dark:text-white/50 light:text-purple-600 font-medium block">속도</label>
            <select value={playbackSpeed} onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
              className="w-full px-2.5 py-1 dark:bg-purple-500/15 light:bg-purple-50 dark:text-white light:text-purple-900 dark:border dark:border-purple-500/20 light:border light:border-purple-300/50 rounded-md text-xs font-medium focus:outline-none transition-all"
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

      {/* 녹음 트랙 상세 */}
      {recordings.length > 0 && (
        <div>
          <button
            onClick={() => setExpandedRecording(!expandedRecording)}
            className="flex items-center gap-2 text-sm font-semibold dark:text-white/60 light:text-purple-700 hover:dark:text-white/80 hover:light:text-purple-900 transition-colors"
          >
            <Mic className="w-4 h-4" />
            녹음 트랙 상세 ({recordings.length}개)
            <ChevronDown className={`w-4 h-4 transition-transform ${expandedRecording ? "rotate-180" : ""}`} />
          </button>

          {expandedRecording && (
            <div className="mt-3 space-y-2">
              {recordings.map((rec) => (
                <div key={rec.id}
                  className="dark:bg-purple-500/10 light:bg-purple-50/80 dark:border dark:border-purple-500/15 light:border light:border-purple-200/50 rounded-xl p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 dark:text-purple-400 light:text-purple-600" />
                      <span className="text-sm font-semibold dark:text-white/80 light:text-purple-900">참가자 {rec.participantIdentity}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold dark:bg-purple-500/20 dark:text-purple-300 light:bg-purple-100 light:text-purple-700">{rec.type.replace("_", " ")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {rec.status === "COMPLETED" ? (
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                      )}
                      <span className={`text-[10px] font-semibold ${rec.status === "COMPLETED" ? "text-green-500" : "text-amber-500"}`}>{rec.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="dark:text-white/40 light:text-purple-500">시작</p>
                      <p className="dark:text-white/70 light:text-purple-800 font-medium">{formatDateTime(rec.startedAt)}</p>
                    </div>
                    <div>
                      <p className="dark:text-white/40 light:text-purple-500">종료</p>
                      <p className="dark:text-white/70 light:text-purple-800 font-medium">{formatDateTime(rec.endedAt)}</p>
                    </div>
                    <div>
                      <p className="dark:text-white/40 light:text-purple-500">소요시간</p>
                      <p className="dark:text-white/70 light:text-purple-800 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(rec.startedAt, rec.endedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t dark:border-purple-500/10 light:border-purple-200/30">
                    <code className="text-[10px] dark:text-white/30 light:text-purple-400 font-mono truncate max-w-[60%]">{rec.s3Path}</code>
                    <button
                      onClick={() => onDownloadRecording(rec.id)}
                      className="flex items-center gap-1 text-xs font-medium dark:text-purple-300 light:text-purple-600 hover:dark:text-purple-200 hover:light:text-purple-800 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      다운로드
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 다운로드 메뉴 */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <button
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all"
          >
            <Download className="w-4 h-4" />
            다운로드
            <ChevronDown className="w-4 h-4" />
          </button>

          {showDownloadMenu && (
            <div className="absolute top-full left-0 mt-2 dark:bg-purple-950/95 light:bg-white/95 dark:border dark:border-purple-500/30 light:border light:border-purple-200/70 rounded-lg backdrop-blur-xl shadow-lg dark:shadow-purple-900/50 light:shadow-purple-300/30 py-1 z-10 min-w-[160px]">
              <button
                onClick={() => { if (firstRecordingId) onDownloadRecording(firstRecordingId); setShowDownloadMenu(false); }}
                className="w-full text-left px-4 py-2 dark:text-white/90 light:text-purple-900 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 transition-colors text-sm flex items-center gap-2"
              >
                <Music className="w-4 h-4" /> 음성 파일
              </button>
              <button
                onClick={() => { if (rawTranscript) downloadTextFile(rawTranscript, `${meetingTitle}-raw-transcript.txt`); setShowDownloadMenu(false); }}
                className="w-full text-left px-4 py-2 dark:text-white/90 light:text-purple-900 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 transition-colors text-sm flex items-center gap-2"
              >
                <FileCode className="w-4 h-4" /> 로우 텍스트
              </button>
              <button
                onClick={() => { const c = fullText || summary || ""; if (c) downloadTextFile(c, `${meetingTitle}-minutes.txt`); setShowDownloadMenu(false); }}
                className="w-full text-left px-4 py-2 dark:text-white/90 light:text-purple-900 dark:hover:bg-purple-500/20 light:hover:bg-purple-100 transition-colors text-sm flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> 전체 회의록
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
