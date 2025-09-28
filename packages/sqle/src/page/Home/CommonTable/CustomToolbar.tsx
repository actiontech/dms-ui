import RefreshButton from '@actiontech/dms-kit/es/components/ActiontechTable/components/RefreshButton';
import { TableRefreshButtonProps } from '@actiontech/dms-kit/es/components/ActiontechTable/index.type';
import { Space } from 'antd';
import { DASHBOARD_COMMON_GET_ORDER_NUMBER } from '.';
import { useTranslation } from 'react-i18next';
import { ReactNode } from 'react';
import { CustomToolbarStyleWrapper } from './style';

export const CustomToolbar = ({
  children,
  refreshButton
}: {
  children: ReactNode;
  refreshButton: TableRefreshButtonProps;
}) => {
  const { t } = useTranslation();

  return (
    <CustomToolbarStyleWrapper>
      <Space>{children}</Space>
      <Space size={8}>
        <span className="table-limit-tips-text">
          {t('dashboard.tableLimitTips', {
            number: DASHBOARD_COMMON_GET_ORDER_NUMBER
          })}
        </span>
        <RefreshButton {...refreshButton} noBorderIcon />
      </Space>
    </CustomToolbarStyleWrapper>
  );
};
