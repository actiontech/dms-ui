import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { BasicResult, BasicButton } from '@actiontech/dms-kit';
import { useTypedNavigate } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { Space } from 'antd';
import { ROUTE_PATHS } from '@actiontech/dms-kit';

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { t } = useTranslation();

  const navigate = useTypedNavigate();

  return (
    <ReactErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => {
        return (
          <BasicResult
            status="error"
            title={t('common.somethingWentWrong')}
            subTitle={error.message}
            extra={
              <Space>
                <BasicButton
                  onClick={() => {
                    resetErrorBoundary();
                    navigate(ROUTE_PATHS.BASE.HOME);
                  }}
                >
                  {t('common.backToHome')}
                </BasicButton>
                <BasicButton type="primary" onClick={resetErrorBoundary}>
                  {t('common.retry')}
                </BasicButton>
              </Space>
            }
          />
        );
      }}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
