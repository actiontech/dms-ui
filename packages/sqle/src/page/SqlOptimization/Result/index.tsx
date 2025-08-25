import { useEffect } from 'react';
import { LeftArrowOutlined } from '@actiontech/icons';
import { ActionButton, PageHeader, useTypedParams } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import ResultContent from './ResultContent';
import { SqlAuditSegmentedKey } from '../../SqlAudit/index.type';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { SqlOptimizationResultStyleWrapper } from './style';
import useOptimizationResult from './hooks/useOptimizationResult';

const SqlOptimizationResult: React.FC = () => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const urlParams =
    useTypedParams<typeof ROUTE_PATHS.SQLE.SQL_AUDIT.optimization_result>();

  const {
    optimizationResultStatus,
    errorMessage,
    optimizationResult,
    optimizationResultLoading,
    getOptimizationResult
  } = useOptimizationResult();

  useEffect(() => {
    if (urlParams.optimizationId) {
      getOptimizationResult(urlParams.optimizationId);
    }
  }, [urlParams.optimizationId, getOptimizationResult]);

  return (
    <>
      <PageHeader
        title={
          <ActionButton
            icon={<LeftArrowOutlined />}
            text={t('sqlOptimization.create.returnButton')}
            actionType="navigate-link"
            link={{
              to: ROUTE_PATHS.SQLE.SQL_AUDIT.index,
              params: { projectID },
              queries: { active: SqlAuditSegmentedKey.SqlOptimization }
            }}
          />
        }
        fixed
      />
      <SqlOptimizationResultStyleWrapper>
        <ResultContent
          optimizationResultStatus={optimizationResultStatus}
          errorMessage={errorMessage}
          optimizationResult={optimizationResult}
          optimizationResultLoading={optimizationResultLoading}
        />
      </SqlOptimizationResultStyleWrapper>
    </>
  );
};

export default SqlOptimizationResult;
