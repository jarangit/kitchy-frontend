import {
  LuHouse,
  LuMaximize2,
  LuMinimize2,
  LuVolume2,
  LuVolumeX,
} from "react-icons/lu";
import { useNavigate, useParams } from "react-router-dom";
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
    "rounded-segment border border-on-primary/30 bg-on-primary/10 text-on-primary hover:bg-on-primary/16 hover:text-on-primary hover:border-on-primary/40",
  default:
    "rounded-segment border border-border bg-surface text-text-secondary hover:border-border-hover hover:bg-surface-hover hover:text-text-primary",
};

export function KdsControlGroup({ variant = "default" }: KdsControlGroupProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id: storeId } = useParams<{ id: string }>();
  const { fullscreen, toggleFullscreen } = useKdsLayout();
  const { alertSoundOn, toggleAlertSound } = useAlertSound();

  const soundAriaLabel = alertSoundOn
    ? t("kds.sound.disable")
    : t("kds.sound.enable");
  const fullscreenAriaLabel = fullscreen
    ? t("kds.fullscreen.exit")
    : t("kds.fullscreen.enter");
  const exitAriaLabel = t("kds.exitBoard");

  const buttonClass = variantButtonClass[variant];

  return (
    <div className="flex items-center gap-2">
      {storeId && (
        <IconButton
          size="sm"
          aria-label={exitAriaLabel}
          title={exitAriaLabel}
          onClick={() => navigate(`/store/${storeId}`)}
          className={buttonClass}
        >
          <LuHouse size={16} />
        </IconButton>
      )}
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
