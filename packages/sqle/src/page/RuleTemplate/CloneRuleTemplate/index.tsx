import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useBoolean } from 'ahooks';
import { IReduxState } from '../../../store';
import { ModalName } from '../../../data/ModalName';
import { updateRuleTemplateListModalStatus } from '../../../store/ruleTemplate';
import { message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCurrentProject } from '@actiontech/shared/lib/global';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { IProjectRuleTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EventEmitter from '../../../utils/EventEmitter';
import EmitterKey from '../../../data/EmitterKey';
import CloneRuleTemplateModal from '../../../page/GlobalRuleTemplate/CloneRuleTemplateModal';
import { CloneRuleTemplateFormFields } from '../../../page/GlobalRuleTemplate/CloneRuleTemplateModal/index.type';
import { parse2ReactRouterPath } from '@actiontech/shared/lib/components/TypedRouter/utils';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const CloneRuleTemplate = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { projectName, projectID } = useCurrentProject();
  const [messageApi, contextMessageHolder] = message.useMessage();

  const visible = useSelector<IReduxState, boolean>(
    (state) => !!state.ruleTemplate.modalStatus[ModalName.Clone_Rule_Template]
  );
  const currentRuleTemplate = useSelector<
    IReduxState,
    IProjectRuleTemplateResV1 | null
  >((state) => state.ruleTemplate.selectRuleTemplate);

  const [form] = useForm<CloneRuleTemplateFormFields>();

  const [requestPending, { setTrue: startRequest, setFalse: requestFinished }] =
    useBoolean();

  const onClose = () => {
    form.resetFields();
    dispatch(
      updateRuleTemplateListModalStatus({
        modalName: ModalName.Clone_Rule_Template,
        status: false
      })
    );
  };

  const onSubmit = async () => {
    const value = await form.validateFields();
    startRequest();
    rule_template
      .cloneProjectRuleTemplateV1({
        rule_template_name: currentRuleTemplate?.rule_template_name ?? '',
        new_rule_template_name: value.templateName,
        desc: value.templateDesc,
        project_name: projectName
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('ruleTemplate.cloneRuleTemplate.successTips', {
              name: currentRuleTemplate?.rule_template_name
            })
          );
          onClose();
          EventEmitter.emit(EmitterKey.Refresh_Rule_Template_List);
        }
      })
      .finally(() => {
        requestFinished();
      });
  };

  return (
    <>
      {contextMessageHolder}
      <CloneRuleTemplateModal
        visible={visible}
        loading={requestPending}
        onClose={onClose}
        onSubmit={onSubmit}
        link={parse2ReactRouterPath(ROUTE_PATHS.SQLE.RULE_TEMPLATE.update, {
          params: {
            projectID,
            templateName: currentRuleTemplate?.rule_template_name ?? ''
          }
        })}
        templateName={currentRuleTemplate?.rule_template_name}
        form={form}
      />
    </>
  );
};

export default CloneRuleTemplate;
