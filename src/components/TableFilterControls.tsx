
import React from "react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export const FilterControls = ({ filters, filterOptions, onFilterChange, onApplyFilters }) => {
  // Handle selection of dropdown filter options
  const handleSelectFilter = (key, value) => {
    // If already selected, we need to add, otherwise create new array
    if (filters[key].includes(value)) {
      onFilterChange(key, filters[key].filter(item => item !== value));
    } else {
      onFilterChange(key, [...filters[key], value]);
    }
  };

  // Handle range inputs for numeric filters
  const handleRangeChange = (filterKey, rangeKey, value) => {
    onFilterChange(filterKey, {
      ...filters[filterKey],
      [rangeKey]: value
    });
  };

  // Reset all filters
  const handleResetFilters = () => {
    onFilterChange("status", []);
    onFilterChange("region", []);
    onFilterChange("sentiment", []);
    onFilterChange("revenue", { min: "", max: "" });
    onFilterChange("transactions", { min: "", max: "" });
    onFilterChange("conversionRate", { min: "", max: "" });
  };

  // Remove a single filter selection
  const removeFilter = (type, value) => {
    onFilterChange(type, filters[type].filter(item => item !== value));
  };

  // Check if there are any active filters
  const hasActiveFilters = () => {
    return (
      filters.status.length > 0 ||
      filters.region.length > 0 ||
      filters.sentiment.length > 0 ||
      filters.revenue.min !== "" ||
      filters.revenue.max !== "" ||
      filters.transactions.min !== "" ||
      filters.transactions.max !== "" ||
      filters.conversionRate.min !== "" ||
      filters.conversionRate.max !== ""
    );
  };

  return (
    <div className="bg-muted/40 p-4 rounded-lg border space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select onValueChange={(value) => handleSelectFilter("status", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {filterOptions.status.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-1 mt-1">
            {filters.status.map(status => (
              <Badge 
                key={status} 
                variant="outline" 
                className="flex items-center gap-1 bg-muted/60"
              >
                {status}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeFilter("status", status)} 
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Region Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Region</label>
          <Select onValueChange={(value) => handleSelectFilter("region", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select region" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {filterOptions.region.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-1 mt-1">
            {filters.region.map(region => (
              <Badge 
                key={region} 
                variant="outline" 
                className="flex items-center gap-1 bg-muted/60"
              >
                {region}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeFilter("region", region)} 
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Sentiment Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sentiment</label>
          <Select onValueChange={(value) => handleSelectFilter("sentiment", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select sentiment" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {filterOptions.sentiment.map(sentiment => (
                  <SelectItem key={sentiment} value={sentiment}>{sentiment}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex flex-wrap gap-1 mt-1">
            {filters.sentiment.map(sentiment => (
              <Badge 
                key={sentiment} 
                variant="outline" 
                className="flex items-center gap-1 bg-muted/60"
              >
                {sentiment}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeFilter("sentiment", sentiment)} 
                />
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Revenue Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Revenue Range</label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.revenue.min}
              onChange={(e) => handleRangeChange("revenue", "min", e.target.value)}
              className="w-full"
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.revenue.max}
              onChange={(e) => handleRangeChange("revenue", "max", e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Transactions Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Transactions Range</label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.transactions.min}
              onChange={(e) => handleRangeChange("transactions", "min", e.target.value)}
              className="w-full"
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.transactions.max}
              onChange={(e) => handleRangeChange("transactions", "max", e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {/* Conversion Rate Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Conversion Rate (%)</label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.conversionRate.min}
              onChange={(e) => handleRangeChange("conversionRate", "min", e.target.value)}
              className="w-full"
            />
            <span className="text-muted-foreground">to</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.conversionRate.max}
              onChange={(e) => handleRangeChange("conversionRate", "max", e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleResetFilters}
          disabled={!hasActiveFilters()}
        >
          Reset Filters
        </Button>
        <Button size="sm" onClick={onApplyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
};
