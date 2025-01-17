import {
  TodoListOutlined,
  SignalFilled,
  ProfileSquareFilled,
  RingOutlined
} from '@actiontech/icons';
import { QuickActionsStyleWrapper } from '../style';
import { BasicToolTip, EmptyBox, useTypedNavigate } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';
import system from '@actiontech/shared/lib/api/sqle/service/system';
import { useRequest } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { Spin, Space } from 'antd';
import { ModuleRedDotModuleNameEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  PERMISSIONS,
  PermissionsConstantType,
  usePermission
} from '@actiontech/shared/lib/features';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

type QuickActionItemType = {
  key: string;
  title: React.ReactNode;
  path: string;
  icon: React.ReactNode;
  permission?: PermissionsConstantType;
  dot?: boolean;
};

const QuickActions = () => {
  const { t } = useTranslation();

  const navigate = useTypedNavigate();

  const location = useLocation();

  const { checkPagePermission } = usePermission();

  const { data, loading } = useRequest(() =>
    system.GetSystemModuleRedDots().then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        return res.data.data;
      }
    })
  );

  const actionItems: Array<QuickActionItemType> = useMemo(() => {
    const actionList: Array<QuickActionItemType> = [
      {
        key: 'global-dashboard',
        title: t('dmsMenu.quickActions.globalDashboard'),
        path: ROUTE_PATHS.SQLE.GLOBAL_DASHBOARD,
        icon: <TodoListOutlined width={18} height={18} color="currentColor" />,
        dot: data?.some(
          (i) =>
            i.module_name === ModuleRedDotModuleNameEnum.global_dashboard &&
            i.has_red_dot
        )
      },
      {
        key: 'report-statistics',
        title: t('dmsMenu.globalSettings.reportStatistics'),
        path: ROUTE_PATHS.SQLE.REPORT_STATISTICS,
        icon: <SignalFilled width={18} height={18} color="currentColor" />,
        permission: PERMISSIONS.PAGES.SQLE.REPORT_STATISTICS
      },
      {
        key: 'view-rule',
        title: t('dmsMenu.globalSettings.viewRule'),
        path: ROUTE_PATHS.SQLE.RULE.index.path,
        icon: (
          <ProfileSquareFilled width={18} height={18} color="currentColor" />
        )
      }
    ];
    return actionList.filter((item) => {
      if (!item.permission) {
        return true;
      }

      return checkPagePermission(item.permission);
    });
  }, [t, data, checkPagePermission]);

  return (
    <QuickActionsStyleWrapper>
      <Spin spinning={loading}>
        <Space className="action-space-wrapper">
          {actionItems.map((action) => {
            return (
              <BasicToolTip key={action.key} title={action.title}>
                <div
                  className={classNames('action-item', {
                    'action-item-active': location.pathname === action.path
                  })}
                  onClick={() => navigate(action.path)}
                >
                  {action.icon}
                  <EmptyBox if={action.dot}>
                    <RingOutlined className="action-item-dot" />
                  </EmptyBox>
                </div>
              </BasicToolTip>
            );
          })}
        </Space>
      </Spin>
    </QuickActionsStyleWrapper>
  );
};

export default QuickActions;
