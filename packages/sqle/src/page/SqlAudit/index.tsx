import { useTranslation } from 'react-i18next';
import {
  PageHeader,
  SegmentedTabs,
  SegmentedTabsProps,
  EmptyBox
} from '@actiontech/shared';
import { SqlAuditSegmentedKey } from './index.type';
import { useEffect, useMemo, useState } from 'react';
import { Space } from 'antd';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import eventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import SqlAuditList from './List';
import SqlOptimizationList from '../SqlOptimization';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { sqlAuditPageHeaderActions } from './actions';
import { useSearchParams } from 'react-router-dom';
import { useCurrentUser } from '@actiontech/shared/lib/global';

const SqlAudit: React.FC = () => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState(SqlAuditSegmentedKey.SqlAudit);

  const { projectID } = useCurrentProject();

  const [searchParams] = useSearchParams();

  const { isSqlOptimizationSupported } = useCurrentUser();

  const onRefresh = () => {
    if (activeKey === SqlAuditSegmentedKey.SqlAudit) {
      eventEmitter.emit(EmitterKey.Refresh_Sql_Audit_List);
    } else if (activeKey === SqlAuditSegmentedKey.SqlOptimization) {
      eventEmitter.emit(EmitterKey.Refresh_Sql_Optimization_List);
    }
  };

  const tabItems = useMemo<SegmentedTabsProps['items']>(() => {
    return [
      {
        label: t('sqlAudit.sqlAudit'),
        value: SqlAuditSegmentedKey.SqlAudit,
        children: <SqlAuditList />,
        destroyInactivePane: true
      },
      {
        label: t('sqlAudit.sqlOptimization'),
        value: SqlAuditSegmentedKey.SqlOptimization,
        children: <SqlOptimizationList />,
        destroyInactivePane: true
      }
    ];
  }, [t]);

  useEffect(() => {
    if (
      searchParams &&
      searchParams.get('active') &&
      Object.values(SqlAuditSegmentedKey).includes(
        searchParams.get('active') as SqlAuditSegmentedKey
      )
    ) {
      setActiveKey(searchParams.get('active') as SqlAuditSegmentedKey);
    }
  }, [searchParams]);

  const pageHeaderActions = sqlAuditPageHeaderActions(projectID);

  return (
    <article>
      <PageHeader
        title={
          <Space>
            {t('sqlAudit.pageTitle')}
            <TableRefreshButton refresh={onRefresh} />
          </Space>
        }
        extra={
          <Space>
            {pageHeaderActions['create-audit']}
            {/* #if [ee] */}
            <EmptyBox if={isSqlOptimizationSupported}>
              {pageHeaderActions['create-optimization']}
            </EmptyBox>
            {/* #endif */}
          </Space>
        }
      />

      <SegmentedTabs
        activeKey={activeKey}
        onChange={(key) => {
          setActiveKey(key);
        }}
        items={tabItems}
      />
    </article>
  );
};

export default SqlAudit;
