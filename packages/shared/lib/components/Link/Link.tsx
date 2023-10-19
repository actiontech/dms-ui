import { Link } from 'react-router-dom';
import { CustomLinkProps } from '.';

/**
 * @deprecated 后续会移除该组件, 需要在重构过程中替换会原生 Link
 */
const CustomLink: React.FC<CustomLinkProps> = ({ to, baseUrl, ...props }) => {
  if (!baseUrl) {
    //default mode
    return <Link to={to} {...props} />;
  }

  let path = to;
  if (typeof to === 'string') {
    path = to.startsWith(baseUrl) ? to : `${baseUrl}${to}`;
  } else {
    path = {
      ...to,
      pathname: to.pathname
        ? to.pathname.startsWith(baseUrl)
          ? to.pathname
          : `${baseUrl}${to.pathname}`
        : undefined
    };
  }
  return <Link {...props} to={path} />;
};

export default CustomLink;
