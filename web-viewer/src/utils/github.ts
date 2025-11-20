import { EncryptedData, TrackerData } from '../types';
import { decrypt, generateDefaultKey } from './crypto';

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
): Promise<EncryptedData> {
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

      const data: EncryptedData = await response.json();
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
 * Decrypts tracker data (plain JSON, no compression)
 */
export async function decryptTrackerData(
  encryptedData: EncryptedData,
  password: string
): Promise<TrackerData> {
  try {
    if (!encryptedData.encrypted) {
      throw new Error('Data is not encrypted');
    }

    const decryptedJson = await decrypt(encryptedData.data, password);
    const data: TrackerData = JSON.parse(decryptedJson);
    
    return data;
  } catch (error) {
    throw new Error(`Failed to decrypt data: ${error}`);
  }
}

/**
 * Fetches and decrypts tracker data from GitHub
 * Automatically uses the default key from workspaceId
 */
export async function fetchAndDecryptData(
  githubUrl: string
): Promise<TrackerData> {
  const parsed = parseGitHubUrl(githubUrl);
  
  if (!parsed) {
    throw new Error('Invalid GitHub URL. Please use format: https://github.com/owner/repo');
  }

  const encryptedData = await fetchStatsFromGitHub(
    parsed.owner,
    parsed.repo,
    parsed.branch !== 'main' ? parsed.branch : undefined
  );

  // Automatically decrypt using the workspaceId from the file
  if (!encryptedData.workspaceId) {
    throw new Error('Stats file is missing workspaceId. This file may be corrupted.');
  }

  const defaultKey = await generateDefaultKey(encryptedData.workspaceId);
  
  try {
    const data = await decryptTrackerData(encryptedData, defaultKey);
    console.log('Successfully decrypted stats data');
    return data;
  } catch (error) {
    throw new Error(
      `Failed to decrypt the stats file. The file may be corrupted or from an incompatible version. ` +
      `Error: ${error}`
    );
  }
}

