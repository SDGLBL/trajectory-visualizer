import axios from 'axios';
import JSZip from 'jszip';

const GITHUB_API = 'https://api.github.com';

// Helper function to get headers with token
const getHeaders = () => {
  const token = localStorage.getItem('github_token');
  return {
    'Authorization': `token ${token}`,
  };
};

export const api = {
  // Get user's repositories
  getRepositories: async () => {
    const response = await axios.get(`${GITHUB_API}/user/repos`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  // Get workflow runs for a specific repository
  getWorkflowRuns: async (owner: string, repo: string, page: number = 1) => {
    const response = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}/actions/runs`, {
      headers: getHeaders(),
      params: {
        page,
        per_page: 30
      }
    });
    return response.data;
  },

  // Get details for a specific workflow run
  getRunDetails: async (owner: string, repo: string, runId: number) => {
    const response = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}/actions/runs/${runId}/jobs`, {
      headers: getHeaders(),
      params: {
        per_page: 100
      }
    });
    
    // Get artifacts for this run
    const artifactsResponse = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}/actions/runs/${runId}/artifacts`, {
      headers: getHeaders(),
    });

    // Get run details
    const runResponse = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}/actions/runs/${runId}`, {
      headers: getHeaders(),
    });

    return {
      run: runResponse.data,
      jobs: response.data,
      artifacts: artifactsResponse.data
    };
  },

  // Get artifact content
  getArtifactContent: async (owner: string, repo: string, artifactId: number) => {
    const response = await axios.get(`${GITHUB_API}/repos/${owner}/${repo}/actions/artifacts/${artifactId}/zip`, {
      headers: getHeaders(),
      responseType: 'arraybuffer'
    });
    
    // Load the zip file
    const zip = new JSZip();
    const contents = await zip.loadAsync(response.data);
    
    // Find the first file in the zip (GitHub artifacts typically contain one file)
    const files = Object.keys(contents.files);
    if (files.length === 0) {
      throw new Error('No files found in artifact');
    }
    
    // Read the file content
    const firstFile = contents.files[files[0]];
    const text = await firstFile.async('text');
    
    try {
      // Try to parse as JSON first
      const jsonContent = JSON.parse(text);
      
      // Check if it's a history file (contains history field)
      if (jsonContent.history) {
        return {
          content: jsonContent,
          jsonlHistory: jsonContent.history
        };
      }
      
      // If no history found, return just the content
      return { 
        content: jsonContent,
        jsonlHistory: []
      };
    } catch (jsonError) {
      // If parsing fails, return empty content and history
      console.warn('Failed to parse artifact content as JSON');
      return {
        content: { text },
        jsonlHistory: []
      };
    }
  }
};

export default api; 