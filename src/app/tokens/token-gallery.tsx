/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

export type Token = { name: string; label?: string };

export type TokenRow = Token & {
  sample: (value: string) => ReactNode;
};

function useThemeVersion(): number {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const observer = new MutationObserver(() => setVersion((v) => v + 1));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  return version;
}

export function useTokenValues(
  names: readonly string[],
): Record<string, string> {
  useThemeVersion();
  const style = getComputedStyle(document.documentElement);
  const values: Record<string, string> = {};
  for (const name of names) {
    values[name] = style.getPropertyValue(name).trim();
  }
  return values;
}

export function TokenGroup({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-title text-text-primary">{title}</h2>
        {description ? (
          <p className="text-body-sm text-text-secondary">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function shortName(name: string): string {
  return name.replace(/^--/, "");
}

export function ColorSwatches({ tokens }: { tokens: Token[] }) {
  const names = tokens.map((t) => t.name);
  const values = useTokenValues(names);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {tokens.map((token) => (
        <div
          key={token.name}
          className="overflow-hidden rounded-lg border border-border bg-surface"
        >
          <div
            className="h-16 w-full border-b border-border"
            style={{ backgroundColor: `var(${token.name})` }}
          />
          <div className="space-y-0.5 p-2.5">
            <p className="text-label text-text-primary">
              {token.label ?? shortName(token.name)}
            </p>
            <p className="font-mono text-xs text-text-tertiary">{token.name}</p>
            <p className="font-mono text-xs text-text-secondary">
              {values[token.name]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TokenTable({ rows }: { rows: TokenRow[] }) {
  const names = rows.map((row) => row.name);
  const values = useTokenValues(names);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      {rows.map((row) => (
        <div
          key={row.name}
          className="flex items-center gap-4 border-b border-border px-3.5 py-2 last:border-b-0"
        >
          <div className="flex w-28 shrink-0 items-center justify-center">
            {row.sample(values[row.name])}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-label text-text-primary">
              {row.label ?? shortName(row.name)}
            </p>
            <p className="truncate font-mono text-xs text-text-tertiary">
              {row.name}
            </p>
          </div>
          <p className="shrink-0 font-mono text-xs text-text-secondary">
            {values[row.name]}
          </p>
        </div>
      ))}
    </div>
  );
}

export function CompositeTypeScale({
  items,
}: {
  items: { className: string; name: string }[];
}) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.name}
          className="rounded-lg border border-border bg-surface px-4 py-3"
        >
          <p className={`${item.className} text-text-primary`}>
            The quick brown fox jumps over the lazy dog
          </p>
          <p className="mt-1 font-mono text-xs text-text-tertiary">
            {item.name}
          </p>
        </div>
      ))}
    </div>
  );
}

export const colorSample =
  () =>
  (value: string): ReactNode => (
    <span
      className="inline-block h-7 w-7 rounded-full border border-border"
      style={{ backgroundColor: value || "var(--color-surface)" }}
    />
  );

export const spacingSample =
  (height = 8) =>
  (value: string): ReactNode => (
    <span
      className="inline-block rounded-full bg-accent"
      style={{ width: value, height, minWidth: 2 }}
    />
  );

export const radiusSample =
  (size = 32) =>
  (value: string): ReactNode => (
    <span
      className="inline-block border border-border bg-surface-muted"
      style={{ width: size, height: size, borderRadius: value }}
    />
  );

export const shadowSample = (value: string): ReactNode => (
  <span
    className="inline-block h-9 w-16 rounded-md bg-surface"
    style={{ boxShadow: value }}
  />
);

export const motionSample = (value: string): ReactNode => (
  <span
    className="inline-block h-3.5 w-3.5 animate-pulse rounded-full bg-accent"
    style={{ animationDuration: value }}
  />
);

export const fontSample = (value: string): ReactNode => (
  <span className="leading-none text-text-primary" style={{ fontSize: value }}>
    Ag
  </span>
);

export const weightSample = (value: string): ReactNode => (
  <span className="text-base text-text-primary" style={{ fontWeight: value }}>
    Ag
  </span>
);

export const leadingSample = (value: string): ReactNode => (
  <span
    className="inline-block w-32 text-body-sm text-text-primary"
    style={{ lineHeight: value }}
  >
    The quick brown fox jumps over the lazy dog
  </span>
);

export const trackingSample = (value: string): ReactNode => (
  <span
    className="text-body-sm text-text-primary"
    style={{ letterSpacing: value }}
  >
    Tracking
  </span>
);

export const familySample = (value: string): ReactNode => (
  <span
    className="text-body-sm text-text-primary"
    style={{ fontFamily: value }}
  >
    Ag
  </span>
);
