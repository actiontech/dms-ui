import { RuleObject } from 'antd/es/form';
import { SystemRole } from '../enum';
import { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom';

export type Dictionary = {
  [key: string]: string | number | boolean | Dictionary | string[] | undefined;
};

export type StringDictionary = {
  [key: string]: string;
};

export type ModalStatus = {
  [key: string]: boolean;
};

export type FormValidatorRule = RuleObject['validator'];

export type TemplateKeyPath<T> = {
  [key in keyof T]: key extends string
    ? T[key] extends Record<string, any>
      ? `${key}.${TemplateKeyPath<T[key]>}`
      : key
    : never;
}[keyof T];

export interface IStore {
  [key: string]: any;
}

export type PermissionReduxState = {
  sqlOptimizationIsSupported: boolean;
};

export type ExcludeSymbol<T> = T extends symbol ? never : T;

export type FormValidateError<T> = {
  values: T;
  errorFields: Array<{
    name: string[];
    errors: string[];
    warnings: string[];
  }>;
  outOfDate: boolean;
};
