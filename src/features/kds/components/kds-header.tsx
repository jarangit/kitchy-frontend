import { LuActivity, LuArrowLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";

interface Props {
  storeId: string;
  stationName?: string;
  isRefetching: boolean;
}

const KdsHeader = ({ storeId, stationName, isRefetching }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap items-center justify-between gap-5">
      <div className="flex items-center gap-4">
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
          <h1 className="text-heading font-[var(--weight-semibold)] text-text-primary">
            Kitchen Display System
          </h1>
          <p className="text-label text-text-secondary">
            {stationName ? `Station: ${stationName}` : "Single station mode"}
          </p>
        </div>
      </div>

      <div className="inline-flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-2.5 text-label text-text-secondary">
        <LuActivity size={16} className={isRefetching ? "animate-pulse" : ""} />
        {isRefetching ? "Updating..." : "Auto refresh 5s"}
      </div>
    </div>
  );
};

export default KdsHeader;
