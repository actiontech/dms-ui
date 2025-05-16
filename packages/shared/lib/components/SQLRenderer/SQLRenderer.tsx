import classNames from 'classnames';
import { SQLRendererProps } from './SQLRenderer.types';
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
  copyIconClassName,
  wordWrap = false
}) => {
  const { renderSQLTemplateContent } = useRenderSQLTemplate({
    showLineNumbers,
    sql,
    emptySqlContent,
    highlightSyntax,
    preserveOriginalFormat,
    wordWrap
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
          'copy-icon-hover': showCopyIcon === 'hover',
          'word-wrap': wordWrap
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
