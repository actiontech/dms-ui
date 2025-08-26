import { useTranslation } from 'react-i18next';
import {
  PageHeader,
  SegmentedTabs,
  SegmentedTabsProps,
  useTypedQuery,
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
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { sqlAuditPageHeaderActions } from './actions';
import { usePermission } from '@actiontech/shared/lib/features';
import { PERMISSIONS } from '@actiontech/shared/lib/features/usePermission/permissions';

const SqlAudit: React.FC = () => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState(SqlAuditSegmentedKey.SqlAudit);

  const { projectID } = useCurrentProject();

  const extractQuery = useTypedQuery();

  const { checkPagePermission } = usePermission();

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
    const searchParams = extractQuery(ROUTE_PATHS.SQLE.SQL_AUDIT.index);
    if (
      searchParams &&
      searchParams.active &&
      Object.values(SqlAuditSegmentedKey).includes(
        searchParams.active as SqlAuditSegmentedKey
      )
    ) {
      setActiveKey(searchParams.active as SqlAuditSegmentedKey);
    }
  }, [extractQuery]);

  const pageHeaderActions = sqlAuditPageHeaderActions(projectID, activeKey);

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
          <>
            {pageHeaderActions['create-audit']}
            {/* #if [ee] */}
            <EmptyBox
              if={checkPagePermission(PERMISSIONS.PAGES.SQLE.SQL_OPTIMIZATION)}
            >
              {pageHeaderActions['create-optimization']}
            </EmptyBox>
            {/* #endif */}
          </>
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
