import { useBoolean } from 'ahooks';
import ServerMonitorForm from '../ServerMonitorForm';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import { Form, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../../../../../../../store';
import { ModalName } from '../../../../../../../data/ModalName';
import { updateMonitorSourceConfigModalStatus } from '../../../../../../../store/monitorSourceConfig';
import { useEffect } from 'react';
import server from '../../../../../../../api/server';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EventEmitter from '../../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../../data/EmitterKey';
import { IV1UpdateServerParams } from '../../../../../../../api/server/index.d';
import { IServerMonitorFormField } from '../ServerMonitorForm/index.type';

const UpdateServerMonitor = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [form] = Form.useForm<IServerMonitorFormField>();

  const [messageApi, contextHolder] = message.useMessage();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const visible = useSelector(
    (state: IReduxState) =>
      state.monitorSourceConfig.modalStatus[ModalName.Update_Server_Monitor]
  );

  const selectData = useSelector(
    (state: IReduxState) => state.monitorSourceConfig.selectServerMonitorData
  );

  useEffect(() => {
    if (visible && selectData) {
      form.setFieldsValue({
        host: selectData.host,
        name: selectData.name,
        password: selectData.password,
        port: selectData.port,
        user: selectData.user
      });
    }
  }, [visible, selectData, form]);

  const submit = async () => {
    try {
      const values = await form.validateFields();
      const params: IV1UpdateServerParams = {
        server: {
          host: values.host,
          name: values.name,
          password: values.password,
          port: Number(values.port),
          user: values.user
        },
        id: Number(selectData?.id)
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
        modalName: ModalName.Update_Server_Monitor,
        status: false
      })
    );
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
