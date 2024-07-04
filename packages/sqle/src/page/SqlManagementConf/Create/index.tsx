import { PageLayoutHasFixedHeaderStyleWrapper } from '@actiontech/shared/lib/styleWrapper/element';
import CreationResult from './CreationResult';
import BackToConf from '../Common/BackToConf';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import { useState } from 'react';
import { Form, Space } from 'antd';
import {
  BasicButton,
  EmptyBox,
  LazyLoadComponent,
  PageHeader
} from '@actiontech/shared';
import {
  FormStyleWrapper,
  formItemLayout
} from '@actiontech/shared/lib/components/FormCom/style';
import ConfForm from '../Common/ConfForm';

const CreateAuditPlan: React.FC = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { projectName, projectID } = useCurrentProject();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccessStatus, setSubmitSuccessStatus] = useState(false);

  const onReset = () => {
    form.resetFields();
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    console.log('on submit', values);
  };

  return (
    <PageLayoutHasFixedHeaderStyleWrapper>
      <PageHeader
        fixed
        title={<BackToConf />}
        extra={
          <EmptyBox if={!submitSuccessStatus}>
            <Space>
              <BasicButton onClick={onReset} disabled={submitLoading}>
                {t('common.reset')}
              </BasicButton>
              <BasicButton
                type="primary"
                htmlType="submit"
                onClick={onSubmit}
                loading={submitLoading}
              >
                {t('common.submit')}
              </BasicButton>
            </Space>
          </EmptyBox>
        }
      />

      <LazyLoadComponent open={!submitSuccessStatus} animation={false}>
        <FormStyleWrapper
          colon={false}
          labelAlign="left"
          className="hasTopHeader"
          form={form}
          {...formItemLayout.spaceBetween}
        >
          <ConfForm submitLoading={submitLoading} />
        </FormStyleWrapper>
      </LazyLoadComponent>

      <LazyLoadComponent open={submitSuccessStatus} animation={false}>
        <CreationResult />
      </LazyLoadComponent>
    </PageLayoutHasFixedHeaderStyleWrapper>
  );
};

export default CreateAuditPlan;
