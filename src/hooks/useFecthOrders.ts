/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { fetchOrders } from "../service/order-service";

export function useOrders() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const data = await fetchOrders();
        setData(data); // รองรับทั้งแบบ object หรือ array
      } catch (err: any) {
        console.error("Error loading orders:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  return { data, loading, error };
}
