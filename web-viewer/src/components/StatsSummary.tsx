import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { SessionStats } from '../types';

interface StatsSummaryProps {
  stats: SessionStats;
}

export function StatsSummary({ stats }: StatsSummaryProps) {
  const totalLines = stats.totalHumanLines + stats.totalAiLines;
  const totalChars = stats.totalHumanChars + stats.totalAiChars;
  
  const humanLinePercent = totalLines > 0 
    ? ((stats.totalHumanLines / totalLines) * 100).toFixed(1)
    : '0.0';
  
  const aiLinePercent = totalLines > 0 
    ? ((stats.totalAiLines / totalLines) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Lines</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M12 2v20M2 12h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalLines.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {totalChars.toLocaleString()} characters
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Human-Written</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-green-600"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.totalHumanLines.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {humanLinePercent}% of total lines
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">AI-Generated</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-orange-600"
          >
            <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.totalAiLines.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {aiLinePercent}% of total lines
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Characters</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M4 7V4h16v3M9 20h6M12 4v16" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalChars.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-green-600 dark:text-green-400">
              {stats.totalHumanChars.toLocaleString()}
            </span>
            {' / '}
            <span className="text-orange-600 dark:text-orange-400">
              {stats.totalAiChars.toLocaleString()}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

