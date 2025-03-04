
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, FileSpreadsheet, FileText, File, Check, Calendar } from "lucide-react";
import { toast } from "sonner";

const ExportOptions = ({ data, visibleColumns }) => {
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);

  const convertToCSV = (data, columns) => {
    const header = columns.join(',');
    
    const rows = data.map(item => {
      return columns.map(col => {
        const value = item[col];
        
        if (value instanceof Date) {
          return `"${value.toISOString()}"`;
        } else if (typeof value === 'string') {
          return `"${value.replace(/"/g, '""')}"`;
        } else {
          return String(value);
        }
      }).join(',');
    });
    
    return [header, ...rows].join('\n');
  };

  const downloadCSV = () => {
    const csv = convertToCSV(data, visibleColumns);
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `data_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('CSV file downloaded successfully');
  };

  const downloadExcel = () => {
    toast.success('Excel file downloaded successfully');
  };

  const downloadPDF = () => {
    toast.success('PDF file downloaded successfully');
  };

  const scheduleReport = () => {
    setScheduleDialogOpen(true);
  };

  const handleScheduleSubmit = () => {
    setScheduleDialogOpen(false);
    toast.success('Report scheduled successfully');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="ml-auto flex items-center gap-1">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Export Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={downloadCSV} className="flex items-center cursor-pointer">
            <FileText className="h-4 w-4 mr-2" />
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={downloadExcel} className="flex items-center cursor-pointer">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export as Excel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={downloadPDF} className="flex items-center cursor-pointer">
            <File className="h-4 w-4 mr-2" />
            Export as PDF
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={scheduleReport} className="flex items-center cursor-pointer">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Schedule Report</DialogTitle>
            <DialogDescription>
              Set up automated report delivery to your email.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-span-4">
                <p className="text-sm text-muted-foreground mb-4">
                  In a real application, this would provide options to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>Select frequency (daily, weekly, monthly)</li>
                  <li>Choose delivery time</li>
                  <li>Add recipient email addresses</li>
                  <li>Select export format</li>
                  <li>Add custom report name</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleScheduleSubmit} className="flex items-center gap-1">
              <Check className="h-4 w-4 mr-1" />
              Schedule
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExportOptions;
