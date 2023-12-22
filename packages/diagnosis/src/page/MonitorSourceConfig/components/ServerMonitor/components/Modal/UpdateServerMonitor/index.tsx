import { useBoolean } from 'ahooks';
import ServerMonitorForm from '../ServerMonitorForm';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import { Form, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { ModalName } from '../../../../../../../data/ModalName';
import { useEffect } from 'react';
import server from '../../../../../../../api/server';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EventEmitter from '../../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../../data/EmitterKey';
import { IV1UpdateServerParams } from '../../../../../../../api/server/index.d';
import { IServerMonitorFormField } from '../ServerMonitorForm/index.type';
import useMonitorSourceConfigRedux from '../../../../../hooks/useMonitorSourceConfigRedux';

const UpdateServerMonitor = () => {
  const { t } = useTranslation();

  const [form] = Form.useForm<IServerMonitorFormField>();

  const [messageApi, contextHolder] = message.useMessage();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const modalName = ModalName.Update_Server_Monitor;

  const {
    visible,
    selectServerData: selectData,
    setModalStatus
  } = useMonitorSourceConfigRedux(modalName);

  useEffect(() => {
    if (visible && selectData) {
      form.setFieldsValue({
        host: selectData.host,
        name: selectData.name,
        port: selectData.port,
        user: selectData.user
      });
    }
  }, [visible, selectData, form]);

  const submit = async () => {
    const values = await form.validateFields();
    const params: IV1UpdateServerParams = {
      server: {
        host: values.host,
        name: values.name,
        password: values.password,
        port: Number(values.port),
        user: values.user
      },
      id: selectData?.id
    };
    startSubmit();
    server
      .V1UpdateServer(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t(
              'monitorSourceConfig.serverMonitor.updateServerMonitorSourceTip',
              {
                name: values.name
              }
            )
          );
          closeModal();
          EventEmitter.emit(EmitterKey.Refresh_Monitor_Source_Config);
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
        title={t('monitorSourceConfig.serverMonitor.updateServerMonitorSource')}
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
        <ServerMonitorForm form={form} isUpdate={true} visible={visible} />
      </BasicDrawer>
    </>
  );
};

export default UpdateServerMonitor;
