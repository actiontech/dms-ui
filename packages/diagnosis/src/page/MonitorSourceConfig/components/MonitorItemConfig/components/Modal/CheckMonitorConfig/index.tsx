import monitor from '../../../../../../../api/monitor';
import { ActiontechTable } from '@actiontech/shared/lib/components/ActiontechTable';
import { useRequest } from 'ahooks';
import { getErrorMessage } from '@actiontech/shared/lib/utils/Common';
import { CheckMonitorConfigColumns } from './column';
import { useTranslation } from 'react-i18next';
import { ModalName } from '../../../../../../../data/ModalName';
import { CheckMonitorConfigStyleWrapper } from './style';
import useMonitorSourceConfigRedux from '../../../../../hooks/useMonitorSourceConfigRedux';

const CheckMonitorConfig = () => {
  const { t } = useTranslation();

  const modalName = ModalName.Check_Monitor_Config;

  const {
    visible,
    selectMonitorConfigData,
    setMonitorConfigSelectData,
    setModalStatus
  } = useMonitorSourceConfigRedux(modalName);

  const {
    loading,
    data: monitorConfigData,
    error
  } = useRequest(
    () => {
      return monitor
        .V1ListRoutineMetrics({
          monitor_id: Number(selectMonitorConfigData?.monitor_id)
        })
        .then((res) => {
          return res.data?.data?.metrics ?? [];
        });
    },
    {
      ready: !!selectMonitorConfigData?.monitor_id && visible,
      refreshDeps: [selectMonitorConfigData?.monitor_id]
    }
  );

  const onCloseModal = () => {
    setModalStatus(modalName, false);
    setMonitorConfigSelectData(null);
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
          rowKey="metric_key"
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
