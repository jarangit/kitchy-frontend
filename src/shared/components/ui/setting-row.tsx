import { useState, type ReactNode, type KeyboardEvent } from "react";
import { LuChevronRight } from "react-icons/lu";
import { cn } from "@/shared/utils/cn";
import { useTranslation } from "@/shared/i18n/use-translation";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";

/**
 * iPad Settings–style row.
 * Variants:
 *   - "display"  : label + value on right (read-only)
 *   - "link"     : label + value + chevron (tappable)
 *   - "action"   : label only, whole row tappable, optional trailing node
 *   - "control"  : label + custom control on right (e.g. Toggle / ChipTab)
 *   - "editable" : tap to reveal inline input → Save / Cancel (auto-save on Save)
 */

type BaseProps = {
  icon?: ReactNode;
  label: ReactNode;
  hint?: ReactNode;
  className?: string;
};

type DisplayProps = BaseProps & {
  variant: "display";
  value?: ReactNode;
};

type LinkProps = BaseProps & {
  variant: "link";
  value?: ReactNode;
  onClick?: () => void;
};

type ActionProps = BaseProps & {
  variant: "action";
  onClick?: () => void;
  trailing?: ReactNode;
};

type ControlProps = BaseProps & {
  variant: "control";
  control: ReactNode;
};

type EditableProps = BaseProps & {
  variant: "editable";
  value: string;
  onSave: (next: string) => void;
  placeholder?: string;
  emptyLabel?: string;
  type?: "text" | "tel" | "email";
};

type Props =
  | DisplayProps
  | LinkProps
  | ActionProps
  | ControlProps
  | EditableProps;

const rowBase =
  "group flex items-center gap-4 px-4 py-3.5 min-h-14 text-body text-text-primary";

const tappable =
  "cursor-pointer transition-colors duration-[var(--motion-fast)] hover:bg-surface-hover focus-visible:outline-none focus-visible:bg-surface-hover";

function LabelBlock({
  icon,
  label,
  hint,
}: Pick<BaseProps, "icon" | "label" | "hint">) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      {icon && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-text-secondary">
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-body text-text-primary">{label}</div>
        {hint && (
          <div className="mt-0.5 truncate text-body-sm text-text-secondary">
            {hint}
          </div>
        )}
      </div>
    </div>
  );
}

export function SettingRow(props: Props) {
  const { t } = useTranslation();
  const { icon, label, hint, className } = props;

  // ---------- editable ----------
  if (props.variant === "editable") {
    const { value, onSave, placeholder, emptyLabel, type = "text" } = props;
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);

    const start = () => {
      setDraft(value);
      setEditing(true);
    };
    const commit = () => {
      onSave(draft.trim());
      setEditing(false);
    };
    const cancel = () => {
      setDraft(value);
      setEditing(false);
    };
    const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") commit();
      if (e.key === "Escape") cancel();
    };

    if (editing) {
      return (
        <div className={cn(rowBase, "items-stretch gap-3 py-2.5", className)}>
          <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <div className="shrink-0 text-body text-text-secondary sm:w-40">
              {label}
            </div>
            <Input
              autoFocus
              type={type}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKey}
              placeholder={placeholder}
              className="flex-1"
            />
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={cancel}>
              {t("settings.cp.row.cancel")}
            </Button>
            <Button type="button" size="sm" onClick={commit}>
              {t("settings.cp.row.save")}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <button
        type="button"
        onClick={start}
        className={cn(rowBase, tappable, "w-full text-left", className)}
      >
        <LabelBlock icon={icon} label={label} hint={hint} />
        <div className="flex shrink-0 items-center gap-2 text-body text-text-secondary">
          <span className={cn(!value && "italic text-text-tertiary")}>
            {value || emptyLabel || t("settings.cp.store.empty")}
          </span>
          <LuChevronRight
            size={18}
            className="text-text-tertiary transition-transform duration-[var(--motion-fast)] group-hover:translate-x-0.5"
          />
        </div>
      </button>
    );
  }

  // ---------- control ----------
  if (props.variant === "control") {
    return (
      <div className={cn(rowBase, className)}>
        <LabelBlock icon={icon} label={label} hint={hint} />
        <div className="shrink-0">{props.control}</div>
      </div>
    );
  }

  // ---------- link ----------
  if (props.variant === "link") {
    return (
      <button
        type="button"
        onClick={props.onClick}
        className={cn(rowBase, tappable, "w-full text-left", className)}
      >
        <LabelBlock icon={icon} label={label} hint={hint} />
        <div className="flex shrink-0 items-center gap-2 text-body text-text-secondary">
          {props.value != null && <span>{props.value}</span>}
          <LuChevronRight
            size={18}
            className="text-text-tertiary transition-transform duration-[var(--motion-fast)] group-hover:translate-x-0.5"
          />
        </div>
      </button>
    );
  }

  // ---------- action ----------
  if (props.variant === "action") {
    return (
      <button
        type="button"
        onClick={props.onClick}
        className={cn(rowBase, tappable, "w-full text-left", className)}
      >
        <LabelBlock icon={icon} label={label} hint={hint} />
        {props.trailing && <div className="shrink-0">{props.trailing}</div>}
      </button>
    );
  }

  // ---------- display ----------
  return (
    <div className={cn(rowBase, className)}>
      <LabelBlock icon={icon} label={label} hint={hint} />
      {props.value != null && (
        <div className="shrink-0 text-body text-text-secondary">
          {props.value}
        </div>
      )}
    </div>
  );
}

/** Group of rows with a soft divider between each row. */
export function SettingGroup({
  title,
  description,
  children,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      {(title || description) && (
        <div className="space-y-1 px-1">
          {title && (
            <h3 className="text-subtitle text-text-primary">{title}</h3>
          )}
          {description && (
            <p className="text-body-sm text-text-secondary">{description}</p>
          )}
        </div>
      )}
      <div className="divide-y divide-border/60 overflow-hidden rounded-card bg-surface">
        {children}
      </div>
    </section>
  );
}
