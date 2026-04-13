// src/pages/UserDashboard.tsx
import AddUpStoreForm from "@/features/store/components/add-up-store";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const auth = useAuth();
  const { user } = auth || {};
  const userId = auth?.user?.id;

  const { stores, storesLoading, createStore } =
    useStoreService({ userId });
  const navigate = useNavigate();

  const [isCreate, setIsCreate] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {}, [stores]);

  if (storesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-container">
      <div className="flex justify-end items-center gap-3 border border-[var(--color-border)] rounded-xl p-4">
        <div className="text-[var(--color-text-secondary)]">Hello: {user?.email}</div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
        >
          Sign Out
        </Button>
      </div>
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-2xl font-bold">Your Stores</h1>
        <Button onClick={() => setIsCreate(!isCreate)}>
          {!isCreate ? "Build new store" : "Cancel"}
        </Button>
      </div>

      {!isCreate ? (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stores && stores?.length
              ? stores.map((item: any) => (
                  <div
                    className="bg-[var(--color-primary)] rounded-lg p-4 cursor-pointer hover:bg-[var(--color-primary-hover)] text-[var(--color-text-inverse)] active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
                    onClick={() => navigate(`/store/${item.id}`)}
                    key={item.id}
                  >
                    <strong className="">{item.name}</strong>
                  </div>
                ))
              : "No stores found"}
          </div>
        </div>
      ) : (
        <AddUpStoreForm
          _onSubmit={(data) => {
            if (!userId) return;
            createStore({ userId: userId, name: data?.name });
            setIsCreate(false);
          }}
        />
      )}
    </div>
  );
}
