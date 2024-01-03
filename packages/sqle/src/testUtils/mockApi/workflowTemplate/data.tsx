import { WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import { IconHonour } from '../../../icon/WorkflowTemplate';
import { StepInfoArrowEnum } from '../../../page/WorkflowTemplate/components/StepCard/index.type';

export const workflowTemplateData = {
  allow_submit_when_less_audit_level:
    WorkflowTemplateDetailResV1AllowSubmitWhenLessAuditLevelEnum.warn,
  desc: '700300 默认模板',
  update_time: '2023-12-26T14:19:12+08:00',
  workflow_step_template_list: [
    {
      approved_by_authorized: true,
      assignee_user_id_list: [],
      execute_by_authorized: false,
      number: 1,
      type: 'sql_review'
    },
    {
      approved_by_authorized: false,
      assignee_user_id_list: ['1739544663515205632'],
      desc: 'step desc',
      execute_by_authorized: false,
      number: 2,
      type: 'sql_review'
    },
    {
      approved_by_authorized: false,
      assignee_user_id_list: [],
      execute_by_authorized: true,
      number: 2,
      type: 'sql_execute'
    }
  ],
  workflow_template_name: '700300-WorkflowTemplate'
};

export const workflowTemplateCardProps = {
  rowKey: '1',
  key: '1',
  title: 'test',
  indexNumber: 1,
  show: true,
  disabled: false,
  icon: (
    <span className="honour-icon">
      <IconHonour />
    </span>
  ),
  arrow: StepInfoArrowEnum.none,
  desc: '',
  ...workflowTemplateData.workflow_step_template_list[0]
};
