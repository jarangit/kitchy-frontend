import { Loader2 } from "lucide-react"; // ใช้ icon จาก lucide-react (ถ้ายังไม่ติดตั้ง ดูข้างล่าง)
import { useLoading } from "@/shared/hooks/useLoading";

export default function LoadingOverlay() {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-overlay)] backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[var(--color-text-inverse)]" />
        <p className="text-[var(--color-text-inverse)] text-subtitle font-[var(--weight-medium)]">Loading, please wait...</p>
      </div>
    </div>
  );
}