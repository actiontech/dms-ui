import { LinkProps, To } from 'react-router-dom';

export type ObjectRoutePathValue = {
  prefix?: string;
  path: string;
};

export type RoutePathValue = To | ObjectRoutePathValue;

export type RouteConfig = {
  [key: string]: string | ObjectRoutePathValue | RouteConfig;
};

// 提取路径中的参数
type ExtractParams<T extends string> = string extends T
  ? Record<string, string>
  : T extends `${infer _}:${infer Param}/${infer Rest}`
  ? { [K in Param | keyof ExtractParams<Rest>]: string }
  : T extends `${infer _}:${infer Param}`
  ? { [K in Param]: string }
  : unknown;

// 合并前缀和路径中的参数
type MergeParams<T extends ObjectRoutePathValue> = T['prefix'] extends string
  ? ExtractParams<T['prefix']> & ExtractParams<T['path']>
  : ExtractParams<T['path']>;

// 根据路由配置提取参数类型
export type InferParamsFromConfig<T> = T extends ObjectRoutePathValue
  ? MergeParams<T>
  : T extends RouteConfig
  ? { [K in keyof T]: InferParamsFromConfig<T[K]> }[keyof T]
  : never;

export type CustomLinkProps<T extends RouteConfig[keyof RouteConfig]> = Omit<
  LinkProps,
  'to'
> & {
  to: T | To;
  values?: InferParamsFromConfig<T>;
};
