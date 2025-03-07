
import { TimelineEntry, StepColor } from '../types';
import { FiMessageSquare, FiTerminal, FiEdit3, FiSearch, FiAlertCircle } from 'react-icons/fi';
import { IconType } from 'react-icons';

type StepInfo = {
  stepTitle: string;
  stepIcon: JSX.Element;
  actorType: string;
  stepColor: StepColor;
};

const createIcon = (Icon: IconType) => {
  // @ts-ignore: IconType is difficult to type correctly
  return <Icon className="w-3 h-3" />;
};

export function getStepInfo(entry: TimelineEntry): StepInfo {
  let stepTitle = entry.title || 'Unknown Step';
  let stepIcon = createIcon(FiMessageSquare);
  let actorType = 'Assistant';
  let stepColor: StepColor = 'blue';

  if (entry.type === 'command') {
    stepIcon = createIcon(FiTerminal);
    actorType = 'Command';
    stepColor = 'green';
  } else if (entry.type === 'edit') {
    stepIcon = createIcon(FiEdit3);
    actorType = 'Edit';
    stepColor = 'yellow';
  } else if (entry.type === 'search') {
    stepIcon = createIcon(FiSearch);
    actorType = 'Search';
    stepColor = 'gray';
  } else if (entry.type === 'error') {
    stepIcon = createIcon(FiAlertCircle);
    actorType = 'Error';
    stepColor = 'red';
  }

  return {
    stepTitle,
    stepIcon,
    actorType,
    stepColor,
  };
}