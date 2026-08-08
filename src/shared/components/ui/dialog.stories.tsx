import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Button } from "./button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

const meta = {
  title: "UI/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  args: {
    open: true,
    onClose: () => {},
    children: null,
  },
  argTypes: {
    open: { control: "boolean" },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
  render: (args) => (
    <Dialog {...args}>
      <DialogHeader>
        <DialogTitle>Confirm action</DialogTitle>
        <DialogDescription>This action cannot be undone.</DialogDescription>
      </DialogHeader>
      <p className="text-body text-text-secondary">
        Are you sure you want to continue?
      </p>
      <DialogFooter>
        <Button variant="ghost">Cancel</Button>
        <Button variant="danger">Confirm</Button>
      </DialogFooter>
    </Dialog>
  ),
};

export const Interactive: Story = {
  args: { open: false, children: null },
  render: (args) => {
    const [open, setOpen] = useState(args.open);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open dialog</Button>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogHeader>
            <DialogTitle>Edit store details</DialogTitle>
            <DialogDescription>
              Update the information shown to customers.
            </DialogDescription>
          </DialogHeader>
          <p className="text-body text-text-secondary">
            Dialog content goes here.
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save</Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  },
};
