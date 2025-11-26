import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import ResultContent from '../../SqlOptimization/Result/ResultContent';
import { ModalName } from '../../../data/ModalName';
import {
  updateSqlAnalyzeModalStatus,
  updateResultDrawerData
} from '../../../store/sqlAnalyze';
import { IReduxState } from '../../../store';
import { OptimizationSQLDetailStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { BasicDrawer } from '@actiontech/dms-kit';
import { useEffect } from 'react';
import useOptimizationResult from '../../SqlOptimization/Result/hooks/useOptimizationResult';

const SqlOptimizationResultDrawer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { open, optimizationId } = useSelector((state: IReduxState) => {
    return {
      open: !!state.sqlAnalyze.modalStatus[
        ModalName.Sql_Optimization_Result_Drawer
      ],
      optimizationId:
        state.sqlAnalyze.resultDrawer.currentResultDrawerData?.optimizationId
    };
  });

  const {
    errorMessage,
    optimizationResult,
    getOptimizationResult,
    cancelOptimizationRequestPolling,
    optimizationResultLoading
  } = useOptimizationResult({ pollingInterval: 5000 });

  const onClose = () => {
    dispatch(
      updateSqlAnalyzeModalStatus({
        modalName: ModalName.Sql_Optimization_Result_Drawer,
        status: false
      })
    );
    dispatch(
      updateResultDrawerData({
        resultDrawerData: null
      })
    );
    cancelOptimizationRequestPolling();
  };
  useEffect(() => {
    if (
      open &&
      optimizationId &&
      (!optimizationResult?.status ||
        ![
          OptimizationSQLDetailStatusEnum.finish,
          OptimizationSQLDetailStatusEnum.failed
        ].includes(optimizationResult.status))
    ) {
      getOptimizationResult(optimizationId);
    }
  }, [open, getOptimizationResult, optimizationId, optimizationResult?.status]);

  return (
    <BasicDrawer
      title={t('sqlAnalyze.optimizationResultDrawer.title')}
      placement="right"
      open={open}
      onClose={onClose}
      maskClosable={false}
      size="large"
    >
      <ResultContent
        isVerticalLayout={true}
        errorMessage={errorMessage}
        optimizationResult={optimizationResult}
        optimizationResultLoading={optimizationResultLoading}
      />
    </BasicDrawer>
  );
};

export default SqlOptimizationResultDrawer;
