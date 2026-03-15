import { useState, useEffect, useRef } from "react";

export function useMicTest(selectedMicrophone: string, isOpen: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [microphoneLevel, setMicrophoneLevel] = useState(0);
  const [micTestStream, setMicTestStream] = useState<MediaStream | null>(null);

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

  useEffect(() => {
    return () => {
      stopMicTest();
    };
  }, [isOpen]);

  return {
    isMicTesting,
    microphoneLevel,
    startMicTest,
    stopMicTest,
  };
}
