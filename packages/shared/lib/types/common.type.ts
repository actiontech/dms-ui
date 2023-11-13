import { RuleObject } from 'antd/es/form';
import { ReactNode } from 'react';
import { RouteObject } from 'react-router-dom';
import { SystemRole } from '../enum';

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

export type RouterConfigItem = RouteObject & {
  label?: string;
  icon?: ReactNode;
  hideInMenu?: boolean;
  key: string;
  children?: RouterConfigItem[];
  role?: Array<SystemRole | ''>;
};
