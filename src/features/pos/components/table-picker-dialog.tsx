import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { SelectionChip } from "@/shared/components/ui/selection-chip";

const TABLE_OPTIONS = Array.from(
  { length: 20 },
  (_, index) => `T-${String(index + 1).padStart(2, "0")}`
);

interface Props {
  open: boolean;
  onClose: () => void;
  tableNumber: string | null;
  onSelect: (table: string) => void;
}

const TablePickerDialog = ({ open, onClose, tableNumber, onSelect }: Props) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>Select Table</DialogTitle>
        <DialogDescription>Tap to select table for dine in order.</DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-4 gap-3">
        {TABLE_OPTIONS.map((table) => (
          <SelectionChip
            key={table}
            active={tableNumber === table}
            onClick={() => {
              onSelect(table);
              onClose();
            }}
            className="text-base"
          >
            {table}
          </SelectionChip>
        ))}
      </div>
    </Dialog>
  );
};

export default TablePickerDialog;
