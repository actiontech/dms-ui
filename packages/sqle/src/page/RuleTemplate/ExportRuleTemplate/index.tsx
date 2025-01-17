import { useTranslation } from 'react-i18next';
import ExportRuleTemplate from '../../GlobalRuleTemplate/ExportRuleTemplate';
import { useCallback } from 'react';
import { Form, message } from 'antd';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { useCurrentProject } from '@actiontech/shared/lib/features';
import { ExportRuleTemplateFormFields } from '../../GlobalRuleTemplate/ExportRuleTemplate/index.type';
import { exportProjectRuleTemplateV1ExportTypeEnum } from '@actiontech/shared/lib/api/sqle/service/rule_template/index.enum';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../../../store';
import { ModalName } from '../../../data/ModalName';
import { updateRuleTemplateListModalStatus } from '../../../store/ruleTemplate';
import { useBoolean } from 'ahooks';

const ExportProjectRuleTemplate: React.FC = () => {
  const { t } = useTranslation();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { projectName } = useCurrentProject();
  const [form] = Form.useForm<ExportRuleTemplateFormFields>();
  const dispatch = useDispatch();
  const [requestPending, { setTrue: startRequest, setFalse: requestFinished }] =
    useBoolean();

  const { currentRuleTemplate, open } = useSelector((state: IReduxState) => ({
    currentRuleTemplate: state.ruleTemplate.selectRuleTemplate,
    open: state.ruleTemplate.modalStatus[ModalName.Export_Rule_Template]
  }));

  const onClose = useCallback(() => {
    form.resetFields();
    dispatch(
      updateRuleTemplateListModalStatus({
        modalName: ModalName.Export_Rule_Template,
        status: false
      })
    );
  }, [dispatch, form]);

  const obSubmit = useCallback(
    (values: ExportRuleTemplateFormFields) => {
      const templateName = currentRuleTemplate?.rule_template_name ?? '';
      const hideLoading = messageApi.loading(
        t('ruleTemplate.exportRuleTemplate.exporting', { name: templateName }),
        0
      );
      startRequest();

      rule_template
        .exportProjectRuleTemplateV1(
          {
            export_type:
              values.exportFileType as unknown as exportProjectRuleTemplateV1ExportTypeEnum,
            rule_template_name: templateName,
            project_name: projectName
          },
          {
            responseType: 'blob'
          }
        )
        .then(() => {
          onClose();
        })
        .finally(() => {
          hideLoading();
          requestFinished();
        });
    },
    [
      currentRuleTemplate?.rule_template_name,
      messageApi,
      onClose,
      projectName,
      requestFinished,
      startRequest,
      t
    ]
  );
  return (
    <>
      {messageContextHolder}
      <ExportRuleTemplate
        open={open}
        onClose={onClose}
        onSubmit={obSubmit}
        form={form}
        submitPending={requestPending}
      />
    </>
  );
};

export default ExportProjectRuleTemplate;
