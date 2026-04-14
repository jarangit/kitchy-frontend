import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import AddUpStoreForm from "@/features/store/components/add-up-store";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { SettingsSectionCard, SettingsShell } from "@/features/store/components/settings-shell";
import { useTranslation } from "@/shared/i18n/use-translation";

const SettingsShopPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();
  const userId = auth?.user?.id ? String(auth.user.id) : undefined;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { storeFinOneQuery, updateStore, deleteStore } = useStoreService({ userId });

  const handleDeleteStore = () => {
    if (id !== undefined) {
      deleteStore();
      navigate("/dashboard");
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <SettingsShell
        title={t("settings.shop.title")}
        description={t("settings.shop.description")}
        onBack={() => navigate(`/store/${id}/settings`)}
      >
        <SettingsSectionCard title={t("settings.shop.storeName")}>
          {storeFinOneQuery ? (
            <AddUpStoreForm
              defaultValues={{ name: storeFinOneQuery.name }}
              _onSubmit={(data) =>
                updateStore({
                  storeData: { name: data.name },
                })
              }
            />
          ) : (
            <div className="text-[var(--color-text-tertiary)]">{t("settings.shop.loading")}</div>
          )}
        </SettingsSectionCard>

        <SettingsSectionCard
          title={t("settings.shop.dangerZone")}
          description={t("settings.shop.dangerDescription")}
        >
          <div className="space-y-6">
            <Button
              variant="danger"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              {t("settings.shop.deleteStore")}
            </Button>

            <div className="border-t border-[var(--color-border)] pt-5">
              <p className="mb-3 text-xs text-[var(--color-text-tertiary)]">
                {t("settings.shop.switchStorePrompt")}
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="h-11"
              >
                {t("settings.shop.switchStore")}
              </Button>
            </div>
          </div>
        </SettingsSectionCard>
      </SettingsShell>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogHeader>
          <DialogTitle>{t("settings.shop.deleteDialogTitle")}</DialogTitle>
          <DialogDescription>
            {t("settings.shop.deleteDialogDescription")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button variant="danger" onClick={handleDeleteStore}>
            {t("settings.shop.deleteConfirm")}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default SettingsShopPage;
