import type { Meta, StoryObj } from "@storybook/react-vite";
import { InsetPanel } from "./inset-panel";

const meta = {
  title: "UI/InsetPanel",
  component: InsetPanel,
  parameters: {
    layout: "padded",
  },
  args: {
    children: "Inset panel content",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "interactive", "dashed"],
    },
    padding: {
      control: "select",
      options: ["md", "sm", "lg", "none"],
    },
  },
} satisfies Meta<typeof InsetPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Interactive: Story = {
  args: { variant: "interactive", children: "Hover me" },
};

export const Dashed: Story = {
  args: { variant: "dashed", children: "Drop files here" },
};

export const PaddingVariants: Story = {
  render: () => (
    <div className="max-w-md space-y-3">
      <InsetPanel padding="sm">Small padding</InsetPanel>
      <InsetPanel padding="md">Medium padding</InsetPanel>
      <InsetPanel padding="lg">Large padding</InsetPanel>
    </div>
  ),
};
