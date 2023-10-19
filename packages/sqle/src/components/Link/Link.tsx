import { Link } from '@actiontech/shared';
import { CustomLinkProps } from '@actiontech/shared/lib/components/Link';
import { SQLE_BASE_URL } from '@actiontech/shared/lib/data/common';

/**
 * @deprecated 后续会移除该组件, 需要在重构过程中替换会原生 Link
 */
const CustomLink: React.FC<CustomLinkProps> = ({
  baseUrl = SQLE_BASE_URL,
  ...props
}) => {
  return <Link {...props} baseUrl={baseUrl} />;
};

export default CustomLink;
