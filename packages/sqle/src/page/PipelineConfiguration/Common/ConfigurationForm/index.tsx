import {
  CustomLabelContent,
  FormItemLabel,
  FormItemSubTitle
} from '@actiontech/shared/lib/components/FormCom';
import { useTranslation } from 'react-i18next';
import { BasicInput } from '@actiontech/shared';
import { workflowNameRule } from '@actiontech/shared/lib/utils/FormRule';
import PipelineNodeField from './PipelineNodeField';
import React from 'react';

const PipelineConfigurationForm: React.FC<{ isEditionMode?: boolean }> = ({
  isEditionMode = false
}) => {
  const { t } = useTranslation();

  return (
    <>
      <FormItemSubTitle>
        {t('pipelineConfiguration.form.baseConfig')}
      </FormItemSubTitle>
      <FormItemLabel
        className="has-required-style has-label-tip"
        label={
          <CustomLabelContent
            title={t('pipelineConfiguration.form.name')}
            tips={t('pipelineConfiguration.form.nameTip')}
          />
        }
        name="name"
        rules={[
          { required: true },
          { validator: workflowNameRule() },
          { max: 59 }
        ]}
      >
        <BasicInput disabled={isEditionMode} />
      </FormItemLabel>
      <FormItemLabel
        className="has-label-tip"
        label={
          <CustomLabelContent
            title={t('pipelineConfiguration.form.desc')}
            tips={t('pipelineConfiguration.form.descTip')}
          />
        }
        name="description"
      >
        <BasicInput.TextArea />
      </FormItemLabel>
      <FormItemLabel
        className="has-label-tip"
        label={
          <CustomLabelContent
            title={t('pipelineConfiguration.form.address')}
            tips={t('pipelineConfiguration.form.addressTip')}
          />
        }
        name="address"
      >
        <BasicInput />
      </FormItemLabel>
      <FormItemLabel
        name="nodes"
        rules={[{ required: true }]}
        wrapperCol={{ span: 24 }}
      >
        <PipelineNodeField />
      </FormItemLabel>
    </>
  );
};

export default PipelineConfigurationForm;
