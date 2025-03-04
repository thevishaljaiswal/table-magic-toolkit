import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, Filter, X as CloseIcon, ColumnsIcon, SlidersHorizontal, PlusCircle } from "lucide-react";
import ExportOptions from "@/components/ExportOptions";
import { DataItem } from "@/utils/data";
import { VisibilityState } from "@/utils/data";

interface DataTableToolbarProps {
  data: DataItem[];
  setFilteredData: React.Dispatch<React.SetStateAction<DataItem[]>>;
  visibleColumns: string[];
  setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>;
  columnVisibility: VisibilityState;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
  availableColumns: Array<{ id: string; title: string }>;
}

interface ActiveFilter {
  id: string;
  type: 'search' | 'date' | 'select' | 'range';
  field?: string;
  value: any;
  label: string;
}

export const DataTableToolbar: React.FC<DataTableToolbarProps> = ({
  data,
  setFilteredData,
  visibleColumns,
  setVisibleColumns,
  columnVisibility,
  setColumnVisibility,
  availableColumns,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const statuses = Array.from(new Set(data.map(item => item.status)));
  const regions = Array.from(new Set(data.map(item => item.region)));

  useEffect(() => {
    let result = [...data];

    activeFilters.forEach(filter => {
      switch (filter.type) {
        case 'search':
          result = result.filter(item => 
            Object.entries(item).some(([key, value]) => 
              typeof value === 'string' && value.toLowerCase().includes(filter.value.toLowerCase())
            )
          );
          break;
        case 'date':
          if (filter.value.from && filter.value.to) {
            result = result.filter(item => {
              const date = item.createdAt;
              return date >= filter.value.from && date <= filter.value.to;
            });
          }
          break;
        case 'select':
          if (filter.field && filter.value) {
            result = result.filter(item => 
              item[filter.field as keyof DataItem] === filter.value
            );
          }
          break;
      }
    });

    setFilteredData(result);
  }, [activeFilters, data, setFilteredData]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    
    if (!value.trim()) {
      setActiveFilters(prev => prev.filter(f => f.type !== 'search'));
      return;
    }
    
    const searchFilter: ActiveFilter = {
      id: 'search',
      type: 'search',
      value: value,
      label: `Search: ${value}`,
    };
    
    setActiveFilters(prev => {
      const existingIndex = prev.findIndex(f => f.id === 'search');
      if (existingIndex >= 0) {
        const newFilters = [...prev];
        newFilters[existingIndex] = searchFilter;
        return newFilters;
      }
      return [...prev, searchFilter];
    });
  };

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
    
    if (!range.from || !range.to) {
      setActiveFilters(prev => prev.filter(f => f.id !== 'dateRange'));
      return;
    }
    
    const fromStr = format(range.from, 'MMM d, yyyy');
    const toStr = format(range.to, 'MMM d, yyyy');
    
    const dateFilter: ActiveFilter = {
      id: 'dateRange',
      type: 'date',
      field: 'createdAt',
      value: range,
      label: `Date: ${fromStr} - ${toStr}`,
    };
    
    setActiveFilters(prev => {
      const existingIndex = prev.findIndex(f => f.id === 'dateRange');
      if (existingIndex >= 0) {
        const newFilters = [...prev];
        newFilters[existingIndex] = dateFilter;
        return newFilters;
      }
      return [...prev, dateFilter];
    });
  };

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    
    if (!value) {
      setActiveFilters(prev => prev.filter(f => f.id !== 'status'));
      return;
    }
    
    const statusFilter: ActiveFilter = {
      id: 'status',
      type: 'select',
      field: 'status',
      value: value,
      label: `Status: ${value}`,
    };
    
    setActiveFilters(prev => {
      const existingIndex = prev.findIndex(f => f.id === 'status');
      if (existingIndex >= 0) {
        const newFilters = [...prev];
        newFilters[existingIndex] = statusFilter;
        return newFilters;
      }
      return [...prev, statusFilter];
    });
  };

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    
    if (!value) {
      setActiveFilters(prev => prev.filter(f => f.id !== 'region'));
      return;
    }
    
    const regionFilter: ActiveFilter = {
      id: 'region',
      type: 'select',
      field: 'region',
      value: value,
      label: `Region: ${value}`,
    };
    
    setActiveFilters(prev => {
      const existingIndex = prev.findIndex(f => f.id === 'region');
      if (existingIndex >= 0) {
        const newFilters = [...prev];
        newFilters[existingIndex] = regionFilter;
        return newFilters;
      }
      return [...prev, regionFilter];
    });
  };

  const removeFilter = (filterId: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== filterId));
    
    switch (filterId) {
      case 'search':
        setSearchValue("");
        break;
      case 'dateRange':
        setDateRange({ from: undefined, to: undefined });
        break;
      case 'status':
        setSelectedStatus("");
        break;
      case 'region':
        setSelectedRegion("");
        break;
    }
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setSearchValue("");
    setDateRange({ from: undefined, to: undefined });
    setSelectedStatus("");
    setSelectedRegion("");
  };

  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnId]: !prev[columnId],
    }));
  };

  return (
    <div className="toolbar animate-fade-in">
      <div className="toolbar-section">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-8 md:w-[200px] lg:w-[300px]"
            />
            {searchValue && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                onClick={() => handleSearch("")}
              >
                <CloseIcon className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className={cn(
              "flex items-center gap-1", 
              showFilters && "bg-accent text-accent-foreground"
            )}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <ColumnsIcon className="h-4 w-4 mr-1" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableColumns.map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={columnVisibility[column.id]}
                  onCheckedChange={() => toggleColumnVisibility(column.id)}
                >
                  {column.title}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <ExportOptions 
            data={data} 
            visibleColumns={visibleColumns} 
          />
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2 mt-2 animate-slide-in-down">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "flex items-center gap-1 text-sm justify-start",
                    dateRange.from && "bg-accent text-accent-foreground"
                  )}
                >
                  <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd")} -{" "}
                        {format(dateRange.to, "LLL dd, yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, yyyy")
                    )
                  ) : (
                    "Date Range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger
                className={cn(
                  "w-[180px] text-sm",
                  selectedStatus && "bg-accent text-accent-foreground"
                )}
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedRegion} onValueChange={handleRegionChange}>
              <SelectTrigger
                className={cn(
                  "w-[180px] text-sm",
                  selectedRegion && "bg-accent text-accent-foreground"
                )}
              >
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Regions</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <PlusCircle className="h-3.5 w-3.5 mr-1" />
                  More Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-[200px]">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sentiment">Sentiment</Label>
                    <Select>
                      <SelectTrigger id="sentiment">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="positive">Positive</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                        <SelectItem value="negative">Negative</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="device">Device</Label>
                    <Select>
                      <SelectTrigger id="device">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="desktop">Desktop</SelectItem>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="tablet">Tablet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-2 animate-fade-in">
            {activeFilters.map((filter) => (
              <Badge
                key={filter.id}
                variant="secondary"
                className="flex items-center gap-1 px-2 py-1"
              >
                {filter.label}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground"
                  onClick={() => removeFilter(filter.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {activeFilters.length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                onClick={clearAllFilters}
              >
                Clear all
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTableToolbar;
