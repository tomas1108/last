import React, { useState, useEffect, useRef } from "react";

const WaveformIcon = ({ audioURL }) => {
  const canvasRef = useRef(null);
  const [audioData, setAudioData] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const renderWaveform = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.beginPath();
      for (let i = 0; i < audioData.length; i++) {
        const x = i * (canvas.width / audioData.length);
        const y = (1 - audioData[i]) * canvas.height;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();
    };

    const audio = new Audio(audioURL);
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const audioSrc = audioContext.createMediaElementSource(audio);

    audioSrc.connect(analyser);
    audioSrc.connect(audioContext.destination);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const updateWaveform = () => {
      analyser.getByteTimeDomainData(dataArray);
      setAudioData(Array.from(dataArray).map((val) => val / 255));
      requestAnimationFrame(updateWaveform);
    };

    audio.addEventListener("loadeddata", () => {
      updateWaveform();
    });

    return () => {
      audioContext.close();
    };
  }, [audioURL]);

  return <canvas ref={canvasRef} width={100} height={50} />;
};

export default WaveformIcon;
