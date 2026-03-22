import { useState, useEffect, useRef } from "react";

export function useMeetingDevices(isOpen: boolean, isVideoOn: boolean) {
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [speakers, setSpeakers] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("");
  const [selectedSpeaker, setSelectedSpeaker] = useState<string>("");
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, isVideoOn, selectedCamera]);

  const stopPreview = () => {
    if (previewStream) {
      previewStream.getTracks().forEach((track) => track.stop());
      setPreviewStream(null);
    }
  };

  return {
    cameras,
    microphones,
    speakers,
    selectedCamera,
    setSelectedCamera,
    selectedMicrophone,
    setSelectedMicrophone,
    selectedSpeaker,
    setSelectedSpeaker,
    previewVideoRef,
    previewStream,
    stopPreview,
  };
}
