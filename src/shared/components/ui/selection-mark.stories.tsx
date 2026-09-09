import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectionMark } from "./selection-mark";

const meta = {
  title: "UI/SelectionMark",
  component: SelectionMark,
  parameters: {
    layout: "centered",
  },
  args: {
    shape: "square",
    checked: false,
  },
  argTypes: {
    shape: { control: "select", options: ["circle", "square"] },
    checked: { control: "boolean" },
  },
} satisfies Meta<typeof SelectionMark>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SquareUnchecked: Story = {
  args: { shape: "square", checked: false },
};

export const SquareChecked: Story = {
  args: { shape: "square", checked: true },
};

export const CircleUnchecked: Story = {
  args: { shape: "circle", checked: false },
};

export const CircleChecked: Story = {
  args: { shape: "circle", checked: true },
};

export const All: Story = {
  args: {},
  render: () => (
    <div className="flex items-center gap-4">
      <SelectionMark shape="circle" checked={false} />
      <SelectionMark shape="circle" checked />
      <SelectionMark shape="square" checked={false} />
      <SelectionMark shape="square" checked />
    </div>
  ),
};
