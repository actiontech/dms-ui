import {
  NavigateTypedOptions,
  ObjectRoutePathValue,
  RoutePathValue,
  TypedLinkProps
} from './index.type';

const errorLogger = (msg: string) => {
  // #if [PROD]
  // eslint-disable-next-line no-console
  console.error(msg);
  // #elif [DEV]
  throw new Error(msg);
  // #endif
};

export const formatPath = (
  path: string,
  values: Record<string, string>
): string => {
  if (typeof values !== 'object' || values === null) {
    errorLogger('Value must be a non-null object');
  }

  const [basePath, queryString] = path.split('?');

  const formattedBasePath = basePath.replace(/:([\w]+)/g, (_, key) => {
    if (!(key in values)) {
      errorLogger(`Missing value for parameter "${key}" in path`);
    }
    const paramValue = values[key];
    if (paramValue === null || paramValue === undefined) {
      errorLogger(`Value for parameter "${key}" cannot be null or undefined`);
    }

    return String(paramValue);
  });

  if (!queryString) {
    return formattedBasePath;
  }
  const formattedQueryParams = queryString
    .split('&')
    .map((paramName) => {
      if (paramName in values) {
        const paramValue = values[paramName];
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

export const parse2ReactRouterPath = (
  to: ObjectRoutePathValue,
  values?: Record<string, string>
): string => {
  const { prefix, path, query } = to;
  let fullPath = prefix ? `${prefix}/${path}` : path;
  if (query) {
    fullPath = `${fullPath}?${query}`;
  }

  if (!values) {
    return fullPath;
  }
  return formatPath(fullPath, values);
};

export const isCustomRoutePathObject = (
  to: RoutePathValue
): to is ObjectRoutePathValue => {
  if (typeof to === 'string') {
    return false;
  }

  if ('pathname' in to) {
    return false;
  }

  if ('path' in to) {
    return true;
  }
  return false;
};

export const getFormatPathValues = <T extends RoutePathValue>(
  options: TypedLinkProps<T> | NavigateTypedOptions<T>
) => {
  let values: Record<string, string> | undefined;
  if ('params' in options) {
    const params = options.params;
    values = { ...params };
  }

  if ('queries' in options) {
    const queries = options.queries ?? {};
    values = values ? { ...values, ...queries } : { ...queries };
  }

  return values;
};
