
import React, { useState, useMemo } from "react";
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
  DropdownMenuCheckboxItem,
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
  Square,
  Eye,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { FilterControls } from "./TableFilter";

// Define column structure with TypeScript interfaces
export interface ColumnDef {
  id: string;
  name: string;
  width?: string;
  numeric?: boolean;
  filterable?: boolean;
  renderCell?: (value: any, row: any) => React.ReactNode;
}

export interface TableComponentProps {
  data: any[];
  columns: ColumnDef[];
  onRowAction?: (action: string, row: any) => void;
  onViewDetails?: (row: any) => void;
  filterConfig?: {
    filterable: boolean;
    initialFilters?: any;
    filterOptions?: any;
  };
  actions?: {
    viewDetails?: boolean;
    edit?: boolean;
    delete?: boolean;
    custom?: { label: string; action: string }[];
  };
}

// Define interface for range filters
interface RangeFilter {
  min: string;
  max: string;
}

// Generic table component
export const TableComponent = ({ 
  data, 
  columns,
  onRowAction,
  onViewDetails,
  filterConfig = { filterable: true },
  actions = { viewDetails: true, edit: true, delete: true }
}: TableComponentProps) => {
  const { toast } = useToast();
  
  // State for table functionality
  const [filteredData, setFilteredData] = useState<any[]>(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{ key: string | null, direction: string }>({ key: null, direction: "asc" });
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.filter(col => col.id !== 'actions').map(col => col.id)
  );
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<any>({});
  
  // Column dragging state
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);

  // Initialize filters based on columns
  useMemo(() => {
    const initialFilters: any = {};
    
    // Create an object to store unique values for each filterable column
    const filterOptionsObj: any = {};
    
    columns.forEach(column => {
      if (column.filterable) {
        // For categorical fields, initialize with empty arrays
        if (!column.numeric) {
          initialFilters[column.id] = [];
          
          // Extract unique values for this column for filter options
          const uniqueValues = [...new Set(data.map(item => item[column.id]))];
          filterOptionsObj[column.id] = uniqueValues;
        } 
        // For numeric fields, initialize with range filters
        else {
          initialFilters[column.id] = { min: "", max: "" };
        }
      }
    });
    
    // Add IDs filter
    initialFilters.ids = [];
    
    // Only update filters if it's empty (initial load)
    if (Object.keys(filters).length === 0) {
      setFilters(initialFilters);
    }
    
    // Store filter options for use in the filter component
    setFilterOptions(filterOptionsObj);
    
  }, [columns, data]);

  // Filter options state
  const [filterOptions, setFilterOptions] = useState<any>({});

  // Apply all filters
  const applyFilters = () => {
    let results = [...data];

    // Apply search term filter
    if (searchTerm) {
      results = results.filter(item => 
        Object.values(item).some(val => 
          val !== null && val !== undefined && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply ID list filter (if any IDs are specified)
    if (filters.ids && filters.ids.length > 0) {
      results = results.filter(item => 
        filters.ids.includes(item.id.toString())
      );
    }

    // Apply filters for each column
    columns.forEach(column => {
      if (column.filterable && filters[column.id]) {
        // For categorical fields (status, region, etc.)
        if (!column.numeric && Array.isArray(filters[column.id]) && filters[column.id].length > 0) {
          results = results.filter(item => filters[column.id].includes(item[column.id]));
        }
        
        // For numeric fields (revenue, transactions, etc.)
        else if (column.numeric && 
                (filters[column.id].min !== "" || filters[column.id].max !== "")) {
          results = results.filter(item => {
            const numValue = Number(item[column.id]);
            const min = filters[column.id].min !== "" ? Number(filters[column.id].min) : Number.MIN_SAFE_INTEGER;
            const max = filters[column.id].max !== "" ? Number(filters[column.id].max) : Number.MAX_SAFE_INTEGER;
            return numValue >= min && numValue <= max;
          });
        }
      }
    });

    setFilteredData(results);
  };

  // Search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // Delay applying filters for better performance on large datasets
    setTimeout(() => {
      applyFilters();
    }, 300);
  };

  // Update filters
  const handleFilterChange = (filterKey: string, value: any) => {
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
  const handleSort = (key: string) => {
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

  // Toggle column visibility
  const toggleColumnVisibility = (columnId: string) => {
    setVisibleColumns(prev => {
      if (prev.includes(columnId)) {
        return prev.filter(id => id !== columnId);
      } else {
        return [...prev, columnId];
      }
    });
  };

  // Column drag handlers
  const handleDragStart = (columnId: string) => {
    setDraggedColumn(columnId);
  };

  const handleDragOver = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (draggedColumn === null || draggedColumn === targetColumnId) return;
    
    const dragIndex = columns.findIndex(col => col.id === draggedColumn);
    const hoverIndex = columns.findIndex(col => col.id === targetColumnId);
    
    if (dragIndex === -1 || hoverIndex === -1) return;
    
    // Reorder columns (in-place mutation is not ideal, but this is just for UI)
    const newColumnsOrder = [...columns];
    const draggedItem = newColumnsOrder[dragIndex];
    newColumnsOrder.splice(dragIndex, 1);
    newColumnsOrder.splice(hoverIndex, 0, draggedItem);
    
    // We don't update the columns prop directly since it's passed from parent
    // But we could emit an event to the parent if column reordering needs to persist
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
    toast({
      title: "Column order updated",
      description: "Table columns have been rearranged",
    });
  };

  // Row selection handlers
  const toggleSelectRow = (id: string | number) => {
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

  // Handle row action
  const handleRowAction = (action: string, row: any) => {
    if (action === 'viewDetails' && onViewDetails) {
      onViewDetails(row);
      return;
    }
    
    if (onRowAction) {
      onRowAction(action, row);
    } else {
      // Default actions if no handler provided
      switch (action) {
        case 'edit':
          toast({
            title: "Edit action",
            description: `Editing record ${row.id}`,
          });
          break;
        case 'delete':
          toast({
            title: "Delete action",
            description: `Deleting record ${row.id}`,
            variant: "destructive"
          });
          break;
        default:
          toast({
            title: "Action triggered",
            description: `${action} for record ${row.id}`,
          });
      }
    }
  };

  // Bulk action handlers
  const handleBulkAction = (action: string) => {
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

  // Format currency helper
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format percentage helper
  const formatPercent = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  };

  // Helper to render cell content
  const renderCellContent = (column: ColumnDef, row: any) => {
    // Use custom render function if provided
    if (column.renderCell) {
      return column.renderCell(row[column.id], row);
    }
    
    // Render based on value type
    const value = row[column.id];
    
    if (value === undefined || value === null) {
      return '-';
    }
    
    // If the column is 'status' and the value is a string
    if (column.id === 'status' && typeof value === 'string') {
      return <StatusBadge status={value} />;
    }
    
    // If the column is 'sentiment' and the value is a string
    if (column.id === 'sentiment' && typeof value === 'string') {
      return <SentimentBadge sentiment={value} />;
    }
    
    // Format numeric values
    if (column.numeric) {
      if (column.id.toLowerCase().includes('rate') || 
          column.id.toLowerCase().includes('percent')) {
        return <span className="text-right block">{formatPercent(value)}</span>;
      }
      
      if (column.id.toLowerCase().includes('revenue') || 
          column.id.toLowerCase().includes('value') ||
          column.id.toLowerCase().includes('price')) {
        return <span className="text-right block">{formatCurrency(value)}</span>;
      }
      
      return <span className="text-right block">{value}</span>;
    }
    
    return value;
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
          {filterConfig.filterable && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1" 
              onClick={() => setFiltersOpen(!filtersOpen)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          )}
          
          {/* Column visibility dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2 flex items-center gap-1">
                <Eye className="h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.filter(column => column.id !== 'actions').map(column => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={visibleColumns.includes(column.id)}
                  onCheckedChange={() => toggleColumnVisibility(column.id)}
                >
                  {column.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
      
      {filtersOpen && filterConfig.filterable && (
        <FilterControls 
          filters={filters}
          filterOptions={filterOptions}
          onFilterChange={handleFilterChange}
          onApplyFilters={handleApplyFilters}
        />
      )}
      
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto max-h-[70vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px] px-2 sticky top-0 bg-background z-10">
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
                
                {columns
                  .filter(col => col.id !== 'actions' && visibleColumns.includes(col.id))
                  .map((column) => (
                    <TableHead 
                      key={column.id}
                      className={cn(
                        `${column.width !== undefined ? `w-[${column.width}]` : ''} cursor-move relative sticky top-0 bg-background z-10`
                      )}
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
                
                <TableHead className="text-right w-[80px] sticky top-0 bg-background z-10">Actions</TableHead>
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
                    
                    {columns
                      .filter(col => col.id !== 'actions' && visibleColumns.includes(col.id))
                      .map((column) => (
                        <TableCell 
                          key={`${item.id}-${column.id}`} 
                          className={cn(column.numeric && "text-right")}
                        >
                          {renderCellContent(column, item)}
                        </TableCell>
                      ))}
                    
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
                          
                          {actions.viewDetails && (
                            <DropdownMenuItem onClick={() => handleRowAction('viewDetails', item)}>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              View details
                            </DropdownMenuItem>
                          )}
                          
                          {actions.edit && (
                            <DropdownMenuItem onClick={() => handleRowAction('edit', item)}>
                              Edit record
                            </DropdownMenuItem>
                          )}
                          
                          {/* Custom actions */}
                          {actions.custom && actions.custom.map(customAction => (
                            <DropdownMenuItem 
                              key={customAction.action} 
                              onClick={() => handleRowAction(customAction.action, item)}
                            >
                              {customAction.label}
                            </DropdownMenuItem>
                          ))}
                          
                          {actions.delete && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleRowAction('delete', item)}
                              >
                                Delete
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={visibleColumns.length + 2} className="h-24 text-center">
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
interface StatusBadgeProps {
  status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig: Record<string, { label: string; className: string }> = {
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

  const config = statusConfig[status.toLowerCase()] || {
    label: status,
    className: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400"
  };

  return (
    <Badge className={cn("font-medium", config.className)} variant="outline">
      {config.label}
    </Badge>
  );
};

// Sentiment Badge Component
interface SentimentBadgeProps {
  sentiment: string;
}

const SentimentBadge = ({ sentiment }: SentimentBadgeProps) => {
  const sentimentConfig: Record<string, { label: string; className: string }> = {
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

  const config = sentimentConfig[sentiment.toLowerCase()] || {
    label: sentiment,
    className: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400",
  };

  return (
    <Badge className={cn("font-medium", config.className)} variant="outline">
      {config.label}
    </Badge>
  );
};

export default TableComponent;
