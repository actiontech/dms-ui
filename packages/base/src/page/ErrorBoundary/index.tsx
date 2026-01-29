import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { BasicResult, BasicButton, ROUTE_PATHS } from '@actiontech/dms-kit';
import { useTypedNavigate } from '@actiontech/shared';
import { Space } from 'antd';
import { t } from '../../locale';

export const isChunkLoadError = (error: Error): boolean => {
  const message = error.message || '';
  const stack = error.stack || '';

  const chunkFailedPatterns = [
    /Failed to fetch dynamically imported module/i,
    /Loading chunk [\d]+ failed/i,
    /ChunkLoadError/i,
    /Loading CSS chunk [\d]+ failed/i,
    /Importing a module script failed/i
  ];

  return chunkFailedPatterns.some(
    (pattern) => pattern.test(message) || pattern.test(stack)
  );
};

export const forceReloadWithCache = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete('_t');
  url.searchParams.set('_t', Date.now().toString());
  window.location.href = url.toString();
};

export const errorFallback = ({
  error,
  resetErrorBoundary,
  navigate
}: {
  error: Error;
  resetErrorBoundary: () => void;
  navigate: (path: string) => void;
}) => {
  if (isChunkLoadError(error)) {
    return (
      <BasicResult
        status="warning"
        title={t('common.pageUpdating')}
        subTitle={t('common.pageUpdatingDesc')}
        extra={
          <BasicButton type="primary" onClick={forceReloadWithCache}>
            {t('common.refresh')}
          </BasicButton>
        }
      />
    );
  }

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
};

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const navigate = useTypedNavigate();
  return (
    <ReactErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) =>
        errorFallback({ error, resetErrorBoundary, navigate })
      }
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
