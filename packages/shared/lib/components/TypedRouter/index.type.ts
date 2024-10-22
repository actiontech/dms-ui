import { LinkProps, To } from 'react-router-dom';

export type ObjectRoutePathValue = {
  prefix?: string;
  path: string;
  query?: string;
};

export type RoutePathValue = To | ObjectRoutePathValue;

export type RouteConfig = {
  [key: string]: string | ObjectRoutePathValue;
};

// 提取路径中的参数
type ExtractPathParams<T extends string> = string extends T
  ? Record<string, string>
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends `${infer _}:${infer Param}/${infer Rest}`
  ? { [K in Param | keyof ExtractPathParams<Rest>]: string }
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends `${infer _}:${infer Param}`
  ? { [K in Param]: string }
  : unknown;

// 提取查询参数
export type ExtractQueryParams<T extends string> = string extends T
  ? Record<string, string | undefined>
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends `${infer Param}&${infer Rest}`
  ? { [K in Param]?: string } & ExtractQueryParams<Rest>
  : T extends `${infer Param}`
  ? { [K in Param]?: string }
  : unknown;

type MergeParams<T extends ObjectRoutePathValue> = T['prefix'] extends string
  ? T['query'] extends string
    ? ExtractPathParams<T['prefix']> &
        ExtractPathParams<T['path']> &
        ExtractQueryParams<T['query']>
    : ExtractPathParams<T['prefix']> & ExtractPathParams<T['path']>
  : ExtractPathParams<T['path']>;

export type InferParamsFromConfig<T> = T extends ObjectRoutePathValue
  ? MergeParams<T>
  : never;

export type CustomLinkProps<T extends RouteConfig[keyof RouteConfig]> = Omit<
  LinkProps,
  'to'
> &
  InferParamsFromConfig<T> extends never
  ? {
      to: T | To;
    }
  : {
      to: T | To;
      values: InferParamsFromConfig<T>;
    };
