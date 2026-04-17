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
    <div className="bg-surface border border-border rounded-radius-lg p-6 text-center">
      <div className="text-heading  font-[var(--weight-semibold)] text-text-primary leading-tight break-words">
        ฿{formatCurrency(numericValue)}
      </div>
      <div className="text-label text-text-secondary mt-1">
        {subtitle}
      </div>
    </div>
  );
};

export default RevenueCard;
