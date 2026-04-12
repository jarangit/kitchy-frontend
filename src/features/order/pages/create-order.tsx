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
  const { id: restaurantId } = useParams<{ id: string }>();
  const { productsQuery, productsQueryLoading } = useProductService(
    Number(restaurantId)
  );
  const orderService = useOrderService({
    restaurantId: Number(restaurantId),
    stationId: undefined,
    orderId: undefined,
  });
  const [listProductAdded, setListProductAdded] =
    useState<{ productId: number; quantity: number; name: string }[]>();

  const [orderNumber, setOrderNumber] = useState<string>("");

  const onAddProduct = (product: { id: number; name: string }) => {
    // Handle adding product to order
    const existingProduct = listProductAdded?.find(
      (item) => item.productId === product.id
    );
    if (existingProduct) {
      // If product already exists, increase quantity
      setListProductAdded((prev) =>
        prev?.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // If product does not exist, add it with quantity 1
      setListProductAdded((prev) => [
        ...(prev || []),
        { productId: product.id, quantity: 1, name: product.name || "" },
      ]);
    }
  };

  const onCreateOrder = () => {
    // Handle order creation logic here
    if (!listProductAdded || listProductAdded.length === 0) {
      alert("Please add at least one product to the order.");
      return;
    }
    const orderData = {
      restaurantId: Number(restaurantId),
      orderNumber: orderNumber, // Example order number
      products: listProductAdded?.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };
    orderService.createMutation.mutate({
      ...orderData,
    });
    // Reset the list after creating order
    setListProductAdded([]);
  };

  if (productsQueryLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-container">
      <Button onClick={() => window.history.back()}>Back</Button>
      <h1 className="text-2xl font-bold mb-4">Create Order</h1>

      {/* grid left is product list . right is number pad */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded shadow col-span-4">
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          {/* grid product */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productsQuery?.map((product: any) => (
              <div
                key={product.id}
                className="border p-4 rounded hover:bg-gray-100 cursor-pointer"
              >
                <h3 className="text-lg font-semibold">{product.name}</h3>
                <Button onClick={() => onAddProduct(product)}>ADD</Button>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow col-span-2">
          <h2 className="text-xl font-semibold mb-2">Number Pad</h2>
          {/* Number pad component goes here */}
          <input
            type="text"
            className="w-full border p-3"
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
            <div className="text-gray-500">No products added yet.</div>
          )}
          <Button className="w-full mt-4" onClick={() => onCreateOrder()}>
            Create Order
          </Button>
          {/* <Input type="text" />
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
              <Button
                key={number}
                className="w-full h-12"
                onClick={() => console.log(`Number ${number} pressed`)}
              >
                {number}
              </Button>
            ))}
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default CreateOrderPage;
