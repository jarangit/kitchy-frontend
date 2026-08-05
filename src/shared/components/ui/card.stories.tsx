import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "padded",
  },
  args: {
    children: "Card content",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "muted", "interactive", "dashed"],
    },
    padding: {
      control: "select",
      options: ["md", "sm", "none"],
    },
    as: { control: false },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Muted: Story = {
  args: { variant: "muted" },
};

export const Interactive: Story = {
  args: { variant: "interactive", children: "Hover me" },
};

export const Dashed: Story = {
  args: { variant: "dashed", children: "Drop zone" },
};

export const WithHeader: Story = {
  args: {},
  render: () => (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>Supporting description for the card.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-body text-text-secondary">
          Main body content of the card. Kept minimal and calm.
        </p>
      </CardContent>
    </Card>
  ),
};
