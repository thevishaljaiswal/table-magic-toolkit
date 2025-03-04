
import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MoreHorizontal, 
  ArrowUpDown, 
  Search, 
  Filter, 
  GripVertical,
  Trash,
  Copy,
  Share,
  Download,
  CheckSquare,
  Square 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { FilterControls } from "./TableFilterControls";

// Define column structure
const initialColumns = [
  { id: "id", name: "ID", width: "80px" },
  { id: "name", name: "Name", width: "auto" },
  { id: "email", name: "Email", width: "auto" },
  { id: "status", name: "Status", width: "auto", filterable: true },
  { id: "revenue", name: "Revenue", width: "auto", numeric: true, filterable: true },
  { id: "transactions", name: "Transactions", width: "auto", numeric: true, filterable: true },
  { id: "conversionRate", name: "Conversion", width: "auto", numeric: true, filterable: true },
  { id: "region", name: "Region", width: "auto", filterable: true },
  { id: "sentiment", name: "Sentiment", width: "auto", filterable: true },
  { id: "actions", name: "Actions", width: "80px" }
];

const ReportDataTable = ({ data }) => {
  const { toast } = useToast();
  const [filteredData, setFilteredData] = useState(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [columns, setColumns] = useState(initialColumns);
  const [selectedRows, setSelectedRows] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: [],
    region: [],
    sentiment: [],
    revenue: { min: "", max: "" },
    transactions: { min: "", max: "" },
    conversionRate: { min: "", max: "" }
  });
  
  // Column dragging state
  const [draggedColumn, setDraggedColumn] = useState(null);

  // Generate options for filters
  const filterOptions = useMemo(() => {
    return {
      status: [...new Set(data.map(item => item.status))],
      region: [...new Set(data.map(item => item.region))],
      sentiment: [...new Set(data.map(item => item.sentiment))]
    };
  }, [data]);

  // Apply all filters
  const applyFilters = () => {
    let results = [...data];

    // Apply search term filter
    if (searchTerm) {
      results = results.filter(item => 
        Object.values(item).some(val => 
          val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply dropdown filters
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        results = results.filter(item => value.includes(item[key]));
      } else if (typeof value === 'object' && (value.min || value.max)) {
        // Range filters for numeric values
        results = results.filter(item => {
          const numValue = Number(item[key]);
          const min = value.min !== "" ? Number(value.min) : Number.MIN_SAFE_INTEGER;
          const max = value.max !== "" ? Number(value.max) : Number.MAX_SAFE_INTEGER;
          return numValue >= min && numValue <= max;
        });
      }
    });

    setFilteredData(results);
  };

  // Search functionality
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === "") {
      applyFilters(); // Apply other filters without search
    } else {
      // Set the search term and reapply all filters
      setSearchTerm(term);
      applyFilters();
    }
  };

  // Update filters
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [filterKey]: value };
      return newFilters;
    });
  };

  // Apply filters when they change
  const handleApplyFilters = () => {
    applyFilters();
    setFiltersOpen(false);
  };

  // Sorting functionality
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    
    const sorted = [...filteredData].sort((a, b) => {
      if (a[key] === null) return 1;
      if (b[key] === null) return -1;
      
      if (direction === "asc") {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });
    
    setFilteredData(sorted);
  };

  // Column drag handlers
  const handleDragStart = (columnId) => {
    setDraggedColumn(columnId);
  };

  const handleDragOver = (e, targetColumnId) => {
    e.preventDefault();
    if (draggedColumn === null || draggedColumn === targetColumnId) return;
    
    const dragIndex = columns.findIndex(col => col.id === draggedColumn);
    const hoverIndex = columns.findIndex(col => col.id === targetColumnId);
    
    if (dragIndex === -1 || hoverIndex === -1) return;
    
    // Reorder columns
    const newColumns = [...columns];
    const draggedItem = newColumns[dragIndex];
    newColumns.splice(dragIndex, 1);
    newColumns.splice(hoverIndex, 0, draggedItem);
    
    setColumns(newColumns);
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
    toast({
      title: "Column order updated",
      description: "Table columns have been rearranged",
    });
  };

  // Row selection handlers
  const toggleSelectRow = (id) => {
    setSelectedRows(prev => {
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const toggleSelectAllRows = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map(row => row.id));
    }
  };

  // Bulk action handlers
  const handleBulkAction = (action) => {
    const selectedCount = selectedRows.length;
    
    if (selectedCount === 0) {
      toast({
        title: "No rows selected",
        description: "Please select at least one row to perform this action",
        variant: "destructive"
      });
      return;
    }

    let message = "";
    switch (action) {
      case "delete":
        message = `Deleted ${selectedCount} rows`;
        break;
      case "export":
        message = `Exported ${selectedCount} rows`;
        break;
      case "share":
        message = `Sharing ${selectedCount} rows`;
        break;
      case "copy":
        message = `Copied ${selectedCount} rows to clipboard`;
        break;
      default:
        message = `Performed ${action} on ${selectedCount} rows`;
    }

    toast({
      title: "Bulk action completed",
      description: message,
    });

    // Clear selection after action
    setSelectedRows([]);
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format percentage
  const formatPercent = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-8"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1" 
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedRows.length > 0 && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleBulkAction("delete")}
                className="flex items-center gap-1"
              >
                <Trash className="h-4 w-4" />
                Delete
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleBulkAction("export")}
                className="flex items-center gap-1"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleBulkAction("copy")}
                className="flex items-center gap-1"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleBulkAction("share")}
                className="flex items-center gap-1"
              >
                <Share className="h-4 w-4" />
                Share
              </Button>
            </div>
          )}
          <div className="text-sm text-muted-foreground ml-auto">
            {selectedRows.length > 0 ? (
              <span className="font-medium">{selectedRows.length} selected</span>
            ) : (
              <span>Showing {filteredData.length} of {data.length} records</span>
            )}
          </div>
        </div>
      </div>
      
      {filtersOpen && (
        <FilterControls 
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onApplyFilters={handleApplyFilters}
        />
      )}
      
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px] px-2">
                  <div 
                    className="flex items-center justify-center cursor-pointer" 
                    onClick={toggleSelectAllRows}
                  >
                    {selectedRows.length === filteredData.length && filteredData.length > 0 ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                
                {columns.filter(col => col.id !== 'actions').map((column) => (
                  <TableHead 
                    key={column.id}
                    className={`${column.width !== 'auto' ? `w-[${column.width}]` : ''} cursor-move relative`}
                    draggable={column.id !== 'actions'}
                    onDragStart={() => handleDragStart(column.id)}
                    onDragOver={(e) => handleDragOver(e, column.id)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="flex items-center gap-1">
                      <GripVertical className="h-4 w-4 text-muted-foreground/70 cursor-grab" />
                      <Button 
                        variant="ghost" 
                        className="p-0 font-medium hover:bg-transparent"
                        onClick={() => handleSort(column.id)}
                      >
                        {column.name}
                        <ArrowUpDown className="ml-2 h-3.5 w-3.5 text-muted-foreground/70" />
                      </Button>
                    </div>
                  </TableHead>
                ))}
                
                <TableHead className="text-right w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id} className={cn(selectedRows.includes(item.id) && "bg-muted/50")}>
                    <TableCell className="px-2">
                      <div 
                        className="flex items-center justify-center cursor-pointer" 
                        onClick={() => toggleSelectRow(item.id)}
                      >
                        {selectedRows.includes(item.id) ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </div>
                    </TableCell>
                    
                    {columns.filter(col => col.id !== 'actions').map((column) => {
                      // Render cell based on column type
                      let cellContent;
                      switch (column.id) {
                        case 'id':
                          cellContent = <span className="font-medium">{item.id}</span>;
                          break;
                        case 'status':
                          cellContent = <StatusBadge status={item.status} />;
                          break;
                        case 'revenue':
                          cellContent = <span className="text-right block">{formatCurrency(item.revenue)}</span>;
                          break;
                        case 'transactions':
                          cellContent = <span className="text-right block">{item.transactions}</span>;
                          break;
                        case 'conversionRate':
                          cellContent = <span className="text-right block">{formatPercent(item.conversionRate)}</span>;
                          break;
                        case 'sentiment':
                          cellContent = <SentimentBadge sentiment={item.sentiment} />;
                          break;
                        default:
                          cellContent = item[column.id];
                      }
                      
                      return (
                        <TableCell key={`${item.id}-${column.id}`} className={cn(column.numeric && "text-right")}>
                          {cellContent}
                        </TableCell>
                      );
                    })}
                    
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View details</DropdownMenuItem>
                          <DropdownMenuItem>Edit record</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length + 2} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
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
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge className={cn("font-medium", config.className)} variant="outline">
      {config.label}
    </Badge>
  );
};

// Sentiment Badge Component
const SentimentBadge = ({ sentiment }) => {
  const sentimentConfig = {
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
    }
  };

  const config = sentimentConfig[sentiment] || sentimentConfig.neutral;

  return (
    <Badge className={cn("font-medium", config.className)} variant="outline">
      {config.label}
    </Badge>
  );
};

export default ReportDataTable;
