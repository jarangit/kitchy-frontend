import { LuQrCode } from "react-icons/lu";

interface Props {
  subtotal: number;
}

const QrPaymentSection = ({ subtotal }: Props) => {
  return (
    <div className="bg-surface rounded-radius-md border border-border p-6 mt-6 text-center">
      <h3 className="mb-6 text-title text-text-primary">QR Code Payment</h3>
      <div className="w-52 h-52 mx-auto border border-border rounded-radius-lg flex flex-col items-center justify-center gap-3 text-text-tertiary">
        <LuQrCode size={48} />
        <span className="text-base">QR Code Placeholder</span>
      </div>
      <p className="mt-4 text-label text-text-secondary">
        Scan to pay ฿{subtotal.toFixed(2)}
      </p>
    </div>
  );
};

export default QrPaymentSection;
