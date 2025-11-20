import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { DailyStats } from '../types';

interface TimelineChartProps {
  dailyStats: DailyStats[];
}

export function TimelineChart({ dailyStats }: TimelineChartProps) {
  console.log('TimelineChart received dailyStats:', dailyStats);

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

  console.log('Sorted stats for chart:', sortedStats);

  // Format data for chart
  const chartData = sortedStats.map(stat => ({
    date: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    fullDate: stat.date,
    human: stat.humanLines,
    ai: stat.aiLines,
    events: stat.events,
  }));

  console.log('Formatted chart data:', chartData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Daily Activity Timeline 
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({chartData.length} {chartData.length === 1 ? 'day' : 'days'} tracked)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart 
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 60 }}
          >
            <defs>
              <linearGradient id="colorHuman" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4CAF50" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF9800" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#FF9800" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.5} />
            <XAxis 
              dataKey="date" 
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 11 }}
              interval={0}
              stroke="#888"
            />
            <YAxis 
              tick={{ fontSize: 11 }}
              stroke="#888"
              label={{ value: 'Lines of Code', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background border-2 border-border p-4 rounded-lg shadow-xl backdrop-blur-sm">
                      <p className="font-bold mb-3 text-base border-b pb-2">{data.fullDate}</p>
                      <div className="space-y-2">
                        <p className="text-sm text-green-600 font-medium flex items-center justify-between">
                          <span>👤 Human:</span>
                          <span className="ml-3 font-bold">{data.human} lines</span>
                        </p>
                        <p className="text-sm text-orange-600 font-medium flex items-center justify-between">
                          <span>🤖 AI:</span>
                          <span className="ml-3 font-bold">{data.ai} lines</span>
                        </p>
                        <p className="text-sm text-blue-600 font-medium flex items-center justify-between border-t pt-2">
                          <span>📝 Total:</span>
                          <span className="ml-3 font-bold">{data.human + data.ai} lines</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-3 pt-2 border-t">
                          ⚡ {data.events} coding events
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Area 
              type="monotone"
              dataKey="human" 
              stroke="#4CAF50"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorHuman)"
              name="Human Lines"
            />
            <Area 
              type="monotone"
              dataKey="ai" 
              stroke="#FF9800"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAi)"
              name="AI Lines"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Summary below chart */}
        <div className="mt-4 pt-4 border-t grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total Human Lines</p>
            <p className="text-lg font-bold text-green-600">
              {chartData.reduce((sum, day) => sum + day.human, 0).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Total AI Lines</p>
            <p className="text-lg font-bold text-orange-600">
              {chartData.reduce((sum, day) => sum + day.ai, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

