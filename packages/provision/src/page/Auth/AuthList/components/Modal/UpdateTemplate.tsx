import auth from '@actiontech/shared/lib/api/provision/service/auth';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useBoolean, useRequest } from 'ahooks';
import { Form, message } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { EventEmitterKey, ModalName } from '~/data/enum';
import useModalStatus from '~/hooks/useModalStatus';
import { AuthListModalStatus, AuthListSelectData } from '~/store/auth/list';
import EventEmitter from '~/utils/EventEmitter';
import { BasicModal, BasicButton, BasicSelect } from '@actiontech/shared';
import { IUpdateTemplateFormFields } from '../List/index.type';
import { ResponseCode } from '@actiontech/shared/lib/enum';

const UpdateTemplate = () => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const { projectID } = useCurrentProject();
  const { toggleModal, visible } = useModalStatus(
    AuthListModalStatus,
    ModalName.UpdateTemplateInAuth
  );
  const [selectData, updateSelectData] = useRecoilState(AuthListSelectData);

  const [form] = Form.useForm<IUpdateTemplateFormFields>();

  const [updateLoading, { setTrue: startUpdate, setFalse: updateFinish }] =
    useBoolean();

  const closeModal = () => {
    toggleModal(ModalName.UpdateTemplateInAuth, false);
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
          data_permission_template_uid: values.data_permission_template_uid
        }
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        messageApi.success(t('auth.updateTemplateSuccess'));
        closeAndReset();
        EventEmitter.emit(EventEmitterKey.Refresh_Auth_List_Table);
      }
    } finally {
      updateFinish();
    }
  };

  const { data: authTemplateOptions } = useRequest(
    () =>
      auth
        .AuthListDataPermissionTemplate({
          page_index: 1,
          page_size: 999,
          filter_by_namespace_uid: projectID ?? ''
        })
        .then((res) => {
          return (
            res.data.data?.map((item) => ({
              value: item.uid ?? '',
              label: item.name ?? ''
            })) ?? []
          );
        }),
    {
      ready: visible,
      refreshDeps: [projectID]
    }
  );

  useEffect(() => {
    if (
      selectData?.data_permission_template_names?.length &&
      authTemplateOptions?.length !== 0
    ) {
      const cur = authTemplateOptions?.find(
        (item) => item.label === selectData.data_permission_template_names?.[0]
      );
      if (!cur) return;
      form.setFieldValue('data_permission_template_uid', cur.value);
    }
  }, [authTemplateOptions, form, selectData?.data_permission_template_names]);

  return (
    <BasicModal
      title={t('auth.updateTemplateTitle')}
      open={visible}
      footer={
        <>
          <BasicButton disabled={updateLoading} onClick={closeAndReset}>
            {t('common.close')}
          </BasicButton>
          <BasicButton type="primary" loading={updateLoading} onClick={submit}>
            {t('common.submit')}
          </BasicButton>
        </>
      }
      onCancel={closeAndReset}
    >
      {contextHolder}
      <Form layout="vertical" form={form}>
        <Form.Item
          name="data_permission_template_uid"
          label={t('auth.addAuth.baseForm.template')}
          required={true}
        >
          <BasicSelect options={authTemplateOptions} />
        </Form.Item>
      </Form>
    </BasicModal>
  );
};

export default UpdateTemplate;
