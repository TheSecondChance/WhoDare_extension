import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { DailyStats } from "../types";

interface DailyBreakdownProps {
  dailyStats: DailyStats[];
}

export function DailyBreakdown({ dailyStats }: DailyBreakdownProps) {
  if (dailyStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Usage Breakdown</CardTitle>
          <CardDescription>
            No daily statistics available yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Start coding to see your daily activity breakdown
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort by date descending (most recent first) and take last 30 days
  const sortedStats = [...dailyStats]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 30);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Usage Breakdown</CardTitle>
        <CardDescription>
          Your coding activity for the last 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Human Lines</TableHead>
                <TableHead className="text-right">AI Lines</TableHead>
                <TableHead className="text-right">Total Lines</TableHead>
                <TableHead className="text-right">Human %</TableHead>
                <TableHead className="text-right">Events</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStats.map((stat) => {
                const totalLines = stat.humanLines + stat.aiLines;
                const humanPercent =
                  totalLines > 0
                    ? Math.round((stat.humanLines / totalLines) * 100)
                    : 0;

                return (
                  <TableRow key={stat.date}>
                    <TableCell className="font-medium">
                      {new Date(stat.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {stat.humanLines.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-orange-600">
                      {stat.aiLines.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {totalLines.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          humanPercent >= 50
                            ? "text-green-600 font-medium"
                            : "text-orange-600"
                        }
                      >
                        {humanPercent}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {stat.events}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

