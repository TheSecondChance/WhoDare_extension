import { TrackerData } from '../types';

/**
 * Parses a GitHub URL to extract owner, repo, and branch
 */
export function parseGitHubUrl(url: string): {
  owner: string;
  repo: string;
  branch: string;
} | null {
  try {
    // Support various GitHub URL formats
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+)(?:\/tree\/([^\/]+))?/,
      /github\.com\/([^\/]+)\/([^\/]+)\.git/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace('.git', ''),
          branch: match[3] || 'main',
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Failed to parse GitHub URL:', error);
    return null;
  }
}

/**
 * Fetches the stats file from a GitHub repository
 * Tries multiple branches automatically
 */
export async function fetchStatsFromGitHub(
  owner: string,
  repo: string,
  branch?: string
): Promise<TrackerData> {
  // Try multiple branches if not specified
  const branches = branch ? [branch] : ['main', 'master'];
  
  let lastError: Error | null = null;
  
  for (const branchName of branches) {
    try {
      const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branchName}/.howdare/stats.json`;
      
      console.log(`Trying to fetch from: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
        continue; // Try next branch
      }

      const data: TrackerData = await response.json();
      console.log('Successfully fetched and parsed stats file');
      return data;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Failed to fetch from branch '${branchName}':`, error);
      // Continue to try next branch
    }
  }

  // If we get here, all branches failed
  throw new Error(
    `Could not find .howdare/stats.json in repository. ` +
    `Tried branches: ${branches.join(', ')}. ` +
    `Make sure you've committed the stats file to your repository. ` +
    `Last error: ${lastError?.message}`
  );
}

/**
 * Fetches tracker data from GitHub (plain JSON format)
 */
export async function fetchData(
  githubUrl: string
): Promise<TrackerData> {
  const parsed = parseGitHubUrl(githubUrl);
  
  if (!parsed) {
    throw new Error('Invalid GitHub URL. Please use format: https://github.com/owner/repo');
  }

  const data = await fetchStatsFromGitHub(
    parsed.owner,
    parsed.repo,
    parsed.branch !== 'main' ? parsed.branch : undefined
  );

  // Ensure backward compatibility: add dailyStats if missing
  if (!data.dailyStats) {
    data.dailyStats = [];
    console.log('Added missing dailyStats field for backward compatibility');
  }

  // Ensure sessionStats exists
  if (!data.sessionStats) {
    data.sessionStats = {
      totalHumanLines: 0,
      totalAiLines: 0,
      totalHumanChars: 0,
      totalAiChars: 0,
    };
  }

  // Ensure files exists
  if (!data.files) {
    data.files = {};
  }

  // Ensure globalHistory exists
  if (!data.globalHistory) {
    data.globalHistory = [];
  }

  console.log('Successfully loaded stats data');
  return data;
}

