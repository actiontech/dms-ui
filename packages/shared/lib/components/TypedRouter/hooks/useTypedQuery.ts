import { useSearchParams } from 'react-router-dom';
import { InferQueriesFromConfig, ObjectRoutePathValue } from '../index.type';
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

      if (!to.query) {
        return null;
      }

      const values: InferQueriesFromConfig<T> = {} as InferQueriesFromConfig<T>;

      to.query.split('&').forEach((key) => {
        (values as Record<string, string | null>)[key] = searchParams.get(key);
      });

      return values;
    },
    [searchParams]
  );

  return extractQueries;
}
export default useTypedQuery;
