import { LinkProps } from 'react-router-dom';
import Link from './Link';
export type CustomLinkProps = LinkProps &
  React.RefAttributes<HTMLAnchorElement> & {
    baseUrl?: string;
  };

export default Link;
