import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DailyStats } from '../types';

interface TimelineChartProps {
  dailyStats: DailyStats[];
}

export function TimelineChart({ dailyStats }: TimelineChartProps) {
  if (dailyStats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No daily data available yet
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort by date and get last 30 days
  const sortedStats = [...dailyStats].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  ).slice(-30);

  // Format data for chart
  const chartData = sortedStats.map(stat => ({
    date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fullDate: stat.date,
    human: stat.humanLines,
    ai: stat.aiLines,
    events: stat.events,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Activity (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 10 }}
            />
            <YAxis label={{ value: 'Lines of Code', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background border border-border p-3 rounded shadow-lg">
                      <p className="font-semibold mb-1">{data.fullDate}</p>
                      <p className="text-sm text-green-600">Human: {data.human} lines</p>
                      <p className="text-sm text-orange-600">AI: {data.ai} lines</p>
                      <p className="text-sm text-muted-foreground mt-1">{data.events} events</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="human" fill="#4CAF50" name="Human Lines" />
            <Bar dataKey="ai" fill="#FF9800" name="AI Lines" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

