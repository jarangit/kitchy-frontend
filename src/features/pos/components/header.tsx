import { useEffect, useState } from "react";
import { LuShoppingCart, LuArrowLeft } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";

interface Props {
  shopName: string;
  onCartClick?: () => void;
  cartItemCount?: number;
  onExit?: () => void;
}

const PosHeader = ({
  shopName,
  onCartClick,
  cartItemCount = 0,
  onExit,
}: Props) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = currentTime.toLocaleDateString("th-TH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-between bg-[var(--color-bg)] border-b border-[var(--color-border)] px-6 py-4">
      <h1 className="text-xl font-bold text-[var(--color-text-primary)]">
        {shopName}
      </h1>

      <div className="flex items-center gap-4">
        {onExit && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onExit}
            className="h-11 px-3"
          >
            <LuArrowLeft size={16} />
            Exit POS
          </Button>
        )}

        {/* Cart badge button — tablet only */}
        {onCartClick && (
          <button
            onClick={onCartClick}
            className="relative lg:hidden flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-all duration-[var(--motion-fast)] active:scale-[0.98]"
          >
            <LuShoppingCart size={20} className="text-[var(--color-text-primary)]" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center rounded-full bg-[var(--color-success)] text-[var(--color-text-inverse)] text-xs font-bold px-1">
                {cartItemCount}
              </span>
            )}
          </button>
        )}

        <div className="text-right">
          <div className="text-sm font-semibold text-[var(--color-text-primary)]">
            {formattedTime}
          </div>
          <div className="text-xs text-[var(--color-text-secondary)]">
            {formattedDate}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosHeader;
