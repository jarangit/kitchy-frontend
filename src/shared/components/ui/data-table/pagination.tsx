import { Button } from "@/shared/components/ui/button";
import { Select } from "@/shared/components/ui/select";

interface Props {
  pageIndex: number;
  pageSize: number;
  totalItems: number;
  pageSizeOptions?: number[];
  onPageChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export function DataTablePagination({
  pageIndex,
  pageSize,
  totalItems,
  pageSizeOptions = [10, 20, 50],
  onPageChange,
  onPageSizeChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const clampedPageIndex = Math.min(pageIndex, totalPages - 1);
  const start = totalItems === 0 ? 0 : clampedPageIndex * pageSize + 1;
  const end = Math.min(totalItems, (clampedPageIndex + 1) * pageSize);
  const canGoPrevious = clampedPageIndex > 0;
  const canGoNext = clampedPageIndex < totalPages - 1;

  return (
    <div className="flex flex-col gap-2 border-t border-card-border bg-card-bg px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <p className="text-body-sm tabular-nums text-text-secondary">
          {start}-{end} of {totalItems}
        </p>
        <div className="w-full sm:w-[124px]">
          <Select
            aria-label="Rows per page"
            value={String(pageSize)}
            className="h-10 rounded-full px-4 text-body-sm"
            options={pageSizeOptions.map((option) => ({
              value: String(option),
              label: `${option} / page`,
            }))}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="min-w-[92px]"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(clampedPageIndex - 1)}
        >
          Previous
        </Button>
        <span className="min-w-[64px] text-center text-body-sm tabular-nums text-text-secondary">
          {clampedPageIndex + 1} / {totalPages}
        </span>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="min-w-[92px]"
          disabled={!canGoNext}
          onClick={() => onPageChange(clampedPageIndex + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
