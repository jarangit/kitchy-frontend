import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LuCheck,
  LuChefHat,
  LuClock,
  LuInfo,
  LuShoppingBag,
  LuStore,
  LuX,
} from "react-icons/lu";
import { useReceiptRealtime } from "@/features/receipt/hooks/use-receipt-realtime";
import {
  receiptApiService,
  ReceiptApiError,
} from "@/features/receipt/services/receipt";
import type {
  PublicReceiptDto,
  ReceiptExpiredPayload,
  ReceiptOrderStatus,
  ReceiptUpdatedPayload,
} from "@/features/receipt/types/receipt.dto";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";
import { cn } from "@/shared/utils/cn";

const orderTypeLabels: Record<PublicReceiptDto["orderType"], string> = {
  DINE_IN: "ทานที่ร้าน",
  TOGO: "กลับบ้าน",
  DELIVERY: "เดลิเวอรี่",
};

const paymentMethodLabels: Record<PublicReceiptDto["paymentMethod"], string> = {
  CASH: "เงินสด",
  QR: "QR",
  DELIVERY_PLATFORM: "แพลตฟอร์มเดลิเวอรี่",
};

const steps = ["รับออเดอร์แล้ว", "กำลังทำ", "พร้อมรับ"] as const;

interface StatusView {
  title: string;
  subtitle: string;
  stepIndex: number;
  icon: typeof LuCheck;
  heroTone: string;
}

const statusViews: Record<ReceiptOrderStatus, StatusView> = {
  NEW: {
    title: "กำลังทำอาหาร",
    subtitle: "ครัวกำลังเตรียมออเดอร์ของคุณ",
    stepIndex: 1,
    icon: LuChefHat,
    heroTone: "bg-warning-bg text-warning",
  },
  PREPARING: {
    title: "กำลังทำอาหาร",
    subtitle: "ครัวกำลังเตรียมออเดอร์ของคุณ",
    stepIndex: 1,
    icon: LuChefHat,
    heroTone: "bg-warning-bg text-warning",
  },
  READY: {
    title: "พร้อมรับแล้ว",
    subtitle: "มารับออเดอร์ของคุณได้เลย",
    stepIndex: 2,
    icon: LuShoppingBag,
    heroTone: "bg-success-bg text-success",
  },
  COMPLETED: {
    title: "เสร็จสิ้น",
    subtitle: "ขอบคุณที่ใช้บริการครับ",
    stepIndex: 3,
    icon: LuCheck,
    heroTone: "bg-success-bg text-success",
  },
  CANCELLED: {
    title: "ออเดอร์ถูกยกเลิก",
    subtitle: "กรุณาติดต่อร้านหากมีข้อสงสัย",
    stepIndex: -1,
    icon: LuX,
    heroTone: "bg-danger-bg text-danger",
  },
};

const formatCurrency = (amount: number) => `฿${amount.toFixed(2)}`;

const formatDateTime = (value: string) =>
  new Date(value).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

const normalizeReceiptStatusForDisplay = (
  status: ReceiptOrderStatus,
): ReceiptOrderStatus => (status === "NEW" ? "PREPARING" : status);

export default function PublicReceiptPage() {
  const { receiptToken } = useParams<{ receiptToken: string }>();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<PublicReceiptDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorState, setErrorState] = useState<{
    title: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadReceipt = async () => {
      if (!receiptToken) return;

      setIsLoading(true);
      setErrorState(null);

      try {
        const data = await receiptApiService.getByToken(receiptToken);
        if (isMounted) {
          setReceipt({
            ...data,
            status: normalizeReceiptStatusForDisplay(data.status),
          });
        }
      } catch (error) {
        if (!isMounted) return;

        if (error instanceof ReceiptApiError && error.status === 410) {
          setErrorState({
            title: "ลิงก์ใบเสร็จหมดอายุแล้ว",
            description: error.expiredAt
              ? `หมดอายุเมื่อ ${formatDateTime(error.expiredAt)}`
              : "ลิงก์นี้ไม่สามารถเปิดดูได้แล้ว",
          });
        } else if (error instanceof ReceiptApiError && error.status === 404) {
          setErrorState({
            title: "ไม่พบใบเสร็จ",
            description: "กรุณาตรวจสอบลิงก์อีกครั้ง",
          });
        } else {
          setErrorState({
            title: "โหลดใบเสร็จไม่สำเร็จ",
            description: "กรุณาลองใหม่อีกครั้ง",
          });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadReceipt();

    return () => {
      isMounted = false;
    };
  }, [receiptToken]);

  const handleUpdated = useCallback((payload: ReceiptUpdatedPayload) => {
    setReceipt((current) =>
      current
        ? {
            ...current,
            status: normalizeReceiptStatusForDisplay(payload.status),
            updatedAt: payload.updatedAt,
          }
        : current,
    );
  }, []);

  const handleExpired = useCallback((payload: ReceiptExpiredPayload) => {
    setErrorState({
      title: "ลิงก์ใบเสร็จหมดอายุแล้ว",
      description: `หมดอายุเมื่อ ${formatDateTime(payload.expiredAt)}`,
    });
  }, []);

  useReceiptRealtime({
    receiptToken,
    onUpdated: handleUpdated,
    onExpired: handleExpired,
  });

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg p-6">
        <Spinner size="lg" />
      </main>
    );
  }

  if (errorState || !receipt) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg p-4 sm:p-6">
        <section className="w-full max-w-md rounded-card border border-border bg-card-bg p-6 text-center shadow-card sm:p-8">
          <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
            <LuClock className="text-text-tertiary" size={32} />
          </span>
          <h1 className="text-title font-semibold text-text-primary">
            {errorState?.title ?? "ไม่พบใบเสร็จ"}
          </h1>
          <p className="mt-2 text-body-sm text-text-secondary">
            {errorState?.description ?? "กรุณาตรวจสอบลิงก์อีกครั้ง"}
          </p>
          <Button className="mt-6 w-full" onClick={() => navigate("/login")}>
            กลับไป Kitchy
          </Button>
        </section>
      </main>
    );
  }

  const displayStatus = normalizeReceiptStatusForDisplay(receipt.status);
  const statusView = statusViews[displayStatus];
  const StatusIcon = statusView.icon;
  const isCancelled = displayStatus === "CANCELLED";

  return (
    <main className="min-h-screen bg-bg px-4 py-6 sm:px-6 sm:py-10">
      <section className="mx-auto w-full max-w-lg overflow-hidden rounded-card border border-border bg-card-bg shadow-card">
        <div className="p-5 sm:p-7">
          <header className="flex items-start justify-between gap-3 border-b border-border pb-5">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-muted">
                <LuStore className="text-text-primary" size={26} />
              </span>
              <div className="min-w-0">
                <h1 className="truncate text-title font-semibold text-text-primary">
                  {receipt.storeName}
                </h1>
                <p className="mt-0.5 text-body-sm text-text-secondary">
                  ขอบคุณที่อุดหนุนครับ
                </p>
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-surface-muted px-3 py-1.5 text-caption font-medium text-text-secondary">
              <LuShoppingBag size={14} aria-hidden="true" />
              {orderTypeLabels[receipt.orderType]}
            </span>
          </header>

          <div className="mt-5">
            <p className="font-mono text-title font-semibold text-text-primary">
              #{receipt.orderNumber}
            </p>
            <p className="mt-1 text-body-sm text-text-secondary">
              สั่งเมื่อ {formatDateTime(receipt.createdAt)}
              {receipt.tableNumber ? ` · โต๊ะ ${receipt.tableNumber}` : ""}
            </p>
          </div>

          <div className="mt-6 flex flex-col items-center text-center">
            <span
              className={cn(
                "flex h-20 w-20 items-center justify-center rounded-full",
                statusView.heroTone,
              )}
            >
              <StatusIcon size={40} aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-heading font-semibold text-text-primary">
              {statusView.title}
            </h2>
            <p className="mt-1 text-body-sm text-text-secondary">
              {statusView.subtitle}
            </p>
          </div>

          {!isCancelled && (
            <div className="mt-8" aria-label="สถานะออเดอร์">
              <div className="grid grid-cols-3 items-start">
                {steps.map((label, index) => {
                  const isDone = index < statusView.stepIndex;
                  const isCurrent = index === statusView.stepIndex;
                  const isReached = index <= statusView.stepIndex;
                  const isFirst = index === 0;
                  const isLast = index === steps.length - 1;
                  return (
                    <div
                      key={label}
                      className="flex min-w-0 flex-col items-center text-center"
                    >
                      <div className="flex w-full items-center">
                        <span
                          className={cn(
                            "h-0.5 flex-1",
                            isFirst && "invisible",
                            index <= statusView.stepIndex
                              ? "bg-success"
                              : "bg-border",
                          )}
                          aria-hidden="true"
                        />
                        <span
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                            isDone &&
                              "border-success bg-success text-on-status",
                            isCurrent &&
                              "border-warning bg-warning text-on-status",
                            !isReached &&
                              "border-border bg-surface text-text-tertiary",
                          )}
                          aria-current={isCurrent ? "step" : undefined}
                        >
                          {isDone ? (
                            <LuCheck size={16} aria-hidden="true" />
                          ) : (
                            <span
                              className={cn(
                                "h-2.5 w-2.5 rounded-full",
                                isCurrent ? "bg-on-status" : "bg-border",
                              )}
                              aria-hidden="true"
                            />
                          )}
                        </span>
                        <span
                          className={cn(
                            "h-0.5 flex-1",
                            isLast && "invisible",
                            index < statusView.stepIndex
                              ? "bg-success"
                              : "bg-border",
                          )}
                          aria-hidden="true"
                        />
                      </div>
                      <p
                        className={cn(
                          "mt-2 text-center text-caption",
                          isReached
                            ? "font-medium text-text-primary"
                            : "text-text-tertiary",
                        )}
                      >
                        {label}
                      </p>
                      {index === 0 && (
                        <p className="mt-0.5 text-caption tabular-nums text-text-tertiary">
                          {formatTime(receipt.createdAt)}
                        </p>
                      )}
                      {isCurrent && index > 0 && (
                        <p className="mt-0.5 text-caption tabular-nums text-text-tertiary">
                          {formatTime(receipt.updatedAt)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-8 border-t border-border pt-5">
            <h3 className="text-subtitle font-semibold text-text-primary">
              รายการของคุณ ({receipt.items.length})
            </h3>
            <ul className="mt-2 divide-y divide-border">
              {receipt.items.map((item) => (
                <li
                  key={`${item.name}-${item.quantity}-${item.price}`}
                  className="grid grid-cols-[1fr_auto_auto] items-baseline gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-body font-medium text-text-primary">
                      {item.name}
                    </p>
                    {item.note && (
                      <p className="mt-0.5 truncate text-caption text-text-tertiary">
                        {item.note}
                      </p>
                    )}
                  </div>
                  <p className="text-body-sm tabular-nums text-text-secondary">
                    x{item.quantity}
                  </p>
                  <p className="w-20 text-right text-body font-medium tabular-nums text-text-primary">
                    {formatCurrency(item.total)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex items-center gap-4 rounded-card border border-success-border bg-success-bg p-4 sm:p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success text-on-status">
              <LuCheck size={26} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-body font-medium text-text-primary">
                ชำระเงินแล้ว
              </p>
              <p className="text-title font-semibold tabular-nums text-text-primary">
                {formatCurrency(receipt.totalAmount)}
              </p>
              <p className="mt-0.5 text-caption text-text-secondary">
                {paymentMethodLabels[receipt.paymentMethod]} ·{" "}
                {formatDateTime(receipt.paidAt)}
              </p>
            </div>
          </div>

          <footer className="mt-5 flex items-start gap-3 border-t border-border pt-5">
            <LuInfo
              className="mt-0.5 shrink-0 text-text-tertiary"
              size={20}
              aria-hidden="true"
            />
            <div>
              <p className="text-body font-medium text-text-primary">
                สถานะจะอัปเดตให้อัตโนมัติ
              </p>
              <p className="mt-0.5 text-body-sm text-text-secondary">
                คุณสามารถปิดหน้านี้ได้ และกลับมาดูได้ตลอดเวลาจนถึง{" "}
                {formatDateTime(receipt.expiresAt)}
              </p>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}
