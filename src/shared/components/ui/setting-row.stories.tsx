import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { LuStore, LuUser } from "react-icons/lu";
import { Toggle } from "./toggle";
import { SettingGroup, SettingRow } from "./setting-row";

const meta = {
  title: "UI/SettingRow",
  component: SettingRow,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof SettingRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Display: Story = {
  render: () => (
    <div className="mx-auto max-w-xl">
      <SettingRow
        variant="display"
        icon={<LuStore size={20} />}
        label="Store name"
        value="Kitchy Coffee"
      />
    </div>
  ),
};

export const Link: Story = {
  render: () => (
    <div className="mx-auto max-w-xl">
      <SettingRow
        variant="link"
        icon={<LuStore size={20} />}
        label="Store settings"
        hint="Currency, language, timezone"
        value="THB"
        onClick={() => {}}
      />
    </div>
  ),
};

export const Action: Story = {
  render: () => (
    <div className="mx-auto max-w-xl">
      <SettingRow
        variant="action"
        icon={<LuUser size={20} />}
        label="Sign out"
        hint="Log out of this account"
        onClick={() => {}}
      />
    </div>
  ),
};

export const Control: Story = {
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <div className="mx-auto max-w-xl">
        <SettingRow
          variant="control"
          label="Push notifications"
          hint="Get notified about new orders"
          control={<Toggle checked={checked} onChange={setChecked} />}
        />
      </div>
    );
  },
};

export const Editable: Story = {
  render: () => {
    const [name, setName] = useState("Kitchy Coffee");
    return (
      <div className="mx-auto max-w-xl">
        <SettingRow
          variant="editable"
          label="Store name"
          value={name}
          onSave={setName}
        />
      </div>
    );
  },
};

export const Grouped: Story = {
  render: () => (
    <div className="mx-auto max-w-xl">
      <SettingGroup title="General" description="Basic store information.">
        <SettingRow
          variant="display"
          label="Store name"
          value="Kitchy Coffee"
        />
        <SettingRow variant="link" label="Address" value="Sukhumvit 24" />
        <SettingRow variant="action" label="Reset password" />
      </SettingGroup>
    </div>
  ),
};
