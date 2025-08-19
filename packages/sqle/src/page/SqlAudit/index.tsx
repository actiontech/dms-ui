import { useTranslation } from 'react-i18next';
import {
  PageHeader,
  SegmentedTabs,
  SegmentedTabsProps,
  useTypedQuery
} from '@actiontech/shared';
import { SqlAuditSegmentedKey } from './index.type';
import { useEffect, useMemo, useState } from 'react';
import { Space } from 'antd';
import { TableRefreshButton } from '@actiontech/shared/lib/components/ActiontechTable';
import eventEmitter from '../../utils/EventEmitter';
import EmitterKey from '../../data/EmitterKey';
import SqlAuditList from './List';
import SqlOptimizationList from '../SqlOptimization/List';
import {
  PermissionsConstantType,
  usePermission
} from '@actiontech/shared/lib/features';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { SqlAuditPageHeaderActions } from './actions';

const SqlAudit: React.FC = () => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState(SqlAuditSegmentedKey.SqlAudit);

  const { checkPagePermission } = usePermission();
  const { projectID } = useCurrentProject();

  const extractQuery = useTypedQuery();

  const onRefresh = () => {
    if (activeKey === SqlAuditSegmentedKey.SqlAudit) {
      eventEmitter.emit(EmitterKey.Refresh_Sql_Audit_List);
    } else if (activeKey === SqlAuditSegmentedKey.SqlOptimization) {
      eventEmitter.emit(EmitterKey.Refresh_Sql_Optimization_List);
    }
  };

  const tabItems = useMemo<SegmentedTabsProps['items']>(() => {
    const items: Array<
      SegmentedTabsProps['items'][0] & { permission?: PermissionsConstantType }
    > = [
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

    return items.filter(
      (item) => !item.permission || checkPagePermission(item.permission)
    );
  }, [checkPagePermission, t]);

  useEffect(() => {
    const searchParams = extractQuery(ROUTE_PATHS.SQLE.SQL_AUDIT.index);
    if (searchParams && searchParams.active) {
      setActiveKey(searchParams.active as SqlAuditSegmentedKey);
    }
  }, [extractQuery]);

  const pageHeaderActions = SqlAuditPageHeaderActions(projectID, activeKey);

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
            {pageHeaderActions['create-optimization']}
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
