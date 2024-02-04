import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useBoolean } from 'ahooks';
import { message } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import EmitterKey from '../../../../../data/EmitterKey';
import { ModalName } from '../../../../../data/ModalName';
import { IReduxState } from '../../../../../store';
import { updateGlobalRuleTemplateListModalStatus } from '../../../../../store/globalRuleTemplate';
import EventEmitter from '../../../../../utils/EventEmitter';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { IRuleTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import CloneRuleTemplateModal from '../../../CloneRuleTemplateModal';
import { CloneRuleTemplateFormFields } from '../../../CloneRuleTemplateModal/index.type';

const CloneGlobalRuleTemplate = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [form] = useForm<CloneRuleTemplateFormFields>();

  const [messageApi, messageContextHolder] = message.useMessage();

  const visible = useSelector<IReduxState, boolean>(
    (state) =>
      !!state.globalRuleTemplate.modalStatus[ModalName.Clone_Rule_Template]
  );
  const [requestPending, { setTrue: startRequest, setFalse: requestFinished }] =
    useBoolean();

  const currentRuleTemplate = useSelector<
    IReduxState,
    IRuleTemplateResV1 | null
  >((state) => state.globalRuleTemplate.selectGlobalRuleTemplate);

  const onClose = () => {
    form.resetFields();
    dispatch(
      updateGlobalRuleTemplateListModalStatus({
        modalName: ModalName.Clone_Rule_Template,
        status: false
      })
    );
  };

  const onSubmit = async () => {
    const value = await form.validateFields();
    startRequest();
    rule_template
      .CloneRuleTemplateV1({
        rule_template_name: currentRuleTemplate?.rule_template_name ?? '',
        new_rule_template_name: value.templateName,
        desc: value.templateDesc
      })
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            t('ruleTemplate.cloneRuleTemplate.successTips', {
              name: currentRuleTemplate?.rule_template_name
            })
          );
          onClose();
          EventEmitter.emit(EmitterKey.Refresh_Global_Rule_Template_List);
        }
      })
      .finally(() => {
        requestFinished();
      });
  };

  return (
    <>
      {messageContextHolder}
      <CloneRuleTemplateModal
        visible={visible}
        loading={requestPending}
        onClose={onClose}
        onSubmit={onSubmit}
        link={`/sqle/ruleManager/globalUpdate/${currentRuleTemplate?.rule_template_name}`}
        templateName={currentRuleTemplate?.rule_template_name}
        form={form}
      />
    </>
  );
};

export default CloneGlobalRuleTemplate;
