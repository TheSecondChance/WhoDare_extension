import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SessionStats, DailyStats } from "../types";
import { TrendingUp, TrendingDown, Calendar, Code2, Zap } from "lucide-react";

interface StatsChartProps {
  sessionStats: SessionStats;
  dailyStats: DailyStats[];
}

const COLORS = {
  human: "#4CAF50",
  ai: "#FF9800",
};

export function StatsChart({ sessionStats, dailyStats }: StatsChartProps) {
  const totalLines = sessionStats.totalHumanLines + sessionStats.totalAiLines;
  const totalChars = sessionStats.totalHumanChars + sessionStats.totalAiChars;

  if (totalLines === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Code Distribution & Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const humanPercentage = (
    (sessionStats.totalHumanLines / totalLines) *
    100
  ).toFixed(1);
  const aiPercentage = ((sessionStats.totalAiLines / totalLines) * 100).toFixed(
    1
  );

  const pieData = [
    {
      name: "Human-written",
      value: sessionStats.totalHumanLines,
      percentage: humanPercentage,
    },
    {
      name: "AI-generated",
      value: sessionStats.totalAiLines,
      percentage: aiPercentage,
    },
  ];

  // Calculate daily averages
  const daysTracked = dailyStats.length;
  const avgLinesPerDay =
    daysTracked > 0 ? Math.round(totalLines / daysTracked) : 0;
  const avgHumanPerDay =
    daysTracked > 0
      ? Math.round(sessionStats.totalHumanLines / daysTracked)
      : 0;
  const avgAiPerDay =
    daysTracked > 0 ? Math.round(sessionStats.totalAiLines / daysTracked) : 0;

  // Get last 7 days stats for trend
  const last7Days = dailyStats.slice(-7);
  const recentTotal = last7Days.reduce(
    (sum, day) => sum + day.humanLines + day.aiLines,
    0
  );
  const recentAvg =
    last7Days.length > 0 ? Math.round(recentTotal / last7Days.length) : 0;

  // Calculate trend (compare recent 7 days to overall average)
  const trendUp = recentAvg > avgLinesPerDay;
  const trendPercent =
    avgLinesPerDay > 0
      ? Math.abs(
          Math.round(((recentAvg - avgLinesPerDay) / avgLinesPerDay) * 100)
        )
      : 0;

  // Get most productive day
  const mostProductiveDay =
    dailyStats.length > 0
      ? dailyStats.reduce((max, day) => {
          const dayTotal = day.humanLines + day.aiLines;
          const maxTotal = max.humanLines + max.aiLines;
          return dayTotal > maxTotal ? day : max;
        })
      : null;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
        <CardTitle className="flex items-center gap-2">
          <Code2 className="h-5 w-5" />
          Code Distribution & Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pie Chart */}
          <div>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percentage }) => `${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? COLORS.human : COLORS.ai}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    `${value.toLocaleString()} lines`
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Stats Grid */}
          <div className="space-y-4">
            {/* Total Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                    Human Code
                  </p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {sessionStats.totalHumanLines.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {sessionStats.totalHumanChars.toLocaleString()} chars
                  </p>
                </div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {humanPercentage}%
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <div>
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                    AI Code
                  </p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    {sessionStats.totalAiLines.toLocaleString()}
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    {sessionStats.totalAiChars.toLocaleString()} chars
                  </p>
                </div>
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {aiPercentage}%
                </div>
              </div>
            </div>

            {/* Daily Insights */}
            {daysTracked > 0 && (
              <div className="pt-3 border-t space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Daily Average</span>
                  </div>
                  <span className="text-sm font-bold">
                    {avgLinesPerDay} lines/day
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Human avg: {avgHumanPerDay}/day</span>
                  <span>AI avg: {avgAiPerDay}/day</span>
                </div>

                {last7Days.length > 0 && (
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        Last 7 Days Trend
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {trendUp ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-bold ${
                          trendUp ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {trendUp ? "+" : "-"}
                        {trendPercent}%
                      </span>
                    </div>
                  </div>
                )}

                {mostProductiveDay && (
                  <div className="pt-2 text-xs text-muted-foreground">
                    <span className="font-medium">Most productive:</span>{" "}
                    {new Date(mostProductiveDay.date).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}{" "}
                    (
                    {(
                      mostProductiveDay.humanLines + mostProductiveDay.aiLines
                    ).toLocaleString()}{" "}
                    lines)
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Summary Bar */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              Total:{" "}
              <span className="font-bold text-foreground">
                {totalLines.toLocaleString()}
              </span>{" "}
              lines
              {" • "}
              <span className="font-bold text-foreground">
                {totalChars.toLocaleString()}
              </span>{" "}
              characters
            </div>
            {daysTracked > 0 && (
              <div className="text-muted-foreground">
                <span className="font-bold text-foreground">{daysTracked}</span>{" "}
                days tracked
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
