
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { generateSampleData } from "@/utils/data";
import ReportChartView from "@/components/ReportChartView";
import ExportOptions from "@/components/ExportOptions";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import TableComponent, { ColumnDef } from "@/components/ui/TableComponent";

const Report = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [data] = useState(() => generateSampleData(50));
  
  // Define columns for the table
  const columns: ColumnDef[] = [
    { id: "id", name: "ID", width: "80px" },
    { id: "name", name: "Name" },
    { id: "email", name: "Email" },
    { id: "status", name: "Status", filterable: true },
    { id: "revenue", name: "Revenue", numeric: true, filterable: true },
    { id: "transactions", name: "Transactions", numeric: true, filterable: true },
    { id: "conversionRate", name: "Conversion", numeric: true, filterable: true },
    { id: "region", name: "Region", filterable: true },
    { id: "sentiment", name: "Sentiment", filterable: true }
  ];
  
  // Handle viewing details for a record
  const handleViewDetails = (row: any) => {
    navigate(`/record?id=${row.id}`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2" 
          onClick={() => navigate('/')}
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </Button>
        
        <ExportOptions data={data} visibleColumns={columns.map(col => col.id)} />
      </div>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Business Analytics Report</CardTitle>
          <CardDescription>
            Comprehensive overview of business performance metrics across various dimensions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="table" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="table">Data Table</TabsTrigger>
                <TabsTrigger value="charts">Charts & Metrics</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="table" className="pt-4">
              <TableComponent 
                data={data} 
                columns={columns}
                onViewDetails={handleViewDetails}
                actions={{
                  viewDetails: true,
                  edit: true,
                  delete: true,
                }}
                filterConfig={{
                  filterable: true,
                }}
              />
            </TabsContent>
            
            <TabsContent value="charts" className="pt-4">
              <ReportChartView data={data} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Report;
