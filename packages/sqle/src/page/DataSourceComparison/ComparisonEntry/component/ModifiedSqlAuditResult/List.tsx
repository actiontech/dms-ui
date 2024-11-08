import { SQLRenderer } from '@actiontech/shared';
import { ISQLStatementWithAuditResult } from '@actiontech/shared/lib/api/sqle/service/common';
import { List } from 'antd';
import { SqlAuditResultCollapseStyleWrapper } from '../ComparisonTreeNode/ComparisonDetailDrawer/style';
import AuditResult from '../SqlAuditResult';
import {
  ModifiedSqlAuditResultInfoStyleWrapper,
  ModifiedSqlAuditResultTitleStyleWrapper
} from './style';
import { useTranslation } from 'react-i18next';

type Props = {
  dataSource?: ISQLStatementWithAuditResult[];
  instanceType: string;
  auditResultCollapseActiveKeys: string[];
  auditResultCollapseActiveKeysOnChange: (keys: string[]) => void;
};

const ModifiedSqlAuditResultList: React.FC<Props> = ({
  dataSource,
  instanceType,
  auditResultCollapseActiveKeys,
  auditResultCollapseActiveKeysOnChange
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

                <SQLRenderer sql={item.sql_statement ?? ''} showLineNumbers />
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
