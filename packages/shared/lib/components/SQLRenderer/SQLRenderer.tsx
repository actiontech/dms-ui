import classNames from 'classnames';
import { SQLRendererProps } from './index.type';
import { SQLRendererStyleWrapper } from './style';
import { Spin } from 'antd';
import useRenderSQLTemplate from './hooks/useRenderSQLTemplate';
import useRenderCopyIcon from './hooks/useRenderCopyIcon';

const SQLRenderer: React.FC<SQLRendererProps> = (props) => {
  const { renderSQLTemplateContent } = useRenderSQLTemplate(props);
  const { renderCopyIcon } = useRenderCopyIcon(props);
  const { showCopyIcon, onClick, className, loading } = props;

  const render = () => {
    const content = (
      <SQLRendererStyleWrapper
        className={classNames('actiontech-sql-renderer-wrapper', className, {
          'copy-icon-hover': showCopyIcon === 'hover'
        })}
        onClick={onClick}
      >
        {renderSQLTemplateContent()}
        {renderCopyIcon()}
      </SQLRendererStyleWrapper>
    );
    if (typeof loading === 'boolean') {
      return (
        <Spin spinning={loading} delay={600}>
          {content}
        </Spin>
      );
    }

    return content;
  };

  return render();
};

export default SQLRenderer;
