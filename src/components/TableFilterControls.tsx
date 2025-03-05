
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { 
  Filter, 
  ListFilter, 
  Calendar, 
  BarChart3,
  Hash,
  Check,
  X
} from "lucide-react";

interface RangeFilter {
  min: string;
  max: string;
}

interface Filters {
  status: string[];
  region: string[];
  sentiment: string[];
  revenue: RangeFilter;
  transactions: RangeFilter;
  conversionRate: RangeFilter;
  ids: string[];
}

interface FilterOptions {
  status: string[];
  region: string[];
  sentiment: string[];
}

interface FilterControlsProps {
  filters: Filters;
  filterOptions: FilterOptions;
  onFilterChange: (key: string, value: any) => void;
  onApplyFilters: () => void;
}

export const FilterControls = ({ 
  filters, 
  filterOptions, 
  onFilterChange, 
  onApplyFilters 
}: FilterControlsProps) => {
  
  // Handle checkbox change for array filters
  const handleCheckboxChange = (filterKey: string, value: string) => {
    const currentValues = filters[filterKey as keyof Filters] as string[];
    
    if (Array.isArray(currentValues)) {
      const updated = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      
      onFilterChange(filterKey, updated);
    }
  };
  
  // Handle range filter change
  const handleRangeChange = (filterKey: string, rangeType: 'min' | 'max', value: string) => {
    const rangeFilter = filters[filterKey as keyof Filters] as RangeFilter;
    
    onFilterChange(filterKey, {
      ...rangeFilter,
      [rangeType]: value
    });
  };
  
  // Handle IDs text change
  const handleIdsChange = (value: string) => {
    const idsArray = value
      .split(',')
      .map(id => id.trim())
      .filter(id => id !== '');
    
    onFilterChange('ids', idsArray);
  };
  
  // Reset all filters
  const resetFilters = () => {
    onFilterChange('status', []);
    onFilterChange('region', []);
    onFilterChange('sentiment', []);
    onFilterChange('revenue', { min: '', max: '' });
    onFilterChange('transactions', { min: '', max: '' });
    onFilterChange('conversionRate', { min: '', max: '' });
    onFilterChange('ids', []);
  };
  
  return (
    <Card className="mb-6 border-0 shadow-sm">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter Records
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              <X className="mr-2 h-3 w-3" />
              Reset
            </Button>
            <Button size="sm" onClick={onApplyFilters}>
              <Check className="mr-2 h-3 w-3" />
              Apply Filters
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status, Region, and Sentiment filters */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
              <ListFilter className="h-4 w-4" />
              Categories
            </h4>
            
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {filterOptions.status.map(status => (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`status-${status}`}
                        checked={filters.status.includes(status)}
                        onCheckedChange={() => handleCheckboxChange('status', status)}
                      />
                      <label 
                        htmlFor={`status-${status}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {status}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">Region</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {filterOptions.region.map(region => (
                    <div key={region} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`region-${region}`}
                        checked={filters.region.includes(region)}
                        onCheckedChange={() => handleCheckboxChange('region', region)}
                      />
                      <label 
                        htmlFor={`region-${region}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {region}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">Sentiment</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {filterOptions.sentiment.map(sentiment => (
                    <div key={sentiment} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`sentiment-${sentiment}`}
                        checked={filters.sentiment.includes(sentiment)}
                        onCheckedChange={() => handleCheckboxChange('sentiment', sentiment)}
                      />
                      <label 
                        htmlFor={`sentiment-${sentiment}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {sentiment}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Numeric range filters */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              Numeric Ranges
            </h4>
            
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">Revenue</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <Label className="text-xs" htmlFor="revenue-min">Min</Label>
                    <Input 
                      id="revenue-min"
                      type="number" 
                      placeholder="Min" 
                      value={filters.revenue.min}
                      onChange={(e) => handleRangeChange('revenue', 'min', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs" htmlFor="revenue-max">Max</Label>
                    <Input 
                      id="revenue-max"
                      type="number" 
                      placeholder="Max" 
                      value={filters.revenue.max}
                      onChange={(e) => handleRangeChange('revenue', 'max', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">Transactions</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <Label className="text-xs" htmlFor="transactions-min">Min</Label>
                    <Input 
                      id="transactions-min"
                      type="number" 
                      placeholder="Min" 
                      value={filters.transactions.min}
                      onChange={(e) => handleRangeChange('transactions', 'min', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs" htmlFor="transactions-max">Max</Label>
                    <Input 
                      id="transactions-max"
                      type="number" 
                      placeholder="Max" 
                      value={filters.transactions.max}
                      onChange={(e) => handleRangeChange('transactions', 'max', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">Conversion Rate (%)</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div>
                    <Label className="text-xs" htmlFor="conversion-min">Min</Label>
                    <Input 
                      id="conversion-min"
                      type="number" 
                      placeholder="Min" 
                      value={filters.conversionRate.min}
                      onChange={(e) => handleRangeChange('conversionRate', 'min', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs" htmlFor="conversion-max">Max</Label>
                    <Input 
                      id="conversion-max"
                      type="number" 
                      placeholder="Max" 
                      value={filters.conversionRate.max}
                      onChange={(e) => handleRangeChange('conversionRate', 'max', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* ID filter */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
              <Hash className="h-4 w-4" />
              IDs Filter
            </h4>
            
            <div>
              <Label className="text-xs text-muted-foreground">Specific IDs (comma separated)</Label>
              <Input
                className="mt-1"
                placeholder="e.g. 1001, 1002, 1003"
                value={filters.ids.join(', ')}
                onChange={(e) => handleIdsChange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter multiple IDs separated by commas to filter records
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
