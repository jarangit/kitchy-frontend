import type { Meta, StoryObj } from "@storybook/react-vite";
import { LuDollarSign, LuHeart, LuInfo, LuTriangleAlert } from "react-icons/lu";
import { IconTile } from "./icon-tile";

const meta = {
  title: "UI/IconTile",
  component: IconTile,
  parameters: {
    layout: "centered",
  },
  args: {
    children: <LuHeart size={20} />,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    tone: {
      control: "select",
      options: ["neutral", "primary", "success", "warning", "danger", "info"],
    },
    shape: {
      control: "select",
      options: ["circle", "square"],
    },
  },
} satisfies Meta<typeof IconTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {
  args: { tone: "neutral" },
};

export const Primary: Story = {
  args: { tone: "primary" },
};

export const Success: Story = {
  args: {
    tone: "success",
    children: <LuDollarSign size={20} />,
  },
};

export const Warning: Story = {
  args: {
    tone: "warning",
    children: <LuTriangleAlert size={20} />,
  },
};

export const Danger: Story = {
  args: { tone: "danger" },
};

export const Info: Story = {
  args: {
    tone: "info",
    children: <LuInfo size={20} />,
  },
};

export const Square: Story = {
  args: { shape: "square", tone: "primary" },
};

export const Tones: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconTile tone="neutral">
        <LuHeart size={20} />
      </IconTile>
      <IconTile tone="primary">
        <LuHeart size={20} />
      </IconTile>
      <IconTile tone="success">
        <LuHeart size={20} />
      </IconTile>
      <IconTile tone="warning">
        <LuHeart size={20} />
      </IconTile>
      <IconTile tone="danger">
        <LuHeart size={20} />
      </IconTile>
      <IconTile tone="info">
        <LuHeart size={20} />
      </IconTile>
    </div>
  ),
};
