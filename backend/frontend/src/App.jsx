import { useEffect, useRef, useState } from "react";

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [status, setStatus] = useState("Waiting Camera...");
  const [capturedImage, setCapturedImage] = useState("");
  const [cameraMode, setCameraMode] = useState("environment");

  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState("");
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

      setStatus("Camera Active");
    } catch (error) {
      console.log(error);

      setStatus("Camera Error");
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

    setStatus("Scanning...");

    try {
      const response = await fetch("/api/detect", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          image: image,
        }),
      });

      const data = await response.json();

      setResult(data.result);
      setConfidence(data.confidence);

      setStatus("Scan Finished");
    } catch (error) {
      console.log(error);

      setStatus("Scan Error");
    }

    setIsSending(false);
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;

    const tracks = stream.getTracks();

    tracks.forEach((track) => track.stop());

    setStatus("Camera Stopped");
  };

  const switchCamera = () => {
    if (cameraMode === "user") {
      setCameraMode("environment");
    } else {
      setCameraMode("user");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#111",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "white",
        gap: "20px",
        padding: "20px",
      }}
    >
      <h1>Money Detector System</h1>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          width: "350px",
          borderRadius: "20px",
          border: "4px solid white",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={captureFrame}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            background: "green",
            color: "white",
          }}
        >
          Scan
        </button>

        <button
          onClick={stopCamera}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            background: "red",
            color: "white",
          }}
        >
          Stop
        </button>

        <button
          onClick={switchCamera}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Switch
        </button>
      </div>

      <h2>{status}</h2>

      <h2>Result: {result}</h2>

      <h2>Confidence: {confidence}%</h2>

      <canvas
        ref={canvasRef}
        style={{
          display: "none",
        }}
      />

      {capturedImage && (
        <img
          src={capturedImage}
          alt="capture"
          style={{
            width: "200px",
            borderRadius: "10px",
            border: "2px solid white",
          }}
        />
      )}
    </div>
  );
}

export default App;
