import { BasicModal, BasicButton } from '@actiontech/shared';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { IReduxState } from '../../../../store';
import { ModalName } from '../../../../data/ModalName';
import { updateSqlOptimizationModalStatus } from '../../../../store/sqlOptimization';
import FullScreenOutlined from '../components/Icons/FullScreenOutlined';
import CloseOutlined from '../components/Icons/CloseOutlined';
import { useTranslation } from 'react-i18next';
import QueryPlanFlow from '../components/QueryPlanFlow';
import { QueryPlanDiffModalWrapper } from './style';
import { ExecutionPlanType } from '../index.type';

const QueryPlanDiffModal: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [fullscreenPlan, setFullscreenPlan] =
    useState<ExecutionPlanType | null>(null);
  const [fitViewTrigger, setFitViewTrigger] = useState(0);

  const { modalStatus, currentQueryPlanDiffData } = useSelector(
    (state: IReduxState) => ({
      modalStatus: state.sqlOptimization.modalStatus,
      currentQueryPlanDiffData:
        state.sqlOptimization.queryPlanDiffModal.currentQueryPlanDiffData
    })
  );

  const open = !!modalStatus[ModalName.Sql_Optimization_Query_Plan_Diff_Modal];

  const handleCancel = () => {
    setFullscreenPlan(null);
    dispatch(
      updateSqlOptimizationModalStatus({
        modalName: ModalName.Sql_Optimization_Query_Plan_Diff_Modal,
        status: false
      })
    );
  };

  const handleFullscreenPlan = (planType: ExecutionPlanType) => {
    setFullscreenPlan(planType);
    setFitViewTrigger((prev) => prev + 1);
  };

  const handleExitFullscreen = () => {
    setFullscreenPlan(null);
    setFitViewTrigger((prev) => prev + 1);
  };

  const planConfigs = [
    {
      type: ExecutionPlanType.ORIGINAL,
      title: t('sqlOptimization.result.originalExecutionPlan'),
      queryPlanDesc: currentQueryPlanDiffData?.originalQueryPlan,
      hiddenCondition: fullscreenPlan === ExecutionPlanType.OPTIMIZED
    },
    {
      type: ExecutionPlanType.OPTIMIZED,
      title: t('sqlOptimization.result.finalOptimized'),
      queryPlanDesc: currentQueryPlanDiffData?.optimizedQueryPlan,
      hiddenCondition: fullscreenPlan === ExecutionPlanType.ORIGINAL
    }
  ];

  return (
    <BasicModal
      title={t('sqlOptimization.result.compareExecutionPlanDifferences')}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={1200}
      centered
      maskClosable={false}
      bodyStyle={{ paddingTop: 0 }}
    >
      <QueryPlanDiffModalWrapper className={fullscreenPlan ? 'fullscreen' : ''}>
        {planConfigs.map((config) => (
          <div
            key={config.type}
            className={`plan-section ${config.hiddenCondition ? 'hidden' : ''}`}
            style={{ display: config.hiddenCondition ? 'none' : 'flex' }}
          >
            <div className="plan-header">
              <div className="plan-title">{config.title}</div>
              <div className="plan-actions">
                {fullscreenPlan === config.type ? (
                  <BasicButton
                    icon={<CloseOutlined />}
                    type="text"
                    size="small"
                    onClick={handleExitFullscreen}
                    title={t('sqlOptimization.result.exitFullscreen')}
                  />
                ) : (
                  <BasicButton
                    icon={<FullScreenOutlined />}
                    type="text"
                    size="small"
                    onClick={() => handleFullscreenPlan(config.type)}
                    title={t('sqlOptimization.result.fullscreenDisplay')}
                  />
                )}
              </div>
            </div>
            <div className="plan-content">
              <QueryPlanFlow
                queryPlanDesc={config.queryPlanDesc ?? []}
                height={600}
                fitViewTrigger={fitViewTrigger}
                planType={config.type}
              />
            </div>
          </div>
        ))}
      </QueryPlanDiffModalWrapper>
    </BasicModal>
  );
};

export default QueryPlanDiffModal;
