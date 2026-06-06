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
            <Button onClick={() => navigate(`/store/${id}/pos`)}>{t("pos.payment.backToPos")}</Button>
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
    <div className="min-h-0 flex-1 overflow-y-auto [-webkit-overflow-scrolling:touch]">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Card padding="none" className="overflow-hidden">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_320px]">
            <section className="order-2 bg-bg p-4 lg:order-1">
              <div className="mx-auto max-w-md">
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

            <aside className="order-1 border-b border-border bg-card-bg p-4 lg:sticky lg:top-6 lg:order-2 lg:border-b-0 lg:border-l">
              <div className="space-y-5">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success-bg text-success animate-check">
                    <LuCircleCheck size={28} />
                  </div>
                  <h1 className="text-title text-text-primary">{t("pos.success.title")}</h1>
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
                  <p className="mt-1 text-label text-text-tertiary">{formattedDate}</p>
                </div>

                <div className="rounded-card bg-bg px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-label text-text-secondary">{t("pos.receipt.total")}</span>
                    <span className="text-title tabular-nums text-text-primary">
                      ฿{subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="flex w-full flex-col gap-3 no-print">
                  <Button size="lg" className="w-full" onClick={handleNewOrder}>
                    {t("pos.success.newOrder")}
                    <LuArrowRight size={18} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    onClick={() => window.print()}
                  >
                    <LuPrinter size={18} />
                    {t("pos.success.printReceipt")}
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
