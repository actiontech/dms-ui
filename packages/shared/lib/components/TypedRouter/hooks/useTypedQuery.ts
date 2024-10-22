import { useSearchParams } from 'react-router-dom';
import {
  RouteConfig,
  ExtractQueryParams,
  ObjectRoutePathValue
} from '../index.type';
import { isCustomRoutePathObject, parse2ReactRouterPath } from '../utils';

type InferQueryFormConfig<T> = T extends ObjectRoutePathValue
  ? T['query'] extends string
    ? ExtractQueryParams<T['query']>
    : never
  : T extends RouteConfig
  ? { [K in keyof T]: InferQueryFormConfig<T[K]> }[keyof T]
  : never;

function useTypedQuery() {
  const [searchParams] = useSearchParams();

  function extractQuery<T extends RouteConfig[keyof RouteConfig]>(
    to: T
  ): InferQueryFormConfig<T> | null {
    if (!searchParams) {
      return null;
    }
    let queryString = '';
    if (isCustomRoutePathObject(to)) {
      queryString = parse2ReactRouterPath(to).split('?')?.[1];
    } else {
      queryString = to.split('?')?.[1];
    }

    if (!queryString) {
      return null;
    }

    const values: InferQueryFormConfig<T> = {} as InferQueryFormConfig<T>;

    queryString.split('&').forEach((param) => {
      const [key] = param.split('=');
      (values as Record<string, string | null>)[key] = searchParams.get(key);
    });

    return values;
  }

  return extractQuery;
}
export default useTypedQuery;
