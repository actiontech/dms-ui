import {
  TodoListOutlined,
  SignalFilled,
  ProfileSquareFilled
} from '@actiontech/icons';
import { QuickActionsStyleWrapper } from '../style';
import { BasicToolTips, EmptyBox } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routePathCollection } from '@actiontech/shared/lib/data/routePathCollection';

const QuickActions: React.FC<{
  isAdmin: boolean;
  hasGlobalViewingPermission: boolean;
}> = ({ isAdmin, hasGlobalViewingPermission }) => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  return (
    <QuickActionsStyleWrapper>
      <BasicToolTips title={t('dmsMenu.quickActions.globalDashboard')}>
        <div
          className="action-item"
          onClick={() => navigate(routePathCollection.SQLE.GLOBAL_DASHBOARD)}
        >
          <TodoListOutlined width={18} height={18} />
        </div>
      </BasicToolTips>
      <EmptyBox if={isAdmin || hasGlobalViewingPermission}>
        <BasicToolTips title={t('dmsMenu.globalSettings.reportStatistics')}>
          <div
            className="action-item"
            onClick={() => navigate(routePathCollection.SQLE.REPORT_STATISTICS)}
          >
            <SignalFilled width={18} height={18} />
          </div>
        </BasicToolTips>
      </EmptyBox>

      <BasicToolTips title={t('dmsMenu.globalSettings.viewRule')}>
        <div
          className="action-item"
          onClick={() => navigate(routePathCollection.SQLE.RULE)}
        >
          <ProfileSquareFilled width={18} height={18} />
        </div>
      </BasicToolTips>
    </QuickActionsStyleWrapper>
  );
};

export default QuickActions;
