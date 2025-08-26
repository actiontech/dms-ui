import {
  TodoListOutlined,
  SignalFilled,
  ProfileSquareFilled,
  RingOutlined,
  BookMarkOutlined
} from '@actiontech/icons';
import { QuickActionsStyleWrapper } from '../style';
import { BasicToolTip, EmptyBox } from '@actiontech/dms-kit';
import { useTypedNavigate } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import classNames from 'classnames';
import system from '@actiontech/shared/lib/api/sqle/service/system';
import { useRequest } from 'ahooks';
import { ResponseCode } from '@actiontech/dms-kit';
import { Space } from 'antd';
import { ModuleRedDotModuleNameEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import {
  PERMISSIONS,
  PermissionsConstantType,
  usePermission
} from '@actiontech/shared/lib/features';
import { ROUTE_PATHS } from '@actiontech/dms-kit';
import { IModuleRedDots } from '@actiontech/shared/lib/api/sqle/service/common';
type QuickActionItemType = {
  key: string;
  title: React.ReactNode;
  path: string;
  icon: React.ReactNode;
  permission?: PermissionsConstantType;
  dot?: boolean;
};
type QuickActionsProps = {
  systemModuleRedDots?: IModuleRedDots;
  setSystemModuleRedDotsLoading: (loading: boolean) => void;
};
const QuickActions: React.FC<QuickActionsProps> = ({
  setSystemModuleRedDotsLoading
}) => {
  const { t } = useTranslation();
  const navigate = useTypedNavigate();
  const location = useLocation();
  const { checkPagePermission } = usePermission();
  const { data } = useRequest(
    () =>
      system.GetSystemModuleRedDots().then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          return res.data.data;
        }
      }),
    {
      onBefore: () => {
        // 父级只负责loading状态管理 api调用还是在组件内部 如果在父级调用需要多个条件编译
        setSystemModuleRedDotsLoading(true);
      },
      onFinally: () => {
        setSystemModuleRedDotsLoading(false);
      }
    }
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
      },
      {
        key: 'knowledge',
        title: t('dmsMenu.globalSettings.knowledge'),
        path: ROUTE_PATHS.SQLE.KNOWLEDGE.index.path,
        icon: <BookMarkOutlined width={18} height={18} color="currentColor" />,
        permission: PERMISSIONS.PAGES.SQLE.KNOWLEDGE
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
      <Space className="action-space-wrapper">
        {actionItems.map((action) => {
          return (
            <BasicToolTip key={action.key} title={action.title}>
              <div
                className={classNames(`action-item ${action.key}`, {
                  'action-item-active': location.pathname.startsWith(
                    action.path
                  )
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
    </QuickActionsStyleWrapper>
  );
};
export default QuickActions;
