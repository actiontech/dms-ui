import { NavigateFunction } from '@actiontech/shared';
import { ReactNode } from 'react';

export type UserDevopsStepsFactory = Array<{
  key: string;
  title: string;
  icon: ReactNode;
  children: UserDevopsStepChildren[];
}>;

export type UserDevopsStepChildren = {
  key: string;
  title: string;
  content: string;
  buttons?: UserDevopsStepButtonItem[];
};

export type UserDevopsStepButtonItem = {
  key?: string;
  label: string;
  action: () => void;
};

export type DevopsStepsProps = {
  navigate: NavigateFunction;
  projectID: string;
  iconColor?: string;
  setOpenRulePageProjectSelectorModal?: (v: boolean) => void;
};
