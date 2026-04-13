import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import AddUpStoreForm from "@/features/store/components/add-up-store";
import { Button } from "@/shared/components/ui/button";
import { LuArrowLeft } from "react-icons/lu";

const SettingsShopPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useAuth();
  const userId = auth?.user?.id;

  const { storeFinOneQuery, updateStore, deleteStore } = useStoreService({
    userId,
    storeId: id ? +id : undefined,
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button
        onClick={() => navigate(`/store/${id}/settings`)}
        className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors active:scale-[0.98]"
      >
        <LuArrowLeft size={16} />
        Back to Settings
      </button>

      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Shop Settings</h1>

      {/* Edit Store Name */}
      <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-6">
        <h3 className="font-semibold text-[var(--color-text-primary)] mb-4">Store Name</h3>
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
      <div className="bg-[var(--color-danger-bg)] rounded-xl border border-[var(--color-danger)] p-6">
        <h3 className="font-semibold text-[var(--color-danger)] mb-2">Danger Zone</h3>
        <p className="text-sm text-[var(--color-danger)] mb-4">
          Deleting a store is permanent and cannot be undone.
        </p>
        <Button
          variant="danger"
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to delete this store? This action cannot be undone."
              )
            ) {
              if (id !== undefined) {
                deleteStore(+id);
                navigate("/dashboard");
              }
            }
          }}
        >
          Delete Store
        </Button>
      </div>
    </div>
  );
};

export default SettingsShopPage;
