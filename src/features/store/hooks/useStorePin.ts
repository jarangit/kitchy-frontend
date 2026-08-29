import { useCallback, useState } from "react";
import {
  clearStorePinCache,
  getStorePin,
  isValidStorePin,
  setStorePinCache,
} from "@/features/store/utils/store-pin-cache";
import { useStoreRouteParam } from "@/shared/hooks/use-store-route-param";
import { storeServiceApi } from "@/features/store/services/store";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "@/shared/services/toast-service";
import { useTranslation } from "@/shared/i18n/use-translation";

type StorePinErrorCode =
  | "STORE_PIN_REQUIRED"
  | "INVALID_STORE_PIN"
  | "STORE_PIN_ALREADY_SET"
  | "STORE_NOT_FOUND";

function extractErrorCode(error: unknown): StorePinErrorCode | null {
  const data = (error as { response?: { data?: unknown } })?.response?.data as
    | {
        message?: { errorCode?: string } | string | string[];
        errorCode?: string;
      }
    | undefined;

  if (!data) return null;
  const msg = data.message ?? data;
  if (typeof msg === "object" && msg !== null && "errorCode" in msg) {
    const code = (msg as { errorCode?: string }).errorCode;
    if (
      code === "STORE_PIN_REQUIRED" ||
      code === "INVALID_STORE_PIN" ||
      code === "STORE_PIN_ALREADY_SET" ||
      code === "STORE_NOT_FOUND"
    )
      return code;
  }
  if (typeof msg === "string" && msg.includes("STORE_PIN_REQUIRED"))
    return "STORE_PIN_REQUIRED";
  return null;
}

export function useStorePin() {
  const storeId = useStoreRouteParam() ?? "";
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const [pinDialog, setPinDialog] = useState<{
    open: boolean;
    mode: "verify" | "create";
    resolve?: (pin: string | null) => void;
  }>({ open: false, mode: "verify" });

  const requestPin = useCallback(
    (mode: "verify" | "create" = "verify"): Promise<string | null> => {
      return new Promise((resolve) => {
        setPinDialog({ open: true, mode, resolve });
      });
    },
    [],
  );

  const handlePinDialogClose = useCallback(() => {
    setPinDialog((prev) => {
      prev.resolve?.(null);
      return { open: false, mode: prev.mode };
    });
  }, []);

  const handlePinDialogVerify = useCallback((pin: string) => {
    if (!isValidStorePin(pin)) return false;
    setPinDialog((prev) => {
      prev.resolve?.(pin);
      return { open: false, mode: prev.mode };
    });
    return true;
  }, []);

  const handlePinDialogCreate = useCallback((pin: string) => {
    if (!isValidStorePin(pin)) return;
    setPinDialog((prev) => {
      prev.resolve?.(pin);
      return { open: false, mode: prev.mode };
    });
  }, []);

  const ensurePin = useCallback(async (): Promise<string | null> => {
    const cached = getStorePin(storeId);
    if (cached && isValidStorePin(cached)) return cached;
    const pin = await requestPin("verify");
    if (pin && isValidStorePin(pin)) {
      setStorePinCache(storeId, pin);
      return pin;
    }
    return null;
  }, [requestPin, storeId]);

  const ensurePinForCreate = useCallback(async (): Promise<string | null> => {
    const pin = await requestPin("create");
    if (pin && isValidStorePin(pin)) {
      setStorePinCache(storeId, pin);
      return pin;
    }
    return null;
  }, [requestPin, storeId]);

  const executeWithPin = useCallback(
    async <T>(action: (pin: string) => Promise<T>): Promise<T | null> => {
      let pin = await ensurePin();
      if (!pin) return null;

      try {
        const result = await action(pin);
        return result;
      } catch (error) {
        const code = extractErrorCode(error);
        if (code === "INVALID_STORE_PIN") {
          clearStorePinCache(storeId);
          toast.error({ title: t("settings.pin.error.incorrect") });
          const retryPin = await requestPin("verify");
          if (!retryPin || !isValidStorePin(retryPin)) return null;
          setStorePinCache(storeId, retryPin);
          try {
            return await action(retryPin);
          } catch (retryError) {
            const retryCode = extractErrorCode(retryError);
            if (retryCode === "INVALID_STORE_PIN") {
              toast.error({ title: t("settings.pin.error.incorrect") });
              clearStorePinCache(storeId);
            }
            throw retryError;
          }
        }

        if (code === "STORE_PIN_REQUIRED") {
          // Store has no PIN yet — need to create one first
          toast.error({ title: t("settings.pin.error.required") });
          const newPin = await ensurePinForCreate();
          if (!newPin) return null;
          try {
            await storeServiceApi.setStorePin(storeId, { pin: newPin });
            queryClient.invalidateQueries({ queryKey: ["store", storeId] });
            toast.success({ title: t("settings.pin.success.created") });
            // retry original action with new pin
            return await action(newPin);
          } catch (setPinError) {
            const setPinCode = extractErrorCode(setPinError);
            if (setPinCode === "STORE_PIN_ALREADY_SET") {
              // PIN now exists, retry with the same pin as verification
              try {
                return await action(newPin);
              } catch (finalError) {
                throw finalError;
              }
            }
            throw setPinError;
          }
        }

        throw error;
      }
    },
    [ensurePin, ensurePinForCreate, queryClient, requestPin, storeId, t],
  );

  const setPinFirstTime = useCallback(
    async (pin: string) => {
      if (!isValidStorePin(pin)) {
        toast.error({ title: t("settings.pin.error.invalidFormat") });
        throw new Error("Invalid PIN format");
      }
      try {
        await storeServiceApi.setStorePin(storeId, { pin });
        setStorePinCache(storeId, pin);
        queryClient.invalidateQueries({ queryKey: ["store", storeId] });
        toast.success({ title: t("settings.pin.success.created") });
      } catch (error) {
        const code = extractErrorCode(error);
        if (code === "STORE_PIN_ALREADY_SET") {
          toast.error({ title: t("settings.pin.error.alreadySet") });
        }
        throw error;
      }
    },
    [queryClient, storeId, t],
  );

  return {
    pinDialog,
    handlePinDialogClose,
    handlePinDialogVerify,
    handlePinDialogCreate,
    ensurePin,
    executeWithPin,
    setPinFirstTime,
    getCachedPin: () => getStorePin(storeId),
    clearPin: () => clearStorePinCache(storeId),
  };
}
