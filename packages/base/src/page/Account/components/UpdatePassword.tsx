import { BasicDrawer, BasicInput, BasicButton } from '@actiontech/shared';
import { Form, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { PasswordFormFields } from '../types';
import dms from '@actiontech/shared/lib/api/base/service/dms';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useDispatch } from 'react-redux';
import { updateToken } from '../../../store/user';

export const UpdatePassword: React.FC<{
  open: boolean;
  onClose: () => void;
}> = ({ open, onClose }) => {
  const { t } = useTranslation();

  const [form] = Form.useForm<PasswordFormFields>();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const dispatch = useDispatch();

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    dms
      .UpdateCurrentUser({
        current_user: {
          old_password: values.oldPassword,
          password: values.newPassword
        }
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          dispatch(updateToken({ token: '' }));
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  return (
    <BasicDrawer
      title={t('dmsAccount.modifyPassword.title')}
      open={open}
      onClose={onClose}
      footer={
        <Space>
          <BasicButton onClick={onClose} disabled={submitLoading}>
            {t('common.close')}
          </BasicButton>
          <BasicButton
            type="primary"
            onClick={onSubmit}
            loading={submitLoading}
          >
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="oldPassword"
          label={t('dmsAccount.modifyPassword.oldPassword')}
          validateFirst={true}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('dmsAccount.modifyPassword.oldPassword')
              })
            }
          ]}
        >
          <BasicInput.Password
            placeholder={t('common.form.placeholder.input', {
              name: t('dmsAccount.modifyPassword.oldPassword')
            })}
          />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label={t('dmsAccount.modifyPassword.newPassword')}
          validateFirst={true}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('dmsAccount.modifyPassword.newPassword')
              })
            }
          ]}
        >
          <BasicInput.Password
            placeholder={t('common.form.placeholder.select', {
              name: t('dmsAccount.modifyPassword.newPassword')
            })}
          />
        </Form.Item>
        <Form.Item
          name="newPasswordConfirm"
          label={t('dmsAccount.modifyPassword.newPasswordConfirm')}
          validateFirst={true}
          dependencies={['newPassword']}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('dmsAccount.modifyPassword.newPasswordConfirm')
              })
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error(t('common.form.rule.passwordNotMatch'))
                );
              }
            })
          ]}
        >
          <BasicInput.Password
            placeholder={t('common.form.placeholder.select', {
              name: t('dmsAccount.modifyPassword.newPasswordConfirm')
            })}
          />
        </Form.Item>
      </Form>
    </BasicDrawer>
  );
};

export default UpdatePassword;
