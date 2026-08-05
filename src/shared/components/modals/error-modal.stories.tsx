import type { Meta, StoryObj } from "@storybook/react-vite";
import ErrorModal from "./error-modal";

const meta = {
  title: "Shared/Modals/ErrorModal",
  component: ErrorModal,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof ErrorModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
