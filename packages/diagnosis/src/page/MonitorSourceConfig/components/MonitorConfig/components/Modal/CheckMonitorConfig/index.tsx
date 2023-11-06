import { BasicModal } from '@actiontech/shared';
import monitor from '@actiontech/shared/lib/api/diagnosis/service/monitor';
import { ActiontechTable } from '@actiontech/shared/lib/components/ActiontechTable';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useRequest } from 'ahooks';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../../../../../../../../base/src/store';
import { getErrorMessage } from '@actiontech/shared/lib/utils/Common';
import { CheckMonitorConfigColumns } from './column';
import { useTranslation } from 'react-i18next';
import { ModalName } from '../../../../../../../data/ModalName';
import { useDispatch } from 'react-redux';
import {
  updateMonitorSourceConfigModalStatus,
  updateSelectMonitorConfigData
} from '../../../../../../../store/monitorSourceConfig';

const CheckMonitorConfig = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const { projectID } = useCurrentProject();

  const selectMonitorConfigData = useSelector(
    (state: IReduxState) => state.monitorSourceConfig.selectMonitorConfigDta
  );

  const visible = useSelector(
    (state: IReduxState) =>
      state.monitorSourceConfig.modalStatus[ModalName.Check_Monitor_Config]
  );

  const {
    loading,
    data: monitorConfigData,
    error
  } = useRequest(
    () => {
      return monitor
        .V1ListRoutineMetrics({
          routine_id: Number(selectMonitorConfigData?.id),
          project_uid: projectID
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
      <BasicModal
        title={t('monitorSourceConfig.monitorConfig.monitorKey')}
        onCancel={onCloseModal}
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
        />
      </BasicModal>
    </>
  );
};

export default CheckMonitorConfig;
