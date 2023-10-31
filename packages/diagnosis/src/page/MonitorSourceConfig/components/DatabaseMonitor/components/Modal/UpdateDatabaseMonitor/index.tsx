import { useBoolean } from 'ahooks';
import DatabaseMonitorForm from '../DatabaseMonitorForm';
import { BasicButton, BasicDrawer } from '@actiontech/shared';
import { Form, Space, message } from 'antd5';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../../../../../../../store';
import { ModalName } from '../../../../../../../data/ModalName';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { updateMonitorSourceConfigModalStatus } from '../../../../../../../store/monitorSourceConfig';
import { useEffect } from 'react';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EventEmitter from '../../../../../../../utils/EventEmitter';
import EmitterKey from '../../../../../../../data/EmitterKey';
import useDbService from '../../../../../../../../../base/src/hooks/useDbService';
import db from '@actiontech/shared/lib/api/diagnosis/service/db';
import { IV1AddDBParams } from '@actiontech/shared/lib/api/diagnosis/service/db/index.d';
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
        datasource_uid: selectData?.datasource_uid,
        host: selectData?.host,
        monitor_name: selectData?.monitor_name,
        port: selectData?.port
      });
    }
  }, [visible, selectData, form]);

  const { projectID } = useCurrentProject();

  const { dbServiceList, updateDbServiceList, generateDbServiceSelectOption } =
    useDbService();

  useEffect(() => {
    if (visible) updateDbServiceList(projectID);
  }, [visible, projectID, updateDbServiceList]);

  const submit = async () => {
    const values = await form.validateFields();
    const sourceData = dbServiceList.find(
      (item) => item?.uid === values.datasource_uid
    );
    const params: IV1AddDBParams = {
      dbs: [
        {
          datasource_name: sourceData?.name ?? '',
          datasource_uid: values.datasource_uid,
          db_type: sourceData?.db_type ?? '',
          host: values.host,
          monitor_name: values.monitor_name,
          port: Number(values.port)
        }
      ],
      project_uid: projectID
    };
    startSubmit();
    db.V1AddDB(params)
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
        <DatabaseMonitorForm
          form={form}
          dbServiceOption={generateDbServiceSelectOption()}
        />
      </BasicDrawer>
    </>
  );
};

export default UpdateDatabaseMonitor;
