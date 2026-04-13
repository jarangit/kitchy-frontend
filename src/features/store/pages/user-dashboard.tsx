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
      <div className="flex justify-end gap-3 border p-4">
        <div>Hello: {user?.email}</div>
        <button onClick={handleLogout}>logout</button>
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
                    className="bg-blue-300 rounded-lg p-4 cursor-pointer hover:bg-blue-400"
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
