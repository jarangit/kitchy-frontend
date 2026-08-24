import { LuMaximize2, LuMinimize2, LuVolume2, LuVolumeX } from "react-icons/lu";
import { IconButton } from "@/shared/components/ui/icon-button";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useKdsLayout } from "@/features/kds/components/kds-layout";
import { useAlertSound } from "@/features/kds/hooks/use-alert-sound";

type ControlVariant = "onPrimary" | "default";

interface KdsControlGroupProps {
  variant?: ControlVariant;
}

const variantButtonClass: Record<ControlVariant, string> = {
  onPrimary:
    "border border-on-primary/30 bg-on-primary/10 text-on-primary hover:bg-on-primary/16 hover:text-on-primary hover:border-on-primary/40",
  default:
    "border border-border bg-surface text-text-secondary hover:bg-surface-hover hover:text-text-primary hover:border-border-hover",
};

export function KdsControlGroup({ variant = "default" }: KdsControlGroupProps) {
  const { t } = useTranslation();
  const { fullscreen, toggleFullscreen } = useKdsLayout();
  const { alertSoundOn, toggleAlertSound } = useAlertSound();

  const soundAriaLabel = alertSoundOn
    ? t("kds.sound.disable")
    : t("kds.sound.enable");
  const fullscreenAriaLabel = fullscreen
    ? t("kds.fullscreen.exit")
    : t("kds.fullscreen.enter");

  const buttonClass = variantButtonClass[variant];

  return (
    <div className="flex items-center gap-1">
      <IconButton
        size="sm"
        aria-label={soundAriaLabel}
        title={soundAriaLabel}
        onClick={toggleAlertSound}
        className={buttonClass}
      >
        {alertSoundOn ? <LuVolume2 size={16} /> : <LuVolumeX size={16} />}
      </IconButton>
      <IconButton
        size="sm"
        aria-label={fullscreenAriaLabel}
        title={fullscreenAriaLabel}
        onClick={toggleFullscreen}
        className={buttonClass}
      >
        {fullscreen ? <LuMinimize2 size={16} /> : <LuMaximize2 size={16} />}
      </IconButton>
    </div>
  );
}
