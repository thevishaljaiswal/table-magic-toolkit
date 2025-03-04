
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DataItem } from "./data";

// Helper function to create column definitions with common properties
function createColumn<T extends keyof DataItem>(
  id: T,
  header: string,
  accessorFn?: (row: DataItem) => any,
  cell?: (props: { row: { original: DataItem } }) => React.ReactNode,
  enableSorting: boolean = true,
  meta?: any
): ColumnDef<DataItem> {
  return {
    id: id as string,
    header: ({ column }) => {
      return enableSorting ? (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {header}
          <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-muted-foreground/70" />
        </Button>
      ) : (
        header
      );
    },
    accessorKey: id as string,
    accessorFn,
    cell: cell ? cell : ({ row }) => <div>{String(row.getValue(id as string))}</div>,
    enableSorting,
    meta,
  };
}

// Define the status component for the status column
const StatusComponent = ({ status }: { status: DataItem["status"] }) => {
  const statusMap: Record<
    DataItem["status"],
    { label: string; className: string }
  > = {
    active: {
      label: "Active",
      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    pending: {
      label: "Pending",
      className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
    archived: {
      label: "Archived",
      className: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400",
    },
    suspended: {
      label: "Suspended",
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    },
  };

  const { label, className } = statusMap[status];

  return (
    <Badge className={cn("font-medium", className)} variant="outline">
      {label}
    </Badge>
  );
};

// Define the sentiment component for the sentiment column
const SentimentComponent = ({ sentiment }: { sentiment: DataItem["sentiment"] }) => {
  const sentimentMap: Record<
    DataItem["sentiment"],
    { label: string; className: string }
  > = {
    positive: {
      label: "Positive",
      className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    neutral: {
      label: "Neutral",
      className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    },
    negative: {
      label: "Negative",
      className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    },
  };

  const { label, className } = sentimentMap[sentiment];

  return (
    <Badge className={cn("font-medium", className)} variant="outline">
      {label}
    </Badge>
  );
};

// Define the actions component for the actions column
const ActionsComponent = ({ row }: { row: { original: DataItem } }) => {
  const item = row.original;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.id)}>
          Copy ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>View details</DropdownMenuItem>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Define the expand row button component
export const ExpandRowButton = ({ row, isExpanded }: { row: { id: string }; isExpanded: boolean }) => {
  return (
    <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
      {isExpanded ? (
        <ChevronDown className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </Button>
  );
};

// Define column definitions
export const columns: ColumnDef<DataItem>[] = [
  // Expansion column (for expandable rows)
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => null, // The actual expand button will be rendered elsewhere
    enableSorting: false,
    size: 40,
  },
  // Row selection column (checkbox) is handled in the DataTable component
  // Define all the data columns
  createColumn("id", "ID"),
  createColumn("name", "Name"),
  createColumn("email", "Email"),
  createColumn("role", "Role"),
  createColumn(
    "status",
    "Status",
    undefined,
    ({ row }) => <StatusComponent status={row.original.status} />
  ),
  createColumn(
    "createdAt",
    "Created",
    (row) => row.createdAt.getTime(),
    ({ row }) => formatDate(row.original.createdAt)
  ),
  createColumn(
    "lastActive",
    "Last Active",
    (row) => row.lastActive.getTime(),
    ({ row }) => formatDate(row.original.lastActive)
  ),
  createColumn(
    "revenue",
    "Revenue",
    (row) => row.revenue,
    ({ row }) => formatCurrency(row.original.revenue),
    true,
    { className: "text-right" }
  ),
  createColumn(
    "transactions",
    "Transactions",
    undefined,
    undefined,
    true,
    { className: "text-right" }
  ),
  createColumn(
    "conversionRate",
    "Conversion",
    (row) => row.conversionRate,
    ({ row }) => formatPercent(row.original.conversionRate),
    true,
    { className: "text-right" }
  ),
  createColumn(
    "avgOrderValue",
    "Avg Order",
    (row) => row.avgOrderValue,
    ({ row }) => formatCurrency(row.original.avgOrderValue),
    true,
    { className: "text-right" }
  ),
  createColumn(
    "lifetimeValue",
    "Lifetime Value",
    (row) => row.lifetimeValue,
    ({ row }) => formatCurrency(row.original.lifetimeValue),
    true,
    { className: "text-right" }
  ),
  createColumn(
    "churnRate",
    "Churn Rate",
    (row) => row.churnRate,
    ({ row }) => formatPercent(row.original.churnRate),
    true,
    { className: "text-right" }
  ),
  createColumn("region", "Region"),
  createColumn("country", "Country"),
  createColumn("city", "City"),
  createColumn("device", "Device"),
  createColumn("browser", "Browser"),
  createColumn("os", "OS"),
  createColumn(
    "sentiment",
    "Sentiment",
    undefined,
    ({ row }) => <SentimentComponent sentiment={row.original.sentiment} />
  ),
  // Actions column
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ActionsComponent,
    enableSorting: false,
    meta: { className: "text-right" },
  },
];

// Missing utility functions implied in the column definitions
import { format } from "date-fns";

export function formatDate(date: Date): string {
  return format(date, "MMM d, yyyy");
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatPercent(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
}
