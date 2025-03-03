import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { WorkflowRun, WorkflowRunsResponse } from '../types';
import { api } from '../services/api';
import WorkflowRunsListSkeleton from './loading/WorkflowRunsListSkeleton';

interface WorkflowRunsListProps {
  owner: string;
  repo: string;
  onSelectRun: (run: WorkflowRun) => void;
}

const WorkflowRunsList: React.FC<WorkflowRunsListProps> = ({ owner, repo, onSelectRun }) => {
  const { runId } = useParams();
  
  // Extract selected run ID from URL
  const selectedRunId = runId ? parseInt(runId, 10) : null;
  
  // Track when the runs are loaded to handle scrolling properly
  const [runsLoaded, setRunsLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    console.log('Selected Run ID from URL:', selectedRunId);
    
    // Only attempt to scroll when both selectedRunId and runs are available
    if (selectedRunId && runsLoaded) {
      const scrollToSelectedRun = () => {
        const element = document.getElementById(`run-${selectedRunId}`);
        if (element && listRef.current) {
          // Add a highlight animation and scroll to ensure visibility
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Add a brief flash animation to draw attention
          element.classList.add('animate-highlight');
          setTimeout(() => {
            element.classList.remove('animate-highlight');
          }, 1500);
        }
      };
      
      // Attempt scroll after a delay to ensure DOM is ready
      setTimeout(scrollToSelectedRun, 300);
      
      // Try again after a longer delay as fallback
      setTimeout(scrollToSelectedRun, 1000);
    }
  }, [selectedRunId, runsLoaded]);

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

  // Reference to track the last selected run ID from keyboard navigation
  const lastKeyboardSelectedRef = useRef<number | null>(null);
  
  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!filteredRuns.length || !selectedRunId) return;

      const currentIndex = filteredRuns.findIndex(run => run.id === selectedRunId);
      if (currentIndex === -1) return;

      switch (event.key) {
        case 'ArrowUp':
          if (currentIndex > 0) {
            event.preventDefault();
            const nextRunId = filteredRuns[currentIndex - 1].id;
            
            // Only select if different from current or last keyboard selection
            if (nextRunId !== selectedRunId && nextRunId !== lastKeyboardSelectedRef.current) {
              lastKeyboardSelectedRef.current = nextRunId;
              onSelectRun(filteredRuns[currentIndex - 1]);
              // Ensure the selected run is visible
              const element = document.getElementById(`run-${nextRunId}`);
              element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }
          break;
        case 'ArrowDown':
          if (currentIndex < filteredRuns.length - 1) {
            event.preventDefault();
            const nextRunId = filteredRuns[currentIndex + 1].id;
            
            // Only select if different from current or last keyboard selection
            if (nextRunId !== selectedRunId && nextRunId !== lastKeyboardSelectedRef.current) {
              lastKeyboardSelectedRef.current = nextRunId;
              onSelectRun(filteredRuns[currentIndex + 1]);
              // Ensure the selected run is visible
              const element = document.getElementById(`run-${nextRunId}`);
              element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredRuns, selectedRunId, onSelectRun]);

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

      // Check if there are more pages
      setHasMore(runsData.workflow_runs?.length === 30); // Assuming 30 is the page size
      setError(null);
    } catch (err) {
      console.error('Failed to fetch workflow runs:', err);
      setError('Failed to load workflow runs. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRunsLoaded(true);
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

  // Reference to track if auto-selection has been done
  const autoSelectDoneRef = useRef(false);
  
  // Separate effect for auto-selecting the latest run - only if no run is specified in URL
  useEffect(() => {
    // Only auto-select if all these conditions are met:
    // 1. We have runs available
    // 2. No run ID is in the URL
    // 3. We haven't already auto-selected (prevents loops)
    if (runs.length > 0 && !selectedRunId && !autoSelectDoneRef.current) {
      // Mark that we've done auto-selection for this session
      autoSelectDoneRef.current = true;
      
      // Get the first run (latest) that matches the filter if showSuccessOnly is true
      const latestRun = showSuccessOnly 
        ? runs.find(run => run.conclusion === 'success')
        : runs[0];
      
      if (latestRun) {
        console.log('Auto-selecting latest run:', latestRun.id);
        onSelectRun(latestRun);
      }
    }
  }, [runs, selectedRunId, onSelectRun, showSuccessOnly]);

  // Filter runs when showSuccessOnly or runs change
  useEffect(() => {
    if (showSuccessOnly) {
      setFilteredRuns(runs.filter(run => run.conclusion === 'success'));
    } else {
      setFilteredRuns(runs);
    }
  }, [runs, showSuccessOnly]);

  // Fetch artifact metadata for each run
  useEffect(() => {
    const fetchRunMetadata = async () => {
      if (runs.length === 0) return;
      
      const metadata: {[key: number]: {title: string, issueNumber: number | null}} = {};
      
      // Create a queue to process runs in parallel but with a limit
      const processQueue = async (queue: WorkflowRun[], concurrency = 3) => {
        const results = [];
        const executing = [];
        
        for (const run of queue) {
          const p = (async () => {
            try {
              // Only fetch details for completed runs
              if (run.conclusion === 'success') {
                const details = await api.getRunDetails(owner, repo, run.id);
                
                // Check if there are artifacts
                if (details.artifacts?.artifacts?.length > 0) {
                  // Get the first artifact for metadata
                  const artifactId = details.artifacts.artifacts[0].id;
                  try {
                    const artifactContent = await api.getArtifactContent(owner, repo, artifactId);
                    
                    // Check if there's issue data
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
                    console.error('Error fetching artifact content', error);
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
              console.error('Error processing run', error);
              metadata[run.id] = {
                title: run.name || 'Unknown Issue',
                issueNumber: null
              };
            }
          })();
          
          // Add the promise to the executing array
          executing.push(p);
          results.push(p);
          
          // If we've reached concurrency limit, wait for one to finish
          if (executing.length >= concurrency) {
            await Promise.race(executing);
          }
        }
        
        // Wait for all to finish
        await Promise.all(results);
      };
      
      // Process all runs
      await processQueue(runs);
      setRunMetadata(metadata);
    };
    
    fetchRunMetadata();
  }, [runs, owner, repo]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500';
      case 'failure':
        return 'bg-red-500';
      case 'cancelled':
        return 'bg-orange-500';
      case 'in_progress':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="p-2">
        <div className="flex items-center justify-between px-2 py-2 mb-3">
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-6 w-11 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
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
                <div className="flex-shrink-0 self-center">
                  <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loading && !loadingMore && runs.length === 0) {
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
    <div className="p-2">
      <div className="flex items-center justify-between px-2 py-2 mb-3">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Workflow Runs
        </h2>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showSuccessOnly}
            onChange={(e) => setShowSuccessOnly(e.target.checked)}
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
            Success only
          </span>
        </label>
      </div>

      <div 
        ref={listRef}
        className="max-h-[calc(100vh-16rem)] overflow-y-auto
          scrollbar scrollbar-w-1.5 
          scrollbar-thumb-gray-200/75 dark:scrollbar-thumb-gray-700/75
          scrollbar-track-transparent
          hover:scrollbar-thumb-gray-300/75 dark:hover:scrollbar-thumb-gray-600/75
          scrollbar-thumb-rounded
          pl-1.5 pr-0.5 overflow-x-hidden
          [direction:rtl]"
      >
        <div className="[direction:ltr] py-0.5">
          {filteredRuns.map((run, index) => {
            console.log(`Comparing run ${run.id} with selected ${selectedRunId}`, run.id === selectedRunId);
            return (
              <div
                key={run.id}
                id={`run-${run.id}`}
                className={`py-1 px-2 rounded-lg transition-all duration-200 cursor-pointer relative
                  ${index !== filteredRuns.length - 1 ? 'mb-3' : ''}
                  ${selectedRunId === run.id 
                    ? 'bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500 ring-inset border-transparent shadow-sm' 
                    : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
                  }`}
                onClick={() => {
                  // Only trigger selection if this isn't already the selected run
                  if (run.id !== selectedRunId) {
                    console.log('Selecting run', run.id);
                    onSelectRun(run);
                    // Dispatch a custom event when a new run is selected
                    window.dispatchEvent(new CustomEvent('workflowRunSelected', { detail: { runId: run.id } }));
                  }
                }}
              >
                <div className="flex items-start gap-1.5">
                  <div className="flex-shrink-0 pt-[2px]">
                    <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor(run.conclusion || run.status)}`}></div>
                  </div>
                  {/* Left border indicator for selected run */}
                  {selectedRunId === run.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg"></div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <h3 className={`text-sm ${selectedRunId === run.id ? 'font-semibold' : 'font-medium'} text-gray-900 dark:text-white truncate`}>
                        {runMetadata[run.id]?.title || 'Loading...'}
                      </h3>
                      {runMetadata[run.id]?.issueNumber && (
                        <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800">
                          #{runMetadata[run.id].issueNumber}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        Run #{run.run_number}
                      </span>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <time className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(run.created_at)}
                      </time>
                      {run.run_attempt > 1 && (
                        <>
                          <span className="text-gray-300 dark:text-gray-600">•</span>
                          <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                            Attempt #{run.run_attempt}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 self-center">
                    <svg className="h-3.5 w-3.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}

          {loadingMore && (
            <div ref={loadingRef} className="py-4">
              <div className="space-y-2 mx-1">
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