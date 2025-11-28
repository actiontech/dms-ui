import React, { useState } from 'react';
import {
  ConfigProvider,
  useConfigRender,
  ConfigModifyBtn,
  ConfigSubmitButtonField,
  FormItemLabel,
  ReadOnlyConfigColumnsType
} from '@actiontech/dms-kit';
import { Form, Input, Switch, Select, Slider, message } from 'antd';

interface CustomConfig {
  siteName: string;
  theme: string;
  enableNotifications: boolean;
  maxUploadSize: number;
  allowedFileTypes: string[];
  sessionTimeout: number;
}

const CustomConfigDemo = () => {
  const [submitLoading, setSubmitLoading] = useState(false);

  const initialData: CustomConfig = {
    siteName: 'DMS 管理系统',
    theme: 'light',
    enableNotifications: true,
    maxUploadSize: 10,
    allowedFileTypes: ['pdf', 'doc', 'xlsx'],
    sessionTimeout: 30
  };

  const {
    modifyFlag,
    startModify,
    modifyFinish,
    extraButtonsVisible,
    renderConfigForm,
    form
  } = useConfigRender<CustomConfig>({
    switchFieldName: 'enableNotifications',
    switchFieldLabel: '系统配置'
  });

  React.useEffect(() => {
    form.setFieldsValue(initialData);
  }, [form]);

  const handleSubmit = async (values: CustomConfig) => {
    setSubmitLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSubmitLoading(false);
    modifyFinish();
    message.success('配置保存成功');
    console.log('自定义配置:', values);
  };

  const handleCancel = () => {
    form.setFieldsValue(initialData);
    modifyFinish();
  };

  const readOnlyColumns: ReadOnlyConfigColumnsType<CustomConfig> = [
    {
      label: '站点名称',
      dataIndex: 'siteName'
    },
    {
      label: '主题风格',
      dataIndex: 'theme',
      render: (val: string) => (val === 'light' ? '浅色主题' : '深色主题')
    },
    {
      label: '通知功能',
      dataIndex: 'enableNotifications',
      render: (val: boolean) => (val ? '已启用' : '已禁用')
    },
    {
      label: '最大上传大小',
      dataIndex: 'maxUploadSize',
      render: (val: number) => `${val} MB`
    },
    {
      label: '允许的文件类型',
      dataIndex: 'allowedFileTypes',
      render: (val: string[]) => val.join(', ')
    },
    {
      label: '会话超时时间',
      dataIndex: 'sessionTimeout',
      render: (val: number) => `${val} 分钟`
    }
  ];

  const configField = (
    <>
      <FormItemLabel
        label="站点名称"
        name="siteName"
        rules={[{ required: true, message: '请输入站点名称' }]}
      >
        <Input placeholder="请输入站点名称" />
      </FormItemLabel>

      <FormItemLabel
        label="主题风格"
        name="theme"
        rules={[{ required: true, message: '请选择主题风格' }]}
      >
        <Select
          options={[
            { label: '浅色主题', value: 'light' },
            { label: '深色主题', value: 'dark' }
          ]}
          placeholder="请选择主题风格"
        />
      </FormItemLabel>

      <FormItemLabel
        label="通知功能"
        name="enableNotifications"
        valuePropName="checked"
      >
        <Switch checkedChildren="启用" unCheckedChildren="禁用" />
      </FormItemLabel>

      <FormItemLabel
        label="最大上传大小"
        name="maxUploadSize"
        rules={[{ required: true, message: '请设置最大上传大小' }]}
        extra={
          <span style={{ color: '#999', fontSize: 12 }}>
            单位：MB，建议不超过 100MB
          </span>
        }
      >
        <Slider
          min={1}
          max={100}
          marks={{
            1: '1MB',
            10: '10MB',
            50: '50MB',
            100: '100MB'
          }}
          tooltip={{ formatter: (value) => `${value} MB` }}
        />
      </FormItemLabel>

      <FormItemLabel
        label="允许的文件类型"
        name="allowedFileTypes"
        rules={[{ required: true, message: '请选择允许的文件类型' }]}
      >
        <Select
          mode="multiple"
          placeholder="请选择允许上传的文件类型"
          options={[
            { label: 'PDF', value: 'pdf' },
            { label: 'Word 文档', value: 'doc' },
            { label: 'Excel 表格', value: 'xlsx' },
            { label: 'PowerPoint', value: 'ppt' },
            { label: '图片', value: 'image' },
            { label: '压缩包', value: 'zip' }
          ]}
        />
      </FormItemLabel>

      <FormItemLabel
        label="会话超时时间"
        name="sessionTimeout"
        rules={[{ required: true, message: '请设置会话超时时间' }]}
        extra={
          <span style={{ color: '#999', fontSize: 12 }}>
            单位：分钟，用户无操作时自动退出登录的时间
          </span>
        }
      >
        <Select
          options={[
            { label: '15 分钟', value: 15 },
            { label: '30 分钟', value: 30 },
            { label: '60 分钟', value: 60 },
            { label: '120 分钟', value: 120 },
            { label: '永不超时', value: 0 }
          ]}
          placeholder="请选择会话超时时间"
        />
      </FormItemLabel>
    </>
  );

  const modifyButton = !modifyFlag && (
    <ConfigModifyBtn hidden={!extraButtonsVisible} onClick={startModify} />
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
        <h3>自定义配置 (不使用开关)</h3>

        {renderConfigForm({
          data: initialData,
          columns: readOnlyColumns,
          configExtraButtons: modifyButton,
          configSwitchNode: null, // 不显示开关
          configField,
          submitButtonField,
          onSubmit: handleSubmit
        })}
      </div>
    </ConfigProvider>
  );
};

export default CustomConfigDemo;
