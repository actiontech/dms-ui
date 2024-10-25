import {
  TodoListOutlined,
  SignalFilled,
  ProfileSquareFilled,
  RingOutlined
} from '@actiontech/icons';
import { QuickActionsStyleWrapper } from '../style';
import { BasicToolTips, EmptyBox } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTE_PATH_COLLECTION } from '@actiontech/shared/lib/data/routePathCollection';
import classNames from 'classnames';
import system from '@actiontech/shared/lib/api/sqle/service/system';
import { useRequest } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { Spin, Space } from 'antd';
import { ModuleRedDotModuleNameEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';

type QuickActionItemType = {
  key: string;
  title: React.ReactNode;
  path: string;
  icon: React.ReactNode;
  hidden: boolean;
  dot?: boolean;
};

const QuickActions: React.FC<{
  isAdmin: boolean;
  hasGlobalViewingPermission: boolean;
}> = ({ isAdmin, hasGlobalViewingPermission }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const location = useLocation();

  const { data, loading } = useRequest(() =>
    system.GetSystemModuleRedDots().then((res) => {
      if (res.data.code === ResponseCode.SUCCESS) {
        return res.data.data;
      }
    })
  );

  const actionItems: Array<QuickActionItemType> = useMemo(() => {
    return [
      {
        key: 'global-dashboard',
        title: t('dmsMenu.quickActions.globalDashboard'),
        path: ROUTE_PATH_COLLECTION.SQLE.GLOBAL_DASHBOARD,
        icon: <TodoListOutlined width={18} height={18} color="currentColor" />,
        hidden: false,
        dot: data?.some(
          (i) =>
            i.module_name === ModuleRedDotModuleNameEnum.global_dashboard &&
            i.has_red_dot
        )
      },
      {
        key: 'report-statistics',
        title: t('dmsMenu.globalSettings.reportStatistics'),
        path: ROUTE_PATH_COLLECTION.SQLE.REPORT_STATISTICS,
        icon: <SignalFilled width={18} height={18} color="currentColor" />,
        // todo 权限重构代码合并后需要进行调整
        hidden: !isAdmin && !hasGlobalViewingPermission
      },
      {
        key: 'view-rule',
        title: t('dmsMenu.globalSettings.viewRule'),
        path: ROUTE_PATH_COLLECTION.SQLE.RULE,
        icon: (
          <ProfileSquareFilled width={18} height={18} color="currentColor" />
        ),
        hidden: false
      }
    ];
  }, [t, hasGlobalViewingPermission, isAdmin, data]);

  return (
    <QuickActionsStyleWrapper>
      <Spin spinning={loading}>
        <Space className="action-space-wrapper">
          {actionItems.map((action) => {
            if (!action.hidden) {
              return (
                <BasicToolTips key={action.key} title={action.title}>
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
                </BasicToolTips>
              );
            }
            return null;
          })}
        </Space>
      </Spin>
    </QuickActionsStyleWrapper>
  );
};

export default QuickActions;
