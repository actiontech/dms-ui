import { PopconfirmProps, SpaceProps } from 'antd';
import { IBasicButton } from '../BasicButton';
import { Key, ReactNode } from 'react';
import { IBasicToolTips } from '../BasicToolTips';
import { RoutePathValue, TypedLinkProps } from '../TypedRouter';

type ActionButtonBase = Omit<IBasicButton, 'children'> & {
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
  tooltip: IBasicToolTips;
};

export type ActionButtonProps<T extends RoutePathValue = string> =
  | (ActionButtonBase & ActionButtonWithNavigateLink<T>)
  | (ActionButtonBase & ActionBUttonWithConfirm)
  | (ActionButtonBase & ActionButtonWithTooltip)
  | (ActionButtonBase & ActionButtonWithNormal);

export type ActionButtonGroupProps<T extends RoutePathValue> = {
  actions: Array<ActionButtonProps<T> & { key: Key }>;
} & SpaceProps;
