import { Button } from "@headlessui/react";
import React from "react";

type Props = {};

function CreateOrderPage({}: Props) {
  return (
    <div className="my-container">
      <Button onClick={() => window.history.back()}>Back</Button>
      <h1 className="text-2xl font-bold mb-4">Create Order</h1>
    </div>
  );
}

export default CreateOrderPage;
