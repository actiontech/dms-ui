import { BasicButton, BasicDrawer, BasicInput } from '@actiontech/shared';
import { DrawerFormLayout } from '@actiontech/shared/lib/data/common';
import { ResponseCode } from '@actiontech/shared/lib/enum';
import audit_whitelist from '@actiontech/shared/lib/api/sqle/service/audit_whitelist';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';
import { getInstanceTipListV1FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import DBService from '@actiontech/shared/lib/api/base/service/DBService';
import { ListDBServiceTipsFunctionalModuleEnum } from '@actiontech/shared/lib/api/base/service/DBService/index.enum';
import { Form, Space, message } from 'antd';
import { useRequest } from 'ahooks';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  RuleExceptionDrawerProps,
  RuleExceptionFormFields
} from './index.type';

const DUPLICATE_RULE_EXCEPTION_CODE = 4010;

type RuleExceptionInstanceTip = {
  instance_id?: string;
  instance_name?: string;
};

const RuleExceptionDrawer: React.FC<RuleExceptionDrawerProps> = ({
  open,
  data,
  context,
  onClose,
  onCreated
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<RuleExceptionFormFields>();
  const [messageApi, messageContextHolder] = message.useMessage();

  const { data: instanceTips, loading: instanceTipsLoading } = useRequest(
    () =>
      context?.projectID
        ? DBService.ListDBServiceTips({
            project_uid: context.projectID,
            filter_db_type: context?.dbType,
            functional_module:
              ListDBServiceTipsFunctionalModuleEnum.create_workflow
          }).then((res) =>
            (res.data.data ?? []).map<RuleExceptionInstanceTip>((item) => ({
              instance_id: item.id,
              instance_name: item.name
            }))
          )
        : instance
            .getInstanceTipListV2({
              project_name: context?.projectName ?? '',
              filter_db_type: context?.dbType,
              functional_module:
                getInstanceTipListV1FunctionalModuleEnum.create_workflow
            })
            .then((res) => {
              if (res.data.code === ResponseCode.SUCCESS) {
                return res.data.data ?? [];
              }
              return [];
            })
            .catch(() => []),
    {
      ready: open && !!context?.projectName && !context?.instanceId
    }
  );

  const resolvedInstanceId = useMemo(() => {
    if (context?.instanceId) {
      return context.instanceId;
    }
    const matchedInstance = instanceTips?.find(
      (item) => item.instance_name === context?.instanceName
    );
    return matchedInstance?.instance_id;
  }, [context?.instanceId, context?.instanceName, instanceTips]);

  const lackRequiredContext =
    !context?.projectName ||
    !resolvedInstanceId ||
    !context?.sqlFingerprint ||
    !data?.rule_name;

  const { run: submit, loading: submitLoading } = useRequest(
    () => form.validateFields(),
    {
      manual: true,
      onSuccess(values) {
        audit_whitelist
          .createSQLRuleExceptionV1({
            project_name: context!.projectName,
            instance_id: `${resolvedInstanceId}`,
            sql_fingerprint: context!.sqlFingerprint,
            rule_name: data!.rule_name,
            rule_desc: data?.desc ?? data?.annotation ?? data?.message,
            rule_level: data?.level,
            reason: values.reason
          })
          .then((res) => {
            if (res.data.code === ResponseCode.SUCCESS) {
              messageApi.success(t('whitelist.ruleException.addSuccess'));
              form.resetFields();
              onCreated?.();
              onClose();
            } else if (res.data.code === DUPLICATE_RULE_EXCEPTION_CODE) {
              messageApi.warning(t('whitelist.ruleException.duplicateTips'));
              onClose();
            }
          });
      }
    }
  );

  return (
    <>
      {messageContextHolder}
      <BasicDrawer
        size="large"
        title={t('whitelist.ruleException.drawerTitle')}
        open={open}
        onClose={onClose}
        footer={
          <Space>
            <BasicButton onClick={onClose} disabled={submitLoading}>
              {t('common.close')}
            </BasicButton>
            <BasicButton
              type="primary"
              onClick={submit}
              loading={submitLoading}
              disabled={lackRequiredContext || instanceTipsLoading}
            >
              {t('common.submit')}
            </BasicButton>
          </Space>
        }
      >
        <Form form={form} layout="vertical" {...DrawerFormLayout}>
          <Form.Item label={t('whitelist.ruleException.project')}>
            <BasicInput disabled value={context?.projectName ?? '-'} />
          </Form.Item>
          <Form.Item label={t('whitelist.ruleException.instance')}>
            <BasicInput disabled value={context?.instanceName ?? '-'} />
          </Form.Item>
          <Form.Item label={t('whitelist.ruleException.sqlFingerprint')}>
            <BasicInput.TextArea
              disabled
              className="textarea-no-resize"
              autoSize={{ minRows: 2, maxRows: 4 }}
              value={context?.sqlFingerprint ?? ''}
              placeholder={t('whitelist.ruleException.missingSqlFingerprint')}
            />
          </Form.Item>
          <Form.Item label={t('whitelist.ruleException.ruleName')}>
            <BasicInput disabled value={data?.rule_name ?? '-'} />
          </Form.Item>
          <Form.Item label={t('whitelist.ruleException.ruleDesc')}>
            <BasicInput.TextArea
              disabled
              className="textarea-no-resize"
              autoSize={{ minRows: 2, maxRows: 6 }}
              value={data?.desc ?? data?.annotation ?? data?.message ?? '-'}
            />
          </Form.Item>
          <Form.Item label={t('whitelist.ruleException.ruleLevel')}>
            <BasicInput disabled value={data?.level ?? '-'} />
          </Form.Item>
          <Form.Item
            name="reason"
            label={t('whitelist.ruleException.reason')}
            rules={[{ required: true }, { whitespace: true }]}
          >
            <BasicInput.TextArea
              className="textarea-no-resize"
              autoSize={{ minRows: 3, maxRows: 8 }}
              placeholder={t('common.form.placeholder.input')}
            />
          </Form.Item>
        </Form>
      </BasicDrawer>
    </>
  );
};

export default RuleExceptionDrawer;
