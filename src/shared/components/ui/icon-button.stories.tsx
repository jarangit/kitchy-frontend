import type { Meta, StoryObj } from "@storybook/react-vite";
import { LuSearch, LuSettings, LuTrash2 } from "react-icons/lu";
import { IconButton } from "./icon-button";

const meta = {
  title: "UI/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
  },
  args: {
    "aria-label": "Settings",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: { size: "sm" },
  render: (args) => (
    <IconButton {...args}>
      <LuSearch size={16} />
    </IconButton>
  ),
};

export const Medium: Story = {
  args: { size: "md" },
  render: (args) => (
    <IconButton {...args}>
      <LuSettings size={18} />
    </IconButton>
  ),
};

export const Large: Story = {
  args: { size: "lg" },
  render: (args) => (
    <IconButton {...args}>
      <LuTrash2 size={20} />
    </IconButton>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <IconButton {...args}>
      <LuSettings size={18} />
    </IconButton>
  ),
};
