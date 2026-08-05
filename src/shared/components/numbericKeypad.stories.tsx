import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { NumericKeypad } from "./numbericKeypad";

const meta = {
  title: "UI/NumericKeypad",
  component: NumericKeypad,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof NumericKeypad>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <div className="w-80">
        <NumericKeypad value={value} onChange={setValue} onSubmit={() => {}} />
      </div>
    );
  },
};
