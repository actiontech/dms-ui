import React, { ChangeEvent, useEffect, useState } from 'react';
import {
  StepNodeAlertStyleWrapper,
  UpdateWorkflowTemplateStyleWrapper
} from '../../style';
import { useTranslation } from 'react-i18next';
import { Divider, Form, Typography } from 'antd';
import { BasicInput, BasicSelect, BasicSwitch } from '@actiontech/dms-kit';
import { filterOptionByLabel } from '@actiontech/dms-kit/es/components/BasicSelect/utils';
import {
  ReviewAndExecUserTypeEnum,
  NodeTypeEnum,
  ReviewAndExecNodeInfoProps
} from './index.type';
import { IWorkFlowStepTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import StepButton from '../StepButton';
import { InfoCircleOutlined } from '@ant-design/icons';
const ReviewAndExecNodeInfo: React.FC<ReviewAndExecNodeInfoProps> = (props) => {
  const { t } = useTranslation();
  const [authorizedParam, setAuthorizedParam] = useState(
    props.type === NodeTypeEnum.review
      ? 'approved_by_authorized'
      : 'execute_by_authorized'
  );
  useEffect(() => {
    setAuthorizedParam(
      props.type === NodeTypeEnum.review
        ? 'approved_by_authorized'
        : 'execute_by_authorized'
    );
  }, [props.type]);
  const [userType, setUserType] = useState<ReviewAndExecUserTypeEnum>(
    ReviewAndExecUserTypeEnum.matchAuth
  );
  const updateNodeUsername = (value: string[]) => {
    if (value.length > 3) return;
    props.updateReviewAndExecNodeInfo({
      ...props?.defaultData,
      assignee_user_id_list: value
    });
  };
  const updateNodeType = (value: boolean) => {
    setUserType(
      value
        ? ReviewAndExecUserTypeEnum.matchAuth
        : ReviewAndExecUserTypeEnum.specify
    );
    props.updateReviewAndExecNodeInfo({
      ...props?.defaultData,
      [authorizedParam]: value,
      assignee_user_id_list: value
        ? []
        : props?.defaultData?.assignee_user_id_list ?? []
    });
  };
  const updateNodeDesc = (event: ChangeEvent<HTMLTextAreaElement>) => {
    props.updateReviewAndExecNodeInfo({
      ...props?.defaultData,
      desc: event.target.value
    });
  };
  React.useEffect(() => {
    if (!!props.defaultData) {
      const auth =
        props?.defaultData?.[
          authorizedParam as keyof IWorkFlowStepTemplateResV1
        ];
      setUserType(
        auth
          ? ReviewAndExecUserTypeEnum.matchAuth
          : ReviewAndExecUserTypeEnum.specify
      );
      props.form.setFieldsValue({
        [authorizedParam]: auth,
        desc: props?.defaultData?.desc,
        assignee_user_id_list: props?.defaultData?.assignee_user_id_list
      });
    }
  }, [props.defaultData, props.form, authorizedParam]);
  const prevStep = async () => {
    props.form.validateFields().then(() => props?.prevStep?.());
  };
  const nextStep = async () => {
    props.form.validateFields().then(() => props?.nextStep?.());
  };
  return (
    <UpdateWorkflowTemplateStyleWrapper>
      <div className="step-title-wrapper">
        <div className="step-title">
          {props.type === NodeTypeEnum.review
            ? t('workflowTemplate.step.progressTitle')
            : t('workflowTemplate.step.execTitle')}
        </div>
        <div className="step-title-info">
          {props.type === NodeTypeEnum.review
            ? t('workflowTemplate.step.progressDesc')
            : t('workflowTemplate.step.execDesc')}
        </div>
      </div>
      <div className="step-info-wrapper">
        <Form form={props.form} requiredMark={false} layout="vertical">
          <Form.Item
            label={t('workflowTemplate.form.label.reviewDesc')}
            name="desc"
            rules={[
              {
                validator(_, value) {
                  if (!value || value?.length <= 255) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    t('workflowTemplate.form.rule.descMessage')
                  );
                }
              }
            ]}
          >
            <BasicInput.TextArea
              onChange={updateNodeDesc}
              placeholder={t('common.form.placeholder.input')}
              data-testid="exec-user-desc"
              autoSize
              className="step-desc-textarea"
              size="middle"
            />
          </Form.Item>
          <Form.Item
            label={
              props.type === NodeTypeEnum.review
                ? t(
                    'workflowTemplate.progressConfig.review.reviewUserType.matchAudit'
                  )
                : t(
                    'workflowTemplate.progressConfig.exec.executeUserType.matchExecute'
                  )
            }
            name={[authorizedParam]}
            valuePropName="checked"
            rules={[
              {
                required: true
              }
            ]}
            className="authorized-item-switch"
          >
            <BasicSwitch onChange={updateNodeType} />
          </Form.Item>
          <Form.Item
            label={
              props.type === NodeTypeEnum.review
                ? t('workflowTemplate.form.label.reviewUser')
                : t('workflowTemplate.form.label.execUser')
            }
            name="assignee_user_id_list"
            rules={
              userType === ReviewAndExecUserTypeEnum.specify
                ? [
                    {
                      required: true,
                      message: t('workflowTemplate.form.rule.userRequired')
                    },
                    {
                      validator(_, value) {
                        if (Array.isArray(value) && value.length <= 3) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          t('workflowTemplate.form.rule.userMessage')
                        );
                      }
                    }
                  ]
                : []
            }
          >
            <BasicSelect
              disabled={userType === ReviewAndExecUserTypeEnum.matchAuth}
              onChange={updateNodeUsername}
              mode="multiple"
              showSearch
              loading={props.getUsernameListLoading}
              placeholder={t('common.form.placeholder.select')}
              data-testid="exec-user-select"
              size="middle"
              filterOption={filterOptionByLabel}
            >
              {props.generateUsernameSelectOption()}
            </BasicSelect>
          </Form.Item>
          <StepButton
            currentStep={props.currentStep}
            totalStep={props.totalStep}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        </Form>
        <Divider className="step-info-divider" />
        <StepNodeAlertStyleWrapper>
          <Typography.Text className="step-alert-title">
            <InfoCircleOutlined className="step-alert-title-tips-icon" />
            {t('workflowTemplate.progressConfig.ruler.title')}
          </Typography.Text>
          <Typography.Paragraph className="step-alert-content">
            <ul className="step-alert-item-icon">
              <li>{t('workflowTemplate.progressConfig.ruler.rule1')}</li>
              <li>{t('workflowTemplate.progressConfig.ruler.rule2')}</li>
              <li>{t('workflowTemplate.progressConfig.ruler.rule3')}</li>
            </ul>
          </Typography.Paragraph>
        </StepNodeAlertStyleWrapper>
      </div>
    </UpdateWorkflowTemplateStyleWrapper>
  );
};
export default ReviewAndExecNodeInfo;
