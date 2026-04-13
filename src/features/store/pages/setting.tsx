import AddUpStoreForm from "@/features/store/components/add-up-store";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { useNavigate, useParams } from "react-router-dom";


const SettingStorePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const auth = useAuth();
  const userId = auth?.user?.id;

  const { storeFinOneQuery, updateStore, deleteStore } =
    useStoreService({
      userId,
      storeId: id ? +id : undefined,
    });

  return (
    <div className="my-container flex flex-col gap-4 divide-x">
      <Button onClick={() => navigate(`/store/${id}`)}>
        Back
      </Button>
      <div className="text-xl">Setting</div>
      <div className="text-lg">Store Setting</div>

      {/* form */}
      <div>
        {storeFinOneQuery ? (
          <AddUpStoreForm
            defaultValues={{
              name: storeFinOneQuery.name,
            }}
            _onSubmit={(data) =>
              updateStore({
                storeId: storeFinOneQuery.id,
                storeData: { name: data.name },
              })
            }
          />
        ) : (
          ""
        )}
      </div>

      {/* delete */}
      <div>
        <Button
          variant="destructive"
          onClick={() => {
            if (storeFinOneQuery) {
              if (
                window.confirm(
                  "Are you sure you want to delete this store?"
                )
              ) {
                if (id !== undefined) {
                  deleteStore(+id);
                  navigate(`/dashboard`);
                }
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

export default SettingStorePage;
