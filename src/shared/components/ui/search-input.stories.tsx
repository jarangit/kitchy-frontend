import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SearchInput } from "./search-input";

const meta = {
  title: "UI/SearchInput",
  component: SearchInput,
  parameters: {
    layout: "centered",
  },
  args: {
    placeholder: "Search products...",
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return <SearchInput {...args} value={value} onValueChange={setValue} />;
  },
};

export const WithValue: Story = {
  args: { value: "Iced latte" },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? "");
    return <SearchInput {...args} value={value} onValueChange={setValue} />;
  },
};
