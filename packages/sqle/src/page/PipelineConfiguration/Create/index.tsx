import {
  PageHeader,
  BasicButton,
  EmptyBox,
  BasicResult
} from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import BackToList from '../Common/BackToList';
import {
  FormStyleWrapper,
  formItemLayout,
  FormAreaBlockStyleWrapper,
  FormAreaLineStyleWrapper
} from '@actiontech/shared/lib/components/FormCom/style';
import { FormItemBigTitle } from '@actiontech/shared/lib/components/FormCom';
import { Space } from 'antd';
import { BriefcaseFilled } from '@actiontech/icons';
import PipelineConfigurationForm from '../Common/ConfigurationForm';
import pipeline from '@actiontech/shared/lib/api/sqle/service/pipeline';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { omit } from 'lodash';
import usePipelineConfigurationFormState from '../Common/ConfigurationForm/hooks/usePipelineConfigurationFormState';

const CreatePipelineConfiguration = () => {
  const { t } = useTranslation();

  const {
    form,
    submitLoading,
    startSubmit,
    finishSubmit,
    submitSuccessStatus,
    successfulSubmit,
    setSelectPipelineId,
    openPipelineDetailModal,
    projectName
  } = usePipelineConfigurationFormState();

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    pipeline
      .createPipelineV1({
        project_name: projectName,
        ...values,
        nodes: values.nodes?.map((i) => omit(i, 'id'))
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setSelectPipelineId(res.data.data?.pipeline_id);
          successfulSubmit();
        }
      })
      .finally(() => {
        finishSubmit();
      });
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <>
      <PageHeader
        fixed
        title={<BackToList />}
        extra={
          <EmptyBox if={!submitSuccessStatus}>
            <Space>
              <BasicButton onClick={onReset} loading={submitLoading}>
                {t('common.reset')}
              </BasicButton>
              <BasicButton
                type="primary"
                onClick={onSubmit}
                loading={submitLoading}
              >
                {t('common.save')}
              </BasicButton>
            </Space>
          </EmptyBox>
        }
      />

      <EmptyBox
        if={!submitSuccessStatus}
        defaultNode={
          <BasicResult
            title={t('pipelineConfiguration.create.successTips')}
            subTitle={t('pipelineConfiguration.create.successSubTips')}
            extra={[
              <BasicButton
                type="primary"
                key="check-desc"
                onClick={openPipelineDetailModal}
              >
                {t('pipelineConfiguration.create.successButtonText')}
              </BasicButton>
            ]}
          />
        }
      >
        <FormStyleWrapper
          colon={false}
          labelAlign="left"
          className="hasTopHeader"
          form={form}
          {...formItemLayout.spaceBetween}
        >
          <FormAreaLineStyleWrapper>
            <FormAreaBlockStyleWrapper>
              <FormItemBigTitle>
                <BriefcaseFilled
                  width={42}
                  height={40}
                  className="title-icon"
                />
                {t('pipelineConfiguration.create.title')}
              </FormItemBigTitle>
              <PipelineConfigurationForm />
            </FormAreaBlockStyleWrapper>
          </FormAreaLineStyleWrapper>
        </FormStyleWrapper>
      </EmptyBox>
    </>
  );
};

export default CreatePipelineConfiguration;
