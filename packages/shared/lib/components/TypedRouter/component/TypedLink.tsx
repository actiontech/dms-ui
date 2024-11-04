import { Link } from 'react-router-dom';
import { CustomLinkProps, RouteConfig } from '../index.type';
import { forwardRef } from 'react';
import { isCustomRoutePathObject, parse2ReactRouterPath } from '../utils';

const TypedLink = <T extends RouteConfig[keyof RouteConfig]>(
  props: CustomLinkProps<T>,
  ref: React.Ref<HTMLAnchorElement>
) => {
  const { to, ...linkProps } = props;
  if (isCustomRoutePathObject(to)) {
    if ('values' in props) {
      const { values } = props;
      return (
        <Link {...linkProps} to={parse2ReactRouterPath(to, values)} ref={ref} />
      );
    }
    return <Link {...linkProps} to={parse2ReactRouterPath(to)} ref={ref} />;
  }
  return <Link {...linkProps} to={to} ref={ref} />;
};

export default forwardRef(TypedLink) as unknown as <
  T extends RouteConfig[keyof RouteConfig]
>(
  props: React.PropsWithChildren<CustomLinkProps<T>> &
    React.RefAttributes<HTMLAnchorElement>
) => React.ReactElement;
