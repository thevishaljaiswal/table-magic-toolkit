
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import ReportDataTable from "@/components/ReportDataTable";
import ReportChartView from "@/components/ReportChartView";
import ExportOptions from "@/components/ExportOptions";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { generateSampleData } from "@/utils/data";

const Report = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [data] = useState(() => generateSampleData(50));
  const [visibleColumns] = useState([
    "id", "name", "email", "status", "revenue", "transactions", 
    "conversionRate", "region", "sentiment"
  ]);

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
        
        <ExportOptions data={data} visibleColumns={visibleColumns} />
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
              <ReportDataTable data={data} />
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
