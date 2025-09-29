import React, { useState, useMemo } from 'react';
import {
  ConfigProvider,
  useConfigRender,
  useConfigSwitchControls,
  ConfigSwitch,
  ConfigSubmitButtonField,
  FormItemLabel,
  ReadOnlyConfigColumnsType
} from '@actiontech/dms-kit';
import { Input, InputNumber, message } from 'antd';

interface DatabaseConfig {
  enabled: boolean;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  timeout: number;
}

const SystemConfigurationHubBasicDemo = () => {
  const [submitLoading, setSubmitLoading] = useState(false);

  const initialData: DatabaseConfig = useMemo(
    () => ({
      enabled: true,
      host: 'localhost',
      port: 3306,
      username: 'admin',
      password: '******',
      database: 'dms_system',
      timeout: 30
    }),
    []
  );

  const {
    modifyFlag,
    startModify,
    modifyFinish,
    renderConfigForm,
    form,
    enabled
  } = useConfigRender<DatabaseConfig>({
    switchFieldName: 'enabled',
    switchFieldLabel: '启用数据库连接'
  });

  const {
    configSwitchPopoverOpenState,
    generateConfigSwitchPopoverTitle,
    onConfigSwitchPopoverOpen,
    handleConfigSwitchChange,
    hiddenConfigSwitchPopover
  } = useConfigSwitchControls(form, 'enabled');

  // 初始化表单数据
  React.useEffect(() => {
    form.setFieldsValue(initialData);
  }, [form, initialData]);

  const handleSubmit = async (values: DatabaseConfig) => {
    setSubmitLoading(true);
    // 模拟提交
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSubmitLoading(false);
    hiddenConfigSwitchPopover();
    modifyFinish();
    message.success('配置保存成功');
    // 在实际应用中，这里会处理提交的配置数据
    void values; // 标记参数已使用
  };

  const handleCancel = () => {
    form.setFieldsValue(initialData);
    hiddenConfigSwitchPopover();
    modifyFinish();
  };

  const readOnlyColumns: ReadOnlyConfigColumnsType<DatabaseConfig> = [
    {
      label: '数据库主机',
      dataIndex: 'host',
      render: (val: string) => val || '--'
    },
    {
      label: '端口',
      dataIndex: 'port',
      render: (val: number) => val?.toString() || '--'
    },
    {
      label: '用户名',
      dataIndex: 'username'
    },
    {
      label: '数据库名',
      dataIndex: 'database'
    },
    {
      label: '超时时间',
      dataIndex: 'timeout',
      render: (val: number) => `${val} 秒`
    }
  ];

  const configField = (
    <>
      <FormItemLabel
        label="数据库主机"
        name="host"
        rules={[{ required: true, message: '请输入数据库主机' }]}
      >
        <Input placeholder="请输入数据库主机地址" />
      </FormItemLabel>

      <FormItemLabel
        label="端口"
        name="port"
        rules={[{ required: true, message: '请输入端口号' }]}
      >
        <InputNumber
          min={1}
          max={65535}
          placeholder="请输入端口号"
          style={{ width: '100%' }}
        />
      </FormItemLabel>

      <FormItemLabel
        label="用户名"
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="请输入数据库用户名" />
      </FormItemLabel>

      <FormItemLabel
        label="密码"
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password placeholder="请输入数据库密码" />
      </FormItemLabel>

      <FormItemLabel
        label="数据库名"
        name="database"
        rules={[{ required: true, message: '请输入数据库名' }]}
      >
        <Input placeholder="请输入数据库名称" />
      </FormItemLabel>

      <FormItemLabel
        label="超时时间(秒)"
        name="timeout"
        rules={[{ required: true, message: '请输入超时时间' }]}
      >
        <InputNumber
          min={1}
          max={300}
          placeholder="请输入超时时间"
          style={{ width: '100%' }}
        />
      </FormItemLabel>
    </>
  );

  const configSwitchNode = (
    <ConfigSwitch
      title={generateConfigSwitchPopoverTitle(modifyFlag)}
      switchFieldName="enabled"
      submitLoading={submitLoading}
      popoverVisible={configSwitchPopoverOpenState}
      onConfirm={hiddenConfigSwitchPopover}
      onSwitchChange={(open) => handleConfigSwitchChange(open, startModify)}
      onSwitchPopoverOpen={onConfigSwitchPopoverOpen}
      checked={enabled}
    />
  );

  const submitButtonField = (
    <ConfigSubmitButtonField
      submitLoading={submitLoading}
      handleClickCancel={handleCancel}
    />
  );

  return (
    <ConfigProvider>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <h3>系统配置 - 数据库连接</h3>
        {renderConfigForm({
          data: initialData,
          columns: readOnlyColumns,
          configExtraButtons: null,
          configSwitchNode,
          configField,
          submitButtonField,
          onSubmit: handleSubmit
        })}
      </div>
    </ConfigProvider>
  );
};

export default SystemConfigurationHubBasicDemo;
