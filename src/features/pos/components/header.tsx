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
    <div className="flex items-center justify-between bg-white border-b px-6 py-3">
      <h1 className="text-lg font-bold text-gray-800">{shopName}</h1>
      <div className="text-right">
        <div className="text-sm font-semibold text-gray-700">
          {formattedTime}
        </div>
        <div className="text-xs text-gray-500">{formattedDate}</div>
      </div>
    </div>
  );
};

export default PosHeader;
