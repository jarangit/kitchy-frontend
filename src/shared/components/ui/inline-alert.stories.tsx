import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineAlert } from "./inline-alert";

const meta = {
  title: "UI/InlineAlert",
  component: InlineAlert,
  parameters: {
    layout: "padded",
  },
  args: {
    children: "A short inline message.",
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["default", "danger", "warning", "success", "info"],
    },
  },
} satisfies Meta<typeof InlineAlert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { tone: "default" },
};

export const Danger: Story = {
  args: { tone: "danger", children: "Unable to save changes. Try again." },
};

export const Warning: Story = {
  args: { tone: "warning", children: "Printer is running low on paper." },
};

export const Success: Story = {
  args: { tone: "success", children: "Changes saved successfully." },
};

export const Info: Story = {
  args: { tone: "info", children: "New update available." },
};

export const AllTones: Story = {
  render: () => (
    <div className="max-w-sm space-y-3">
      <InlineAlert tone="default">Default tone</InlineAlert>
      <InlineAlert tone="danger">Danger tone</InlineAlert>
      <InlineAlert tone="warning">Warning tone</InlineAlert>
      <InlineAlert tone="success">Success tone</InlineAlert>
      <InlineAlert tone="info">Info tone</InlineAlert>
    </div>
  ),
};
