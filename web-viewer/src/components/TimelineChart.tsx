import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { HistoryEvent } from '../types';

interface TimelineChartProps {
  history: HistoryEvent[];
}

export function TimelineChart({ history }: TimelineChartProps) {
  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No historical data available
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group events by hour
  const groupedData = history.reduce((acc, event) => {
    const date = new Date(event.timestamp);
    const hourKey = `${date.toLocaleDateString()} ${date.getHours()}:00`;
    
    if (!acc[hourKey]) {
      acc[hourKey] = { time: hourKey, human: 0, ai: 0 };
    }
    
    if (event.type === 'human') {
      acc[hourKey].human += event.linesAdded;
    } else {
      acc[hourKey].ai += event.linesAdded;
    }
    
    return acc;
  }, {} as Record<string, { time: string; human: number; ai: number }>);

  const chartData = Object.values(groupedData).slice(-20); // Last 20 time periods

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Timeline (Last 20 Periods)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 10 }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="human" fill="#4CAF50" name="Human Lines" />
            <Bar dataKey="ai" fill="#FF9800" name="AI Lines" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

