import monitor from '../../../../../../../api/monitor';
import { ActiontechTable } from '@actiontech/shared/lib/components/ActiontechTable';
import { useRequest } from 'ahooks';
import { useSelector } from 'react-redux';
import { getErrorMessage } from '@actiontech/shared/lib/utils/Common';
import { CheckMonitorConfigColumns } from './column';
import { useTranslation } from 'react-i18next';
import { ModalName } from '../../../../../../../data/ModalName';
import { useDispatch } from 'react-redux';
import {
  updateMonitorSourceConfigModalStatus,
  updateSelectMonitorConfigData
} from '../../../../../../../store/monitorSourceConfig';
import { IReduxState } from '../../../../../../../store';
import { CheckMonitorConfigStyleWrapper } from './style';

const CheckMonitorConfig = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const selectMonitorConfigData = useSelector(
    (state: IReduxState) => state.monitorSourceConfig.selectMonitorConfigDta
  );

  const visible = useSelector(
    (state: IReduxState) =>
      state.monitorSourceConfig.modalStatus[ModalName.Check_Monitor_Config]
  );
  console.log(visible);

  const {
    loading,
    data: monitorConfigData,
    error
  } = useRequest(
    () => {
      return monitor
        .V1ListRoutineMetrics({
          routine_id: Number(selectMonitorConfigData?.id)
        })
        .then((res) => {
          return res.data?.data?.metrics ?? [];
        });
    },
    {
      ready: !!selectMonitorConfigData?.id && visible,
      refreshDeps: [selectMonitorConfigData?.id]
    }
  );

  const onCloseModal = () => {
    dispatch(
      updateMonitorSourceConfigModalStatus({
        modalName: ModalName.Check_Monitor_Config,
        status: false
      })
    );
    dispatch(updateSelectMonitorConfigData(null));
  };

  return (
    <>
      <CheckMonitorConfigStyleWrapper
        title={t('monitorSourceConfig.monitorConfig.monitorKey')}
        onCancel={onCloseModal}
        open={visible}
        footer={null}
        size="large"
        className="monitor-item-routine-modal"
      >
        <ActiontechTable
          loading={loading}
          columns={CheckMonitorConfigColumns}
          pagination={{
            total: monitorConfigData?.length ?? 0
          }}
          rowKey="routine_name"
          dataSource={monitorConfigData ?? []}
          errorMessage={getErrorMessage(error ?? '')}
          className="monitor-item-routine-table"
          isPaginationFixed={false}
        />
      </CheckMonitorConfigStyleWrapper>
    </>
  );
};

export default CheckMonitorConfig;
