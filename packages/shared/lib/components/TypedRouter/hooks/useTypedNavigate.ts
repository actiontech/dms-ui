import {
  NavigateOptions,
  To,
  useNavigate as useRouterNavigate
} from 'react-router-dom';
import { isCustomRoutePathObject, parse2ReactRouterPath } from '../utils';
import { InferParamsFromConfig, RouteConfig } from '../index.type';

const useTypedNavigate = () => {
  const innerNavigate = useRouterNavigate();

  function navigate(delta: number): void;
  function navigate<T extends RouteConfig[keyof RouteConfig]>(
    to: T | To,
    options?: NavigateOptions & { values: InferParamsFromConfig<T> }
  ): void;
  function navigate<T extends RouteConfig[keyof RouteConfig]>(
    to: T | To | number,
    options?: NavigateOptions & { values: InferParamsFromConfig<T> }
  ) {
    const { values } = options ?? {};
    if (typeof to === 'number') {
      innerNavigate(to);
    } else if (isCustomRoutePathObject(to)) {
      innerNavigate(parse2ReactRouterPath(to, values), options);
    } else {
      innerNavigate(to, options);
    }
  }

  return navigate;
};

export default useTypedNavigate;
