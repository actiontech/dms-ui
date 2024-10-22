import {
  NavigateOptions,
  To,
  useNavigate as useRouterNavigate
} from 'react-router-dom';
import { isCustomRoutePathObject, parse2ReactRouterPath } from '../utils';
import { InferParamsFromConfig, RouteConfig } from '../index.type';

type NavigateCustomOptions<T> = InferParamsFromConfig<T> extends never
  ? NavigateOptions
  : NavigateOptions & { values: InferParamsFromConfig<T> };
const useTypedNavigate = () => {
  const innerNavigate = useRouterNavigate();

  function navigate(delta: number): void;
  function navigate<T extends RouteConfig[keyof RouteConfig]>(
    to: To | T,
    options?: NavigateCustomOptions<T>
  ): void;
  function navigate<T extends RouteConfig[keyof RouteConfig]>(
    to: T | To | number,
    options?: NavigateCustomOptions<T>
  ) {
    if (typeof to === 'number') {
      innerNavigate(to);
    } else if (isCustomRoutePathObject(to)) {
      if (options && 'values' in options) {
        const { values } = options;
        innerNavigate(parse2ReactRouterPath(to, values), options);
      } else {
        innerNavigate(parse2ReactRouterPath(to), options);
      }
    } else {
      innerNavigate(to, options);
    }
  }

  return navigate;
};

export default useTypedNavigate;
