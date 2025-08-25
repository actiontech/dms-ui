import { PermissionsConstantType } from '../features';
import { SystemRole } from '@actiontech/dms-kit';
import { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom';

export type {
  Dictionary,
  StringDictionary,
  ModalStatus,
  FormValidatorRule,
  TemplateKeyPath,
  IStore,
  PermissionReduxState,
  ExcludeSymbol,
  FormValidateError
} from '@actiontech/dms-kit/src/types/common.type';

type BaseRouterConfigItem = {
  key: string;
  children?: RouterConfigItem[];
  permission?: PermissionsConstantType;
  role?: Array<SystemRole>;
};

export type RouterConfigItem =
  | (Omit<IndexRouteObject, 'children'> &
      BaseRouterConfigItem & {
        children?: RouterConfigItem[];
      })
  | (Omit<NonIndexRouteObject, 'children'> &
      BaseRouterConfigItem & {
        children?: RouterConfigItem[];
      });
