import React, { useState } from "react";
import clsx from "clsx";
import { JsonModal } from "./json-modal";

interface TrajectoryTempateProps {
  children: React.ReactNode;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
  originalJson?: any;
}

interface TrajectoryCardType extends React.FC<TrajectoryTempateProps> {
  Header: React.FC<TrajectoryCardHeaderProps>;
  Body: React.FC<TrajectoryCardBodyProps>;
}

export const TrajectoryCard: TrajectoryCardType = ({ children, className, originalJson }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section
      className={clsx(
        "w-full max-w-[1000px] rounded-md shadow-sm text-xs",
        className,
      )}
    >
      {children}
      {originalJson && (
        <>
          <div className="flex justify-end px-2 py-1 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-[10px] text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center"
            >
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Show JSON
            </button>
          </div>
          <JsonModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            data={originalJson}
          />
        </>
      )}
    </section>
  );
};

interface TrajectoryCardHeaderProps {
  children: string;
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
}

const TrajectoryCardHeader: React.FC<TrajectoryCardHeaderProps> = ({ children, className }) => {
  return (
    <div
      className={clsx(
        "rounded-t-md py-1 px-2 font-medium text-[10px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface TrajectoryCardBodyProps {
  children: React.ReactNode;
}

const TrajectoryCardBody: React.FC<TrajectoryCardBodyProps> = ({ children }) => {
  return (
    <div className="p-2 flex flex-col gap-2 overflow-auto">
      {React.Children.map(children, (child, index) => {
        if (typeof child === "string") return <div key={index} className="text-xs">{child}</div>;
        return child;
      })}
    </div>
  );
};

TrajectoryCard.Header = TrajectoryCardHeader;
TrajectoryCard.Body = TrajectoryCardBody;