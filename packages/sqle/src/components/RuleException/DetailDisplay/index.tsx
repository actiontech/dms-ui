import { ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Typography } from 'antd';
import { BasicToolTips, SQLRenderer } from '@actiontech/shared';
import { MatchConditionReqV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { FormattedMatchModeItem } from '../../../page/RuleException/utils';
import {
  DetailFieldCardStyleWrapper,
  DetailMetaInfoCardStyleWrapper,
  RuleExceptionDetailStyleWrapper
} from './style';

export {
  DetailFieldCardStyleWrapper,
  DetailMetaInfoCardStyleWrapper,
  RuleExceptionDetailStyleWrapper
};

const SQL_SNIPPET_COLLAPSED_ROWS = 1;

type DetailMetaInfoItemProps = {
  label: string;
  value: ReactNode;
};

export const DetailMetaInfoItem: React.FC<DetailMetaInfoItemProps> = ({
  label,
  value
}) => (
  <div className="detail-meta-item">
    <div className="detail-meta-label">{label}</div>
    <div className="detail-meta-value">{value}</div>
  </div>
);

type DetailFieldCardProps = {
  label: string;
  labelTips?: ReactNode;
  labelExtra?: ReactNode;
  children?: ReactNode;
};

export const DetailFieldCard: React.FC<DetailFieldCardProps> = ({
  label,
  labelTips,
  labelExtra,
  children
}) => (
  <DetailFieldCardStyleWrapper>
    <div className="detail-field-header">
      <div className="detail-field-label">
        {labelTips ? (
          <BasicToolTips title={labelTips} suffixIcon>
            {label}
          </BasicToolTips>
        ) : (
          label
        )}
      </div>
      {labelExtra}
    </div>
    {children ? <div className="detail-field-value">{children}</div> : null}
  </DetailFieldCardStyleWrapper>
);

const MatchModeSqlValue: React.FC<{ sql?: string }> = ({ sql }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(false);
  }, [sql]);

  if (!sql) {
    return <>-</>;
  }

  if (expanded) {
    return (
      <>
        <SQLRenderer sql={sql} showCopyIcon />
        <Typography.Link
          className="match-mode-sql-toggle"
          onClick={() => setExpanded(false)}
        >
          {t('common.collapse')}
        </Typography.Link>
      </>
    );
  }

  return (
    <SQLRenderer.Snippet
      sql={sql}
      rows={SQL_SNIPPET_COLLAPSED_ROWS}
      showCopyIcon
      tooltip={false}
      highlightSyntax={false}
      paragraph={{
        ellipsis: {
          expandable: true,
          rows: SQL_SNIPPET_COLLAPSED_ROWS,
          symbol: t('common.expansion'),
          tooltip: false,
          onExpand: () => setExpanded(true)
        }
      }}
    />
  );
};

const renderMatchContent = (
  type?: string,
  content?: string,
  navigatePath?: string
) => {
  if (navigatePath) {
    return (
      <Link target="_blank" to={navigatePath}>
        {content || '-'}
      </Link>
    );
  }
  if (
    type === MatchConditionReqV1TypeEnum.sql ||
    type === MatchConditionReqV1TypeEnum.fp_sql ||
    type === 'sql' ||
    type === 'fp_sql'
  ) {
    return <MatchModeSqlValue sql={content} />;
  }
  return content || '-';
};

type MatchModeItemsListProps = {
  items: FormattedMatchModeItem[];
};

export const MatchModeItemsList: React.FC<MatchModeItemsListProps> = ({
  items
}) => {
  if (!items.length) {
    return <>-</>;
  }

  return (
    <div className="detail-internal-list">
      {items.map((row, index) => (
        <div
          key={`${row.type ?? 'row'}-${index}`}
          className="detail-internal-list-item match-mode-item"
        >
          <div className="match-mode-item-label">{row.typeLabel}</div>
          <div className="match-mode-item-value">
            {renderMatchContent(row.type, row.content, row.navigatePath)}
          </div>
        </div>
      ))}
    </div>
  );
};
