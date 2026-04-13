import { LuActivity, LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";

interface Props {
  storeId: number;
  stationName?: string;
  isRefetching: boolean;
}

const KdsHeader = ({ storeId, stationName, isRefetching }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(`/store/${storeId}`)}
          className="h-11"
        >
          <LuArrowLeft size={16} />
          Back
        </Button>

        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Kitchen Display System
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {stationName ? `Station: ${stationName}` : "All stations"}
          </p>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text-secondary)]">
        <LuActivity size={16} className={isRefetching ? "animate-pulse" : ""} />
        {isRefetching ? "Updating..." : "Auto refresh 5s"}
      </div>
    </div>
  );
};

export default KdsHeader;
