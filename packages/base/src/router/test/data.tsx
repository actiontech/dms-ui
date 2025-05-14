import { RouteObject, useRoutes, Outlet } from 'react-router-dom';
import { RouterConfigItem } from '@actiontech/shared/lib/types/common.type';
import { AuthRouterConfig, unAuthRouterConfig } from '../router';

const routeData = {
  auth: AuthRouterConfig,
  unAuth: unAuthRouterConfig
};

type typeMockRouteCate = keyof typeof routeData;

// todo: 期望单元测试不是用侵入式修改 route 数据的方式测试整个 route
const generateLazyElement = (route: any): RouterConfigItem => {
  const { children, element, ...rest } = route;
  if (children) {
    return {
      key: rest?.key ?? rest.path,
      path: rest.path,
      element:
        element || children[0].index ? (
          <div data-test-parent-id={rest?.key ?? rest.path}>
            <Outlet />
          </div>
        ) : undefined,
      children: children.map((item: RouterConfigItem) =>
        generateLazyElement(item)
      )
    };
  } else {
    const { key, path } = route;
    const content = key === '*' ? `${JSON.stringify(route)}` : key ?? path;
    return {
      key,
      path: path ?? '',
      element: <div key={`key-${key}`}>{content}</div>
    };
  }
};

export const mockUseRoutes = (type: typeMockRouteCate) => {
  const processedRoutes = routeData[type].map(
    (route: RouterConfigItem | RouteObject) => {
      return generateLazyElement(route);
    }
  );

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
