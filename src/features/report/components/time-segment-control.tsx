import type { DateRangePreset } from "@/features/report/types/report.dto";
import { Tabs, TabList, Tab } from "@/shared/components/ui/tabs";
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
    <Tabs
      value={value}
      onChange={(v) => onChange(v as DateRangePreset)}
      variant="segmented"
      className="w-full sm:w-auto overflow-x-auto rounded-full"
    >
      <TabList>
        {segments.map((s) => (
          <Tab key={s.key} value={s.key}>
            {s.label}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
};

export default TimeSegmentControl;
