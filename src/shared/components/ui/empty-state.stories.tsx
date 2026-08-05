import type { Meta, StoryObj } from "@storybook/react-vite";
import { LuInbox } from "react-icons/lu";
import { Button } from "./button";
import { EmptyState } from "./empty-state";

const meta = {
  title: "UI/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "centered",
  },
  args: {
    title: "No items yet",
    description: "Get started by creating your first item.",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithIcon: Story = {
  render: (args) => (
    <EmptyState {...args} icon={<LuInbox size={48} />} />
  ),
};

export const WithAction: Story = {
  args: {
    icon: <LuInbox size={48} />,
  },
  render: (args) => (
    <EmptyState {...args} action={<Button size="sm">Add item</Button>} />
  ),
};
