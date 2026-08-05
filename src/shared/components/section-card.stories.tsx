import type { Meta, StoryObj } from "@storybook/react-vite";
import { LuUtensilsCrossed } from "react-icons/lu";
import RoleCard from "./section-card";

const meta = {
  title: "Shared/SectionCard",
  component: RoleCard,
  parameters: {
    layout: "centered",
  },
  args: {
    icon: <LuUtensilsCrossed size={36} />,
    title: "Station 1",
    orderCount: 12,
    onClick: () => {},
  },
} satisfies Meta<typeof RoleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const NoOrders: Story = {
  args: { orderCount: 0 },
};
