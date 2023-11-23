import { Typography } from 'antd';
import { RenderSQLProps } from './index.type';
import CopyIcon from '@actiontech/shared/lib/components/CopyIcon';
import { tooltipsCommonProps } from '@actiontech/shared/lib/components/BasicToolTips';
import HighlightCode from '../../utils/HighlightCode';
import { RenderSQLStyleWrapper } from './style';

const RenderSQL: React.FC<RenderSQLProps> = ({
  sql,
  rows = 10,
  tooltip,
  onClick
}) => {
  if (!sql) {
    return <span>-</span>;
  }

  return (
    <RenderSQLStyleWrapper onClick={onClick}>
      <Typography.Paragraph
        ellipsis={{
          expandable: false,
          tooltip: tooltip ?? {
            arrow: false,
            ...tooltipsCommonProps(
              <span
                dangerouslySetInnerHTML={{
                  __html: HighlightCode.highlightSql(sql)
                }}
              />,
              640
            )
          },
          rows
        }}
        className="margin-bottom-0"
      >
        <span
          dangerouslySetInnerHTML={{ __html: HighlightCode.highlightSql(sql) }}
        />
      </Typography.Paragraph>
      <CopyIcon text={sql} />
    </RenderSQLStyleWrapper>
  );
};

export default RenderSQL;
