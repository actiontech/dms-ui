import { BasicModal } from '@actiontech/shared';
import { useSelector, useDispatch } from 'react-redux';
import { IReduxState } from '../../../../store';
import { ModalName } from '../../../../data/ModalName';
import { updateSqlOptimizationModalStatus } from '../../../../store/sqlOptimization';
import { useTranslation } from 'react-i18next';
import { OptimizationResultModalWrapper } from './style';
import AnalysisChart from '../components/AnalysisChart';
import SqlDiffView from '../components/SqlDiffView';
import { Space, Typography } from 'antd';
import ProbabilityDisplay from '../components/ProbabilityDisplay';
import { OptimizationResultStatus } from '../index.type';

const OptimizationResultModal: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { modalStatus, currentResultData } = useSelector(
    (state: IReduxState) => ({
      modalStatus: state.sqlOptimization.modalStatus,
      currentResultData:
        state.sqlOptimization.optimizationResultModal.currentResultData
    })
  );

  const open = !!modalStatus[ModalName.Sql_Optimization_Result_Modal];

  const handleCancel = () => {
    dispatch(
      updateSqlOptimizationModalStatus({
        modalName: ModalName.Sql_Optimization_Result_Modal,
        status: false
      })
    );
  };

  return (
    <BasicModal
      title={t('sqlOptimization.result.viewOptimizationResults')}
      open={open}
      onCancel={handleCancel}
      footer={null}
      size="large"
      centered
      maskClosable={false}
    >
      <OptimizationResultModalWrapper>
        {/* 规则描述 */}
        <div className="rule-info">
          <Typography.Title level={5}>
            {currentResultData?.rule_name}
          </Typography.Title>
          <Typography.Text type="secondary">
            {currentResultData?.rule_desc}
          </Typography.Text>
        </div>

        {/* 性能提升展示 */}
        <Space className="performance-improvement-section">
          <Space direction="vertical">
            <ProbabilityDisplay
              analysis={currentResultData?.analysis}
              resultStatus={OptimizationResultStatus.RESOLVED}
            />

            <Typography.Title level={5}>
              {t('sqlOptimization.result.details')}
            </Typography.Title>
            <Typography.Paragraph
              ellipsis={{
                rows: 4,
                expandable: true
              }}
            >
              {currentResultData?.analysis?.improvement_desc}
            </Typography.Paragraph>
          </Space>
          <AnalysisChart data={currentResultData?.analysis} />
        </Space>
        {/* SQL对比 */}
        <div className="sql-comparison">
          <Typography.Title level={5}>
            {t('sqlOptimization.result.compareSqlDifferences')}
          </Typography.Title>
          <SqlDiffView
            originalSql={currentResultData?.origin_sql ?? ''}
            optimizedSql={currentResultData?.optimized_sql ?? ''}
          />
        </div>
      </OptimizationResultModalWrapper>
    </BasicModal>
  );
};

export default OptimizationResultModal;
