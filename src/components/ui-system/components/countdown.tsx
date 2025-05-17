import { useEffect, useState } from "react";

interface CountdownProps {
  seconds: number; // เวลานับถอยหลังเริ่มต้น (วินาที)
  onComplete?: () => void; // ฟังก์ชันเมื่อหมดเวลา
}

const Countdown = ({ seconds, onComplete }: CountdownProps) => {
  const [timeLeft, setTimeLeft] = useState(seconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onComplete) onComplete();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // แปลงเป็น hh:mm:ss
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((secs % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="text-xl font-mono text-center text-red-600">
      ⏳ {formatTime(timeLeft)}
    </div>
  );
};

export default Countdown;