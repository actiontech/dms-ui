import {
  InferParamsFromConfig,
  InferQueriesFromConfig,
  NavigateTypedOptions,
  ObjectRoutePathValue,
  RoutePathValue,
  TypedLinkProps
} from '../TypedRouter.types';

type MergeParamsAndQueries<T extends RoutePathValue> = {
  params?: InferParamsFromConfig<T>;
  queries?: InferQueriesFromConfig<T>;
};

const errorLogger = (msg: string) => {
  // #if [PROD]
  // eslint-disable-next-line no-console
  console.error(msg);
  // #else
  throw new Error(msg);
  // #endif
};

export const formatPath = <T extends RoutePathValue>(
  path: string,
  values: MergeParamsAndQueries<T>
): string => {
  if (typeof values !== 'object' || values === null) {
    errorLogger('Value must be a non-null object');
  }
  const { params, queries } = values;

  const [basePath, queryString] = path.split('?');

  const formattedBasePath = !params
    ? basePath
    : basePath.replace(/:([\w]+)/g, (_, key) => {
        if (!(key in params)) {
          errorLogger(`Missing value for parameter "${key}" in path`);
        }
        const paramValue = params[key];
        if (paramValue === null || paramValue === undefined) {
          errorLogger(
            `Value for parameter "${key}" cannot be null or undefined`
          );
        }

        return String(paramValue);
      });

  if (!queryString || !queries) {
    return formattedBasePath;
  }
  const formattedQueryParams = queryString
    .split('&')
    .map((paramName) => {
      if (queries && paramName in queries) {
        const paramValue = (queries as Record<string, string>)[paramName];
        return paramValue ? `${paramName}=${paramValue}` : null;
      }
      return null;
    })
    .filter(Boolean);

  const cleanedQueryString = formattedQueryParams.join('&');

  return cleanedQueryString
    ? `${formattedBasePath}?${cleanedQueryString}`
    : formattedBasePath;
};

export const parse2ReactRouterPath = <T extends ObjectRoutePathValue>(
  to: T,
  values?: MergeParamsAndQueries<T>
): string => {
  const { prefix, path, query } = to;
  let fullPath = prefix
    ? `${prefix}${path.startsWith('/') ? path : `/${path}`}`
    : path;

  if (!values) {
    return fullPath;
  }

  if (query) {
    fullPath = `${fullPath}?${query}`;
  }

  return formatPath(fullPath, values);
};

export function isCustomRoutePathObject(
  to: unknown
): to is ObjectRoutePathValue {
  if (!to) {
    return false;
  }
  if (typeof to === 'string') {
    return false;
  }

  if (typeof to === 'object') {
    if ('pathname' in to) {
      return false;
    }

    if ('path' in to) {
      return true;
    }
  }

  return false;
}

export const getFormatPathValues = <T extends RoutePathValue>(
  options: TypedLinkProps<T> | NavigateTypedOptions<T>
): MergeParamsAndQueries<T> | undefined => {
  let values: MergeParamsAndQueries<T> | undefined;
  if ('params' in options) {
    const params = options.params;
    values = { params };
  }

  if ('queries' in options) {
    const queries = options.queries;
    values = values ? { ...values, queries } : { queries };
  }

  return values;
};
