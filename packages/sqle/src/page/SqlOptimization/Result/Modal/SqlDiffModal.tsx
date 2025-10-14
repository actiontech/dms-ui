import { BasicModal } from '@actiontech/dms-kit';
import { useSelector, useDispatch } from 'react-redux';
import { IReduxState } from '../../../../store';
import { ModalName } from '../../../../data/ModalName';
import { updateSqlOptimizationModalStatus } from '../../../../store/sqlOptimization';
import { useTranslation } from 'react-i18next';
import SqlDiffView from '../components/SqlDiffView';

const SqlDiffModal: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { modalStatus, currentDiffData } = useSelector(
    (state: IReduxState) => ({
      modalStatus: state.sqlOptimization.modalStatus,
      currentDiffData: state.sqlOptimization.diffModal.currentDiffData
    })
  );

  const open = !!modalStatus[ModalName.Sql_Optimization_Diff_Modal];

  const handleCancel = () => {
    dispatch(
      updateSqlOptimizationModalStatus({
        modalName: ModalName.Sql_Optimization_Diff_Modal,
        status: false
      })
    );
  };

  return (
    <BasicModal
      title={t('sqlOptimization.result.compareSqlDifferences')}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={1200}
      centered
      maskClosable={false}
    >
      <SqlDiffView
        originalSql={currentDiffData?.originalSql ?? ''}
        optimizedSql={currentDiffData?.optimizedSql ?? ''}
        originTitle={t('sqlOptimization.result.original')}
        optimizedTitle={t('sqlOptimization.result.finalOptimized')}
      />
    </BasicModal>
  );
};

export default SqlDiffModal;
