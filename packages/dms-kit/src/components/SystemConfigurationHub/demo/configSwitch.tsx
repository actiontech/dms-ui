import React, { useState } from 'react';
import {
  ConfigProvider,
  ConfigSwitch,
  useConfigSwitchControls
} from '@actiontech/dms-kit';
import { Form, Space, Card } from 'antd';

interface SwitchConfig {
  emailEnabled: boolean;
  smsEnabled: boolean;
  auditEnabled: boolean;
}

const ConfigSwitchDemo = () => {
  const [form] = Form.useForm<SwitchConfig>();
  const [submitLoading, setSubmitLoading] = useState(false);

  // 邮件通知配置开关
  const emailControls = useConfigSwitchControls(form, 'emailEnabled');

  // 短信通知配置开关
  const smsControls = useConfigSwitchControls(form, 'smsEnabled');

  // 审计日志配置开关
  const auditControls = useConfigSwitchControls(form, 'auditEnabled');

  React.useEffect(() => {
    form.setFieldsValue({
      emailEnabled: true,
      smsEnabled: false,
      auditEnabled: true
    });
  }, [form]);

  const handleSwitchAction = (fieldName: keyof SwitchConfig, controls: any) => {
    setSubmitLoading(true);
    setTimeout(() => {
      controls.hiddenConfigSwitchPopover();
      setSubmitLoading(false);
      console.log(`${fieldName} 状态已更新`);
    }, 1000);
  };

  return (
    <ConfigProvider>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
        <h3>配置开关示例</h3>

        <Form form={form} layout="vertical">
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Card title="通知配置" size="small">
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>邮件通知</span>
                  <ConfigSwitch
                    title={emailControls.generateConfigSwitchPopoverTitle(
                      false,
                      '确定要切换邮件通知状态吗？'
                    )}
                    switchFieldName="emailEnabled"
                    submitLoading={submitLoading}
                    popoverVisible={emailControls.configSwitchPopoverOpenState}
                    onConfirm={() =>
                      handleSwitchAction('emailEnabled', emailControls)
                    }
                    onSwitchChange={(open) =>
                      emailControls.handleConfigSwitchChange(open, () => {})
                    }
                    onSwitchPopoverOpen={
                      emailControls.onConfigSwitchPopoverOpen
                    }
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>短信通知</span>
                  <ConfigSwitch
                    title={smsControls.generateConfigSwitchPopoverTitle(
                      false,
                      '确定要切换短信通知状态吗？'
                    )}
                    switchFieldName="smsEnabled"
                    submitLoading={submitLoading}
                    popoverVisible={smsControls.configSwitchPopoverOpenState}
                    onConfirm={() =>
                      handleSwitchAction('smsEnabled', smsControls)
                    }
                    onSwitchChange={(open) =>
                      smsControls.handleConfigSwitchChange(open, () => {})
                    }
                    onSwitchPopoverOpen={smsControls.onConfigSwitchPopoverOpen}
                  />
                </div>
              </Space>
            </Card>

            <Card title="系统配置" size="small">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Space direction="vertical" size={0}>
                  <span>审计日志</span>
                  <span style={{ fontSize: 12, color: '#999' }}>
                    记录系统操作日志
                  </span>
                </Space>
                <ConfigSwitch
                  title={auditControls.generateConfigSwitchPopoverTitle(
                    false,
                    '关闭审计日志将影响安全合规，确定要继续吗？'
                  )}
                  switchFieldName="auditEnabled"
                  submitLoading={submitLoading}
                  popoverVisible={auditControls.configSwitchPopoverOpenState}
                  onConfirm={() =>
                    handleSwitchAction('auditEnabled', auditControls)
                  }
                  onSwitchChange={(open) =>
                    auditControls.handleConfigSwitchChange(open, () => {})
                  }
                  onSwitchPopoverOpen={auditControls.onConfigSwitchPopoverOpen}
                />
              </div>
            </Card>
          </Space>
        </Form>
      </div>
    </ConfigProvider>
  );
};

export default ConfigSwitchDemo;
