import { useSearchParams } from 'react-router-dom';
import { InferQueriesFromConfig, ObjectRoutePathValue } from '../index.type';
import { parse2ReactRouterPath } from '../utils';
import { useCallback } from 'react';

function useTypedQuery() {
  const [searchParams] = useSearchParams();

  const extractQueries = useCallback(
    <T extends ObjectRoutePathValue>(
      to: T
    ): InferQueriesFromConfig<T> | null => {
      if (!searchParams) {
        return null;
      }
      let queryString = '';
      queryString = parse2ReactRouterPath(to).split('?')?.[1];

      if (!queryString) {
        return null;
      }

      const values: InferQueriesFromConfig<T> = {} as InferQueriesFromConfig<T>;

      queryString.split('&').forEach((key) => {
        (values as Record<string, string | null>)[key] = searchParams.get(key);
      });

      return values;
    },
    [searchParams]
  );

  return extractQueries;
}
export default useTypedQuery;
