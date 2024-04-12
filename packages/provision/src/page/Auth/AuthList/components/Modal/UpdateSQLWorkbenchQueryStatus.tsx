import { useRecoilState } from 'recoil';
import {
  AuthListModalStatus,
  AuthListSelectData
} from '../../../../../store/auth/list';
import { useTranslation } from 'react-i18next';
import BasicDrawer from '@actiontech/shared/lib/components/BasicDrawer';
import { Form, Space, message } from 'antd';
import { BasicButton, BasicToolTips, BasicSwitch } from '@actiontech/shared';
import { EventEmitterKey, ModalName } from '../../../../../data/enum';
import useModalStatus from '../../../../../hooks/useModalStatus';
import { IUpdateSQLWorkbenchQueryFields } from '../List/index.type';
import { useBoolean } from 'ahooks';
import EventEmitter from '../../../../../utils/EventEmitter';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { useEffect } from 'react';

const UpdateSQLWorkbenchQueryStatus: React.FC = () => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const { toggleModal, visible } = useModalStatus(
    AuthListModalStatus,
    ModalName.UpdateSQLWorkbenchQueryStatus
  );

  const [selectData, updateSelectData] = useRecoilState(AuthListSelectData);

  const [form] = Form.useForm<IUpdateSQLWorkbenchQueryFields>();

  const [updateLoading, { setTrue: startUpdate, setFalse: updateFinish }] =
    useBoolean();

  const closeModal = () => {
    toggleModal(ModalName.UpdateSQLWorkbenchQueryStatus, false);
    updateSelectData(null);
  };

  const closeAndReset = () => {
    closeModal();
    const timeId = setTimeout(() => {
      form.resetFields();
      clearTimeout(timeId);
    }, 300);
  };

  const submit = async () => {
    const values = await form.validateFields();
    startUpdate();
    try {
      const res = await auth.AuthUpdateAuthorization({
        authorization_uid: selectData?.uid ?? '',
        authorization: {
          used_by_sql_workbench: values.used_by_sql_workbench
        }
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        messageApi.success(t('auth.updateSQLWorkbenchQueryStatus.successTips'));
        closeAndReset();
        EventEmitter.emit(EventEmitterKey.Refresh_Auth_List_Table);
      }
    } finally {
      updateFinish();
    }
  };

  useEffect(() => {
    if (visible) {
      form.setFieldValue(
        'used_by_sql_workbench',
        !!selectData?.used_by_sql_workbench
      );
    }
  }, [form, selectData?.used_by_sql_workbench, visible]);

  return (
    <BasicDrawer
      title={t('auth.updateSQLWorkbenchQueryStatus.title')}
      open={visible}
      footer={
        <Space>
          <BasicButton disabled={updateLoading} onClick={closeAndReset}>
            {t('common.close')}
          </BasicButton>
          <BasicButton type="primary" loading={updateLoading} onClick={submit}>
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
      onClose={closeAndReset}
    >
      {contextHolder}
      <Form layout="vertical" form={form}>
        <Form.Item
          name="used_by_sql_workbench"
          valuePropName="checked"
          rules={[{ required: true }]}
          label={
            <BasicToolTips suffixIcon>
              {t('auth.updateSQLWorkbenchQueryStatus.label')}
            </BasicToolTips>
          }
        >
          <BasicSwitch />
        </Form.Item>
      </Form>
    </BasicDrawer>
  );
};

export default UpdateSQLWorkbenchQueryStatus;
