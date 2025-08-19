import { BasicModal } from '@actiontech/shared';
import { useSelector, useDispatch } from 'react-redux';
import { IReduxState } from '../../../../store';
import { ModalName } from '../../../../data/ModalName';
import { updateSqlOptimizationModalStatus } from '../../../../store/sqlOptimization';
import { useTranslation } from 'react-i18next';
import QueryPlanFlow from '../components/QueryPlanFlow';

const QueryPlanFlowModal: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { modalStatus, currentQueryPlanData } = useSelector(
    (state: IReduxState) => ({
      modalStatus: state.sqlOptimization.modalStatus,
      currentQueryPlanData:
        state.sqlOptimization.queryPlanFlowModal.currentQueryPlanData
    })
  );

  const open = !!modalStatus[ModalName.Sql_Optimization_Query_Plan_Flow_Modal];

  const handleCancel = () => {
    dispatch(
      updateSqlOptimizationModalStatus({
        modalName: ModalName.Sql_Optimization_Query_Plan_Flow_Modal,
        status: false
      })
    );
  };

  if (!currentQueryPlanData) {
    return null;
  }

  return (
    <BasicModal
      title={t('sqlOptimization.result.optimizedExecutionPlan')}
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
      maskClosable={false}
      width={1200}
    >
      <div>
        <QueryPlanFlow queryPlanDesc={currentQueryPlanData} height={700} />
      </div>
    </BasicModal>
  );
};

export default QueryPlanFlowModal;
