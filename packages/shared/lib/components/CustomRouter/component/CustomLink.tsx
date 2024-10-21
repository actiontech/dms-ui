import { Link, To } from 'react-router-dom';
import { CustomLinkProps, RouteConfig } from '../index.type';
import { forwardRef } from 'react';
import { isCustomRoutePathObject, parse2ReactRouterPath } from '../utils';

const CustomLink = <T extends RouteConfig[keyof RouteConfig]>(
  props: CustomLinkProps<T>,
  ref: React.Ref<HTMLAnchorElement>
) => {
  const { to, values, ...linkProps } = props;
  const formattedPath = isCustomRoutePathObject(to)
    ? parse2ReactRouterPath(to, values)
    : (to as To);

  return <Link {...linkProps} to={formattedPath} ref={ref} />;
};

export default forwardRef(CustomLink) as unknown as <
  T extends RouteConfig[keyof RouteConfig]
>(
  props: React.PropsWithChildren<CustomLinkProps<T>> &
    React.RefAttributes<HTMLAnchorElement>
) => React.ReactElement;
