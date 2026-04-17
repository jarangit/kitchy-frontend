import { LuShoppingCart, LuTrendingUp } from "react-icons/lu";
import { Card } from "@/shared/components/ui/card";

interface Props {
  orders: number;
  averageOrderValue: number;
}

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const MetricRow = ({ orders, averageOrderValue }: Props) => {
  const metrics = [
    {
      label: "Orders",
      value: orders.toLocaleString(),
      icon: <LuShoppingCart size={18} />,
      colorBg: "var(--color-info-bg)",
      colorText: "var(--color-info)",
    },
    {
      label: "Avg / Order",
      value: `฿${formatCurrency(averageOrderValue)}`,
      icon: <LuTrendingUp size={18} />,
      colorBg: "var(--color-warning-bg)",
      colorText: "var(--color-warning)",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {metrics.map((m) => (
        <Card
          key={m.label}
          className="p-4"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: m.colorBg }}
            >
              <span style={{ color: m.colorText }}>{m.icon}</span>
            </div>
            <div className="min-w-0">
              <div className="text-title font-semibold text-text-primary">
                {m.value}
              </div>
              <div className="text-caption text-text-secondary">
                {m.label}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MetricRow;
