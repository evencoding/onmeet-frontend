import { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  X,
  Volume2,
  FlipHorizontal,
  Lock,
} from "lucide-react";

export interface DeviceSelection {
  cameraId: string;
  microphoneId: string;
  speakerId: string;
}

interface MeetingPreparationModalProps {
  isOpen: boolean;
  isLocked?: boolean;
  onStart: (password?: string) => void;
  onInitialState: {
    isMuted: boolean;
    isVideoOn: boolean;
  };
  onStateChange: {
    isMuted: boolean;
    setIsMuted: (value: boolean) => void;
    isVideoOn: boolean;
    setIsVideoOn: (value: boolean) => void;
  };
  onDeviceSelect?: (devices: DeviceSelection) => void;
}

export default function MeetingPreparationModal({
  isOpen,
  isLocked,
  onStart,
  onStateChange,
  onDeviceSelect,
}: MeetingPreparationModalProps) {
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isMuted, setIsMuted] = useState(onStateChange.isMuted);
  const [isVideoOn, setIsVideoOn] = useState(onStateChange.isVideoOn);
  const [isCameraFlipped, setIsCameraFlipped] = useState(false);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("");
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>("");
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [microphoneLevel, setMicrophoneLevel] = useState(0);
  const [micTestStream, setMicTestStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setCameras(devices.filter((d) => d.kind === "videoinput"));
        setMicrophones(devices.filter((d) => d.kind === "audioinput"));
        setSpeakers(devices.filter((d) => d.kind === "audiooutput"));

        const defaultCamera = devices.find((d) => d.kind === "videoinput");
        const defaultMic = devices.find((d) => d.kind === "audioinput");
        const defaultSpeaker = devices.find((d) => d.kind === "audiooutput");

        if (defaultCamera) setSelectedCamera(defaultCamera.deviceId);
        if (defaultMic) setSelectedMicrophone(defaultMic.deviceId);
        if (defaultSpeaker) setSelectedSpeaker(defaultSpeaker.deviceId);
      } catch (err) {
        console.error("Error getting devices:", err);
      }
    };

    getDevices();
  }, []);

  useEffect(() => {
    if (!isOpen || !isVideoOn) {
      return;
    }

    const startPreview = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: selectedCamera ? { deviceId: selectedCamera } : true,
          audio: false,
        });
        setPreviewStream(stream);
        if (previewVideoRef.current) {
          previewVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error starting preview:", err);
      }
    };

    if (isVideoOn) {
      startPreview();
    }

    return () => {
      if (previewStream) {
        previewStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, isVideoOn, selectedCamera]);

  useEffect(() => {
    return () => {
      stopMicTest();
    };
  }, [isOpen]);

  const startMicTest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: selectedMicrophone ? { deviceId: selectedMicrophone } : true,
        video: false,
      });

      setMicTestStream(stream);
      setIsMicTesting(true);

      const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioCtx();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);

      source.connect(analyser);
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
        setMicrophoneLevel(Math.min(100, (average / 255) * 150));
      };

      micIntervalRef.current = setInterval(updateLevel, 50);
    } catch (err) {
      console.error("Error starting mic test:", err);
      setIsMicTesting(false);
    }
  };

  const stopMicTest = () => {
    if (micIntervalRef.current) {
      clearInterval(micIntervalRef.current);
      micIntervalRef.current = null;
    }

    setIsMicTesting(false);
    setMicrophoneLevel(0);

    if (micTestStream) {
      micTestStream.getTracks().forEach((track) => track.stop());
      setMicTestStream(null);
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const handleStart = () => {
    if (isLocked && !password.trim()) {
      setPasswordError(true);
      return;
    }

    onStateChange.setIsMuted(isMuted);
    onStateChange.setIsVideoOn(isVideoOn);
    stopMicTest();

    if (previewStream) {
      previewStream.getTracks().forEach((track) => track.stop());
      setPreviewStream(null);
    }

    onDeviceSelect?.({
      cameraId: selectedCamera,
      microphoneId: selectedMicrophone,
      speakerId: selectedSpeaker,
    });

    onStart(password || undefined);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900/95 via-purple-950/95 to-black/95 rounded-2xl border border-purple-500/30 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-8 py-4 border-b border-purple-500/20 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-white">회의 준비</h2>
          <button
            onClick={() => onStart()}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">카메라 미리보기</h3>
              {isVideoOn && (
                <button
                  onClick={() => setIsCameraFlipped(!isCameraFlipped)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 text-white text-sm rounded-lg transition-colors"
                  title="카메라 반전"
                >
                  <FlipHorizontal className="w-4 h-4" />
                  반전
                </button>
              )}
            </div>
            <div className="relative w-full h-48 bg-black rounded-xl overflow-hidden border border-purple-500/30">
              {isVideoOn ? (
                <video
                  ref={previewVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ transform: isCameraFlipped ? "scaleX(-1)" : "scaleX(1)" }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/40 to-black">
                  <VideoOff className="w-16 h-16 text-white/30" />
                </div>
              )}
            </div>
          </div>

          {isLocked && (
            <div className="space-y-2 p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-yellow-400" />
                <label className="font-semibold text-white text-sm">
                  비밀번호가 필요한 회의입니다
                </label>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
                placeholder="회의 비밀번호를 입력하세요"
                className={`w-full px-3 py-2 bg-purple-500/20 border rounded-lg text-white text-sm focus:outline-none focus:border-purple-400 placeholder:text-white/40 ${
                  passwordError
                    ? "border-red-500"
                    : "border-purple-500/30"
                }`}
              />
              {passwordError && (
                <p className="text-xs text-red-400">비밀번호를 입력해주세요</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  카메라
                </label>
                <select
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="w-full px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                >
                  {cameras.map((camera) => (
                    <option key={camera.deviceId} value={camera.deviceId}>
                      {camera.label || `카메라 ${cameras.indexOf(camera) + 1}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  마이크
                </label>
                <select
                  value={selectedMicrophone}
                  onChange={(e) => setSelectedMicrophone(e.target.value)}
                  className="w-full px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                >
                  {microphones.map((mic) => (
                    <option key={mic.deviceId} value={mic.deviceId}>
                      {mic.label || `마이크 ${microphones.indexOf(mic) + 1}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  스피커
                </label>
                <select
                  value={selectedSpeaker}
                  onChange={(e) => setSelectedSpeaker(e.target.value)}
                  className="w-full px-3 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400"
                >
                  {speakers.map((speaker) => (
                    <option key={speaker.deviceId} value={speaker.deviceId}>
                      {speaker.label || `스피커 ${speakers.indexOf(speaker) + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-3">
                  {isVideoOn ? (
                    <Video className="w-5 h-5 text-white" />
                  ) : (
                    <VideoOff className="w-5 h-5 text-white/50" />
                  )}
                  <span className="text-white font-semibold text-sm">카메라</span>
                </div>
                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    isVideoOn
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-purple-500/20 hover:bg-purple-500/30 text-white/70"
                  }`}
                >
                  {isVideoOn ? "켜짐" : "꺼짐"}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-3">
                  {!isMuted ? (
                    <Mic className="w-5 h-5 text-white" />
                  ) : (
                    <MicOff className="w-5 h-5 text-white/50" />
                  )}
                  <span className="text-white font-semibold text-sm">마이크</span>
                </div>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    !isMuted
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-purple-500/20 hover:bg-purple-500/30 text-white/70"
                  }`}
                >
                  {!isMuted ? "켜짐" : "꺼짐"}
                </button>
              </div>

              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-start gap-2">
                  <Volume2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-white/70">
                    회의 시작 전에 기기를 테스트해주세요
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-white" />
                <label className="font-semibold text-white">마이크 음성 테스트</label>
              </div>
              <button
                onClick={isMicTesting ? stopMicTest : startMicTest}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  isMicTesting
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-purple-600 hover:bg-purple-700 text-white"
                }`}
              >
                {isMicTesting ? "테스트 중지" : "테스트 시작"}
              </button>
            </div>

            {isMicTesting && (
              <div className="space-y-2">
                <p className="text-xs text-white/70">마이크에서 음성이 감지되는지 확인하세요</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-purple-900/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-100"
                      style={{ width: `${microphoneLevel}%` }}
                    />
                  </div>
                  <span className="text-xs text-white/70 w-8 text-right">
                    {Math.round(microphoneLevel)}%
                  </span>
                </div>
                <p className="text-xs text-white/50">
                  {microphoneLevel > 10 ? "✓ 음성 감지됨" : "음성을 기다리는 중..."}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-purple-500/20 mt-auto">
            <button
              onClick={handleStart}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all text-sm"
            >
              회의 시작
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
