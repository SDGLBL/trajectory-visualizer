import React, { useEffect, useState, useRef } from 'react';
import { Repository } from '../types';
import { api } from '../services/api';

interface RepositorySelectorProps {
  onSelectRepository: (owner: string, repo: string) => void;
}

const RepositorySelector: React.FC<RepositorySelectorProps> = ({ onSelectRepository }) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter repositories based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRepos(repositories);
      return;
    }
    
    const query = searchQuery.toLowerCase().trim();
    const filtered = repositories.filter(repo => 
      repo.full_name.toLowerCase().includes(query) || 
      repo.description?.toLowerCase().includes(query)
    );
    
    setFilteredRepos(filtered);
  }, [searchQuery, repositories]);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setLoading(true);
        const repos = await api.getRepositories();
        setRepositories(repos);
        setFilteredRepos(repos);
        
        // Handle saved repository after fetching repos
        const savedRepo = localStorage.getItem('selected_repository');
        if (savedRepo) {
          // Only set the selected repo if it exists in the fetched repos
          if (repos.some((repo: Repository) => repo.full_name === savedRepo)) {
            setSelectedRepo(savedRepo);
            const [owner, repo] = savedRepo.split('/');
            onSelectRepository(owner, repo);
          } else {
            // If saved repo no longer exists, clear it from localStorage
            localStorage.removeItem('selected_repository');
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Failed to fetch repositories:', err);
        setError('Failed to load repositories. Please check your GitHub token.');
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, [onSelectRepository]);

  const handleRepoSelect = (fullName: string) => {
    setSelectedRepo(fullName);
    setSearchQuery(''); // Clear search query after selection
    setIsOpen(false);

    if (fullName) {
      const [owner, repo] = fullName.split('/');
      onSelectRepository(owner, repo);
      localStorage.setItem('selected_repository', fullName);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    
    // Open dropdown when typing
    if (!isOpen && e.target.value.trim() !== '') {
      setIsOpen(true);
    }
  };
  
  const handleInputClick = () => {
    setIsOpen(true);
    // Focus input when clicking on the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (loading) {
    return (
      <div className="relative w-[300px]">
        <button
          type="button"
          className="relative w-full bg-white dark:bg-gray-800 pl-3 pr-10 py-2 text-left border border-gray-300 dark:border-gray-600 rounded-md shadow-sm cursor-not-allowed"
          disabled
        >
          <span className="flex items-center">
            <span className="block truncate text-gray-500 dark:text-gray-400">Loading repositories...</span>
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <div className="animate-spin h-5 w-5 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 rounded-full" />
          </span>
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-[300px]">
        <div className="relative w-full bg-red-50 dark:bg-red-900/10 px-3 py-2 text-left border border-red-300 dark:border-red-800/30 rounded-md">
          <span className="flex items-center">
            <svg className="h-5 w-5 text-red-400 dark:text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="block truncate text-sm text-red-700 dark:text-red-400">{error}</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-[300px]" ref={dropdownRef}>
      <div
        className="relative w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:border-gray-400 dark:hover:border-gray-500 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 cursor-text"
        onClick={handleInputClick}
      >
        <input
          ref={inputRef}
          type="text"
          className="w-full pl-3 pr-10 py-2 text-gray-900 dark:text-gray-100 bg-transparent border-none focus:outline-none focus:ring-0"
          placeholder={selectedRepo || 'Search repositories...'}
          value={searchQuery}
          onChange={handleSearchChange}
          onClick={() => setIsOpen(true)}
          autoComplete="off"
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-2">
          {searchQuery ? (
            <button
              type="button"
              className="h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-150 ease-in-out"
              onClick={(e) => {
                e.stopPropagation();
                setSearchQuery('');
                if (inputRef.current) inputRef.current.focus();
              }}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          ) : (
            <svg
              className={`h-5 w-5 text-gray-400 dark:text-gray-500 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
            >
              <path d="M7 7l3 3 3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-900/30 max-h-60 rounded-md py-1 text-base ring-1 ring-black dark:ring-gray-700 ring-opacity-5 dark:ring-opacity-20 overflow-auto focus:outline-none sm:text-sm">
          {loading ? (
            <div className="py-2 px-3 text-center">
              <div className="inline-block animate-spin h-5 w-5 border-2 border-gray-300 dark:border-gray-600 border-t-blue-500 dark:border-t-blue-400 rounded-full mr-2" />
              <span className="text-gray-500 dark:text-gray-400">Loading repositories...</span>
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="relative cursor-default select-none py-2 px-3 text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No matching repositories found' : 'No repositories found'}
            </div>
          ) : (
            filteredRepos.map((repo) => (
              <div
                key={repo.id}
                className={`
                  cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50 dark:hover:bg-gray-700/50
                  ${selectedRepo === repo.full_name 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-200' 
                    : 'text-gray-900 dark:text-gray-200'}
                `}
                onClick={() => handleRepoSelect(repo.full_name)}
              >
                <div className="flex flex-col">
                  <span className="block truncate font-medium">
                    {repo.full_name}
                  </span>
                  {repo.description && (
                    <span className="block truncate text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {repo.description}
                    </span>
                  )}
                </div>
                {selectedRepo === repo.full_name && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600 dark:text-blue-400">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default RepositorySelector; 