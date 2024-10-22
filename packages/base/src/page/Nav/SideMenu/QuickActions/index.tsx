import {
  TodoListOutlined,
  SignalFilled,
  ProfileSquareFilled
} from '@actiontech/icons';
import { QuickActionsStyleWrapper } from '../style';
import { BasicToolTips, ROUTE_PATHS } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames';

type QuickActionItemType = {
  key: string;
  title: React.ReactNode;
  path: string;
  icon: React.ReactNode;
  hidden: boolean;
};

const QuickActions: React.FC<{
  isAdmin: boolean;
  hasGlobalViewingPermission: boolean;
}> = ({ isAdmin, hasGlobalViewingPermission }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const location = useLocation();

  const actionItems: Array<QuickActionItemType> = useMemo(() => {
    return [
      {
        key: 'global-dashboard',
        title: t('dmsMenu.quickActions.globalDashboard'),
        path: ROUTE_PATHS.SQLE.GLOBAL_DASHBOARD,
        icon: <TodoListOutlined width={18} height={18} color="currentColor" />,
        hidden: false
      },
      {
        key: 'report-statistics',
        title: t('dmsMenu.globalSettings.reportStatistics'),
        path: ROUTE_PATHS.SQLE.REPORT_STATISTICS,
        icon: <SignalFilled width={18} height={18} color="currentColor" />,
        // todo 权限重构代码合并后需要进行调整
        hidden: !isAdmin && !hasGlobalViewingPermission
      },
      {
        key: 'view-rule',
        title: t('dmsMenu.globalSettings.viewRule'),
        path: ROUTE_PATHS.SQLE.RULE,
        icon: (
          <ProfileSquareFilled width={18} height={18} color="currentColor" />
        ),
        hidden: false
      }
    ];
  }, [t, hasGlobalViewingPermission, isAdmin]);

  return (
    <QuickActionsStyleWrapper>
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
              </div>
            </BasicToolTips>
          );
        }
        return null;
      })}
    </QuickActionsStyleWrapper>
  );
};

export default QuickActions;
