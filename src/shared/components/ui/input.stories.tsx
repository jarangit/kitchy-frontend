import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Input } from "./input";

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  args: {
    placeholder: "Type something...",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "tel", "password", "number"],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <div className="w-80">
        <Input
          {...args}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

export const WithLabel: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <div className="w-80">
        <Input
          {...args}
          label="Store name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    );
  },
};

export const WithError: Story = {
  args: {
    label: "Email",
    defaultValue: "not-an-email",
    error: "Please enter a valid email address.",
  },
  render: (args) => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
};

export const WithKeyboardToggle: Story = {
  args: {
    label: "Order number",
    placeholder: "e.g. 0042",
  },
  render: (args) => (
    <div className="w-80">
      <Input {...args} keyboardToggle />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    label: "Store name",
    defaultValue: "Kitchy Coffee",
    disabled: true,
  },
  render: (args) => (
    <div className="w-80">
      <Input {...args} />
    </div>
  ),
};
