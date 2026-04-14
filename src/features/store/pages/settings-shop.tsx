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

const SettingsShopPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useAuth();
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
        title="Shop Settings"
        description="Update your store identity and manage high-impact store actions."
        onBack={() => navigate(`/store/${id}/settings`)}
      >
        <SettingsSectionCard title="Store Name">
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
            <div className="text-[var(--color-text-tertiary)]">Loading...</div>
          )}
        </SettingsSectionCard>

        <SettingsSectionCard
          title="Danger Zone"
          description="Deleting a store is permanent and cannot be undone."
        >
          <div className="space-y-6">
            <Button
              variant="danger"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete Store
            </Button>

            <div className="border-t border-[var(--color-border)] pt-5">
              <p className="mb-3 text-xs text-[var(--color-text-tertiary)]">
                Need to work on another store?
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="h-11"
              >
                Switch Store
              </Button>
            </div>
          </div>
        </SettingsSectionCard>
      </SettingsShell>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogHeader>
          <DialogTitle>Delete Store</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this store? This action is permanent and cannot be undone. All data associated with this store will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteStore}>
            Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default SettingsShopPage;
