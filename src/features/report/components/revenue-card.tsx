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
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 text-center">
      <div className="text-[28px] sm:text-[32px] font-[var(--weight-bold)] text-[var(--color-text-primary)] leading-tight break-words">
        ฿{formatCurrency(numericValue)}
      </div>
      <div className="text-label text-[var(--color-text-secondary)] mt-1">
        {subtitle}
      </div>
    </div>
  );
};

export default RevenueCard;
