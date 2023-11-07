import { useBoolean } from 'ahooks';
import ServerMonitorForm from '../ServerMonitorForm';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import { Form, Space, message } from 'antd5';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../../../../../../../store';
import { ModalName } from '../../../../../../../data/ModalName';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import server from '@actiontech/shared/lib/api/diagnosis/service/server';
import { updateMonitorSourceConfigModalStatus } from '../../../../../../../store/monitorSourceConfig';
import { IV1AddServerParams } from '@actiontech/shared/lib/api/diagnosis/service/server/index.d';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EventEmitter from '../../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../../data/EmitterKey';
import { IServerMonitorFormField } from '../ServerMonitorForm/index.type';

const AddServerMonitor = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [form] = Form.useForm<IServerMonitorFormField>();

  const [messageApi, contextHolder] = message.useMessage();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const visible = useSelector(
    (state: IReduxState) =>
      state.monitorSourceConfig.modalStatus[ModalName.Add_Server_Monitor]
  );

  const { projectID } = useCurrentProject();

  const submit = async () => {
    try {
      const values = await form.validateFields();
      const params: IV1AddServerParams = {
        servers: [
          {
            host: values.host,
            name: values.name,
            password: values.password,
            port: Number(values.port),
            user: values.user
          }
        ],
        project_uid: projectID
      };
      startSubmit();
      server
        .V1AddServer(params)
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(
              t('monitorSourceConfig.serverMonitor.addServerMonitorSourceTip', {
                name: values.name
              })
            );
            closeModal();
            EventEmitter.emit(EmitterKey.Refresh_Server_Monitor);
          }
        })
        .finally(() => {
          submitFinish();
        });
    } catch (error) {
      return;
    }
  };

  const closeModal = () => {
    form.resetFields();
    dispatch(
      updateMonitorSourceConfigModalStatus({
        modalName: ModalName.Add_Server_Monitor,
        status: false
      })
    );
  };

  return (
    <>
      <BasicDrawer
        open={visible}
        placement="right"
        title={t('monitorSourceConfig.serverMonitor.addServerMonitorSource')}
        onClose={closeModal}
        footer={
          <Space>
            <BasicButton onClick={closeModal} disabled={submitLoading}>
              {t('common.close')}
            </BasicButton>
            <BasicButton
              type="primary"
              onClick={submit}
              loading={submitLoading}
            >
              {t('common.submit')}
            </BasicButton>
          </Space>
        }
      >
        {contextHolder}
        <ServerMonitorForm form={form} />
      </BasicDrawer>
    </>
  );
};

export default AddServerMonitor;
