import { SQLRenderer } from '@actiontech/shared';
import { ISQLStatementWithAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';
import { List } from 'antd';
import { SqlAuditResultCollapseStyleWrapper } from '../ComparisonTreeNode/ComparisonDetailDrawer/style';
import AuditResult from '../SqlAuditResult';
import {
  ModifiedSqlAuditResultInfoStyleWrapper,
  ModifiedSqlAuditResultTitleStyleWrapper,
  WarningHighlightedSqlStyleWrapper
} from './style';
import { useTranslation } from 'react-i18next';
import {
  isWarningLine,
  sqlHasWarningLine
} from '../ModifiedSqlDrawer/warningSql';

type Props = {
  dataSource?: ISQLStatementWithAuditResult[];
  instanceType: string;
  auditResultCollapseActiveKeys: string[];
  auditResultCollapseActiveKeysOnChange: (keys: string[]) => void;
  auditError?: string;
};

// Renders a SQL string verbatim, line by line, while attaching a
// `warning-highlight-line` className to every `-- WARNING:` line. Used in
// place of SQLRenderer when WARNING annotations are present so the warning
// rows visibly stand out without depending on SQLRenderer's internal HTML.
const SqlWithWarningHighlight: React.FC<{ sql: string }> = ({ sql }) => {
  const lines = sql.split(/\r?\n/);
  return (
    <WarningHighlightedSqlStyleWrapper data-testid="warning-highlighted-sql">
      {lines.map((line, lineIndex) => (
        <span
          key={lineIndex}
          data-testid={
            isWarningLine(line)
              ? `warning-line-${lineIndex}`
              : `sql-line-${lineIndex}`
          }
          className={
            isWarningLine(line)
              ? 'code-line warning-highlight-line'
              : 'code-line'
          }
        >
          {line === '' ? ' ' : line}
        </span>
      ))}
    </WarningHighlightedSqlStyleWrapper>
  );
};

const ModifiedSqlAuditResultList: React.FC<Props> = ({
  dataSource,
  instanceType,
  auditResultCollapseActiveKeys,
  auditResultCollapseActiveKeysOnChange,
  auditError
}) => {
  const { t } = useTranslation();

  return (
    <>
      <List
        bordered={false}
        itemLayout="vertical"
        split={false}
        dataSource={dataSource}
        renderItem={(item, index) => {
          const sqlText = item.sql_statement ?? '';
          const containsWarning = sqlHasWarningLine(sqlText);
          return (
            <List.Item key={index}>
              <ModifiedSqlAuditResultInfoStyleWrapper>
                <ModifiedSqlAuditResultTitleStyleWrapper>
                  <div className="title-text">
                    {t(
                      'dataSourceComparison.entry.modifiedSqlAuditResult.cardTitle'
                    )}
                  </div>
                </ModifiedSqlAuditResultTitleStyleWrapper>

                {containsWarning ? (
                  <SqlWithWarningHighlight sql={sqlText} />
                ) : (
                  <SQLRenderer sql={sqlText} showLineNumbers />
                )}
                <SqlAuditResultCollapseStyleWrapper
                  activeKey={auditResultCollapseActiveKeys}
                  onChange={(keys) =>
                    auditResultCollapseActiveKeysOnChange(keys as string[])
                  }
                  items={[
                    {
                      key: index.toString(),
                      label: t(
                        'dataSourceComparison.entry.comparisonDetail.modifiedSqlAuditResultTitle'
                      ),
                      children: (
                        <AuditResult
                          shouldFetchRules={auditResultCollapseActiveKeys.includes(
                            index.toString()
                          )}
                          instanceType={instanceType ?? ''}
                          auditResults={item.audit_results ?? []}
                          auditError={auditError}
                        />
                      )
                    }
                  ]}
                />
              </ModifiedSqlAuditResultInfoStyleWrapper>
            </List.Item>
          );
        }}
        pagination={false}
      />
    </>
  );
};

export default ModifiedSqlAuditResultList;
