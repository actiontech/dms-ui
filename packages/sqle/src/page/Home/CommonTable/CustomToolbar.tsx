import RefreshButton from '@actiontech/shared/lib/components/ActiontechTable/components/RefreshButton';
import { TableToolbarProps } from '@actiontech/shared/lib/components/ActiontechTable/index.type';
import { ConfigProvider, Space } from 'antd5';
import { DASHBOARD_COMMON_GET_ORDER_NUMBER } from '.';
import { useTranslation } from 'react-i18next';
import { ToolbarStyleWrapper } from '@actiontech/shared/lib/components/ActiontechTable/components/style';

export const CustomToolbar = <T extends Record<string, any>>({
  children,
  refreshButton
}: TableToolbarProps<T>) => {
  const { t } = useTranslation();

  return (
    <ConfigProvider
      theme={{
        token: {
          fontSize: 13
        }
      }}
    >
      <ToolbarStyleWrapper className="full-width-element flex-space-between">
        <Space>{children}</Space>
        <Space size={12}>
          {t('dashboard.tableLimitTips', {
            number: DASHBOARD_COMMON_GET_ORDER_NUMBER
          })}
          <RefreshButton {...refreshButton} />
        </Space>
      </ToolbarStyleWrapper>
    </ConfigProvider>
  );
};
