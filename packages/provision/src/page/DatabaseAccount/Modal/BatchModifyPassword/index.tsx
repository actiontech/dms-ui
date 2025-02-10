import { useBoolean } from 'ahooks';
import { message, Form, Space, Row, Col } from 'antd';
import { useTranslation } from 'react-i18next';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { BasicButton, BasicTypographyEllipsis } from '@actiontech/shared';
import useModalStatus from '../../../../hooks/useModalStatus';
import {
  DatabaseAccountModalStatus,
  DatabaseAccountBatchActionSelectedData
} from '../../../../store/databaseAccount';
import { BatchModifyPasswordFormType } from '../../index.type';
import dbAccountService from '@actiontech/shared/lib/api/provision/service/db_account/';
import { NORMAL_POLICY_VALUE } from '../../../../hooks/useSecurityPolicy';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import EventEmitter from '../../../../utils/EventEmitter';
import { EventEmitterKey, ModalName } from '../../../../data/enum';
import { accountNameRender } from '../../index.utils';
import PasswordPolicyField from '../ModifyPassword/PasswordPolicyField';
import Password from '../../../../utils/Password';
import { BasicInput } from '@actiontech/shared';
import { BatchModifyPasswordDrawerStyleWrapper } from '../../style';
import { FormListAddButtonWrapper } from '@actiontech/shared/lib/styleWrapper/element';

const BatchModifyPasswordModal: React.FC = () => {
  const { t } = useTranslation();

  const [form] = Form.useForm<BatchModifyPasswordFormType>();

  const passwords = Form.useWatch('passwords', form);

  const [messageApi, contextHolder] = message.useMessage();

  const [submitLoading, { setFalse: submitFinish, setTrue: startSubmit }] =
    useBoolean();

  const { toggleModal, visible } = useModalStatus(
    DatabaseAccountModalStatus,
    ModalName.DatabaseAccountBatchModifyPasswordModal
  );

  const [selectData, updateSelectData] = useRecoilState(
    DatabaseAccountBatchActionSelectedData
  );

  const { projectID } = useCurrentProject();

  const onClose = () => {
    form.resetFields();
    updateSelectData([]);
    toggleModal(ModalName.DatabaseAccountBatchModifyPasswordModal, false);
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    dbAccountService
      .AuthBatchUpdateDBAccountPassword({
        project_uid: projectID,
        db_account_password: {
          password_security_policy:
            values.policy === NORMAL_POLICY_VALUE ? '' : values.policy,
          passwords: values.passwords.map((i) => ({
            db_account_uid: i.id,
            db_account_password: i.password
          })),
          renewal_effective_time_day: values.effective_time_day
        }
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('databaseAccount.batchModifyPassword.successTip')
          );
          onClose();
          EventEmitter.emit(
            EventEmitterKey.Refresh_Account_Management_List_Table
          );
        }
      })
      .finally(() => {
        submitFinish();
      });
  };

  useEffect(() => {
    if (visible) {
      form.setFieldValue(
        'passwords',
        selectData.map((account) => {
          return {
            id: account.db_account_uid,
            name: accountNameRender(account.account_info),
            password: '',
            confirm_password: ''
          };
        })
      );
    }
  }, [visible, form, selectData]);

  const generatePassword = () => {
    passwords.forEach((item) => {
      const password = Password.generateMySQLPassword(16);
      item.password = password;
      item.confirm_password = password;
    });
    form.setFieldsValue({
      passwords: [...passwords]
    });
  };

  return (
    <BatchModifyPasswordDrawerStyleWrapper
      open={visible}
      size="large"
      placement="right"
      title={t('databaseAccount.list.batchAction.modifyPassword')}
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
            {t('common.ok')}
          </BasicButton>
        </Space>
      }
    >
      {contextHolder}
      <Form layout="vertical" form={form}>
        <PasswordPolicyField visible={visible} />
        <Form.Item>
          <FormListAddButtonWrapper
            onClick={generatePassword}
            disabled={submitLoading}
            className="form-list-add add-object-button"
          >
            {t('databaseAccount.batchModifyPassword.batchGenerate')}
          </FormListAddButtonWrapper>
        </Form.Item>
        <Form.List name="passwords">
          {(fields) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  key={field.key}
                  className="database-form-item"
                  noStyle
                >
                  <Row wrap={false} gutter={8}>
                    <Col span={4}>
                      <Form.Item
                        label={
                          index === 0
                            ? t('databaseAccount.list.column.account')
                            : ''
                        }
                      >
                        <BasicTypographyEllipsis
                          textCont={accountNameRender(
                            selectData[index].account_info
                          )}
                          copyable={false}
                          tooltipsMaxWidth={0}
                          className="account-name-item"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        {...field}
                        label={
                          index === 0
                            ? t('databaseAccount.create.form.password')
                            : ''
                        }
                        name={[field.name, 'password']}
                        rules={[{ required: true }]}
                      >
                        <BasicInput.Password />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        {...field}
                        label={
                          index === 0
                            ? t('databaseAccount.create.form.confirmPassword')
                            : ''
                        }
                        name={[field.name, 'confirm_password']}
                        rules={[
                          { required: true },
                          () => ({
                            validator(_, value) {
                              if (
                                !value ||
                                passwords[index].password === value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(
                                  t('databaseAccount.create.form.passwordError')
                                )
                              );
                            }
                          })
                        ]}
                      >
                        <BasicInput.Password />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              ))}
            </>
          )}
        </Form.List>
      </Form>
    </BatchModifyPasswordDrawerStyleWrapper>
  );
};

export default BatchModifyPasswordModal;
