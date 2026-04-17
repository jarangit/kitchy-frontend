import { Card } from "@/shared/components/ui/card";

interface Props {
  value: string;
  subtitle: string;
}

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const RevenueCard = ({ value, subtitle }: Props) => {
  const numericValue = Number(value) || 0;

  return (
    <Card className="text-center">
      <div className="text-heading  font-semibold text-text-primary leading-tight break-words">
        ฿{formatCurrency(numericValue)}
      </div>
      <div className="text-label text-text-secondary mt-1">
        {subtitle}
      </div>
    </Card>
  );
};

export default RevenueCard;
