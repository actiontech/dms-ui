import { PopconfirmProps, SpaceProps } from 'antd';
import { Key, ReactNode } from 'react';
import { BasicButtonProps } from '../BasicButton';
import { BasicTooltipProps } from '../BasicToolTip';

type ActionButtonBase = Omit<BasicButtonProps, 'children'> & {
  text?: ReactNode;
};

type ActionButtonWithNormal = {
  actionType?: never;
};

type ActionBUttonWithConfirm = {
  actionType: 'confirm';
  confirm: PopconfirmProps;
};

type ActionButtonWithTooltip = {
  actionType: 'tooltip';
  tooltip: BasicTooltipProps;
};

export type ActionButtonProps =
  | (ActionButtonBase & ActionBUttonWithConfirm)
  | (ActionButtonBase & ActionButtonWithTooltip)
  | (ActionButtonBase & ActionButtonWithNormal);

export type ActionButtonGroupProps = {
  actions: Array<ActionButtonProps & { key: Key }>;
} & SpaceProps;
