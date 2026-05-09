import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  ScanLine,
  RefreshCcw,
  Landmark,
  BadgeCheck,
  AlertCircle,
  Wallet,
  Shield,
} from "lucide-react";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [status, setStatus] = useState("Connecting Secure Camera...");
  const [cameraMode, setCameraMode] = useState("environment");
  const [capturedImage, setCapturedImage] = useState("");
  const [result, setResult] = useState("NO RESULT");
  const [confidence, setConfidence] = useState(0);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    startCamera();
  }, [cameraMode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraMode,
        },
      });

      videoRef.current.srcObject = stream;

      setStatus("Secure Camera Active");
    } catch (error) {
      console.log(error);
      setStatus("Camera Access Failed");
    }
  };

  const captureFrame = async () => {
    if (isSending) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL("image/png");

    setCapturedImage(imageData);

    sendToBackend(imageData);
  };

  const sendToBackend = async (image) => {
    setIsSending(true);

    try {
      const response = await fetch("/api/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image }),
      });

      const data = await response.json();

      setResult(data.result);
      setConfidence(data.confidence);
    } catch (error) {
      console.log(error);
    }

    setIsSending(false);
  };

  const switchCamera = () => {
    setCameraMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    <div className="min-h-screen bg-[#07111F] flex justify-center overflow-hidden">
      <div className="w-full max-w-md min-h-screen relative bg-gradient-to-b from-[#07111F] via-[#0B1E36] to-[#07111F] text-white">
        {/* GLOW */}
        <div className="absolute top-[-120px] left-[-50px] w-[260px] h-[260px] bg-cyan-500/20 blur-3xl rounded-full" />

        <div className="absolute bottom-[-100px] right-[-40px] w-[220px] h-[220px] bg-blue-500/20 blur-3xl rounded-full" />

        {/* HEADER */}
        <div className="px-6 pt-14 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-cyan-300 text-xs tracking-[3px] uppercase">
                National Banking Security
              </p>

              <h1 className="text-4xl font-black mt-2 leading-tight">
                Smart Money
                <br />
                Detector
              </h1>
            </div>

            <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.2)]">
              <Landmark size={30} className="text-cyan-300" />
            </div>
          </div>

          {/* BANK CARD */}
          <div className="mt-7 rounded-[32px] bg-gradient-to-br from-[#102845] to-[#0B1830] border border-cyan-400/10 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute right-[-40px] top-[-40px] w-40 h-40 rounded-full bg-cyan-400/10" />

            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-gray-400 text-sm">Security Status</p>

                <h2 className="text-2xl font-bold mt-1 text-cyan-300">
                  ACTIVE
                </h2>
              </div>

              <Shield className="text-cyan-300" size={28} />
            </div>

            <div className="mt-8 flex items-center justify-between relative z-10">
              <div>
                <p className="text-gray-500 text-xs">Protected By AI Scanner</p>

                <p className="font-semibold mt-1">Bank Authentication System</p>
              </div>

              <Wallet className="text-white/70" />
            </div>
          </div>
        </div>

        {/* CAMERA */}
        <div className="px-6 mt-7 relative z-10">
          <div className="rounded-[34px] bg-[#0B1627] border border-cyan-400/10 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <div className="relative rounded-[28px] overflow-hidden border border-white/5">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-[180px] object-cover"
              />

              {/* DARK OVERLAY */}
              <div className="absolute inset-0 bg-black/15" />

              {/* FRAME */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[80%] h-[65%] rounded-[22px] border border-cyan-300/60 relative shadow-[0_0_25px_rgba(0,255,255,0.3)]">
                  {/* CORNERS */}
                  <div className="absolute top-0 left-0 w-7 h-7 border-l-4 border-t-4 border-cyan-300 rounded-tl-xl" />

                  <div className="absolute top-0 right-0 w-7 h-7 border-r-4 border-t-4 border-cyan-300 rounded-tr-xl" />

                  <div className="absolute bottom-0 left-0 w-7 h-7 border-l-4 border-b-4 border-cyan-300 rounded-bl-xl" />

                  <div className="absolute bottom-0 right-0 w-7 h-7 border-r-4 border-b-4 border-cyan-300 rounded-br-xl" />

                  {/* SCAN LINE */}
                  <div className="absolute left-3 right-3 top-1/2 h-[2px] bg-cyan-300 shadow-[0_0_20px_#00FFFF] animate-pulse" />
                </div>
              </div>

              {/* STATUS */}
              <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xl px-3 py-1 rounded-full border border-white/10">
                <p className="text-[11px] text-cyan-200">{status}</p>
              </div>
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <div className="px-6 mt-6 flex gap-3 relative z-10">
          <button
            onClick={captureFrame}
            disabled={isSending}
            className="flex-1 h-[60px] rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(0,255,255,0.35)] active:scale-95 transition-all"
          >
            <ScanLine size={22} />

            {isSending ? "SCANNING..." : "SCAN MONEY"}
          </button>

          <button
            onClick={switchCamera}
            className="w-[60px] rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center active:scale-95 transition-all"
          >
            <RefreshCcw className="text-cyan-300" />
          </button>
        </div>

        {/* RESULT */}
        <div className="px-6 mt-7 pb-10 relative z-10">
          <div className="rounded-[32px] bg-[#0B1627] border border-cyan-400/10 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-400 text-sm">Authentication Result</p>

                <h2 className="text-2xl font-bold mt-1">
                  {result.includes("ASLI") ? "Verified" : "Not Verified"}
                </h2>
              </div>

              {result.includes("ASLI") ? (
                <div className="w-14 h-14 rounded-2xl bg-green-500/20 border border-green-400/20 flex items-center justify-center">
                  <BadgeCheck className="text-green-400" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-400/20 flex items-center justify-center">
                  <AlertCircle className="text-red-400" />
                </div>
              )}
            </div>

            {/* RESULT BOX */}
            <div className="mt-5 rounded-2xl bg-[#07111F] border border-white/5 p-4">
              <p className="text-gray-500 text-sm">AI Detection</p>

              <h1
                className={`mt-2 text-3xl font-black ${
                  result.includes("ASLI") ? "text-green-400" : "text-red-400"
                }`}
              >
                {result}
              </h1>
            </div>

            {/* CONFIDENCE */}
            <div className="mt-5">
              <div className="flex justify-between mb-2">
                <p className="text-gray-400 text-sm">Confidence Score</p>

                <p className="font-bold text-cyan-300">{confidence}%</p>
              </div>

              <div className="w-full h-3 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    confidence > 70
                      ? "bg-green-400"
                      : confidence > 40
                        ? "bg-yellow-400"
                        : "bg-red-400"
                  }`}
                  style={{
                    width: `${confidence}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* PREVIEW */}
          {capturedImage && (
            <div className="mt-5 rounded-[30px] bg-[#0B1627] border border-cyan-400/10 p-4">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={18} className="text-cyan-300" />

                <p className="font-semibold">Scan Preview</p>
              </div>

              <img
                src={capturedImage}
                alt="capture"
                className="w-full rounded-2xl border border-white/10"
              />
            </div>
          )}
        </div>

        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
}

export default App;
