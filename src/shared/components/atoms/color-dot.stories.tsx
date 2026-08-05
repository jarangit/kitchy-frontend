import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorDot } from "./color-dot";

const meta = {
  title: "UI/ColorDot",
  component: ColorDot,
  parameters: {
    layout: "centered",
  },
  args: {
    color: "#FF3B6F",
  },
  argTypes: {
    color: { control: "color" },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof ColorDot>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: { size: "sm" },
};

export const Medium: Story = {
  args: { size: "md" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const StationColors: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <ColorDot color="#FF3B6F" />
      <ColorDot color="#0A84FF" />
      <ColorDot color="#34C759" />
      <ColorDot color="#FF9F0A" />
      <ColorDot color="#BF5AF2" />
    </div>
  ),
};
