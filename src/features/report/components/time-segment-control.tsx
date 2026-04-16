import type { DateRangePreset } from "@/features/report/types/report.dto";
import { SegmentedControl } from "@/shared/components/ui/segmented-control";

interface Props {
  value: DateRangePreset;
  onChange: (preset: DateRangePreset) => void;
}

const segments: { key: DateRangePreset; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "week", label: "7 Days" },
  { key: "month", label: "Month" },
];

const TimeSegmentControl = ({ value, onChange }: Props) => {
  return (
    <SegmentedControl
      items={segments}
      value={value}
      onChange={onChange}
      className="w-full sm:w-auto overflow-x-auto rounded-full"
    />
  );
};

export default TimeSegmentControl;
