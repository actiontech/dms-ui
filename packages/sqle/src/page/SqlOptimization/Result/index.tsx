import { useEffect } from 'react';
import { PageHeader, BasicButton } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import ResultContent from './ResultContent';
import { SqlAuditSegmentedKey } from '../../SqlAudit/index.type';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { SqlOptimizationResultStyleWrapper } from './style';
import useOptimizationResult from './hooks/useOptimizationResult';
import { useParams, Link } from 'react-router-dom';
import { IconLeftArrow } from '@actiontech/shared/lib/Icon/common';

const SqlOptimizationResult: React.FC = () => {
  const { t } = useTranslation();

  const { projectID } = useCurrentProject();

  const urlParams = useParams<{ optimizationId: string }>();

  const {
    errorMessage,
    optimizationResult,
    getOptimizationResult,
    optimizationResultLoading
  } = useOptimizationResult({
    pollingInterval: 5000
  });

  useEffect(() => {
    if (urlParams.optimizationId) {
      getOptimizationResult(urlParams.optimizationId);
    }
  }, [urlParams.optimizationId, getOptimizationResult]);

  return (
    <>
      <PageHeader
        title={
          <Link
            to={`/sqle/project/${projectID}/sqlAudit?active=${SqlAuditSegmentedKey.SqlOptimization}`}
          >
            <BasicButton icon={<IconLeftArrow />}>
              {t('sqlOptimization.create.returnButton')}
            </BasicButton>
          </Link>
        }
        fixed
      />
      <SqlOptimizationResultStyleWrapper>
        <ResultContent
          errorMessage={errorMessage}
          optimizationResult={optimizationResult}
          optimizationResultLoading={optimizationResultLoading}
        />
      </SqlOptimizationResultStyleWrapper>
    </>
  );
};

export default SqlOptimizationResult;
