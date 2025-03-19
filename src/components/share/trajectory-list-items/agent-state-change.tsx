import React from 'react';
import { TrajectoryCard } from "../trajectory-card";
import { AgentStateChange } from '../../../types/share';

interface AgentStateChangeProps {
  state: AgentStateChange;
}

export const AgentStateChangeComponent: React.FC<AgentStateChangeProps> = ({ state }) => {
  let stateText = '';
  let thought = '';
  
  if ('args' in state) {
    stateText = state.args.agent_state;
    thought = state.args.thought;
  } else if ('extras' in state) {
    stateText = state.extras.agent_state;
  }
  
  return (
    <TrajectoryCard className="bg-gray-100 dark:bg-gray-800/50">
      <TrajectoryCard.Header className="bg-gray-300 dark:bg-gray-700">Agent State: {stateText}</TrajectoryCard.Header>
      <TrajectoryCard.Body>
        {thought && <div>{thought}</div>}
      </TrajectoryCard.Body>
    </TrajectoryCard>
  );
};