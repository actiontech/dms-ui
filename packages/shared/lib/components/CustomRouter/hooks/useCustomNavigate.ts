import {
  NavigateOptions,
  To,
  useNavigate as useRouterNavigate
} from 'react-router-dom';
import { isCustomRoutePathObject, parse2ReactRouterPath } from '../utils';
import { InferParamsFromConfig, RouteConfig } from '../index.type';

const useCustomNavigate = () => {
  const navigate = useRouterNavigate();

  return <T extends RouteConfig[keyof RouteConfig]>(
    to: T,
    options?: NavigateOptions & { values?: InferParamsFromConfig<T> }
  ) => {
    const { values } = options ?? {};
    const formattedPath = isCustomRoutePathObject(to)
      ? parse2ReactRouterPath(to, values)
      : (to as To);
    navigate(formattedPath, options);
  };
};

export default useCustomNavigate;
