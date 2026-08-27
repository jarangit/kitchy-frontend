import { useParams } from "react-router-dom";
import { useCartContext } from "@/features/pos/context/cart-hooks";
import PaymentReceipt from "@/features/pos/components/payment-receipt";
import { usePromptpayQr } from "@/features/pos/hooks/usePromptpayQr";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  onBackToBrowse: () => void;
}

export function PosSuccessView({ onBackToBrowse }: Props) {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { paymentResult } = useCartContext();

  const promptpayQr = usePromptpayQr(
    id,
    paymentResult?.paymentMethod === "QR" ? paymentResult.subtotal : 0,
  );

  if (!paymentResult) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-6 [-webkit-overflow-scrolling:touch]">
        <EmptyState
          title="No payment data found"
          description="It looks like you navigated here directly. Please start a new order."
          action={
            <Button onClick={onBackToBrowse}>
              {t("pos.payment.backToPos")}
            </Button>
          }
        />
      </div>
    );
  }

  const formattedDate = new Date().toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-bg">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-6 [-webkit-overflow-scrolling:touch]">
        <div className="mx-auto w-full max-w-2xl">
          <PaymentReceipt
            paymentResult={paymentResult}
            dateLabel={formattedDate}
            qrDataUrl={promptpayQr.data?.qrDataUrl}
            className="w-full bg-card-bg p-5 sm:p-6"
          />
        </div>
      </div>
    </div>
  );
}

export default PosSuccessView;
