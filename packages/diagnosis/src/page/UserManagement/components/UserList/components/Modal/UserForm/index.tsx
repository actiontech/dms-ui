import { useRequest } from 'ahooks';
import React from 'react';
import { Form, Select } from 'antd';
import { IUserFormProps } from './index.type';
import { t } from '../../../../../../../locale';
import auth from '../../../../../../../api/auth';
import { BasicInput, BasicSelect, BasicSwitch } from '@actiontech/shared';
import useGetRoleData from '../../../../../hooks/useGetRoleData';

const UserForm: React.FC<IUserFormProps> = ({
  form,
  visible,
  isUpdate,
  isAdmin
}) => {
  const { roleList, loading } = useGetRoleData(visible);

  return (
    <>
      <Form form={form} layout="vertical">
        <Form.Item
          name="username"
          label={t('userManagement.userName')}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('userManagement.userName')
              })
            }
          ]}
        >
          <BasicInput disabled={!!isUpdate} />
        </Form.Item>
        {isUpdate ? (
          <Form.Item
            label={t('userManagement.isNeedUpdatePassword')}
            valuePropName="checked"
            name="isNeedUpdatePassword"
          >
            <BasicSwitch />
          </Form.Item>
        ) : null}
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.isNeedUpdatePassword !==
            currentValues.isNeedUpdatePassword
          }
        >
          {({ getFieldValue }) =>
            getFieldValue('isNeedUpdatePassword') ||
            getFieldValue('isNeedUpdatePassword') === undefined ? (
              <>
                <Form.Item
                  name="password"
                  label={t('common.password')}
                  rules={[
                    {
                      required: true,
                      message: t('common.form.rule.require', {
                        name: t('common.password')
                      })
                    }
                  ]}
                  hasFeedback
                >
                  <BasicInput.Password />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label={t('userManagement.confirmPassword')}
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: t('common.form.rule.require', {
                        name: t('common.password')
                      })
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            t(
                              'userManagement.user.createUser.confirmPasswordTips'
                            )
                          )
                        );
                      }
                    })
                  ]}
                >
                  <BasicInput.Password />
                </Form.Item>
              </>
            ) : null
          }
        </Form.Item>
        <Form.Item
          name="role_id"
          label={t('userManagement.roleName')}
          rules={[
            {
              required: true,
              message: t('common.form.rule.require', {
                name: t('userManagement.roleName')
              })
            }
          ]}
        >
          <BasicSelect
            showSearch
            allowClear
            loading={loading}
            disabled={isAdmin}
          >
            {(roleList?.data?.data ?? []).map((item) => (
              <Select.Option
                key={item.id}
                value={item.id}
                label={item.role_name}
              >
                {item.role_name}
              </Select.Option>
            ))}
          </BasicSelect>
        </Form.Item>
      </Form>
    </>
  );
};

export default UserForm;
