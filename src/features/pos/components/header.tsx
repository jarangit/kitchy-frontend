import { useEffect, useState } from "react";

interface Props {
  shopName: string;
}

const PosHeader = ({ shopName }: Props) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-between bg-[var(--color-bg)] border-b border-[var(--color-border)] px-6 py-3">
      <h1 className="text-lg font-bold text-[var(--color-text-primary)]">{shopName}</h1>
      <div className="text-right">
        <div className="text-sm font-semibold text-[var(--color-text-primary)]">
          {formattedTime}
        </div>
        <div className="text-xs text-[var(--color-text-secondary)]">{formattedDate}</div>
      </div>
    </div>
  );
};

export default PosHeader;
