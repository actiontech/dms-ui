import {
  ListOpPermissionsOrderByEnum,
  ListOpPermissionsFilterByTargetEnum
} from './index.enum';

import { IListOpPermissionReply } from '../common.d';

export interface IListOpPermissionsParams {
  page_size: number;

  page_index?: number;

  order_by?: ListOpPermissionsOrderByEnum;

  filter_by_target?: ListOpPermissionsFilterByTargetEnum;
}

export interface IListOpPermissionsReturn extends IListOpPermissionReply {}
