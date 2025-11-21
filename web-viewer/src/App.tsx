import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { StatsSummary } from "./components/StatsSummary";
import { StatsChart } from "./components/StatsChart";
import { TimelineChart } from "./components/TimelineChart";
import { FileBreakdown } from "./components/FileBreakdown";
import { DailyBreakdown } from "./components/DailyBreakdown";
import { fetchData } from "./utils/github";
import { TrackerData } from "./types";
import { Moon, Sun, Github, Loader2 } from "lucide-react";

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TrackerData | null>(null);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleFetchData = async () => {
    if (!repoUrl.trim()) {
      setError("Please enter a GitHub repository URL");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null); // Clear previous data

    try {
      const trackerData = await fetchData(repoUrl);
      console.log("Data loaded successfully:", trackerData);
      setData(trackerData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="h-6 w-6" />
            <h1 className="text-2xl font-bold">whoDare Viewer</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>View Repository Statistics</CardTitle>
            <CardDescription>
              Enter a GitHub repository URL to view its code statistics. The
              repository must contain a{" "}
              <code className="px-1 py-0.5 bg-muted rounded">
                .howdare/stats.json
              </code>{" "}
              file.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="repo-url" className="text-sm font-medium">
                GitHub Repository URL
              </label>
              <Input
                id="repo-url"
                type="text"
                placeholder="https://github.com/owner/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFetchData()}
              />
              <p className="text-xs text-muted-foreground">
                The viewer will automatically try common branches (main,
                master).
              </p>
            </div>

            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-sm text-destructive font-medium">Error</p>
                <p className="text-sm text-destructive mt-1">{error}</p>
              </div>
            )}

            <Button
              onClick={handleFetchData}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                "Fetch Statistics"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Statistics Display */}
        {data && (
          <div className="space-y-8">
            {/* Summary Cards */}
            <StatsSummary stats={data.sessionStats} />

            {/* Enhanced Stats Chart */}
            <StatsChart
              sessionStats={data.sessionStats}
              dailyStats={data.dailyStats || []}
            />

            {/* Timeline Chart */}
            <TimelineChart dailyStats={data.dailyStats || []} />

            {/* Daily Breakdown */}
            <DailyBreakdown dailyStats={data.dailyStats || []} />

            {/* File Breakdown */}
            <FileBreakdown files={data.files} />
          </div>
        )}

        {/* Empty State */}
        {!data && !loading && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Github className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Data Loaded</h2>
              <p className="text-muted-foreground text-center max-w-md">
                Enter a GitHub repository URL above to view code statistics.
                Make sure the repository has the whoDare extension enabled and
                has pushed the stats file.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            whoDare - Track human vs AI code contributions |{" "}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              View on GitHub
            </a>
          </p>
          <p className="mt-2">
            Developed by{" "}
            <a
              href="https://www.linkedin.com/in/eyasu-sintayehu-2995bb324/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              Eyasu Sintayehu
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
