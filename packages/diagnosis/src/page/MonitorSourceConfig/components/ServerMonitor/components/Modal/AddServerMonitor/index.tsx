import { useBoolean } from 'ahooks';
import ServerMonitorForm from '../ServerMonitorForm';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import { Form, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ModalName } from '../../../../../../../data/ModalName';
import server from '../../../../../../../api/server';
import { IV1AddServerParams } from '../../../../../../../api/server/index.d';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EventEmitter from '../../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../../data/EmitterKey';
import { IServerMonitorFormField } from '../ServerMonitorForm/index.type';
import useMonitorSourceConfigRedux from '../../../../../hooks/useMonitorSourceConfigRedux';

const AddServerMonitor = () => {
  const { t } = useTranslation();

  const modalName = ModalName.Add_Server_Monitor;

  const { visible, setModalStatus } = useMonitorSourceConfigRedux(modalName);

  const [form] = Form.useForm<IServerMonitorFormField>();

  const [messageApi, contextHolder] = message.useMessage();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const submit = async () => {
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
      ]
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
  };

  const closeModal = () => {
    form.resetFields();
    setModalStatus(modalName, false);
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
        <ServerMonitorForm form={form} visible={visible} />
      </BasicDrawer>
    </>
  );
};

export default AddServerMonitor;
