// Repository type
export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string;
  html_url: string;
  updated_at: string;
}

// Workflow Run type
export interface WorkflowRun {
  id: number;
  name: string;
  head_branch: string;
  head_sha: string;
  run_number: number;
  event: string;
  status: string;
  conclusion: string | null;
  workflow_id: number;
  created_at: string;
  updated_at: string;
  url: string;
  html_url: string;
}

// Workflow Runs response
export interface WorkflowRunsResponse {
  total_count: number;
  workflow_runs: WorkflowRun[];
}

// Job type
export interface Job {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  steps: Step[];
  started_at: string;
  completed_at: string;
}

// Step type
export interface Step {
  name: string;
  status: string;
  conclusion: string | null;
  number: number;
  started_at: string;
  completed_at: string;
}

// Jobs response
export interface JobsResponse {
  total_count: number;
  jobs: Job[];
}

// Artifact type
export interface Artifact {
  id: number;
  name: string;
  size_in_bytes: number;
  url: string;
  archive_download_url: string;
  expired: boolean;
  created_at: string;
  updated_at: string;
}

// Artifacts response
export interface ArtifactsResponse {
  total_count: number;
  artifacts: Artifact[];
}

// Run details response
export interface RunDetailsResponse {
  run: WorkflowRun;
  jobs: JobsResponse;
  artifacts: ArtifactsResponse;
}

// Artifact content type (assuming it's related to steps)
export interface ArtifactContent {
  [key: string]: any;
  steps?: {
    [key: string]: any;
  };
} 