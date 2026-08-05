import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./label";

const meta = {
  title: "UI/Label",
  component: Label,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Store name",
    htmlFor: "demo-field",
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Required: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="demo-required">
        Store name <span className="text-danger">*</span>
      </Label>
      <input
        id="demo-required"
        className="h-10 w-72 rounded-input border border-input-border bg-input-bg px-3"
      />
    </div>
  ),
};
