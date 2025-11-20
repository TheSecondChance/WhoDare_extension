import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { FileTracking } from '../types';

interface FileBreakdownProps {
  files: FileTracking;
}

export function FileBreakdown({ files }: FileBreakdownProps) {
  const fileEntries = Object.entries(files).filter(
    ([_, stats]) => stats.humanLines + stats.aiLines > 0
  );

  if (fileEntries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>File Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No file data available
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File</TableHead>
              <TableHead className="text-right">Human Lines</TableHead>
              <TableHead className="text-right">AI Lines</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Human %</TableHead>
              <TableHead className="text-right">AI %</TableHead>
              <TableHead className="text-right">Events</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fileEntries.map(([filePath, stats]) => {
              const total = stats.humanLines + stats.aiLines;
              const humanPercent = ((stats.humanLines / total) * 100).toFixed(1);
              const aiPercent = ((stats.aiLines / total) * 100).toFixed(1);

              return (
                <TableRow key={filePath}>
                  <TableCell className="font-mono text-sm">{filePath}</TableCell>
                  <TableCell className="text-right">{stats.humanLines}</TableCell>
                  <TableCell className="text-right">{stats.aiLines}</TableCell>
                  <TableCell className="text-right font-medium">{total}</TableCell>
                  <TableCell className="text-right">
                    <span className="text-green-600 dark:text-green-400">
                      {humanPercent}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-orange-600 dark:text-orange-400">
                      {aiPercent}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {stats.history.length}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

