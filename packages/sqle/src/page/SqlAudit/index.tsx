import { useTranslation } from 'react-i18next';
import {
  PageHeader,
  SegmentedTabs,
  SegmentedTabsProps,
  useTypedNavigate,
  useTypedQuery,
  ActionButton
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
import { PlusOutlined } from '@actiontech/icons';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { SqlAuditPageHeaderActions } from './List/actions';

const SqlAudit: React.FC = () => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState(SqlAuditSegmentedKey.SqlAudit);

  const { checkPagePermission } = usePermission();
  const { projectID } = useCurrentProject();

  const extractQuery = useTypedQuery();
  const navigate = useTypedNavigate();

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

  const renderExtra = () => {
    if (activeKey === SqlAuditSegmentedKey.SqlAudit) {
      const pageHeaderActions = SqlAuditPageHeaderActions(projectID);
      return pageHeaderActions['create-audit'];
    } else if (activeKey === SqlAuditSegmentedKey.SqlOptimization) {
      return (
        <ActionButton
          type="primary"
          icon={<PlusOutlined color="currentColor" width={10} height={10} />}
          text={t('sqlOptimization.create.linkButton')}
          actionType="navigate-link"
          link={{
            to: ROUTE_PATHS.SQLE.SQL_OPTIMIZATION.create,
            params: { projectID }
          }}
        />
      );
    }
    return null;
  };

  useEffect(() => {
    const searchParams = extractQuery(ROUTE_PATHS.SQLE.SQL_AUDIT.index);
    if (searchParams && searchParams.active) {
      setActiveKey(searchParams.active as SqlAuditSegmentedKey);
    }
  }, [extractQuery]);

  return (
    <article>
      <PageHeader
        title={
          <Space>
            {t('sqlAudit.pageTitle')}
            <TableRefreshButton refresh={onRefresh} />
          </Space>
        }
        extra={renderExtra()}
      />

      <SegmentedTabs
        activeKey={activeKey}
        onChange={(key) => {
          setActiveKey(key);
          navigate(ROUTE_PATHS.SQLE.SQL_AUDIT.index, {
            params: { projectID },
            queries: { active: key },
            replace: true
          });
        }}
        items={tabItems}
      />
    </article>
  );
};

export default SqlAudit;
