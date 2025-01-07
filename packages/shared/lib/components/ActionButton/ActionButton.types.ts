import { PopconfirmProps, SpaceProps } from 'antd';
import { BasicButtonProps } from '../BasicButton';
import { Key, ReactNode } from 'react';
import { RoutePathValue, TypedLinkProps } from '../TypedRouter';
import { BasicTooltipProps } from '../BasicToolTip';

type ActionButtonBase = Omit<BasicButtonProps, 'children'> & {
  text?: ReactNode;
};

type ActionButtonWithNormal = {
  actionType?: never;
};

type ActionButtonWithNavigateLink<T extends RoutePathValue> = {
  actionType: 'navigate-link';
  link: TypedLinkProps<T>;
};

type ActionBUttonWithConfirm = {
  actionType: 'confirm';
  confirm: PopconfirmProps;
};

type ActionButtonWithTooltip = {
  actionType: 'tooltip';
  tooltip: BasicTooltipProps;
};

export type ActionButtonProps<T extends RoutePathValue = string> =
  | (ActionButtonBase & ActionButtonWithNavigateLink<T>)
  | (ActionButtonBase & ActionBUttonWithConfirm)
  | (ActionButtonBase & ActionButtonWithTooltip)
  | (ActionButtonBase & ActionButtonWithNormal);

export type ActionButtonGroupProps<T extends RoutePathValue> = {
  actions: Array<ActionButtonProps<T> & { key: Key }>;
} & SpaceProps;
