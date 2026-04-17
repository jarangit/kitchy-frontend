import AddUpStoreForm from "@/features/store/components/add-up-store";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/shared/components/ui/dialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { useAppDispatch } from "@/shared/hooks/hooks";
import { clearCurrentStore, setCurrentStore } from "@/shared/store/slices/current-store-slice";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuPlus, LuStore } from "react-icons/lu";

export default function UserDashboard() {
  const auth = useAuth();
  const { user } = auth || {};
  const userId = auth?.user?.id ? String(auth.user.id) : undefined;

  const { stores, storesLoading, createStore } =
    useStoreService({ userId });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isCreate, setIsCreate] = useState(false);

  const handleLogout = () => {
    dispatch(clearCurrentStore());
    auth?.logout();
  };

  if (storesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <p className="text-body text-text-secondary">Loading...</p>
      </div>
    );
  }

  const hasStores = stores && stores.length > 0;

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-bg/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-surface">
              <span className="text-subtitle text-text-primary">
                K
              </span>
            </div>
            <span className="text-title text-text-primary">
              Kitchy
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-label text-text-secondary sm:inline">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-12 space-y-2">
          <p className="text-label text-text-secondary">Workspace</p>
          <h1 className="text-heading text-text-primary">
            Welcome back
          </h1>
          <p className="text-body text-text-secondary">
            {user?.email}
          </p>
        </div>

        <h2 className="mb-4 text-subtitle text-text-primary">
          Your Stores
        </h2>

        {hasStores ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stores.map((item: any) => (
              <button
                key={item.id}
                type="button"
                className="cursor-pointer text-left"
                onClick={() => {
                  dispatch(
                    setCurrentStore({
                      storeId: String(item.id),
                      storeName: item.name,
                    })
                  );
                  navigate(`/store/${item.id}`);
                }}
              >
                <Card className="min-h-40 bg-surface transition-colors duration-[var(--motion-fast)] hover:bg-card-bg-hover">
                  <CardContent className="flex h-full flex-col justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-bg text-text-secondary">
                      <LuStore size={22} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-subtitle text-text-primary">{item.name}</p>
                      <p className="text-body-sm leading-6 text-text-secondary">
                        Open the store workspace and continue service.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}

            <button
              type="button"
              className="cursor-pointer text-left"
              onClick={() => setIsCreate(true)}
            >
              <Card className="flex min-h-40 items-center justify-center border-dashed bg-bg text-center transition-colors duration-[var(--motion-fast)] hover:bg-card-bg-hover">
                <CardContent className="flex flex-col items-center gap-3 py-8">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-text-secondary">
                    <LuPlus size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-subtitle text-text-primary">Create New Store</p>
                    <p className="text-body-sm leading-6 text-text-secondary">
                      Add another location or brand workspace.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </button>
          </div>
        ) : (
          <EmptyState
            icon={<LuStore size={48} />}
            title="No stores yet"
            description="Create your first store to get started"
            action={
              <Button onClick={() => setIsCreate(true)}>Create Store</Button>
            }
          />
        )}
      </main>

      {/* Create store dialog */}
      <Dialog open={isCreate} onClose={() => setIsCreate(false)}>
        <DialogHeader>
          <DialogTitle>Create New Store</DialogTitle>
          <DialogDescription>
            Give your store a name to get started.
          </DialogDescription>
        </DialogHeader>
        <AddUpStoreForm
          _onSubmit={(data) => {
            if (!userId) return;
            createStore({ userId: userId, name: data?.name });
            setIsCreate(false);
          }}
        />
      </Dialog>
    </div>
  );
}
