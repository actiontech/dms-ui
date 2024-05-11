import classNames from 'classnames';
import { SQLRendererProps } from './index.type';
import { SQLRendererStyleWrapper } from './style';
import { Spin } from 'antd';
import useRenderSQLTemplate from './hooks/useRenderSQLTemplate';
import useRenderCopyIcon from './hooks/useRenderCopyIcon';

const SQLRenderer: React.FC<SQLRendererProps> = ({
  showCopyIcon = false,
  showLineNumbers = false,
  onClick,
  className,
  loading,
  preserveOriginalFormat = true,
  emptySqlContent = '-',
  highlightSyntax = true,
  sql,
  onCopyComplete,
  copyIconClassName
}) => {
  const { renderSQLTemplateContent } = useRenderSQLTemplate({
    showLineNumbers,
    sql,
    emptySqlContent,
    highlightSyntax,
    preserveOriginalFormat
  });
  const { renderCopyIcon } = useRenderCopyIcon({
    showCopyIcon,
    sql,
    onCopyComplete,
    copyIconClassName
  });

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
