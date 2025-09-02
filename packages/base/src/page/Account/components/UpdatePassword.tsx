import { BasicDrawer, BasicInput, BasicButton } from '@actiontech/shared';
import { Form, Space, Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import { useBoolean } from 'ahooks';
import { PasswordFormFields } from '../index.type';
import User from '@actiontech/shared/lib/api/base/service/User';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useDispatch } from 'react-redux';
import { updateToken } from '../../../store/user';
import { validatePasswordComplexity } from '../../../utils/passwordComplexity';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { useState } from 'react';

export const UpdatePassword: React.FC<{
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  isForceChange?: boolean;
  title?: string;
  description?: string;
}> = ({
  open,
  onClose,
  onSuccess,
  isForceChange = false,
  title,
  description
}) => {
  const { t } = useTranslation();

  const [form] = Form.useForm<PasswordFormFields>();
  const [currentPassword, setCurrentPassword] = useState('');

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const dispatch = useDispatch();

  // 密码复杂度验证
  const passwordComplexityValidator = (_: any, value: string) => {
    if (!value) {
      return Promise.resolve();
    }

    const result = validatePasswordComplexity(value);
    if (!result.isValid) {
      return Promise.reject(new Error(result.errors[0]));
    }

    return Promise.resolve();
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    User.UpdateCurrentUser({
      current_user: {
        old_password: values.oldPassword,
        password: values.newPassword
      }
    })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          dispatch(updateToken({ token: '' }));
          // 调用成功回调
          onSuccess?.();
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  const internalCloseHandle = () => {
    form.resetFields();
    setCurrentPassword('');
    onClose();
  };

  return (
    <BasicDrawer
      title={title || t('dmsAccount.modifyPassword.title')}
      open={open}
      onClose={isForceChange ? undefined : internalCloseHandle}
      closable={!isForceChange}
      maskClosable={!isForceChange}
      footer={
        <Space>
          {!isForceChange && (
            <BasicButton onClick={internalCloseHandle} disabled={submitLoading}>
              {t('common.close')}
            </BasicButton>
          )}
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
      {description && (
        <Alert
          message={description}
          type="warning"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}
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
            },
            {
              validator: passwordComplexityValidator
            }
          ]}
          extra={
            currentPassword && (
              <PasswordStrengthIndicator password={currentPassword} />
            )
          }
        >
          <BasicInput.Password
            placeholder={t('common.form.placeholder.select', {
              name: t('dmsAccount.modifyPassword.newPassword')
            })}
            onChange={(e) => setCurrentPassword(e.target.value)}
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
