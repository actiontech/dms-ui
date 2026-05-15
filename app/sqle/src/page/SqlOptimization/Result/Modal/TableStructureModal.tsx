import {
  BasicModal,
  EmptyBox,
  BasicEmpty,
  BasicInput
} from '@actiontech/dms-kit';
import { SQLRenderer } from '@actiontech/shared';
import { useSelector, useDispatch } from 'react-redux';
import { IReduxState } from '../../../../store';
import { ModalName } from '../../../../data/ModalName';
import { updateSqlOptimizationModalStatus } from '../../../../store/sqlOptimization';
import { useTranslation } from 'react-i18next';
import { TableStructureModalWrapper } from './style';
import CopyButton from '../components/CopyButton';

const TableStructureModal: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { modalStatus, currentTableData } = useSelector(
    (state: IReduxState) => ({
      modalStatus: state.sqlOptimization.modalStatus,
      currentTableData:
        state.sqlOptimization.tableStructureModal.currentTableData
    })
  );

  const open = !!modalStatus[ModalName.Sql_Optimization_Table_Structure_Modal];

  const hasRecommendedIndexes = !!(
    currentTableData?.recommendedIndexes &&
    currentTableData.recommendedIndexes.trim()
  );

  const handleCancel = () => {
    dispatch(
      updateSqlOptimizationModalStatus({
        modalName: ModalName.Sql_Optimization_Table_Structure_Modal,
        status: false
      })
    );
  };

  return (
    <BasicModal
      title={
        hasRecommendedIndexes
          ? t('sqlOptimization.result.viewTableStructureAndOptimalIndex')
          : t('sqlOptimization.result.viewTableStructure')
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={1000}
      centered
      maskClosable={false}
    >
      <TableStructureModalWrapper>
        <div className="section">
          <div className="section-header">
            <div className="section-title">
              {t('sqlOptimization.result.tableStructureForQuery')}
            </div>
            <EmptyBox if={!!currentTableData?.tableStructure}>
              <CopyButton content={currentTableData?.tableStructure} onlyIcon />
            </EmptyBox>
          </div>
          <div className="section-content">
            <EmptyBox
              if={!!currentTableData?.tableStructure}
              defaultNode={<BasicEmpty />}
            >
              <BasicInput.TextArea
                value={currentTableData?.tableStructure}
                readOnly
                rows={8}
                bordered={false}
              />
            </EmptyBox>
          </div>
        </div>

        <EmptyBox if={hasRecommendedIndexes}>
          <div className="section">
            <div className="section-header">
              <div className="section-title">
                {t('sqlOptimization.result.optimalIndexForQuery')}
              </div>
              <CopyButton
                content={currentTableData?.recommendedIndexes}
                onlyIcon
              />
            </div>
            <div className="section-content">
              <SQLRenderer
                wordWrap
                showLineNumbers
                sql={currentTableData?.recommendedIndexes}
              />
            </div>
          </div>
        </EmptyBox>
      </TableStructureModalWrapper>
    </BasicModal>
  );
};

export default TableStructureModal;
