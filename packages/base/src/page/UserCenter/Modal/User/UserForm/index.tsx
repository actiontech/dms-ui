import { IUserFormProps } from './index.type';
import { Form, Select, Switch } from 'antd';
import { BasicInput, BasicSelect } from '@actiontech/shared';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Rule } from 'antd/es/form';
import { nameRule, phoneRule } from '@actiontech/shared/lib/utils/FormRule';
import EmptyBox from '@actiontech/shared/lib/components/EmptyBox';
import { BasicToolTips } from '@actiontech/shared';
import useOpPermission from '../../../../../hooks/useOpPermission';
import { ListOpPermissionsFilterByTargetEnum } from '@actiontech/shared/lib/api/base/service/dms/index.enum';

const UserForm: React.FC<IUserFormProps> = (props) => {
  const { t } = useTranslation();

  const {
    loading: getOpPermissionListLoading,
    opPermissionList,
    updateOpPermissionList
  } = useOpPermission(ListOpPermissionsFilterByTargetEnum.user);

  const userNameRules = (): Rule[] => {
    const baseRules = [
      {
        required: true,
        message: t('common.form.rule.require', {
          name: t('dmsUserCenter.user.userForm.username')
        })
      }
    ];
    if (props.isUpdate) {
      return baseRules;
    }
    return [...baseRules, ...nameRule()];
  };

  useEffect(() => {
    if (props.visible) {
      updateOpPermissionList();
    }
  }, [updateOpPermissionList, props.visible]);

  return (
    <Form form={props.form} layout="vertical">
      <Form.Item
        name="username"
        label={t('dmsUserCenter.user.userForm.username')}
        validateFirst={true}
        rules={userNameRules()}
      >
        <BasicInput
          disabled={props.isUpdate}
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsUserCenter.user.userForm.username')
          })}
        />
      </Form.Item>
      <EmptyBox if={props.isUpdate}>
        <Form.Item
          name="needUpdatePassWord"
          label={t('dmsUserCenter.user.userForm.needUpdatePassWord')}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </EmptyBox>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, curValues) =>
          prevValues.needUpdatePassWord !== curValues.needUpdatePassWord
        }
      >
        {() => {
          const passwordItemsHidden =
            props.isUpdate && !props.form.getFieldValue('needUpdatePassWord');
          return (
            <EmptyBox if={!passwordItemsHidden}>
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
              >
                <BasicInput.Password
                  placeholder={t('common.form.placeholder.input', {
                    name: t('common.password')
                  })}
                />
              </Form.Item>
              <Form.Item
                name="passwordConfirm"
                label={t('dmsUserCenter.user.userForm.passwordConfirm')}
                dependencies={['password']}
                rules={[
                  {
                    required: true,
                    message: t('common.form.rule.require', {
                      name: t('dmsUserCenter.user.userForm.passwordConfirm')
                    })
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
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
                  placeholder={t(
                    'dmsUserCenter.user.userForm.passwordConfirmPlaceholder'
                  )}
                />
              </Form.Item>
            </EmptyBox>
          );
        }}
      </Form.Item>
      <Form.Item
        name="email"
        label={t('dmsUserCenter.user.userForm.email')}
        rules={[
          {
            type: 'email',
            message: t('common.form.rule.email')
          }
        ]}
      >
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsUserCenter.user.userForm.email')
          })}
        />
      </Form.Item>
      <Form.Item
        name="phone"
        label={t('dmsUserCenter.user.userForm.phone')}
        rules={phoneRule()}
        className="input-number-hide-arrows"
      >
        <BasicInput
          type="number"
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsUserCenter.user.userForm.phone')
          })}
        />
      </Form.Item>
      <Form.Item name="wxid" label={t('dmsUserCenter.user.userForm.wxid')}>
        <BasicInput
          placeholder={t('common.form.placeholder.input', {
            name: t('dmsUserCenter.user.userForm.wxid')
          })}
        />
      </Form.Item>
      <Form.Item
        name="opPermissionUids"
        label={t('dmsUserCenter.user.userForm.opPermissions')}
      >
        <BasicSelect
          mode="multiple"
          showSearch
          loading={getOpPermissionListLoading}
          placeholder={t('common.form.placeholder.select', {
            name: t('dmsUserCenter.user.userForm.opPermissions')
          })}
        >
          {opPermissionList.map((v) => (
            <Select.Option
              key={v?.op_permission?.uid}
              value={v?.op_permission?.uid ?? ''}
            >
              {v?.op_permission?.name}
            </Select.Option>
          ))}
        </BasicSelect>
      </Form.Item>
      <EmptyBox if={props.isUpdate && !props.isAdmin}>
        <Form.Item
          name="isDisabled"
          label={
            <BasicToolTips
              suffixIcon
              titleWidth={280}
              title={t('dmsUserCenter.user.userForm.disabledTips')}
            >
              {t('dmsUserCenter.user.userForm.isDisabled')}
            </BasicToolTips>
          }
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </EmptyBox>
    </Form>
  );
};

export default UserForm;
