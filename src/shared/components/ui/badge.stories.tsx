import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Badge",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "danger", "warning", "info", "accent"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { variant: "default", children: "Default" },
};

export const Success: Story = {
  args: { variant: "success", children: "Completed" },
};

export const Danger: Story = {
  args: { variant: "danger", children: "Failed" },
};

export const Warning: Story = {
  args: { variant: "warning", children: "Pending" },
};

export const Info: Story = {
  args: { variant: "info", children: "Info" },
};

export const Accent: Story = {
  args: { variant: "accent", children: "Popular" },
};

export const Sizes: Story = {
  args: { children: "Badge" },
  render: (args) => (
    <div className="flex items-center gap-3">
      <Badge {...args} size="sm" />
      <Badge {...args} size="md" />
      <Badge {...args} size="lg" />
    </div>
  ),
};

export const AllVariants: Story = {
  args: {},
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="default">Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="accent">Accent</Badge>
    </div>
  ),
};
