import { RouteObject, useRoutes, Outlet } from 'react-router-dom';
import { AuthRouterConfig, unAuthRouterConfig } from '../router';
import { BaseRouterConfig } from '../router.base';

const routeData = {
  base: BaseRouterConfig,
  sqle: AuthRouterConfig,
  unAuth: unAuthRouterConfig
};

type typeMockRouteCate = keyof typeof routeData;

/**
  todo: 筛选数据 毕竟这个数据是给 menu 用的
  index: true
  有 children 且 element 不为空的
  重定向的

  还需要一个全部的 route 数据快照
 */
const generateLazyElement = (route: any) => {
  const { children, element, ...rest } = route;
  if (children) {
    return {
      ...rest,
      element:
        element || children[0].index ? (
          <div data-test-parent-id={rest.key}>
            <Outlet />
          </div>
        ) : undefined,
      children: children.map((item) => generateLazyElement(item))
    };
  } else {
    const { key, path } = route;
    return {
      key,
      path,
      element: <div key={`key-${key}`}>{key ?? path}</div>
    };
  }
};

const mockUseRoutes = (type: typeMockRouteCate) => {
  const processedRoutes = routeData[type].map((route) => {
    const { children, ...rest } = route;
    if (children) {
      return {
        ...rest,
        children: children.map((item) => generateLazyElement(item))
      };
    } else {
      return generateLazyElement(route);
    }
  });
  return processedRoutes;
};

export const RenderRouterComponent = ({
  type
}: {
  type: typeMockRouteCate;
}) => {
  const data = mockUseRoutes(type) as RouteObject[];
  return useRoutes(data);
};

export default mockUseRoutes;
