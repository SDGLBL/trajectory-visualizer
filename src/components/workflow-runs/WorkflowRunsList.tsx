import React, { useEffect, useState, useRef, useCallback } from 'react';
import { WorkflowRun, WorkflowRunsResponse } from '../../types';
import { api } from '../../services/api';
import WorkflowRunsHeader from './WorkflowRunsHeader';
import WorkflowRunItem from './WorkflowRunItem';
import WorkflowRunsListSkeleton from '../loading/WorkflowRunsListSkeleton';

interface WorkflowRunsListProps {
  owner: string;
  repo: string;
  onSelectRun: (run: WorkflowRun) => void;
  selectedRun?: WorkflowRun | null;
}

const WorkflowRunsList: React.FC<WorkflowRunsListProps> = ({ owner, repo, onSelectRun, selectedRun }) => {
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [filteredRuns, setFilteredRuns] = useState<WorkflowRun[]>([]);
  const [runMetadata, setRunMetadata] = useState<{[key: number]: {title: string, issueNumber: number | null}}>({}); 
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessOnly, setShowSuccessOnly] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const listRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const options = {
      root: listRef.current,
      rootMargin: '20px',
      threshold: 1.0
    };

    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loadingMore) {
        setPage(prev => prev + 1);
      }
    }, options);

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!filteredRuns.length || !selectedRun) return;

      const currentIndex = filteredRuns.findIndex(run => run.id === selectedRun.id);
      if (currentIndex === -1) return;

      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          if (currentIndex > 0) {
            onSelectRun(filteredRuns[currentIndex - 1]);
            // Ensure the selected run is visible
            const element = document.getElementById(`run-${filteredRuns[currentIndex - 1].id}`);
            element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (currentIndex < filteredRuns.length - 1) {
            onSelectRun(filteredRuns[currentIndex + 1]);
            // Ensure the selected run is visible
            const element = document.getElementById(`run-${filteredRuns[currentIndex + 1].id}`);
            element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredRuns, selectedRun, onSelectRun]);

  const fetchWorkflowRuns = useCallback(async (pageNum: number) => {
    if (!owner || !repo) return;

    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const runsData: WorkflowRunsResponse = await api.getWorkflowRuns(owner, repo, pageNum);
      
      if (pageNum === 1) {
        setRuns(runsData.workflow_runs || []);
      } else {
        setRuns(prev => [...prev, ...(runsData.workflow_runs || [])]);
      }

      setHasMore(runsData.workflow_runs?.length === 30);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch workflow runs:', err);
      setError('Failed to load workflow runs. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [owner, repo]);

  // Fetch runs when page changes
  useEffect(() => {
    if (page > 1) {
      fetchWorkflowRuns(page);
    }
  }, [page, fetchWorkflowRuns]);

  // Initial fetch
  useEffect(() => {
    fetchWorkflowRuns(1);
  }, [fetchWorkflowRuns]);

  // Track initial render
  const isInitialSelectRef = useRef(true);
  
  // Auto-select latest run
  useEffect(() => {
    // If we already have a selected run, don't do anything
    if (selectedRun) {
      return;
    }
    
    if (runs.length > 0) {
      const latestRun = showSuccessOnly 
        ? runs.find(run => run.conclusion === 'success')
        : runs[0];
      
      if (latestRun) {
        // On initial render, use a workaround to avoid page scrolling
        if (isInitialSelectRef.current) {
          isInitialSelectRef.current = false;
          // Use a timeout to avoid immediate navigation which can cause scrolling
          setTimeout(() => {
            onSelectRun(latestRun);
          }, 100);
        } else {
          onSelectRun(latestRun);
        }
      }
    }
  }, [runs, selectedRun, onSelectRun, showSuccessOnly]);

  // Filter runs
  useEffect(() => {
    if (showSuccessOnly) {
      setFilteredRuns(runs.filter(run => run.conclusion === 'success'));
    } else {
      setFilteredRuns(runs);
    }
  }, [runs, showSuccessOnly]);

  // Fetch metadata
  useEffect(() => {
    const fetchRunMetadata = async () => {
      if (runs.length === 0) return;
      
      const metadata: {[key: number]: {title: string, issueNumber: number | null}} = {};
      
      const processQueue = async (queue: WorkflowRun[], concurrency = 3) => {
        const results = [];
        const executing = [];
        
        for (const run of queue) {
          const p = (async () => {
            try {
              if (run.conclusion === 'success') {
                const details = await api.getRunDetails(owner, repo, run.id);
                
                if (details.artifacts?.artifacts?.length > 0) {
                  const artifactId = details.artifacts.artifacts[0].id;
                  try {
                    const artifactContent = await api.getArtifactContent(owner, repo, artifactId);
                    const content = artifactContent.content || artifactContent;
                    
                    if (content?.issue) {
                      metadata[run.id] = {
                        title: content.issue.title || 'No Title',
                        issueNumber: content.issue.number || null
                      };
                    } else {
                      metadata[run.id] = {
                        title: run.name || 'Unknown Issue',
                        issueNumber: null
                      };
                    }
                  } catch (error) {
                    metadata[run.id] = {
                      title: run.name || 'Unknown Issue',
                      issueNumber: null
                    };
                  }
                } else {
                  metadata[run.id] = {
                    title: run.name || 'Unknown Issue',
                    issueNumber: null
                  };
                }
              } else {
                metadata[run.id] = {
                  title: run.name || 'Unknown Issue',
                  issueNumber: null
                };
              }
            } catch (error) {
              metadata[run.id] = {
                title: run.name || 'Unknown Issue',
                issueNumber: null
              };
            }
          })();
          
          executing.push(p);
          results.push(p);
          
          if (executing.length >= concurrency) {
            await Promise.race(executing);
          }
        }
        
        await Promise.all(results);
      };
      
      await processQueue(runs);
      setRunMetadata(metadata);
    };
    
    fetchRunMetadata();
  }, [runs, owner, repo]);

  if (loading) {
    return <WorkflowRunsListSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400 dark:text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (runs.length === 0) {
    return (
      <div className="p-6 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No workflow runs</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No workflow runs found for this repository.</p>
      </div>
    );
  }

  return (
    <div className="p-2 h-full flex flex-col">
      <WorkflowRunsHeader
        showSuccessOnly={showSuccessOnly}
        onToggleSuccessOnly={setShowSuccessOnly}
      />

      <div 
        ref={listRef}
        className="flex-grow overflow-y-auto
          scrollbar scrollbar-w-1.5 
          scrollbar-thumb-gray-200/75 dark:scrollbar-thumb-gray-700/75
          scrollbar-track-transparent
          hover:scrollbar-thumb-gray-300/75 dark:hover:scrollbar-thumb-gray-600/75
          scrollbar-thumb-rounded
          pl-1.5 pr-0.5 overflow-x-hidden
          [direction:rtl]"
      >
        <div className="[direction:ltr] py-0.5">
          {filteredRuns.map((run) => (
            <WorkflowRunItem
              key={run.id}
              run={run}
              isSelected={selectedRun?.id === run.id}
              metadata={runMetadata[run.id] || { title: 'Loading...', issueNumber: null }}
              onSelect={onSelectRun}
            />
          ))}

          {loadingMore && (
            <div ref={loadingRef} className="space-y-2 mx-1 mt-2 mb-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 pt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!hasMore && filteredRuns.length > 0 && (
            <div className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
              No more runs to load
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkflowRunsList; 