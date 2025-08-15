import { BasicModal, BasicButton } from '@actiontech/shared';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { IReduxState } from '../../../../store';
import { ModalName } from '../../../../data/ModalName';
import { updateSqlOptimizationModalStatus } from '../../../../store/sqlOptimization';
import { FullScreenOutlined, CloseOutlined } from '@actiontech/icons';
import { useTranslation } from 'react-i18next';
import QueryPlanFlow from '../components/QueryPlanFlow';
import { QueryPlanDiffModalWrapper } from './style';

enum FullscreenPlan {
  ORIGINAL = 'original',
  OPTIMIZED = 'optimized'
}

const QueryPlanDiffModal: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [fullscreenPlan, setFullscreenPlan] = useState<FullscreenPlan | null>(
    null
  );
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

  const handleFullscreenPlan = (planType: FullscreenPlan) => {
    setFullscreenPlan(planType);
    setFitViewTrigger((prev) => prev + 1);
  };

  const handleExitFullscreen = () => {
    setFullscreenPlan(null);
    setFitViewTrigger((prev) => prev + 1);
  };

  if (!currentQueryPlanDiffData) {
    return null;
  }

  const { originalQueryPlan, optimizedQueryPlan } = currentQueryPlanDiffData;

  // 执行计划配置列表
  const planConfigs = [
    {
      type: FullscreenPlan.ORIGINAL,
      title: t('sqlOptimization.result.originalExecutionPlan'),
      queryPlanDesc: originalQueryPlan,
      hiddenCondition: fullscreenPlan === FullscreenPlan.OPTIMIZED
    },
    {
      type: FullscreenPlan.OPTIMIZED,
      title: t('sqlOptimization.result.finalOptimized'),
      queryPlanDesc: optimizedQueryPlan,
      hiddenCondition: fullscreenPlan === FullscreenPlan.ORIGINAL
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
                queryPlanDesc={config.queryPlanDesc}
                height={600}
                fitViewTrigger={fitViewTrigger}
              />
            </div>
          </div>
        ))}
      </QueryPlanDiffModalWrapper>
    </BasicModal>
  );
};

export default QueryPlanDiffModal;
