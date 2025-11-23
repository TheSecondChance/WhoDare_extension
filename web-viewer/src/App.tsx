import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Moon, Sun, Github, Video, Info } from "lucide-react";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";

function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

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

  return (
    <Router>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Github className="h-6 w-6" />
              <h1 className="text-2xl font-bold">whoDare Viewer</h1>
            </Link>
            <div className="flex items-center gap-2">
              <Link to="/about">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Info className="h-5 w-5" />
                  <span className="hidden sm:inline">Features</span>
                </Button>
              </Link>
              <a
                href="https://github.com/TheSecondChance/testWhoDare?tab=readme-ov-file#whodare---ai-vs-human-code-contribution-tracker"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-9 px-3 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Video className="h-5 w-5" />
                <span className="hidden sm:inline">Watch Demo</span>
              </a>
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>

        {/* Footer */}
        <footer className="border-t mt-16">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>
              whoDare - Track human vs AI code contributions |{" "}
              <a
                href="https://github.com/TheSecondChance/WhoDare_extension/"
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
    </Router>
  );
}

export default App;
