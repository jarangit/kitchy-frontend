import { useNavigate, useParams } from "react-router-dom";
import { LuCircleCheck, LuPrinter, LuArrowRight } from "react-icons/lu";
import { useCartContext } from "@/features/pos/context/cart-hooks";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import PaymentReceipt from "@/features/pos/components/payment-receipt";
import { useTranslation } from "@/shared/i18n/use-translation";

const PaymentSuccessPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { paymentResult, clearPaymentResult } = useCartContext();

  if (!paymentResult) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto [-webkit-overflow-scrolling:touch]">
        <EmptyState
          title="No payment data found"
          description="It looks like you navigated here directly. Please start a new order."
          action={
            <Button onClick={() => navigate(`/store/${id}/pos`)}>
              {t("pos.payment.backToPos")}
            </Button>
          }
        />
      </div>
    );
  }

  const { subtotal } = paymentResult;

  const formattedDate = new Date().toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleNewOrder = () => {
    clearPaymentResult();
    navigate(`/store/${id}/pos`, { replace: true });
  };

  return (
    <div className="min-h-0 flex flex-1 flex-col overflow-hidden bg-bg">
      <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 py-4 sm:py-6">
        <Card
          padding="none"
          className="flex min-h-0 w-full flex-1 flex-col overflow-hidden lg:grid lg:grid-cols-[minmax(0,1fr)_320px]"
        >
          <aside className="order-1 flex shrink-0 flex-col gap-5 border-b border-border bg-card-bg p-4 lg:order-2 lg:h-full lg:border-b-0 lg:border-l">
            <div className="space-y-5">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success-bg text-success animate-check">
                  <LuCircleCheck size={28} />
                </div>
                <h1 className="text-title text-text-primary">
                  {t("pos.success.title")}
                </h1>
                <p className="mt-2 text-heading tabular-nums text-text-primary">
                  ฿{subtotal.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-body-sm text-text-secondary">
                  {t("pos.success.orderLabel")}
                </p>
                <p className="mt-1 font-mono text-title text-text-primary">
                  #{paymentResult.receiptId}
                </p>
                <p className="mt-1 text-label text-text-tertiary">
                  {formattedDate}
                </p>
              </div>
            </div>

            <div className="hidden space-y-3 lg:block lg:mt-auto">
              <div className="rounded-card bg-bg px-4 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-label text-text-secondary">
                    {t("pos.receipt.total")}
                  </span>
                  <span className="text-title tabular-nums text-text-primary">
                    ฿{subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 no-print">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  onClick={() => window.print()}
                >
                  <LuPrinter size={18} />
                  {t("pos.success.printReceipt")}
                </Button>
                <Button size="lg" className="w-full" onClick={handleNewOrder}>
                  {t("pos.success.newOrder")}
                  <LuArrowRight size={18} />
                </Button>
              </div>
            </div>
          </aside>

          <section className="order-2 min-h-0 flex-1 overflow-y-auto bg-bg p-4 lg:order-1 [-webkit-overflow-scrolling:touch]">
            <div className="mx-auto max-w-md pb-28 lg:pb-6">
              <p className="mb-3 text-label text-text-secondary">
                {t("pos.success.receiptSection")}
              </p>
              <PaymentReceipt
                paymentResult={paymentResult}
                dateLabel={formattedDate}
                className="w-full bg-card-bg p-6"
              />
            </div>
          </section>
        </Card>

        <div className="no-print sticky bottom-0 z-10 mt-auto border-t border-border bg-card-bg p-4 lg:hidden">
          <div className="space-y-3">
            <div className="rounded-card bg-bg px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-label text-text-secondary">
                  {t("pos.receipt.total")}
                </span>
                <span className="text-title tabular-nums text-text-primary">
                  ฿{subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex w-full flex-col gap-3">
              <Button
                variant="secondary"
                size="lg"
                className="w-full"
                onClick={() => window.print()}
              >
                <LuPrinter size={18} />
                {t("pos.success.printReceipt")}
              </Button>
              <Button size="lg" className="w-full" onClick={handleNewOrder}>
                {t("pos.success.newOrder")}
                <LuArrowRight size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
