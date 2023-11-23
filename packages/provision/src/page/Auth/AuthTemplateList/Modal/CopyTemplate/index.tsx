import { useBoolean } from 'ahooks';
import { Form, Space, message as messageApi } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { ModalName } from '~/data/enum';
import useModalStatus from '~/hooks/useModalStatus';
import { BasicButton, BasicDrawer, BasicInput } from '@actiontech/shared';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import {
  AuthTemplateListSelectData,
  AuthTemplateModalStatus
} from '~/store/auth/templateList';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import auth from '@actiontech/shared/lib/api/provision/service/auth';

interface ICopyTemplateFormFields {
  data_permission_template_name: string;
  name: string;
}
const CopyTemplate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [message, messageContextHolder] = messageApi.useMessage();
  const { projectID } = useCurrentProject();
  const { toggleModal, visible } = useModalStatus(
    AuthTemplateModalStatus,
    ModalName.CopyTemplate
  );
  const [selectedData, setSelectedData] = useRecoilState(
    AuthTemplateListSelectData
  );
  const [form] = Form.useForm<ICopyTemplateFormFields>();
  useEffect(() => {
    if (visible && selectedData) {
      form.setFieldsValue({
        data_permission_template_name: selectedData.name
      });
    }
  }, [form, selectedData, visible]);

  const [copyLoading, { setTrue: startCopy, setFalse: copyFinish }] =
    useBoolean();

  const closeModal = () => {
    toggleModal(ModalName.CopyTemplate, false);
    setSelectedData(null);
  };

  const closeAndReset = () => {
    form.resetFields();
    closeModal();
  };

  const submit = async () => {
    const values = await form.validateFields();
    try {
      startCopy();
      const res = await auth.AuthCopyDataPermissionTemplate({
        data_permission_template_uid: selectedData?.uid ?? '',
        new_template: { name: values.name }
      });
      if (res.data.code === ResponseCode.SUCCESS) {
        closeAndReset();
        message.success(
          t('auth.editTemplate.addSuccessTips', { name: values.name })
        );
        navigate(
          `/provision/project/${projectID}/auth/template/edit_template?name=${values.name}`
        );
      }
    } finally {
      copyFinish();
    }
  };

  return (
    <>
      {messageContextHolder}
      <BasicDrawer
        title={t('auth.button.copyTemplate')}
        open={visible}
        onClose={() => closeAndReset()}
        footer={
          <Space>
            <BasicButton disabled={copyLoading} onClick={closeAndReset}>
              {t('common.close')}
            </BasicButton>
            <BasicButton type="primary" loading={copyLoading} onClick={submit}>
              {t('common.submit')}
            </BasicButton>
          </Space>
        }
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="data_permission_template_name"
            label={t('auth.addAuth.baseForm.template')}
            required={true}
          >
            <BasicInput readOnly={true} disabled={true} />
          </Form.Item>
          <Form.Item
            name="name"
            label={t('auth.template.searchLabel')}
            rules={[{ required: true }]}
          >
            <BasicInput
              placeholder={t('auth.editTemplate.templateNamePlaceholder')}
            />
          </Form.Item>
        </Form>
      </BasicDrawer>
    </>
  );
};

export default CopyTemplate;
