import {
  Form,
  Button,
  Card,
  Col,
  Row,
  Input,
  Divider,
  Select,
  Space,
  Result,
  Typography
} from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import './index.less';
import { Box } from '@mui/system';
import { formLayout, timeDayOptions } from './index.data';
import { useRequest } from 'ahooks';
import PreviewModal from './PreviewModal';
import UserSelect from './UserSelect';
import { ResponseCode } from '~/data/common';
import InputPassword from '~/components/PasswordWithGenerate';
import Password from '~/utils/Password';
import { BackButton, EmptyBox } from '@actiontech/shared';
import { Link } from '../../../components/Link';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { IAddAuthorization } from '@actiontech/shared/lib/api/provision/service/common';
import auth from '@actiontech/shared/lib/api/provision/service/auth';

export interface IFormFields {
  data_permission_template_uid: string;
  hostname: string;
  password: string;
  confirm_password: string;
  username: string;
  effective_time_day: number;
  memo: string;
  permission_user_uid: string;
  purpose: string;
  userValue: string;
}

const AddAuth = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm<IFormFields>();
  const [urlParams] = useSearchParams();
  const id = urlParams.get('id');
  const { projectID } = useCurrentProject();
  useEffect(() => {
    if (id) {
      form.setFieldsValue({
        data_permission_template_uid: id
      });
    }
  }, [id, form]);

  const [params, setParams] = useState<IAddAuthorization>();
  const [success, setSuccess] = useState(false);
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
      refreshDeps: [projectID]
    }
  );

  const resetFields = () => {
    form.resetFields();
    setParams(undefined);
    setSuccess(false);
    setValidateSuccess(false);
    if (id) {
      form.setFieldsValue({
        data_permission_template_uid: id
      });
    }
  };
  const onSave = () =>
    form.validateFields().then((values) => {
      setParams({
        data_permission_template_uid: values.data_permission_template_uid,
        db_account: {
          hostname: values.hostname,
          password: values.password,
          username: values.username
        },
        effective_time_day: values.effective_time_day,
        memo: values.memo,
        permission_user_uid: values.permission_user_uid,
        purpose: values.purpose
      });
    });

  const onSuccess = () => {
    setParams(undefined);
    setSuccess(true);
  };

  const [validateSuccess, setValidateSuccess] = useState(false);
  const { runAsync: verifyDBAccount } = useRequest(
    auth.AuthVerifyDBAccount.bind(auth),
    {
      manual: true,
      debounceWait: 300,
      onSuccess(res) {
        setValidateSuccess(res.data.code === ResponseCode.SUCCESS);
      }
    }
  );

  const userValidator = async (_: any, value: string) => {
    const { data_permission_template_uid, username, hostname } =
      form.getFieldsValue([
        'data_permission_template_uid',
        'username',
        'hostname'
      ]);
    if (!data_permission_template_uid || !username || !hostname) {
      return Promise.resolve();
    }
    const res = await verifyDBAccount({
      data_permission_template_uid,
      username,
      hostname
    });
    if (res.data.code === ResponseCode.SUCCESS) {
      return Promise.resolve();
    }
    return Promise.reject(res.data.message);
  };
  const generatePassword = () => {
    const password = Password.generateMySQLPassword(16);
    form.setFieldsValue({
      password,
      confirm_password: password
    });
    return password;
  };
  return (
    <Box
      sx={{
        padding: (theme) => theme.layout.padding
      }}
    >
      <Card
        title={t('auth.addAuth.title')}
        extra={<BackButton />}
        className="add-auth-card"
      >
        <EmptyBox if={!success}>
          <Form form={form} {...formLayout}>
            <Divider orientation="left">
              {t('auth.addAuth.templateFormTitle')}
            </Divider>
            <Form.Item
              label={t('auth.addAuth.baseForm.template')}
              name="data_permission_template_uid"
              rules={[{ required: true }]}
            >
              <Select options={authTemplateOptions} />
            </Form.Item>
            <Form.Item
              label={t('auth.addAuth.baseForm.effectiveTimeDay')}
              name="effective_time_day"
              initialValue={-1}
              required={true}
            >
              <Select options={timeDayOptions} />
            </Form.Item>
            <Divider orientation="left">
              {t('auth.addAuth.steps.purpose')}
            </Divider>
            <UserSelect form={form} />
            <Form.Item
              name="purpose"
              label={t('auth.addAuth.purposeForm.purpose')}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="memo" label={t('auth.addAuth.purposeForm.memo')}>
              <Input.TextArea />
            </Form.Item>
            <Divider orientation="left">
              {t('auth.addAuth.steps.account')}
            </Divider>
            <Form.Item
              name="username"
              label={t('auth.addAuth.accountForm.username')}
              rules={[{ required: true, validator: userValidator }]}
              dependencies={['data_permission_template_uid', 'hostname']}
              extra={
                validateSuccess && (
                  <Typography.Text type="success">
                    {t('auth.addAuth.accountForm.usernameExtra')}
                  </Typography.Text>
                )
              }
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="hostname"
              label={t('auth.addAuth.accountForm.hostname')}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="password"
              label={t('auth.addAuth.accountForm.password')}
              rules={[{ required: true }]}
            >
              <InputPassword clickGeneratePassword={generatePassword} />
            </Form.Item>
            <Form.Item
              name="confirm_password"
              label={t('auth.addAuth.accountForm.confirm_password')}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(t('auth.addAuth.accountForm.password_error'))
                    );
                  }
                })
              ]}
              dependencies={['password']}
            >
              <Input.Password />
            </Form.Item>
          </Form>
          <Row>
            <Col span={17}>
              <Space className="footer-button">
                <Button onClick={resetFields}>{t('common.reset')}</Button>
                <Button type="primary" onClick={onSave}>
                  {t('common.ok')}
                </Button>
              </Space>
            </Col>
          </Row>
        </EmptyBox>
        <EmptyBox if={success}>
          <>
            <Result
              status="success"
              title={t('auth.addAuth.result.success')}
              subTitle={
                <>
                  {t('auth.addAuth.result.jumpDetailPrefix')}
                  {t('auth.addAuth.result.viewString')}
                  {t('auth.addAuth.result.jumpDetailSuffix')}
                </>
              }
            />
            <Row justify="center">
              <Link to={`${projectID}/auth/list`}>
                <Button type="link">
                  {t('auth.addAuth.result.jumpAuthList')}
                </Button>
              </Link>
              <Button type="link" onClick={resetFields}>
                {t('auth.addAuth.result.continue')}
              </Button>
            </Row>
          </>
        </EmptyBox>
        <PreviewModal
          params={params}
          setParams={setParams}
          onSuccess={onSuccess}
        />
      </Card>
    </Box>
  );
};

export default AddAuth;
