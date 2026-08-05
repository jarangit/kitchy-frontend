import type { Meta, StoryObj } from "@storybook/react-vite";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Button",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger", "ghost"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "icon"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary" },
};

export const Secondary: Story = {
  args: { variant: "secondary" },
};

export const Danger: Story = {
  args: { variant: "danger" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Small: Story = {
  args: { size: "sm", children: "Small" },
};

export const Large: Story = {
  args: { size: "lg", children: "Large" },
};

export const WithIcon: Story = {
  args: { children: "Add item" },
  render: (args) => (
    <Button {...args}>
      <LuPlus size={16} />
      Add item
    </Button>
  ),
};

export const DangerWithIcon: Story = {
  args: { variant: "danger", children: "Delete" },
  render: (args) => (
    <Button {...args}>
      <LuTrash2 size={16} />
      Delete
    </Button>
  ),
};

export const Loading: Story = {
  args: { loading: true },
};

export const LoadingWithText: Story = {
  args: { loading: true, loadingText: "Saving...", children: "Save" },
};

export const Disabled: Story = {
  args: { disabled: true },
};
