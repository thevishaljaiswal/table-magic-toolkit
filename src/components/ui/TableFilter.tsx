
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
  BarChart3,
  Hash,
  Check,
  X
} from "lucide-react";

interface RangeFilter {
  min: string;
  max: string;
}

interface FilterControlsProps {
  filters: any;
  filterOptions: any;
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
    const currentValues = filters[filterKey] as string[];
    
    if (Array.isArray(currentValues)) {
      const updated = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      
      onFilterChange(filterKey, updated);
    }
  };
  
  // Handle range filter change
  const handleRangeChange = (filterKey: string, rangeType: 'min' | 'max', value: string) => {
    const rangeFilter = filters[filterKey] as RangeFilter;
    
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
    // Reset each filter type
    Object.keys(filters).forEach(key => {
      if (Array.isArray(filters[key])) {
        onFilterChange(key, []);
      } else if (typeof filters[key] === 'object' && filters[key] !== null) {
        onFilterChange(key, { min: '', max: '' });
      } else {
        onFilterChange(key, '');
      }
    });
  };
  
  // Create groups of filters
  const categoricalFilters = Object.keys(filterOptions).filter(key => 
    Array.isArray(filterOptions[key]) && key !== 'ids'
  );
  
  const numericFilters = Object.keys(filters).filter(key => 
    typeof filters[key] === 'object' && 
    filters[key] !== null && 
    'min' in filters[key] && 
    'max' in filters[key] &&
    key !== 'ids'
  );
  
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
          {/* Categorical filters */}
          {categoricalFilters.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <ListFilter className="h-4 w-4" />
                Categories
              </h4>
              
              <div className="space-y-4">
                {categoricalFilters.map(filterKey => (
                  <div key={filterKey}>
                    <Label className="text-xs text-muted-foreground capitalize">{filterKey}</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {filterOptions[filterKey].map((option: string) => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`${filterKey}-${option}`}
                            checked={Array.isArray(filters[filterKey]) && filters[filterKey].includes(option)}
                            onCheckedChange={() => handleCheckboxChange(filterKey, option)}
                          />
                          <label 
                            htmlFor={`${filterKey}-${option}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Numeric range filters */}
          {numericFilters.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                Numeric Ranges
              </h4>
              
              <div className="space-y-4">
                {numericFilters.map(filterKey => (
                  <div key={filterKey}>
                    <Label className="text-xs text-muted-foreground capitalize">
                      {filterKey.includes('Rate') ? `${filterKey} (%)` : filterKey}
                    </Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div>
                        <Label className="text-xs" htmlFor={`${filterKey}-min`}>Min</Label>
                        <Input 
                          id={`${filterKey}-min`}
                          type="number" 
                          placeholder="Min" 
                          value={filters[filterKey].min}
                          onChange={(e) => handleRangeChange(filterKey, 'min', e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs" htmlFor={`${filterKey}-max`}>Max</Label>
                        <Input 
                          id={`${filterKey}-max`}
                          type="number" 
                          placeholder="Max" 
                          value={filters[filterKey].max}
                          onChange={(e) => handleRangeChange(filterKey, 'max', e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
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
                value={filters.ids ? filters.ids.join(', ') : ''}
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
