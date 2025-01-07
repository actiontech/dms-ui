import { LinkProps, NavigateOptions, To } from 'react-router-dom';

export type ObjectRoutePathValue = {
  prefix?: string;
  path: string;
  query?: string;
};

export type RoutePathValue = To | ObjectRoutePathValue;

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
export type ExtractPathQueries<T extends string> = string extends T
  ? Record<string, string | undefined>
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends `${infer Param}&${infer Rest}`
  ? { [K in Param]?: string } & ExtractPathQueries<Rest>
  : T extends `${infer Param}`
  ? { [K in Param]?: string }
  : unknown;

export type InferParamsFromConfig<T> = T extends ObjectRoutePathValue
  ? T['prefix'] extends string
    ? ExtractPathParams<T['prefix']> extends object
      ? ExtractPathParams<T['path']> extends object
        ? ExtractPathParams<T['path']> & ExtractPathParams<T['prefix']>
        : ExtractPathParams<T['prefix']>
      : ExtractPathParams<T['path']> extends object
      ? ExtractPathParams<T['path']>
      : never
    : ExtractPathParams<T['path']> extends object
    ? ExtractPathParams<T['path']>
    : never
  : never;

export type InferQueriesFromConfig<T> = T extends ObjectRoutePathValue
  ? T['query'] extends string
    ? ExtractPathQueries<T['query']> extends object
      ? ExtractPathQueries<T['query']>
      : never
    : never
  : never;

export type TypedLinkProps<T extends RoutePathValue = string> = Omit<
  LinkProps,
  'to'
> &
  (InferParamsFromConfig<T> extends never
    ? InferQueriesFromConfig<T> extends never
      ? {
          to: T | To;
        }
      : { to: T; queries?: InferQueriesFromConfig<T> }
    : InferQueriesFromConfig<T> extends never
    ? {
        to: T | To;
        params: InferParamsFromConfig<T>;
      }
    : {
        to: T | To;
        params: InferParamsFromConfig<T>;
        queries?: InferQueriesFromConfig<T>;
      });

export type NavigateTypedOptions<T> = InferParamsFromConfig<T> extends never
  ? InferQueriesFromConfig<T> extends never
    ? NavigateOptions
    : NavigateOptions & { queries?: InferQueriesFromConfig<T> }
  : InferQueriesFromConfig<T> extends never
  ? NavigateOptions & { params: InferParamsFromConfig<T> }
  : NavigateOptions & {
      params: InferParamsFromConfig<T>;
      queries?: InferQueriesFromConfig<T>;
    };

// todo 遗留 params 存在但 options 为可选参数的问题
export type NavigateFunction = {
  (delta: number): void;
  <T extends RoutePathValue>(
    to: To | T,
    options?: NavigateTypedOptions<T>
  ): void;
};
