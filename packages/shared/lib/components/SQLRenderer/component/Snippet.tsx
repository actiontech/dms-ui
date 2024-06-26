import classNames from 'classnames';
import useRenderCopyIcon from '../hooks/useRenderCopyIcon';
import useRenderSQLTemplate from '../hooks/useRenderSQLTemplate';
import { SQLSnippetRendererProps } from '../index.type';
import { SQLRendererStyleWrapper } from '../style';
import { Spin, Typography } from 'antd';
import { tooltipsCommonProps } from '../../BasicToolTips';
import HighlightCode from '../../../utils/HighlightCode';

const Snippet: React.FC<SQLSnippetRendererProps> = ({
  rows = 10,
  tooltip = true,
  paragraph,
  showCopyIcon = false,
  onClick,
  className,
  loading,
  emptySqlContent = '-',
  highlightSyntax = true,
  sql,
  onCopyComplete,
  copyIconClassName
}) => {
  const { renderSQLTemplateContent } = useRenderSQLTemplate({
    showLineNumbers: false,
    sql,
    emptySqlContent,
    highlightSyntax,
    preserveOriginalFormat: false
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
        className={classNames(
          'actiontech-sql-snippet-renderer-wrapper',
          className,
          {
            'copy-icon-hover': showCopyIcon === 'hover'
          }
        )}
        onClick={onClick}
      >
        {sql ? (
          <Typography.Paragraph
            ellipsis={{
              expandable: false,
              tooltip: tooltip
                ? {
                    arrow: false,
                    ...tooltipsCommonProps(renderSQLTemplateContent(), 640)
                  }
                : false,
              rows
            }}
            {...paragraph}
            className={classNames('margin-bottom-0', paragraph?.className)}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: HighlightCode.highlightSql(sql)
              }}
            />
          </Typography.Paragraph>
        ) : (
          <span className="empty-sql-placeholder">{emptySqlContent}</span>
        )}

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

export default Snippet;
