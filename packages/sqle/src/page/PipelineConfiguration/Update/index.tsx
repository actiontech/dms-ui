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
import { Spin, Space } from 'antd';
import { BriefcaseFilled } from '@actiontech/icons';
import PipelineConfigurationForm from '../Common/ConfigurationForm';
import pipeline from '@actiontech/shared/lib/api/sqle/service/pipeline';
import { useParams } from 'react-router-dom';
import { useRequest } from 'ahooks';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { omit } from 'lodash';
import {
  pipelineNodeBaseAuditMethodEnum,
  pipelineNodeBaseObjectTypeEnum,
  pipelineNodeBaseTypeEnum,
  pipelineNodeToBeUpdatedAuditMethodEnum,
  pipelineNodeToBeUpdatedObjectTypeEnum,
  pipelineNodeToBeUpdatedTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import usePipelineConfigurationFormState from '../Common/ConfigurationForm/hooks/usePipelineConfigurationFormState';

const CreatePipelineConfiguration = () => {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();

  const {
    form,
    submitLoading,
    startSubmit,
    finishSubmit,
    submitSuccessStatus,
    successfulSubmit,
    projectName,
    setSelectPipelineId,
    openPipelineDetailModal
  } = usePipelineConfigurationFormState();

  const { loading: getPipelineDetailLoading } = useRequest(() =>
    pipeline
      .getPipelineDetailV1({
        pipeline_id: id ?? '',
        project_name: projectName ?? ''
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const { data } = res.data;
          form.setFieldsValue({
            name: data?.name,
            description: data?.description,
            address: data?.address,
            nodes:
              data?.nodes?.map((i) => ({
                ...omit(i, 'integration_info'),
                audit_method:
                  i.audit_method as unknown as pipelineNodeBaseAuditMethodEnum,
                object_type:
                  i.object_type as unknown as pipelineNodeBaseObjectTypeEnum,
                type: i.type as unknown as pipelineNodeBaseTypeEnum
              })) ?? []
          });
        }
      })
  );

  const onSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    pipeline
      .updatePipelineV1({
        project_name: projectName,
        pipeline_id: id ?? '',
        ...values,
        nodes:
          values?.nodes?.map((i) => ({
            ...omit(i, 'integration_info'),
            audit_method:
              i.audit_method as unknown as pipelineNodeToBeUpdatedAuditMethodEnum,
            object_type:
              i.object_type as unknown as pipelineNodeToBeUpdatedObjectTypeEnum,
            type: i.type as unknown as pipelineNodeToBeUpdatedTypeEnum
          })) ?? []
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          setSelectPipelineId(Number(id));
          successfulSubmit();
        }
      })
      .finally(() => {
        finishSubmit();
      });
  };

  const onReset = () => {
    form.resetFields(
      Object.keys(form.getFieldsValue()).filter((key) => key !== 'name')
    );
  };

  return (
    <>
      <PageHeader
        fixed
        title={<BackToList />}
        extra={
          <EmptyBox if={!submitSuccessStatus}>
            <Space>
              <BasicButton
                onClick={onReset}
                loading={getPipelineDetailLoading || submitLoading}
              >
                {t('common.reset')}
              </BasicButton>
              <BasicButton
                type="primary"
                onClick={onSubmit}
                loading={getPipelineDetailLoading || submitLoading}
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
            title={t('pipelineConfiguration.update.successTips')}
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
                {t('pipelineConfiguration.update.title')}
              </FormItemBigTitle>
              <Spin spinning={getPipelineDetailLoading}>
                <PipelineConfigurationForm isEditionMode />
              </Spin>
            </FormAreaBlockStyleWrapper>
          </FormAreaLineStyleWrapper>
        </FormStyleWrapper>
      </EmptyBox>
    </>
  );
};

export default CreatePipelineConfiguration;
