import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

const meta = {
  title: "UI/Table",
  component: Table,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Product</TableHead>
          <TableHead align="right">Price</TableHead>
          <TableHead align="center">Qty</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Iced Caffè Latte</TableCell>
          <TableCell align="right">฿120.00</TableCell>
          <TableCell align="center">2</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Matcha Croissant</TableCell>
          <TableCell align="right">฿95.00</TableCell>
          <TableCell align="center">1</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const SortableHeader: Story = {
  render: () => {
    const [sort, setSort] = useState<"asc" | "desc" | null>(null);
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              sortable
              sortDirection={sort}
              onSort={() =>
                setSort((current) =>
                  current === "asc"
                    ? "desc"
                    : current === "desc"
                      ? null
                      : "asc",
                )
              }
            >
              Product
            </TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Iced Caffè Latte</TableCell>
            <TableCell>
              <span className="text-success">Available</span>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Matcha Croissant</TableCell>
            <TableCell>
              <span className="text-warning">Low stock</span>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
  },
};

export const ClickableRows: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Store</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {["Kitchy Coffee", "Kitchy Bakery", "Kitchy Cafe"].map((name) => (
          <TableRow key={name} clickable onClick={() => {}}>
            <TableCell>{name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
