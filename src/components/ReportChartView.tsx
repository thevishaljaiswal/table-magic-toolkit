
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DataItem {
  id: string | number;
  name: string;
  email: string;
  status: string;
  revenue: number;
  transactions: number;
  conversionRate: number;
  region: string;
  sentiment: string;
  churnRate?: number;
  [key: string]: any;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    dataKey: string;
    color: string;
  }>;
  label?: string;
}

interface ChartContainerProps {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

interface ReportChartViewProps {
  data: DataItem[];
}

// ChartContainer component for consistent styling
const ChartContainer = ({
  title,
  description,
  className,
  children,
}: ChartContainerProps) => (
  <Card className={cn("shadow-sm", className)}>
    <CardHeader className="pb-2">
      <CardTitle className="text-base font-medium">{title}</CardTitle>
      {description && <CardDescription>{description}</CardDescription>}
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-3 border shadow-sm rounded-md">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>
              {entry.name}: {entry.dataKey.includes("revenue")
                ? `$${entry.value.toLocaleString()}`
                : entry.dataKey.includes("Rate")
                  ? `${entry.value}%`
                  : entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const ReportChartView = ({ data }: ReportChartViewProps) => {
  const [chartView, setChartView] = useState("summary");

  // Calculate summary stats
  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const totalTransactions = data.reduce(
    (sum, item) => sum + (item.transactions || 0),
    0
  );
  const avgConversionRate =
    data.reduce((sum, item) => sum + (item.conversionRate || 0), 0) / data.length;

  // Prepare data for region based charts
  const regionData = Object.entries(
    data.reduce((acc, item) => {
      const region = item.region;
      if (!acc[region]) {
        acc[region] = {
          region,
          revenue: 0,
          transactions: 0,
          count: 0,
          conversionRate: 0,
        };
      }
      acc[region].revenue += (item.revenue || 0);
      acc[region].transactions += (item.transactions || 0);
      acc[region].count += 1;
      acc[region].conversionRate += (item.conversionRate || 0);
      return acc;
    }, {} as Record<string, any>)
  ).map(([_, value]) => ({
    ...value,
    conversionRate: value.conversionRate / value.count,
  }));

  // Prepare data for status distribution
  const statusData = Object.entries(
    data.reduce((acc, item) => {
      const status = item.status;
      if (!acc[status]) {
        acc[status] = { name: status, value: 0 };
      }
      acc[status].value += 1;
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  ).map(([_, value]) => value);

  // Prepare data for sentiment analysis
  const sentimentData = Object.entries(
    data.reduce((acc, item) => {
      const sentiment = item.sentiment;
      if (!acc[sentiment]) {
        acc[sentiment] = { name: sentiment, value: 0 };
      }
      acc[sentiment].value += 1;
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  ).map(([_, value]) => value);

  // Prepare conversion vs churn rate data
  const rateComparisonData = data.map((item) => ({
    name: item.name.split(" ")[0], // Just use first name for brevity
    conversionRate: item.conversionRate || 0,
    churnRate: item.churnRate || 0,
  })).slice(0, 7); // Just show first 7 for readability

  // Colors for the charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];
  const STATUS_COLORS = {
    active: "#4CAF50",
    pending: "#FF9800",
    archived: "#9E9E9E",
    suspended: "#F44336",
  };
  const SENTIMENT_COLORS = {
    positive: "#4CAF50",
    neutral: "#2196F3",
    negative: "#F44336",
  };

  return (
    <div className="space-y-6">
      <Tabs value={chartView} onValueChange={setChartView}>
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="regions">Regional Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Summary View */}
        <TabsContent value="summary" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {totalTransactions.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +15% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {avgConversionRate.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  +2.5% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ChartContainer title="Status Distribution">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS] || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>

            <ChartContainer title="Sentiment Analysis">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sentimentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {sentimentData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={SENTIMENT_COLORS[entry.name as keyof typeof SENTIMENT_COLORS] || COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </div>
        </TabsContent>

        {/* Regional Analysis View */}
        <TabsContent value="regions" className="space-y-6">
          <ChartContainer title="Revenue by Region">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    name="Revenue"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>

          <div className="grid gap-4 md:grid-cols-2">
            <ChartContainer title="Transactions by Region">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="transactions"
                      name="Transactions"
                      fill="#82ca9d"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>

            <ChartContainer title="Conversion Rate by Region">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey="conversionRate"
                      name="Conversion Rate"
                      fill="#ffc658"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartContainer>
          </div>
        </TabsContent>

        {/* Performance View */}
        <TabsContent value="performance" className="space-y-6">
          <ChartContainer title="Conversion vs Churn Rate">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rateComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="conversionRate"
                    name="Conversion Rate"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="churnRate"
                    name="Churn Rate"
                    stroke="#ff7300"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>

          <ChartContainer title="Revenue Trend">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.slice(0, 10).map((item) => ({
                    name: item.name.split(" ")[0],
                    revenue: item.revenue || 0,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportChartView;
