
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const ReportChartView = ({ data }) => {
  const [timeRange, setTimeRange] = useState("all");
  
  // Process data for charts
  const statusData = processStatusData(data);
  const revenueData = processRevenueData(data);
  const sentimentData = processSentimentData(data);
  const regionData = processRegionData(data);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Performance Metrics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="year">Last year</SelectItem>
            <SelectItem value="quarter">Last quarter</SelectItem>
            <SelectItem value="month">Last month</SelectItem>
            <SelectItem value="week">Last week</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Revenue by Region */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue by Region</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Sentiment Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={
                      entry.name === 'Positive' ? '#00C49F' : 
                      entry.name === 'Negative' ? '#FF8042' : '#FFBB28'
                    } />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Count']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="transactions" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Total Revenue" 
          value={`$${data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}`}
          description="Sum of all transactions"
        />
        <MetricCard 
          title="Avg. Transaction" 
          value={`$${Math.round(data.reduce((sum, item) => sum + item.avgOrderValue, 0) / data.length).toLocaleString()}`}
          description="Average value per order"
        />
        <MetricCard 
          title="Conversion Rate" 
          value={`${(data.reduce((sum, item) => sum + item.conversionRate, 0) / data.length).toFixed(1)}%`}
          description="Visitors who completed a purchase"
        />
        <MetricCard 
          title="Churn Rate" 
          value={`${(data.reduce((sum, item) => sum + item.churnRate, 0) / data.length).toFixed(1)}%`}
          description="Customer attrition rate"
        />
      </div>
    </div>
  );
};

// Helper function to process status distribution data
function processStatusData(data) {
  const statusCounts = data.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(statusCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));
}

// Helper function to process revenue by region data
function processRegionData(data) {
  const regionRevenue = data.reduce((acc, item) => {
    acc[item.region] = (acc[item.region] || 0) + item.revenue;
    return acc;
  }, {});
  
  return Object.entries(regionRevenue).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value).slice(0, 5);
}

// Helper function to process sentiment data
function processSentimentData(data) {
  const sentimentCounts = data.reduce((acc, item) => {
    acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
    return acc;
  }, {});
  
  return Object.entries(sentimentCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));
}

// Helper function to process revenue trend data
function processRevenueData(data) {
  // Group data into 10 segments for visualization
  const segmentSize = Math.ceil(data.length / 10);
  const segments = [];
  
  for (let i = 0; i < 10; i++) {
    const segmentData = data.slice(i * segmentSize, (i + 1) * segmentSize);
    if (segmentData.length === 0) break;
    
    const totalRevenue = segmentData.reduce((sum, item) => sum + item.revenue, 0);
    const totalTransactions = segmentData.reduce((sum, item) => sum + item.transactions, 0);
    
    segments.push({
      name: `Segment ${i + 1}`,
      revenue: Math.round(totalRevenue / segmentData.length),
      transactions: Math.round(totalTransactions / segmentData.length)
    });
  }
  
  return segments;
}

// Metric Card Component
const MetricCard = ({ title, value, description }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export default ReportChartView;
