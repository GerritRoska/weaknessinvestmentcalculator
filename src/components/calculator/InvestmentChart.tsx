import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface InvestmentChartProps {
  data?: Array<{
    year: number;
    value: number;
    realValue: number;
    contribution: number;
  }>;
  title?: string;
  showRealReturns?: boolean;
}

const InvestmentChart = ({
  data = generateSampleData(),
  title = "Investment Growth Over Time",
  showRealReturns = false,
}: InvestmentChartProps) => {
  const [activeView, setActiveView] = useState<"nominal" | "real">(
    showRealReturns ? "real" : "nominal",
  );

  // Update activeView when showRealReturns prop changes
  React.useEffect(() => {
    setActiveView(showRealReturns ? "real" : "nominal");
  }, [showRealReturns]);

  // Make sure we have both nominal and real values in the data
  const chartData = React.useMemo(() => {
    return data.map((item) => ({
      ...item,
      // Ensure realValue is properly calculated if it's not already
      realValue: item.realValue || item.value,
    }));
  }, [data]);

  return (
    <Card className="w-full h-full bg-white shadow-md">
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
            {title}
          </h3>
          <Tabs
            defaultValue="nominal"
            value={activeView}
            onValueChange={(value) =>
              setActiveView(value as "nominal" | "real")
            }
            className="w-full md:w-auto"
          >
            <TabsList className="w-full">
              <TabsTrigger
                value="nominal"
                className="flex-1 text-xs sm:text-sm py-1.5"
              >
                Nominal Returns
              </TabsTrigger>
              <TabsTrigger
                value="real"
                className="flex-1 text-xs sm:text-sm py-1.5"
              >
                <span className="hidden sm:inline">
                  Real Returns (Inflation Adjusted)
                </span>
                <span className="sm:hidden">Real Returns</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="h-[250px] sm:h-[300px] md:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="year"
                label={{
                  value: "Years",
                  position: "insideBottomRight",
                  offset: -10,
                  fontSize: 12,
                }}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                label={{
                  value: "Value ($)",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 12,
                }}
                tickFormatter={(value) => `${formatCurrency(value)}`}
                tick={{ fontSize: 10 }}
                width={60}
              />
              <Tooltip
                formatter={(value) => [
                  `$${formatCurrency(Number(value))}`,
                  activeView === "nominal" ? "Nominal Value" : "Real Value",
                ]}
                labelFormatter={(label) => `Year ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name="Nominal Value"
                stroke="#4f46e5"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                hide={activeView !== "nominal"}
              />
              <Line
                type="monotone"
                dataKey="realValue"
                name="Real Value (Inflation Adjusted)"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
                hide={activeView !== "real"}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 sm:mt-4 mb-12 sm:mb-20 text-xs sm:text-sm text-gray-500 space-y-2 border-b pb-4 sm:pb-6">
          <div className="flex justify-end">
            <p className="text-right">
              *{" "}
              {activeView === "nominal"
                ? "Nominal returns show growth without accounting for inflation"
                : "Real returns show growth adjusted for inflation"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to format currency values
const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)}K`;
  }
  return value.toFixed(2);
};

// Generate sample data for preview
const generateSampleData = () => {
  const data = [];
  let value = 10000;
  let realValue = 10000;
  const nominalRate = 0.08; // 8% annual return
  const inflationRate = 0.03; // 3% inflation

  for (let year = 0; year <= 30; year++) {
    data.push({
      year,
      value: Math.round(value),
      realValue: Math.round(realValue),
      contribution: year === 0 ? 10000 : 10000 + 500 * 12 * year,
    });

    value *= 1 + nominalRate;
    realValue *= 1 + nominalRate - inflationRate;
  }

  return data;
};

export default InvestmentChart;
