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
import { BasicEmpty, BasicDrawer, BasicResult } from '@actiontech/shared';
import { useEffect } from 'react';
import useOptimizationResult from '../../SqlOptimization/Result/hooks/useOptimizationResult';
import { Spin, Space } from 'antd';

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
    optimizationResultStatus,
    errorMessage,
    optimizationResult,
    optimizationResultLoading,
    getOptimizationResult,
    cancelOptimizationRequestPolling
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
        optimizationResult?.status ===
          OptimizationSQLDetailStatusEnum.optimizing)
    ) {
      getOptimizationResult(optimizationId);
    }
  }, [open, getOptimizationResult, optimizationId, optimizationResult?.status]);

  const contentRender = () => {
    if (
      !optimizationResult ||
      optimizationResult?.status === OptimizationSQLDetailStatusEnum.optimizing
    ) {
      return (
        <BasicResult
          title={
            <Space direction="vertical">
              <Space size={20}>
                <Spin />
                <span>
                  {t('sqlAnalyze.optimizationResultDrawer.resultTips')}
                </span>
              </Space>
              <span>
                {t('sqlAnalyze.optimizationResultDrawer.trackProgressTips')}
              </span>
            </Space>
          }
        />
      );
    }
    if (optimizationResult?.status === OptimizationSQLDetailStatusEnum.finish) {
      return (
        <ResultContent
          isVerticalLayout={true}
          optimizationResultStatus={optimizationResultStatus}
          errorMessage={errorMessage}
          optimizationResult={optimizationResult}
          optimizationResultLoading={optimizationResultLoading}
        />
      );
    } else if (
      optimizationResult?.status === OptimizationSQLDetailStatusEnum.failed
    ) {
      return <BasicEmpty errorInfo={optimizationResult.status_detail} />;
    }
  };

  return (
    <BasicDrawer
      title={t('sqlAnalyze.optimizationResultDrawer.title')}
      placement="right"
      open={open}
      onClose={onClose}
      maskClosable={false}
      size="large"
    >
      {contentRender()}
    </BasicDrawer>
  );
};

export default SqlOptimizationResultDrawer;
