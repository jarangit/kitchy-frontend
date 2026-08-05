import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton, SkeletonCard, SkeletonRow } from "./skeleton";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  parameters: {
    layout: "padded",
  },
  argTypes: {
    width: { control: "text" },
    height: { control: "text" },
    circle: { control: "boolean" },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {
  args: { width: "w-64" },
};

export const Circle: Story = {
  args: { circle: true, width: "w-12", height: "h-12" },
};

export const Card: Story = {
  render: () => (
    <div className="w-80">
      <SkeletonCard />
    </div>
  ),
};

export const ListRows: Story = {
  render: () => (
    <div className="w-80">
      <SkeletonRow />
      <SkeletonRow />
      <SkeletonRow />
    </div>
  ),
};
