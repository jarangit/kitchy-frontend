import { Loader2 } from "lucide-react"; // ใช้ icon จาก lucide-react (ถ้ายังไม่ติดตั้ง ดูข้างล่าง)
import { useLoading } from "../../../hooks/useLoading";

export default function LoadingOverlay() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
        <p className="text-white text-lg font-medium">Loading, please wait...</p>
      </div>
    </div>
  );
}