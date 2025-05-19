import React from 'react';
import { TrajectoryCard } from "../trajectory-card";
import { CMarkdown } from '../../markdown';
import { QueryCodeIndexObservation } from '../../../types/share';

interface QueryCodeIndexObservationProps {
  observation: QueryCodeIndexObservation;
}

export const QueryCodeIndexObservationComponent: React.FC<QueryCodeIndexObservationProps> = ({ observation }) => {
  const isSuccessful = observation.success !== false;

  // Sanitize content to ensure it's a valid string for the markdown component
  const sanitizeContent = (content: any): string => {
    if (!content) return '';

    // If content is already a string, return it
    if (typeof content === 'string') return content;

    // If content is an array, join it with newlines
    if (Array.isArray(content)) {
      return content
        .filter(item => item !== false && item !== null && item !== undefined)
        .map(item => String(item))
        .join('\n');
    }

    // For other types, convert to string
    return String(content);
  };

  const sanitizedContent = sanitizeContent(observation.content);

  return (
    <TrajectoryCard
      className={isSuccessful ?
        "bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800" :
        "bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800"
      }
      originalJson={observation}
    >
      <TrajectoryCard.Header
        className={isSuccessful ?
          "bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-100" :
          "bg-red-100 dark:bg-red-800/50 text-red-800 dark:text-red-100"
        }
      >
        Code Index Result {isSuccessful ? "" : "(Failed)"}
      </TrajectoryCard.Header>
      <TrajectoryCard.Body>
        <div className="mb-2 font-medium">{observation.message}</div>
        {sanitizedContent && (
          <div className="overflow-auto">
            <CMarkdown>{sanitizedContent}</CMarkdown>
          </div>
        )}
      </TrajectoryCard.Body>
    </TrajectoryCard>
  );
};
