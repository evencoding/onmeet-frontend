import { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  X,
  Volume2,
} from "lucide-react";

interface MeetingPreparationModalProps {
  isOpen: boolean;
  onStart: () => void;
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
}

export default function MeetingPreparationModal({
  isOpen,
  onStart,
  onStateChange,
}: MeetingPreparationModalProps) {
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(onStateChange.isMuted);
  const [isVideoOn, setIsVideoOn] = useState(onStateChange.isVideoOn);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("");
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>("");
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);

  // Get available devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        setCameras(devices.filter((d) => d.kind === "videoinput"));
        setMicrophones(devices.filter((d) => d.kind === "audioinput"));
        setSpeakers(devices.filter((d) => d.kind === "audiooutput"));

        // Set default devices
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

  // Start camera preview
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

  const handleStart = () => {
    onStateChange.setIsMuted(isMuted);
    onStateChange.setIsVideoOn(isVideoOn);
    onStart();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900/95 via-purple-950/95 to-black/95 rounded-2xl border border-purple-500/30 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 py-4 border-b border-purple-500/20 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-white">Meeting Preparation</h2>
          <button
            onClick={onStart}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {/* Camera Preview */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">Camera Preview</h3>
            <div className="relative w-full h-48 bg-black rounded-xl overflow-hidden border border-purple-500/30">
              {isVideoOn ? (
                <video
                  ref={previewVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/40 to-black">
                  <VideoOff className="w-16 h-16 text-white/30" />
                </div>
              )}
            </div>
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column - Device Selection */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  Camera
                </label>
                <select
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="w-full px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg text-white text-xs focus:outline-none focus:border-purple-400"
                >
                  {cameras.map((camera) => (
                    <option key={camera.deviceId} value={camera.deviceId}>
                      {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  Microphone
                </label>
                <select
                  value={selectedMicrophone}
                  onChange={(e) => setSelectedMicrophone(e.target.value)}
                  className="w-full px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg text-white text-xs focus:outline-none focus:border-purple-400"
                >
                  {microphones.map((mic) => (
                    <option key={mic.deviceId} value={mic.deviceId}>
                      {mic.label || `Microphone ${microphones.indexOf(mic) + 1}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white mb-1">
                  Speaker
                </label>
                <select
                  value={selectedSpeaker}
                  onChange={(e) => setSelectedSpeaker(e.target.value)}
                  className="w-full px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg text-white text-xs focus:outline-none focus:border-purple-400"
                >
                  {speakers.map((speaker) => (
                    <option key={speaker.deviceId} value={speaker.deviceId}>
                      {speaker.label || `Speaker ${speakers.indexOf(speaker) + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column - Settings */}
            <div className="space-y-3">
              {/* Camera Toggle */}
              <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-3">
                  {isVideoOn ? (
                    <Video className="w-5 h-5 text-white" />
                  ) : (
                    <VideoOff className="w-5 h-5 text-white/50" />
                  )}
                  <span className="text-white font-semibold">Camera</span>
                </div>
                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    isVideoOn
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-purple-500/20 hover:bg-purple-500/30 text-white/70"
                  }`}
                >
                  {isVideoOn ? "On" : "Off"}
                </button>
              </div>

              {/* Microphone Toggle */}
              <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-3">
                  {!isMuted ? (
                    <Mic className="w-5 h-5 text-white" />
                  ) : (
                    <MicOff className="w-5 h-5 text-white/50" />
                  )}
                  <span className="text-white font-semibold">Microphone</span>
                </div>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`px-3 py-1 text-sm rounded-lg font-semibold transition-all ${
                    !isMuted
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-purple-500/20 hover:bg-purple-500/30 text-white/70"
                  }`}
                >
                  {!isMuted ? "On" : "Off"}
                </button>
              </div>

              {/* Info Box */}
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-start gap-2">
                  <Volume2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-white/70">
                    Test your devices before starting the meeting
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-3 border-t border-purple-500/20 mt-auto">
            <button
              onClick={onStart}
              className="flex-1 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all text-sm"
            >
              Start Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
