import {
  NavigateOptions,
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
    if (isCustomRoutePathObject(to)) {
      navigate(parse2ReactRouterPath(to, values), options);
    } else {
      navigate(to, options);
    }
  };
};

export default useCustomNavigate;
