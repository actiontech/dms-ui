import { useBoolean } from 'ahooks';
import { Form, Space, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../../../../../../../store';
import { ModalName } from '../../../../../../../data/ModalName';
import db from '../../../../../../../api/db';
import { IV1AddDBParams } from '../../../../../../../api/db/index.d';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EventEmitter from '../../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../../data/EmitterKey';
import { updateMonitorSourceConfigModalStatus } from '../../../../../../../store/monitorSourceConfig';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import DatabaseMonitorForm from '../DatabaseMonitorForm';
import { IDatabaseMonitorFormField } from '../DatabaseMonitorForm/index.type';

const AddDatabaseMonitor = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [form] = Form.useForm<IDatabaseMonitorFormField>();

  const [messageApi, contextHolder] = message.useMessage();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const visible = useSelector(
    (state: IReduxState) =>
      state.monitorSourceConfig.modalStatus[ModalName.Add_Database_Monitor]
  );

  const submit = async () => {
    const values = await form.validateFields();
    const params: IV1AddDBParams = {
      dbs: [
        {
          monitor_type: values.monitor_type,
          host: values.host,
          monitor_name: values.monitor_name,
          port: Number(values.port),
          username: values.username,
          password: values.password
        }
      ]
    };
    startSubmit();
    db.V1AddDB(params)
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t(
              'monitorSourceConfig.databaseMonitor.addDatabaseMonitorSourceTip',
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
        modalName: ModalName.Add_Database_Monitor,
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
          'monitorSourceConfig.databaseMonitor.addDatabaseMonitorSource'
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
        <DatabaseMonitorForm form={form} />
      </BasicDrawer>
    </>
  );
};

export default AddDatabaseMonitor;
