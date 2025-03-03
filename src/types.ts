export interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  html_url: string;
  description: string | null;
  private: boolean;
  updated_at: string;
}

export interface WorkflowRun {
  id: number;
  name: string | null;
  head_branch: string;
  head_sha: string;
  run_number: number;
  event: string;
  status: string;
  conclusion: string | null;
  workflow_id: number;
  html_url: string;
  created_at: string;
  updated_at: string;
  run_attempt: number;
  run_started_at: string;
  jobs_url: string;
  logs_url: string;
  workflow_name: string;
}

export interface WorkflowRunsResponse {
  total_count: number;
  workflow_runs: WorkflowRun[];
}

export interface Job {
  id: number;
  run_id: number;
  name: string;
  status: string;
  conclusion: string | null;
  started_at: string;
  completed_at: string | null;
  steps: JobStep[];
}

export interface JobStep {
  name: string;
  status: string;
  conclusion: string | null;
  number: number;
  started_at: string;
  completed_at: string | null;
}

export interface Artifact {
  id: number;
  name: string;
  size_in_bytes: number;
  created_at: string;
  updated_at: string;
  expired: boolean;
}

export interface RunDetails {
  run: WorkflowRun;
  jobs: {
    total_count: number;
    jobs: Job[];
  };
  artifacts: {
    total_count: number;
    artifacts: Artifact[];
  };
}

export interface RunDetailsResponse {
  run: WorkflowRun;
  jobs: {
    total_count: number;
    jobs: Job[];
  };
  artifacts: {
    total_count: number;
    artifacts: Artifact[];
  };
}

// Generic type for artifact content - this can be any JSON structure
export type ArtifactContent = any;