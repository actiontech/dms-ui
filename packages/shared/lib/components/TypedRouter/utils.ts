import { To } from 'react-router-dom';
import {
  InferParamsFromConfig,
  ObjectRoutePathValue,
  RouteConfig,
  RoutePathValue
} from './index.type';

export const formatPath = <T extends RouteConfig[keyof RouteConfig]>(
  path: string,
  values: InferParamsFromConfig<T>
): string => {
  if (typeof path !== 'string') {
    throw new Error('Path must be a string');
  }

  if (typeof values !== 'object' || values === null) {
    throw new Error('Value must be a non-null object');
  }

  return path.replace(/:([\w]+)/g, (_, key) => {
    if (!(key in values)) {
      throw new Error(`Missing value for parameter "${key}" in path`);
    }

    const paramValue = (values as Record<string, string>)[key];
    if (paramValue === undefined || paramValue === null) {
      throw new Error(
        `Value for parameter "${key}" cannot be null or undefined`
      );
    }

    return String(paramValue);
  });
};

export const parse2ReactRouterPath = <T extends RouteConfig[keyof RouteConfig]>(
  to: ObjectRoutePathValue,
  values?: InferParamsFromConfig<T>
): To => {
  const { prefix, path } = to;

  if (!values) {
    return path;
  }

  if (prefix) {
    return formatPath(`${prefix}/${path}`, values);
  }

  return formatPath(path, values);
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
