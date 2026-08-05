import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Select } from "./select";

const meta = {
  title: "UI/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  args: {
    options: [
      { value: "TOGO", label: "Takeaway (TOGO)" },
      { value: "DINE_IN", label: "Dine in" },
      { value: "DELIVERY", label: "Delivery" },
    ],
  },
  argTypes: {
    options: { control: false },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => {
    const [value, setValue] = useState("TOGO");
    return (
      <div className="w-72">
        <Select
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

export const WithLabel: Story = {
  args: { label: "Order type" },
  render: (args) => {
    const [value, setValue] = useState("DINE_IN");
    return (
      <div className="w-72">
        <Select
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

export const WithPlaceholder: Story = {
  args: { label: "Order type", placeholder: "Choose an order type" },
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <div className="w-72">
        <Select
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: { label: "Order type", value: "TOGO", disabled: true },
  render: (args) => (
    <div className="w-72">
      <Select {...args} />
    </div>
  ),
};
