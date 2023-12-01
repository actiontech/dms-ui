import { useBoolean } from 'ahooks';
import DatabaseMonitorForm from '../DatabaseMonitorForm';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import { Form, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../../../../../../../store';
import { ModalName } from '../../../../../../../data/ModalName';
import { updateMonitorSourceConfigModalStatus } from '../../../../../../../store/monitorSourceConfig';
import { useEffect } from 'react';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EventEmitter from '../../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../../data/EmitterKey';
import db from '../../../../../../../api/db';
import { IV1UpdateDBParams } from '../../../../../../../api/db/index.d';
import { IDatabaseMonitorFormField } from '../DatabaseMonitorForm/index.type';

const UpdateDatabaseMonitor = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [form] = Form.useForm<IDatabaseMonitorFormField>();

  const [messageApi, contextHolder] = message.useMessage();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const visible = useSelector(
    (state: IReduxState) =>
      state.monitorSourceConfig.modalStatus[ModalName.Update_Database_Monitor]
  );

  const selectData = useSelector(
    (state: IReduxState) => state.monitorSourceConfig.selectDatabaseMonitor
  );

  useEffect(() => {
    if (visible && selectData) {
      form.setFieldsValue({
        monitor_type: selectData?.monitor_type,
        host: selectData?.host,
        monitor_name: selectData?.monitor_name,
        port: selectData?.port,
        username: selectData?.username
      });
    }
  }, [visible, selectData, form]);

  const submit = async () => {
    const values = await form.validateFields();
    const params: IV1UpdateDBParams = {
      id: selectData?.id,
      username: values.username,
      password: values.password
    };
    startSubmit();
    db.V1UpdateDB(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t(
              'monitorSourceConfig.databaseMonitor.updateDatabaseMonitorSourceTip',
              {
                name: values.monitor_name
              }
            )
          );
          closeModal();
          EventEmitter.emit(EmitterKey.Refresh_Database_Monitor);
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const closeModal = () => {
    form.resetFields();
    dispatch(
      updateMonitorSourceConfigModalStatus({
        modalName: ModalName.Update_Database_Monitor,
        status: false
      })
    );
  };

  return (
    <>
      <BasicDrawer
        open={visible}
        placement="right"
        title={t(
          'monitorSourceConfig.databaseMonitor.updateDatabaseMonitorSource'
        )}
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
        <DatabaseMonitorForm form={form} isUpdate={true} />
      </BasicDrawer>
    </>
  );
};

export default UpdateDatabaseMonitor;
