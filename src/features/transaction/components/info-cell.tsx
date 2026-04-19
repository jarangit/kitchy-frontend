import type { ReactNode } from "react";

interface Props {
  label: string;
  value: ReactNode;
}

export function InfoCell({ label, value }: Props) {
  return (
    <div className="min-w-0">
      <p className="text-caption uppercase tracking-wider text-text-tertiary">
        {label}
      </p>
      <p className="mt-1 truncate text-body-sm font-medium text-text-primary">
        {value}
      </p>
    </div>
  );
}

export default InfoCell;
