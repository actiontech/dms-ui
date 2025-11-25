import classNames from 'classnames';
import useRenderCopyIcon from '../hooks/useRenderCopyIcon';
import useRenderSQLTemplate from '../hooks/useRenderSQLTemplate';
import { SQLSnippetRendererProps } from '../SQLRenderer.types';
import { SQLRendererStyleWrapper } from '../style';
import { Spin, Typography } from 'antd';
import { useMemo } from 'react';
import { isNumber } from 'lodash';
import { basicTooltipCommonProps } from '../../BasicToolTip';
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
  copyIconClassName,
  cuttingLength
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

  const slicedSql = useMemo(() => {
    if (isNumber(cuttingLength)) {
      return sql?.slice(0, cuttingLength);
    }
    return sql;
  }, [cuttingLength, sql]);

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
        {slicedSql ? (
          <Typography.Paragraph
            ellipsis={{
              expandable: false,
              tooltip: tooltip
                ? {
                    arrow: false,
                    ...basicTooltipCommonProps(renderSQLTemplateContent(), 640)
                  }
                : false,
              rows
            }}
            {...paragraph}
            className={classNames('margin-bottom-0', paragraph?.className)}
          >
            <span
              dangerouslySetInnerHTML={{
                __html: HighlightCode.highlightSql(slicedSql)
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
