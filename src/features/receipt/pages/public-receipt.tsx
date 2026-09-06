import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuClock, LuReceiptText } from "react-icons/lu";
import { useReceiptRealtime } from "@/features/receipt/hooks/use-receipt-realtime";
import {
  receiptApiService,
  ReceiptApiError,
} from "@/features/receipt/services/receipt";
import type {
  PublicReceiptDto,
  ReceiptExpiredPayload,
  ReceiptUpdatedPayload,
} from "@/features/receipt/types/receipt.dto";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";

const statusLabels: Record<PublicReceiptDto["status"], string> = {
  NEW: "รับออเดอร์แล้ว",
  PREPARING: "กำลังเตรียม",
  READY: "พร้อมรับ",
  COMPLETED: "เสร็จสิ้น",
  CANCELLED: "ยกเลิก",
};

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

const formatCurrency = (amount: number) => `฿${amount.toFixed(2)}`;

const formatDateTime = (value: string) =>
  new Date(value).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
        if (isMounted) setReceipt(data);
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
        ? { ...current, status: payload.status, updatedAt: payload.updatedAt }
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
      <main className="flex min-h-screen items-center justify-center bg-bg p-6">
        <section className="w-full max-w-md rounded-card border border-border bg-card-bg p-6 text-center shadow-card">
          <LuClock className="mx-auto mb-4 text-text-tertiary" size={40} />
          <h1 className="text-title font-semibold text-text-primary">
            {errorState?.title ?? "ไม่พบใบเสร็จ"}
          </h1>
          <p className="mt-2 text-label text-text-secondary">
            {errorState?.description ?? "กรุณาตรวจสอบลิงก์อีกครั้ง"}
          </p>
          <Button className="mt-5" onClick={() => navigate("/login")}>
            กลับไป Kitchy
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg px-4 py-6 sm:px-6">
      <section className="mx-auto w-full max-w-2xl rounded-card border border-border bg-card-bg p-5 shadow-card sm:p-7">
        <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="text-caption uppercase tracking-widest-2 text-text-tertiary">
              Digital Receipt
            </p>
            <h1 className="mt-1 text-title font-semibold text-text-primary">
              {receipt.storeName}
            </h1>
            <p className="mt-1 font-mono text-label text-text-secondary">
              #{receipt.orderNumber}
            </p>
          </div>
          <div className="rounded-card bg-surface px-3 py-2 text-right">
            <p className="text-caption text-text-tertiary">สถานะ</p>
            <p className="text-label font-semibold text-text-primary">
              {statusLabels[receipt.status]}
            </p>
          </div>
        </div>

        <div className="grid gap-3 border-b border-border py-5 text-label sm:grid-cols-2">
          <div>
            <p className="text-text-tertiary">ประเภทออเดอร์</p>
            <p className="text-text-primary">
              {orderTypeLabels[receipt.orderType]}
              {receipt.tableNumber ? ` · โต๊ะ ${receipt.tableNumber}` : ""}
            </p>
          </div>
          <div>
            <p className="text-text-tertiary">ชำระเงิน</p>
            <p className="text-text-primary">
              {paymentMethodLabels[receipt.paymentMethod]} ·{" "}
              {formatDateTime(receipt.paidAt)}
            </p>
          </div>
        </div>

        <div className="space-y-3 border-b border-border py-5">
          {receipt.items.map((item) => (
            <div
              key={`${item.name}-${item.quantity}`}
              className="grid grid-cols-[1fr_auto_auto] gap-3 text-label"
            >
              <div>
                <p className="text-text-primary">{item.name}</p>
                {item.note && (
                  <p className="mt-1 text-caption text-text-tertiary">
                    {item.note}
                  </p>
                )}
              </div>
              <p className="text-text-secondary">x{item.quantity}</p>
              <p className="w-20 text-right tabular-nums text-text-primary">
                {formatCurrency(item.total)}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-2 border-b border-border py-5 text-label">
          <div className="flex justify-between text-text-secondary">
            <span>Subtotal</span>
            <span className="tabular-nums">
              {formatCurrency(receipt.subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-title font-semibold text-text-primary">
            <span>Total</span>
            <span className="tabular-nums">
              {formatCurrency(receipt.totalAmount)}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-5 text-caption text-text-tertiary">
          <LuReceiptText className="mt-0.5 shrink-0" size={18} />
          <p>
            ใบเสร็จนี้เปิดดูได้ถึง {formatDateTime(receipt.expiresAt)}{" "}
            และสถานะจะอัปเดตอัตโนมัติเมื่อร้านเปลี่ยนสถานะออเดอร์
          </p>
        </div>
      </section>
    </main>
  );
}
