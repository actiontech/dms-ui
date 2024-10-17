import {
  TodoListOutlined,
  SignalFilled,
  ProfileSquareFilled
} from '@actiontech/icons';
import { QuickActionsStyleWrapper } from '../style';
import { BasicToolTips } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATH_COLLECTION } from '@actiontech/shared/lib/data/routePathCollection';

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

  const actionItems: Array<QuickActionItemType> = useMemo(() => {
    return [
      {
        key: 'global-dashboard',
        title: t('dmsMenu.quickActions.globalDashboard'),
        path: ROUTE_PATH_COLLECTION.SQLE.GLOBAL_DASHBOARD,
        icon: <TodoListOutlined width={18} height={18} />,
        hidden: false
      },
      {
        key: 'report-statistics',
        title: t('dmsMenu.globalSettings.reportStatistics'),
        path: ROUTE_PATH_COLLECTION.SQLE.REPORT_STATISTICS,
        icon: <SignalFilled width={18} height={18} />,
        // todo 权限重构代码合并后需要进行调整
        hidden: !isAdmin && !hasGlobalViewingPermission
      },
      {
        key: 'view-rule',
        title: t('dmsMenu.globalSettings.viewRule'),
        path: ROUTE_PATH_COLLECTION.SQLE.RULE,
        icon: <ProfileSquareFilled width={18} height={18} />,
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
                className="action-item"
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
