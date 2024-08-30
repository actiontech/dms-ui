import {
  BasicSelect,
  BasicButton,
  BasicInput,
  EmptyBox
} from '@actiontech/shared';
import { Form, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { PipelineNodeModalProps } from '../../index.type';
import {
  CustomLabelContent,
  FormItemLabel
} from '@actiontech/shared/lib/components/FormCom';
import { workflowNameRule } from '@actiontech/shared/lib/utils/FormRule';
import {
  PipelineNodeTypeOptions,
  PipelineNodeObjectTypeOptions,
  PipelineNodeAuditMethodOptions
} from '../../index.data';
import { PipelineNodeModalStyleWrapper } from '../../../style';
import {
  pipelineNodeDetailAuditMethodEnum,
  pipelineNodeBaseTypeEnum
} from '@actiontech/shared/lib/api/sqle/service/common.enum';
import useInstance from '../../../../../../hooks/useInstance';
import { useEffect, useMemo } from 'react';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import useGlobalRuleTemplate from '../../../../../../hooks/useGlobalRuleTemplate';
import useRuleTemplate from '../../../../../../hooks/useRuleTemplate';
import { ruleTemplateListDefaultKey } from '../../../../../../data/common';
import { useRequest } from 'ahooks';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import { isNumber } from 'lodash';
import useDatabaseType from '../../../../../../hooks/useDatabaseType';
import { getInstanceTipListV1FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';

const NodeModal: React.FC<PipelineNodeModalProps> = ({
  visible,
  editNodeId,
  onCancel,
  onSubmit,
  form,
  nodeNameList
}) => {
  const { t } = useTranslation();

  const auditMethod = Form.useWatch('audit_method', form);

  const instanceName = Form.useWatch('instance_name', form);

  const templateName = Form.useWatch('rule_template_name', form);

  const instanceType = Form.useWatch('instance_type', form);

  const { projectName } = useCurrentProject();

  const {
    instanceOptions,
    updateInstanceList,
    loading: getInstanceLoading
  } = useInstance();

  const {
    loading: getDriverMetaLoading,
    updateDriverNameList,
    generateDriverSelectOptions
  } = useDatabaseType();

  const {
    loading: getGlobalRuleTemplateLoading,
    updateGlobalRuleTemplateList,
    globalRuleTemplateTipsOptions
  } = useGlobalRuleTemplate();

  const {
    loading: getRuleTemplateListLoading,
    updateRuleTemplateList,
    ruleTemplateTipsOptions
  } = useRuleTemplate();

  const ruleTemplateOptions = useMemo(() => {
    return [
      ...ruleTemplateTipsOptions(instanceType ?? ruleTemplateListDefaultKey),
      ...globalRuleTemplateTipsOptions(
        instanceType ?? ruleTemplateListDefaultKey
      )
    ];
  }, [ruleTemplateTipsOptions, globalRuleTemplateTipsOptions, instanceType]);

  const { loading: instanceInfoLoading } = useRequest(
    () => {
      return instance
        .getInstanceV2({
          instance_name: instanceName ?? '',
          project_name: projectName
        })
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS && !templateName) {
            form.setFieldsValue({
              rule_template_name: res.data.data?.rule_template?.name
            });
          }
          return res.data.data;
        });
    },
    {
      ready: !!instanceName,
      refreshDeps: [instanceName]
    }
  );

  useEffect(() => {
    if (auditMethod === pipelineNodeDetailAuditMethodEnum.offline) {
      form.resetFields(['instance_name']);
    } else if (auditMethod === pipelineNodeDetailAuditMethodEnum.online) {
      form.resetFields(['instance_type']);
    }
  }, [auditMethod, form]);

  const onInstanceTypeChange = () => {
    form.resetFields(['rule_template_name']);
  };

  useEffect(() => {
    if (auditMethod === pipelineNodeDetailAuditMethodEnum.online) {
      updateInstanceList({
        project_name: projectName,
        functional_module:
          getInstanceTipListV1FunctionalModuleEnum.create_pipeline
      });
    }
  }, [projectName, auditMethod, updateInstanceList]);

  useEffect(() => {
    updateRuleTemplateList(projectName);
    updateGlobalRuleTemplateList();
  }, [projectName, updateGlobalRuleTemplateList, updateRuleTemplateList]);

  useEffect(() => {
    updateDriverNameList();
  }, [updateDriverNameList]);

  return (
    <PipelineNodeModalStyleWrapper
      open={visible}
      title={
        !isNumber(editNodeId)
          ? t('pipelineConfiguration.form.node.modal.createTitle')
          : t('pipelineConfiguration.form.node.modal.editTitle')
      }
      onClose={onCancel}
      footer={
        <Space>
          <BasicButton onClick={onCancel}>{t('common.close')}</BasicButton>
          <BasicButton type="primary" onClick={onSubmit}>
            {t('common.submit')}
          </BasicButton>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        <FormItemLabel
          name="name"
          label={t('pipelineConfiguration.form.node.name')}
          rules={[
            { required: true },
            { validator: workflowNameRule() },
            {
              validator: (_, value) => {
                if (nodeNameList.includes(value)) {
                  return Promise.reject(
                    t('pipelineConfiguration.form.node.duplicateName')
                  );
                }
                return Promise.resolve();
              }
            },
            { max: 59 }
          ]}
        >
          <BasicInput />
        </FormItemLabel>
        <FormItemLabel
          name="type"
          label={t('pipelineConfiguration.form.node.type')}
          rules={[{ required: true }]}
          initialValue={pipelineNodeBaseTypeEnum.audit}
        >
          <BasicSelect options={PipelineNodeTypeOptions} />
        </FormItemLabel>
        <FormItemLabel
          name="object_type"
          className="has-required-style has-label-tip"
          label={
            <CustomLabelContent
              title={t('pipelineConfiguration.form.node.auditObjectType')}
              tips={t('pipelineConfiguration.form.node.auditObjectTypeTips')}
            />
          }
          rules={[{ required: true }]}
        >
          <BasicSelect options={PipelineNodeObjectTypeOptions} />
        </FormItemLabel>
        <FormItemLabel
          name="object_path"
          className="has-required-style has-label-tip"
          label={
            <CustomLabelContent
              title={t('pipelineConfiguration.form.node.auditObjectPath')}
              tips={t('pipelineConfiguration.form.node.auditObjectPathTips')}
            />
          }
          rules={[{ required: true }]}
        >
          <BasicInput />
        </FormItemLabel>
        <FormItemLabel
          name="audit_method"
          className="has-required-style has-label-tip"
          label={
            <CustomLabelContent
              title={t('pipelineConfiguration.form.node.auditMethod')}
              tips={t('pipelineConfiguration.form.node.auditMethodTips')}
            />
          }
          initialValue={pipelineNodeDetailAuditMethodEnum.offline}
        >
          <BasicSelect options={PipelineNodeAuditMethodOptions} />
        </FormItemLabel>
        <EmptyBox
          if={auditMethod === pipelineNodeDetailAuditMethodEnum.offline}
        >
          <FormItemLabel
            className="has-required-style"
            label={t('auditPlan.planForm.dataSource.dbType')}
            name="instance_type"
            rules={[
              {
                required: true
              }
            ]}
          >
            <BasicSelect
              allowClear
              loading={getDriverMetaLoading}
              onChange={onInstanceTypeChange}
            >
              {generateDriverSelectOptions()}
            </BasicSelect>
          </FormItemLabel>
        </EmptyBox>

        <EmptyBox if={auditMethod === pipelineNodeDetailAuditMethodEnum.online}>
          <FormItemLabel
            name="instance_name"
            className="has-required-style has-label-tip"
            label={
              <CustomLabelContent
                title={t('pipelineConfiguration.form.node.instance')}
                tips={t('pipelineConfiguration.form.node.instanceTips')}
              />
            }
            rules={[{ required: true }]}
          >
            <BasicSelect
              options={instanceOptions}
              loading={getInstanceLoading}
            />
          </FormItemLabel>
        </EmptyBox>
        <FormItemLabel
          name="rule_template_name"
          className="has-required-style has-label-tip"
          label={
            <CustomLabelContent
              title={t('pipelineConfiguration.form.node.template')}
              tips={t('pipelineConfiguration.form.node.templateTips')}
            />
          }
          rules={[{ required: true }]}
        >
          <BasicSelect
            options={ruleTemplateOptions}
            loading={
              getGlobalRuleTemplateLoading ||
              getRuleTemplateListLoading ||
              instanceInfoLoading
            }
          />
        </FormItemLabel>
      </Form>
    </PipelineNodeModalStyleWrapper>
  );
};

export default NodeModal;
