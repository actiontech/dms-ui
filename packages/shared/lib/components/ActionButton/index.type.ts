import { PopconfirmProps, SpaceProps, TooltipProps } from 'antd';
import { IBasicButton } from '../BasicButton';
import { LinkProps } from 'react-router-dom';
import { Key, ReactNode } from 'react';

type ActionButtonBase = Omit<IBasicButton, 'children'> & {
  text?: ReactNode;
};

type ActionButtonWithNormal = {
  actionType?: never;
};

type ActionButtonWithNavigateLink = {
  actionType: 'navigate-link';
  link: LinkProps;
};

type ActionBUttonWithConfirm = {
  actionType: 'confirm';
  confirm: PopconfirmProps;
};

type ActionButtonWithTooltip = {
  actionType: 'tooltip';
  tooltip: TooltipProps;
};

export type ActionButtonProps =
  | (ActionButtonBase & ActionButtonWithNavigateLink)
  | (ActionButtonBase & ActionBUttonWithConfirm)
  | (ActionButtonBase & ActionButtonWithTooltip)
  | (ActionButtonBase & ActionButtonWithNormal);

export type ActionButtonGroupProps = {
  actions: Array<ActionButtonProps & { key: Key }>;
} & SpaceProps;
