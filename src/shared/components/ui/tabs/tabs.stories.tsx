import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { LuClock, LuListOrdered } from "react-icons/lu";
import { Tabs, TabList, Tab } from "./tabs";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  parameters: {
    layout: "padded",
  },
  args: {
    value: "pending",
    onChange: () => {},
    children: null,
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const ChipTabsExample = () => {
  const [value, setValue] = useState("pending");
  return (
    <Tabs value={value} onChange={setValue} variant="chip">
      <TabList aria-label="Order status">
        <Tab value="pending" count={12}>
          Pending
        </Tab>
        <Tab value="preparing" count={5}>
          Preparing
        </Tab>
        <Tab value="completed">Completed</Tab>
        <Tab value="cancelled" disabled>
          Cancelled
        </Tab>
      </TabList>
    </Tabs>
  );
};

const SegmentedTabsExample = () => {
  const [value, setValue] = useState("day");
  return (
    <Tabs value={value} onChange={setValue} variant="segmented">
      <TabList aria-label="Report range" fullWidth>
        <Tab value="day">Day</Tab>
        <Tab value="week">Week</Tab>
        <Tab value="month">Month</Tab>
      </TabList>
    </Tabs>
  );
};

export const Chip: Story = {
  args: {},
  render: () => <ChipTabsExample />,
};

export const Segmented: Story = {
  args: {},
  render: () => <SegmentedTabsExample />,
};

export const WithIcons: Story = {
  args: {},
  render: () => {
    const [value, setValue] = useState("orders");
    return (
      <Tabs value={value} onChange={setValue} variant="chip" size="md">
        <TabList aria-label="Orders section">
          <Tab value="orders" icon={<LuListOrdered size={16} />} count={8}>
            Orders
          </Tab>
          <Tab value="history" icon={<LuClock size={16} />}>
            History
          </Tab>
        </TabList>
      </Tabs>
    );
  },
};
