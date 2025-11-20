import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface StatsChartProps {
  humanLines: number;
  aiLines: number;
}

const COLORS = {
  human: '#4CAF50',
  ai: '#FF9800',
};

export function StatsChart({ humanLines, aiLines }: StatsChartProps) {
  const total = humanLines + aiLines;
  
  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Code Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No data available
          </p>
        </CardContent>
      </Card>
    );
  }

  const data = [
    { name: 'Human-written', value: humanLines, percentage: ((humanLines / total) * 100).toFixed(1) },
    { name: 'AI-generated', value: aiLines, percentage: ((aiLines / total) * 100).toFixed(1) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Code Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.human : COLORS.ai} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

