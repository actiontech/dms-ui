import classNames from 'classnames';
import useRenderCopyIcon from '../hooks/useRenderCopyIcon';
import useRenderSQLTemplate from '../hooks/useRenderSQLTemplate';
import { SQLSnippetRendererProps } from '../index.type';
import { SQLRendererStyleWrapper } from '../style';
import { Spin, Typography } from 'antd';
import HighlightCode from '../../../utils/HighlightCode';
import { tooltipsCommonProps } from '../../BasicToolTips';
import EmptyBox from '../../EmptyBox';

const Snippet: React.FC<SQLSnippetRendererProps> = ({
  rows = 10,
  tooltip = true,
  paragraph,
  ...props
}) => {
  const { renderSQLTemplateContent } = useRenderSQLTemplate(props);
  const { renderCopyIcon } = useRenderCopyIcon(props);
  const {
    sql,
    showCopyIcon,
    onClick,
    className,
    loading,
    emptySqlContent = '-'
  } = props;

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
        <EmptyBox
          if={!!sql}
          defaultNode={
            <span className="empty-sql-placeholder">{emptySqlContent}</span>
          }
        >
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
                __html: HighlightCode.highlightSql(sql!)
              }}
            />
          </Typography.Paragraph>
        </EmptyBox>

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
