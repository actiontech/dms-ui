import {
  ActiontechTableActionMeta,
  ActiontechTableActionsConfig,
  ActiontechTableToolbarActionMeta
} from '@actiontech/dms-kit/es/components/ActiontechTable/index.type';
import { PermissionsConstantType } from './permissions';

type ReplacePermissions<T> = Omit<T, 'permissions'> & {
  permissions?: PermissionsConstantType;
};

type ReplaceButtonsPermissions<T> = T extends (...args: any[]) => any
  ? (
      ...args: Parameters<T>
    ) => ReturnType<T> extends Array<infer K>
      ? Array<ReplacePermissions<K>>
      : ReturnType<T>
  : T extends Array<infer K>
  ? Array<ReplacePermissions<K>>
  : T;

// 根据 ActiontechTableActionsConfig 调整内部 permissions 的类型
export type ActiontechTableActionsWithPermissions<
  T = Record<string, any>,
  F = Record<string, any>,
  OtherColumnKeys extends string = never
> =
  | {
      [K in keyof ActiontechTableActionsConfig<
        T,
        F,
        OtherColumnKeys
      >]: K extends 'buttons' | 'moreButtons'
        ? ReplaceButtonsPermissions<
            ActiontechTableActionsConfig<T, F, OtherColumnKeys>[K]
          >
        : ActiontechTableActionsConfig<T, F, OtherColumnKeys>[K];
    }
  | ReplacePermissions<ActiontechTableActionMeta<T>>[];

export type ActiontechTableToolbarActionWithPermissions =
  ReplacePermissions<ActiontechTableToolbarActionMeta>[];

export type CheckActionPermissionOtherValues<T> = {
  record?: T;
  authDataSourceId?: string;
  targetProjectID?: string;
};
