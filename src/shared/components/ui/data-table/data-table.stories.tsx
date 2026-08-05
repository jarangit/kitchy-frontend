import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Badge } from "../badge";
import { Button } from "../button";
import { DataTableColumnHeader } from "./column-header";
import { DataTable } from "./data-table";
import type { DataTableColumn } from "./data-table.types";
import { EmptyState } from "../empty-state";
import type { SortingState } from "@tanstack/react-table";

interface OrderRow {
  id: string;
  number: string;
  type: "TOGO" | "DINE_IN";
  total: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
}

const data: OrderRow[] = [
  { id: "1", number: "#0042", type: "DINE_IN", total: 420, status: "PENDING" },
  { id: "2", number: "#0041", type: "TOGO", total: 180, status: "COMPLETED" },
  { id: "3", number: "#0040", type: "DINE_IN", total: 650, status: "COMPLETED" },
  { id: "4", number: "#0039", type: "TOGO", total: 95, status: "CANCELLED" },
  { id: "5", number: "#0038", type: "DINE_IN", total: 340, status: "PENDING" },
];

const statusVariant = {
  PENDING: "warning",
  COMPLETED: "success",
  CANCELLED: "danger",
} as const;

const columns: DataTableColumn<OrderRow>[] = [
  {
    accessorKey: "number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order" />
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
  },
  {
    accessorKey: "total",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Total (฿)" align="right" />
    ),
    cell: ({ row }) => `฿${row.original.total.toFixed(2)}`,
    meta: { align: "right" },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]}>
        {row.original.status}
      </Badge>
    ),
  },
];

const meta = {
  title: "UI/DataTable",
  component: DataTable<OrderRow>,
  parameters: {
    layout: "padded",
  },
  args: {
    data,
    columns,
  },
} satisfies Meta<typeof DataTable<OrderRow>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
  render: () => <DataTable data={data} columns={columns} />,
};

export const Sortable: Story = {
  args: {},
  render: () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    return (
      <DataTable
        data={data}
        columns={columns}
        sorting={sorting}
        onSortingChange={setSorting}
      />
    );
  },
};

export const ClickableRows: Story = {
  args: {},
  render: () => (
    <DataTable
      data={data}
      columns={columns}
      onRowClick={(row) => console.log("row clicked", row)}
      getRowId={(row) => row.id}
    />
  ),
};

export const Loading: Story = {
  args: {},
  render: () => (
    <DataTable data={[]} columns={columns} isLoading loadingRowCount={5} />
  ),
};

export const Empty: Story = {
  args: {},
  render: () => (
    <DataTable
      data={[]}
      columns={columns}
      emptyState={
        <EmptyState
          title="No orders found"
          description="Orders will appear here when they are created."
          action={<Button size="sm">Create order</Button>}
        />
      }
    />
  ),
};
