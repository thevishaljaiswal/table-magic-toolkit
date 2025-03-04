
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

// Define the MetricCard component
const MetricCard = ({ title, value, description, className = "" }) => (
  <Card className={`shadow-sm ${className}`}>
    <CardHeader className="pb-2">
      <CardTitle className="text-base font-medium text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

// Custom tooltip for the charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 border rounded-lg shadow-md p-2 text-sm">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((entry, index) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value instanceof Date 
              ? entry.value.toLocaleDateString() 
              : typeof entry.value === 'number' && entry.name.includes('Rate') 
                ? `${entry.value.toFixed(1)}%` 
                : entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ReportChartView = ({ data }) => {
  const [chartTab, setChartTab] = useState("overview");
  
  // Calculate total revenue
  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const formattedTotalRevenue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(totalRevenue);
  
  // Calculate averages for key metrics
  const averageOrderValue = Math.round(
    totalRevenue / data.reduce((sum, item) => sum + (item.transactions || 0), 0)
  );
  const formattedAOV = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(averageOrderValue);
  
  // Prepare data for the pie chart - Group by status
  const statusData = data.reduce((acc, item) => {
    const status = item.status || "unknown";
    if (!acc[status]) {
      acc[status] = 0;
    }
    acc[status] += item.revenue || 0;
    return acc;
  }, {});
  
  const pieChartData = Object.keys(statusData).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: statusData[key]
  }));
  
  // Prepare data for the region bar chart
  const regionData = data.reduce((acc, item) => {
    const region = item.region || "unknown";
    if (!acc[region]) {
      acc[region] = { name: region, revenue: 0, transactions: 0 };
    }
    acc[region].revenue += item.revenue || 0;
    acc[region].transactions += item.transactions || 0;
    return acc;
  }, {});
  
  const barChartData = Object.values(regionData)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);
  
  // Get sentiment distribution
  const sentimentData = data.reduce((acc, item) => {
    const sentiment = item.sentiment || "unknown";
    if (!acc[sentiment]) {
      acc[sentiment] = 0;
    }
    acc[sentiment]++;
    return acc;
  }, {});
  
  const sentimentChartData = Object.keys(sentimentData).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: (sentimentData[key] / data.length) * 100
  }));
  
  // Colors for pie chart
  const COLORS = ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0', '#3f51b5'];
  
  // Create time-series data for trends
  const getSegmentedTimeData = () => {
    // We'll create segments of data to simulate time series
    const segments = [];
    const segmentSize = Math.ceil(data.length / 6); // Divide data into 6 segments
    
    for (let i = 0; i < 6; i++) {
      const segmentData = data.slice(i * segmentSize, (i + 1) * segmentSize);
      if (segmentData.length === 0) break;
      
      const totalRevenue = segmentData.reduce((sum, item) => sum + (item.revenue || 0), 0);
      const totalTransactions = segmentData.reduce((sum, item) => sum + (item.transactions || 0), 0);
      
      segments.push({
        name: `Segment ${i + 1}`,
        revenue: totalRevenue,
        transactions: totalTransactions,
        conversionRate: segmentData.reduce((sum, item) => sum + (item.conversionRate || 0), 0) / segmentData.length
      });
    }
    
    return segments;
  };
  
  const timeSeriesData = getSegmentedTimeData();

  return (
    <div className="space-y-6">
      <Tabs value={chartTab} onValueChange={setChartTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <MetricCard 
              title="Total Revenue" 
              value={formattedTotalRevenue}
              description="All time revenue"
            />
            <MetricCard 
              title="Average Order Value" 
              value={formattedAOV}
              description="Average revenue per transaction"
            />
            <MetricCard 
              title="Total Transactions" 
              value={data.reduce((sum, item) => sum + (item.transactions || 0), 0).toLocaleString()}
              description="All time completed transactions"
            />
          </div>
          
          {/* Revenue by Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Status</CardTitle>
              <CardDescription>
                Distribution of revenue across different statuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-6">
          {/* Sales Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <MetricCard 
              title="Top Region" 
              value={barChartData.length > 0 ? barChartData[0].name : "N/A"}
              description="Highest revenue generating region"
            />
            <MetricCard 
              title="Conversion Rate" 
              value={`${(data.reduce((sum, item) => sum + (item.conversionRate || 0), 0) / data.length).toFixed(1)}%`}
              description="Visitors who completed a purchase"
            />
            <MetricCard 
              title="Churn Rate" 
              value={`${(data.reduce((sum, item) => sum + (item.churnRate || 0), 0) / data.length).toFixed(1)}%`}
              description="Customer attrition rate"
            />
          </div>
          
          {/* Top Regions Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Top Regions by Revenue</CardTitle>
              <CardDescription>
                Revenue and transaction count across top performing regions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={barChartData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#8884d8" />
                    <Bar yAxisId="right" dataKey="transactions" name="Transactions" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <MetricCard 
              title="Sentiment Analysis" 
              value={sentimentChartData.find(item => item.name === "Positive")
                ? `${sentimentChartData.find(item => item.name === "Positive").value.toFixed(1)}% Positive`
                : "N/A"}
              description="Percentage of positive customer sentiment"
            />
            <MetricCard 
              title="Active Customers" 
              value={data.filter(item => item.status === "active").length.toLocaleString()}
              description="Number of currently active customers"
            />
            <MetricCard 
              title="Average Lifetime Value" 
              value={new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD"
              }).format(data.reduce((sum, item) => sum + (item.lifetimeValue || 0), 0) / data.length)}
              description="Average revenue per customer over time"
            />
          </div>
          
          {/* Time Series Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>
                Revenue, transactions, and conversion rate trends over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timeSeriesData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 10,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="transactions" name="Transactions" stroke="#82ca9d" />
                    <Line yAxisId="right" type="monotone" dataKey="conversionRate" name="Conversion Rate (%)" stroke="#ff7300" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportChartView;
