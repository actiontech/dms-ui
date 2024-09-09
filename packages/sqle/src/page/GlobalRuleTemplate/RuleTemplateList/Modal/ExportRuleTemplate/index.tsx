import { useForm } from 'antd/es/form/Form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { ExportRuleTemplateFormFields } from '../../../ExportRuleTemplate/index.type';
import { message } from 'antd';
import { IReduxState } from '../../../../../store';
import { ModalName } from '../../../../../data/ModalName';
import { useBoolean } from 'ahooks';
import { IRuleTemplateResV1 } from '@actiontech/shared/lib/api/sqle/service/common';
import { updateGlobalRuleTemplateListModalStatus } from '../../../../../store/globalRuleTemplate';
import rule_template from '@actiontech/shared/lib/api/sqle/service/rule_template';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import ExportRuleTemplate from '../../../ExportRuleTemplate';
import { useCallback } from 'react';

const ExportRuleTemplateModal: React.FC = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [form] = useForm<ExportRuleTemplateFormFields>();

  const [messageApi, messageContextHolder] = message.useMessage();

  const open = useSelector<IReduxState, boolean>(
    (state) =>
      !!state.globalRuleTemplate.modalStatus[ModalName.Export_Rule_Template]
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
        modalName: ModalName.Export_Rule_Template,
        status: false
      })
    );
  };

  const onSubmit = useCallback(
    async (values: ExportRuleTemplateFormFields) => {
      const templateName = currentRuleTemplate?.rule_template_name ?? '';

      const hideLoading = messageApi.loading(
        t('ruleTemplate.exportRuleTemplate.exporting', { name: templateName }),
        0
      );
      startRequest();

      rule_template
        .exportRuleTemplateV1(
          {
            rule_template_name: templateName,
            export_type: values.exportFileType
          },
          {
            responseType: 'blob'
          }
        )
        .then((res) => {
          if (res.data.code === ResponseCode.SUCCESS) {
            messageApi.success(
              t('ruleTemplate.exportRuleTemplate.exportSuccessTips', {
                name: templateName
              })
            );
          }
        })
        .finally(() => {
          hideLoading();
          requestFinished();
        });
    },
    [
      currentRuleTemplate?.rule_template_name,
      messageApi,
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
        submitPending={requestPending}
        onClose={onClose}
        onSubmit={onSubmit}
        form={form}
      />
    </>
  );
};

export default ExportRuleTemplateModal;
