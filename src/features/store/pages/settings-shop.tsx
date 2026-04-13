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
import { LuArrowLeft } from "react-icons/lu";

const SettingsShopPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useAuth();
  const userId = auth?.user?.id;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { storeFinOneQuery, updateStore, deleteStore } = useStoreService({
    userId,
    storeId: id ? +id : undefined,
  });

  const handleDeleteStore = () => {
    if (id !== undefined) {
      deleteStore(+id);
      navigate("/dashboard");
    }
    setIsDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate(`/store/${id}/settings`)}
        className="min-h-11 px-2 inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all duration-[var(--motion-fast)] active:scale-[0.98]"
      >
        <LuArrowLeft size={16} />
        Back to Settings
      </button>

      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Shop Settings</h1>

      {/* Edit Store Name */}
      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Store Name</h3>
        {storeFinOneQuery ? (
          <AddUpStoreForm
            defaultValues={{ name: storeFinOneQuery.name }}
            _onSubmit={(data) =>
              updateStore({
                storeId: storeFinOneQuery.id,
                storeData: { name: data.name },
              })
            }
          />
        ) : (
          <div className="text-[var(--color-text-tertiary)]">Loading...</div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">Danger Zone</h3>
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">
          Deleting a store is permanent and cannot be undone.
        </p>
        <Button
          variant="danger"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          Delete Store
        </Button>

        <div className="pt-4 mt-4 border-t border-[var(--color-border)]">
          <p className="text-xs text-[var(--color-text-tertiary)] mb-2">
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
    </div>
  );
};

export default SettingsShopPage;
