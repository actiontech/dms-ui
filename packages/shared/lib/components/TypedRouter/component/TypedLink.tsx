import { Link, To } from 'react-router-dom';
import {
  TypedLinkProps,
  RoutePathValue,
  ObjectRoutePathValue
} from '../index.type';
import { forwardRef } from 'react';
import {
  getFormatPathValues,
  isCustomRoutePathObject,
  parse2ReactRouterPath
} from '../utils';

const TypedLink = <T extends RoutePathValue>(
  props: TypedLinkProps<T>,
  ref: React.Ref<HTMLAnchorElement>
) => {
  if (isCustomRoutePathObject(props.to)) {
    const values = getFormatPathValues(
      props as TypedLinkProps<ObjectRoutePathValue>
    );
    if ('params' in props && 'queries' in props) {
      const { to, params, queries, ...linkProps } = props;
      return (
        <Link {...linkProps} to={parse2ReactRouterPath(to, values)} ref={ref} />
      );
    }
    if ('params' in props) {
      const { to, params, ...linkProps } = props;
      return (
        <Link {...linkProps} to={parse2ReactRouterPath(to, values)} ref={ref} />
      );
    }
    if ('queries' in props) {
      const { to, queries, ...linkProps } = props;
      return (
        <Link {...linkProps} to={parse2ReactRouterPath(to, values)} ref={ref} />
      );
    }
    const { to, ...linkProps } = props;
    return (
      <Link {...linkProps} to={parse2ReactRouterPath(to, values)} ref={ref} />
    );
  }

  const { to, ...linkProps } = props;
  return <Link {...linkProps} to={to as To} ref={ref} />;
};

export default forwardRef(TypedLink) as unknown as <T extends RoutePathValue>(
  props: React.PropsWithChildren<TypedLinkProps<T>> &
    React.RefAttributes<HTMLAnchorElement>
) => React.ReactElement;
