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
      <div className="min-h-screen bg-[var(--color-surface)] flex items-center justify-center">
        <p className="text-[var(--color-text-secondary)]">Loading...</p>
      </div>
    );
  }

  const hasStores = stores && stores.length > 0;

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Top bar */}
      <header className="bg-[var(--color-bg)] border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Logo + name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] flex items-center justify-center">
              <span className="text-subtitle font-[var(--weight-semibold)] text-[var(--color-text-inverse)]">
                K
              </span>
            </div>
            <span className="text-title font-[var(--weight-semibold)] text-[var(--color-text-primary)]">
              Kitchy
            </span>
          </div>

          {/* Right: User info + sign out */}
          <div className="flex items-center gap-3">
            <span className="text-label text-[var(--color-text-secondary)] hidden sm:inline">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Content area */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-heading font-[var(--weight-bold)] text-[var(--color-text-primary)]">
            Welcome back
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            {user?.email}
          </p>
        </div>

        {/* Your Stores heading */}
        <h2 className="text-subtitle font-[var(--weight-semibold)] text-[var(--color-text-primary)] mt-8 mb-4">
          Your Stores
        </h2>

        {hasStores ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Store cards */}
            {stores.map((item: any) => (
              <div
                key={item.id}
                className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 cursor-pointer hover:border-[var(--color-border-hover)] hover:shadow-md active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
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
                <div className="w-10 h-10 rounded-xl bg-[var(--color-success-bg)] flex items-center justify-center text-2xl">
                  🏪
                </div>
                <p className="font-[var(--weight-medium)] mt-3 text-[var(--color-text-primary)]">
                  {item.name}
                </p>
              </div>
            ))}

            {/* Create new store card */}
            <div
              className="bg-[var(--color-bg)] border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] p-5 cursor-pointer hover:border-[var(--color-border-hover)] hover:shadow-md active:scale-[0.98] transition-all duration-[var(--motion-fast)] flex flex-col items-center justify-center gap-2"
              onClick={() => setIsCreate(true)}
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-text-secondary)]">
                <LuPlus size={24} />
              </div>
              <p className="text-label font-[var(--weight-medium)] text-[var(--color-text-secondary)]">
                Create New Store
              </p>
            </div>
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
