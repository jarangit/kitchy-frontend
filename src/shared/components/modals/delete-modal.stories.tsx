import type { Meta, StoryObj } from "@storybook/react-vite";
import DeleteModal from "./delete-modal";

const meta = {
  title: "Shared/Modals/DeleteModal",
  component: DeleteModal,
  parameters: {
    layout: "padded",
  },
  args: {
    content: "This will permanently delete the product and its history.",
    onConfirm: () => {},
  },
} satisfies Meta<typeof DeleteModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const WithoutConfirm: Story = {
  args: { onConfirm: undefined },
};
