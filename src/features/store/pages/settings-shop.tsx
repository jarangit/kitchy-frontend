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
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors"
      >
        <LuArrowLeft size={16} />
        Back to Settings
      </button>

      <h1 className="text-2xl font-bold text-gray-800">Shop Settings</h1>

      {/* Edit Store Name */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Store Name</h3>
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
          <div className="text-gray-400">Loading...</div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-xl border border-red-200 p-6">
        <h3 className="font-semibold text-red-700 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-600 mb-4">
          Deleting a store is permanent and cannot be undone.
        </p>
        <Button
          variant="destructive"
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
