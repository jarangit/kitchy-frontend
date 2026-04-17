import type { DateRangePreset } from "@/features/report/types/report.dto";
import { SegmentedControl } from "@/shared/components/ui/segmented-control";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  value: DateRangePreset;
  onChange: (preset: DateRangePreset) => void;
}

const TimeSegmentControl = ({ value, onChange }: Props) => {
  const { t } = useTranslation();
  const segments: { key: DateRangePreset; label: string }[] = [
    { key: "today", label: t("report.range.today") },
    { key: "week", label: t("report.range.week") },
    { key: "month", label: t("report.range.month") },
  ];

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
