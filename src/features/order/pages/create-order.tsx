/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable no-empty-pattern */
import { Button } from "@/shared/components/ui/button";
import { useProductService } from "@/features/product/hooks/useProductService";
import { useOrderService } from "@/features/order/hooks/useOrder";
import { useState } from "react";
import { useParams } from "react-router-dom";

type Props = {};

function CreateOrderPage({}: Props) {
  const { id: storeId } = useParams<{ id: string }>();
  const { productsQuery, productsQueryLoading } = useProductService(
    Number(storeId)
  );
  const orderService = useOrderService({
    storeId: Number(storeId),
    stationId: undefined,
    orderId: undefined,
  });
  const [listProductAdded, setListProductAdded] =
    useState<{ productId: number; quantity: number; name: string }[]>();

  const [orderNumber, setOrderNumber] = useState<string>("");

  const onAddProduct = (product: { id: number; name: string }) => {
    const existingProduct = listProductAdded?.find(
      (item) => item.productId === product.id
    );
    if (existingProduct) {
      setListProductAdded((prev) =>
        prev?.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setListProductAdded((prev) => [
        ...(prev || []),
        { productId: product.id, quantity: 1, name: product.name || "" },
      ]);
    }
  };

  const onCreateOrder = () => {
    if (!listProductAdded || listProductAdded.length === 0) {
      alert("Please add at least one product to the order.");
      return;
    }
    const orderData = {
      storeId: Number(storeId),
      orderNumber: orderNumber,
      products: listProductAdded?.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };
    orderService.createMutation.mutate({
      ...orderData,
    });
    setListProductAdded([]);
  };

  if (productsQueryLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-container">
      <Button onClick={() => window.history.back()}>Back</Button>
      <h1 className="text-2xl font-bold mb-4">Create Order</h1>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-[var(--color-bg)] p-4 rounded shadow col-span-4">
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productsQuery?.map((product: any) => (
              <div
                key={product.id}
                className="border border-[var(--color-border)] p-4 rounded hover:bg-[var(--color-surface-hover)] cursor-pointer active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
              >
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <Button onClick={() => onAddProduct(product)}>Add to Order</Button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-[var(--color-bg)] p-4 rounded shadow col-span-2">
          <h2 className="text-xl font-semibold mb-2">Number Pad</h2>
          <input
            type="text"
            className="w-full border border-[var(--color-border)] p-3 rounded-[var(--input-radius)] bg-[var(--input-bg)] text-[var(--input-text)]"
            onChange={(e) => setOrderNumber(e.target.value)}
          />
          {listProductAdded && listProductAdded.length > 0 ? (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Selected Products</h3>
              <ul>
                {listProductAdded.map((item) => (
                  <li key={item.productId} className="mb-2">
                    {item.name}, : {item.quantity}x
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-[var(--color-text-secondary)]">No products added yet.</div>
          )}
          <Button className="w-full mt-4" onClick={() => onCreateOrder()}>
            Create Order
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CreateOrderPage;
