import classNames from 'classnames';
import { PageHeaderProps } from './PageHeader.types';
import { PageHeaderStyleWrapper } from './style';

const PageHeader: React.FC<PageHeaderProps> = ({ title, extra, fixed }) => {
  return (
    <PageHeaderStyleWrapper
      className={classNames('actiontech-page-header-namespace', {
        'fixed-style': fixed
      })}
    >
      <div className="title">{title}</div>
      <div className="extra">{extra}</div>
    </PageHeaderStyleWrapper>
  );
};

export default PageHeader;
