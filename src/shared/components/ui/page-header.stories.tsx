import type { Meta, StoryObj } from "@storybook/react-vite";
import { LuPlus, LuDownload } from "react-icons/lu";
import { Button } from "./button";
import { PageHeader } from "./page-header";

const meta = {
  title: "UI/PageHeader",
  component: PageHeader,
  parameters: {
    layout: "padded",
  },
  args: {
    title: "Store dashboard",
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithSubtitle: Story = {
  args: {
    title: "Products",
    subtitle: "Manage your menu items and pricing",
  },
};

export const WithAction: Story = {
  args: {
    title: "Products",
    subtitle: "Manage your menu items and pricing",
  },
  render: (args) => (
    <PageHeader
      {...args}
      action={
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            <LuDownload size={16} />
            Export
          </Button>
          <Button size="sm">
            <LuPlus size={16} />
            Add product
          </Button>
        </div>
      }
    />
  ),
};

export const WithBack: Story = {
  args: {
    title: "Product details",
    subtitle: "Iced Caffè Latte",
  },
  render: (args) => <PageHeader {...args} backTo="/" />,
};

export const WithChildren: Story = {
  args: {
    title: "Orders",
  },
  render: (args) => (
    <PageHeader
      {...args}
      children={
        <div className="flex gap-3 text-body-sm text-text-secondary">
          <span>All</span>
          <span>Pending</span>
          <span>Completed</span>
        </div>
      }
    />
  ),
};

export const Sticky: Story = {
  args: {
    title: "Transactions",
    subtitle: "Scrollable page with sticky header",
  },
  render: (args) => (
    <div className="max-h-64 overflow-y-auto rounded-card border border-border">
      <PageHeader {...args} sticky />
      <div className="space-y-3 p-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="h-10 rounded-md bg-surface-muted" />
        ))}
      </div>
    </div>
  ),
};
