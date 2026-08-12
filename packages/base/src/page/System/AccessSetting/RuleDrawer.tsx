import { useCallback, useEffect } from 'react';
import { useBoolean } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { Form, Space, message } from 'antd';
import {
  BasicButton,
  BasicDrawer,
  BasicInput,
  BasicTag,
  EmptyBox,
  ResponseCode
} from '@actiontech/dms-kit';
import { DrawerFormLayout } from '@actiontech/dms-kit';
import Configuration from '@actiontech/shared/lib/api/base/service/Configuration';
import { IAccessWhitelistRuleItem } from '@actiontech/shared/lib/api/base/service/common';
import { isValidIPv4OrCIDR } from './utils';

export type AccessRuleFormFields = {
  source: string;
  remark?: string;
};

type AccessRuleDrawerProps = {
  open: boolean;
  editingRule: IAccessWhitelistRuleItem | null;
  onClose: () => void;
  onSuccess: () => void;
  canWrite: boolean;
};

const AccessRuleDrawer: React.FC<AccessRuleDrawerProps> = ({
  open,
  editingRule,
  onClose,
  onSuccess,
  canWrite
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<AccessRuleFormFields>();
  const [submitLoading, { setTrue: startSubmit, setFalse: finishSubmit }] =
    useBoolean();
  const [fillIpLoading, { setTrue: startFillIp, setFalse: finishFillIp }] =
    useBoolean();
  const [messageApi, messageContextHolder] = message.useMessage();
  const isEdit = !!editingRule?.uid;

  useEffect(() => {
    if (!open) {
      return;
    }
    if (editingRule) {
      form.setFieldsValue({
        source: editingRule.source,
        remark: editingRule.remark
      });
    } else {
      form.resetFields();
    }
  }, [open, editingRule, form]);

  const handleClose = useCallback(() => {
    form.resetFields();
    onClose();
  }, [form, onClose]);

  const handleUseCurrentIp = () => {
    startFillIp();
    Configuration.GetAccessRestrictionClientIP()
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          const clientIp = res.data.data?.client_ip;
          if (clientIp) {
            form.setFieldsValue({ source: clientIp });
          }
        }
      })
      .finally(() => {
        finishFillIp();
      });
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    startSubmit();
    const request = isEdit
      ? Configuration.UpdateAccessWhitelistRule({
          rule_uid: editingRule?.uid ?? '',
          source: values.source.trim(),
          remark: values.remark,
          policy_type: 'whitelist'
        })
      : Configuration.CreateAccessWhitelistRule({
          source: values.source.trim(),
          remark: values.remark,
          policy_type: 'whitelist'
        });

    request
      .then((res) => {
        if (res.data.code === ResponseCode.SUCCESS) {
          messageApi.success(
            isEdit
              ? t('dmsSystem.accessSettings.editSuccess')
              : t('dmsSystem.accessSettings.addSuccess')
          );
          handleClose();
          onSuccess();
        }
      })
      .finally(() => {
        finishSubmit();
      });
  };

  return (
    <>
      {messageContextHolder}
      <BasicDrawer
        title={
          isEdit
            ? t('dmsSystem.accessSettings.editRuleTitle')
            : t('dmsSystem.accessSettings.addRuleTitle')
        }
        open={open}
        onClose={handleClose}
        footer={
          <Space>
            <BasicButton onClick={handleClose} disabled={submitLoading}>
              {t('common.cancel')}
            </BasicButton>
            <EmptyBox if={canWrite}>
              <BasicButton
                type="primary"
                onClick={handleSubmit}
                loading={submitLoading}
              >
                {t('common.submit')}
              </BasicButton>
            </EmptyBox>
          </Space>
        }
      >
        <Form form={form} layout="vertical" {...DrawerFormLayout}>
          <Form.Item
            label={t('dmsSystem.accessSettings.columns.source')}
            name="source"
            rules={[
              {
                required: true,
                message: t('common.form.rule.require', {
                  name: t('dmsSystem.accessSettings.columns.source')
                })
              },
              {
                validator: (_, value) => {
                  if (!value || isValidIPv4OrCIDR(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(t('dmsSystem.accessSettings.invalidSource'))
                  );
                }
              }
            ]}
            extra={
              <EmptyBox if={canWrite}>
                <BasicButton
                  type="link"
                  size="small"
                  loading={fillIpLoading}
                  onClick={handleUseCurrentIp}
                  style={{ padding: 0 }}
                >
                  {t('dmsSystem.accessSettings.useCurrentIp')}
                </BasicButton>
              </EmptyBox>
            }
          >
            <BasicInput
              placeholder={t('dmsSystem.accessSettings.sourcePlaceholder')}
            />
          </Form.Item>
          <Form.Item label={t('dmsSystem.accessSettings.columns.policy')}>
            <BasicTag color="green">
              {t('dmsSystem.accessSettings.whitelistPolicy')}
            </BasicTag>
          </Form.Item>
          <Form.Item
            label={t('dmsSystem.accessSettings.columns.remark')}
            name="remark"
          >
            <BasicInput.TextArea
              className="textarea-no-resize"
              autoSize={{ minRows: 2, maxRows: 6 }}
              placeholder={t('common.form.placeholder.input')}
            />
          </Form.Item>
        </Form>
      </BasicDrawer>
    </>
  );
};

export default AccessRuleDrawer;
