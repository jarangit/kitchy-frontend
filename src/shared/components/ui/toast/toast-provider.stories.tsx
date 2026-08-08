import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button";
import { ToastProvider } from "./toast-provider";
import { toast } from "@/shared/services/toast-service";

const meta = {
  title: "UI/Toast",
  component: ToastProvider,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <>
      <ToastProvider />
      <div className="flex flex-wrap gap-3">
        <Button
          size="sm"
          onClick={() => toast.show({ title: "Default toast" })}
        >
          Default
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() =>
            toast.success({
              title: "Saved",
              description: "Changes were saved successfully.",
            })
          }
        >
          Success
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            toast.warning({
              title: "Low paper",
              description: "Printer 2 is running low on paper.",
            })
          }
        >
          Warning
        </Button>
        <Button
          size="sm"
          variant="danger"
          onClick={() =>
            toast.error({
              title: "Payment failed",
              description: "The card was declined. Try again.",
            })
          }
        >
          Error
        </Button>
        <Button
          size="sm"
          onClick={() =>
            toast.info({
              title: "Update available",
              description: "A new version is ready to install.",
            })
          }
        >
          Info
        </Button>
      </div>
    </>
  ),
};

export const WithAction: Story = {
  render: () => (
    <>
      <ToastProvider />
      <Button
        size="sm"
        onClick={() =>
          toast.warning({
            title: "Printer offline",
            description: "Reconnect printer 1.",
            durationMs: 10000,
            action: { label: "Reconnect", onClick: () => {} },
          })
        }
      >
        Show toast with action
      </Button>
    </>
  ),
};
