import { PopconfirmProps, SpaceProps, TooltipProps } from 'antd';
import { IBasicButton } from '../../components/BasicButton';
import { LinkProps } from 'react-router-dom';
import { PermissionsConstantType } from '../usePermission';
import { Key } from 'react';

type PermissionControlBase = Omit<IBasicButton, 'children'> & {
  permission: PermissionsConstantType;
  text: string;
};

type PermissionControlWithNormalButton = {
  actionType?: never;
};

type PermissionControlWithLink = {
  actionType: 'navigate-link';
  link: LinkProps;
};

type PermissionControlWithConfirmButton = {
  actionType: 'confirm';
  confirm: PopconfirmProps;
};

type PermissionControlWithTooltipsButton = {
  actionType: 'tooltip';
  tooltip: TooltipProps;
};

export type PermissionControlProps =
  | (PermissionControlBase & PermissionControlWithLink)
  | (PermissionControlBase & PermissionControlWithConfirmButton)
  | (PermissionControlBase & PermissionControlWithTooltipsButton)
  | (PermissionControlBase & PermissionControlWithNormalButton);

export type PermissionControlGroupProps = {
  actions: Array<PermissionControlProps & { key: Key }>;
} & SpaceProps;
