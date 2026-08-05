import type { Meta, StoryObj } from "@storybook/react-vite";
import { BrandMark } from "./brand-mark";

const meta = {
  title: "UI/BrandMark",
  component: BrandMark,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md"],
    },
  },
} satisfies Meta<typeof BrandMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: { size: "sm" },
};

export const Medium: Story = {
  args: { size: "md" },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <BrandMark size="sm" />
      <BrandMark size="md" />
    </div>
  ),
};
