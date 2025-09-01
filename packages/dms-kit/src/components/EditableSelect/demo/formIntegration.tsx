import React, { useState } from 'react';
import {
  EditableSelect,
  ConfigProvider,
  BasicButton,
  EditableSelectOption
} from '@actiontech/dms-kit';
import { Form, Input, Switch, Card, message } from 'antd';

interface ProjectFormData {
  name: string;
  description: string;
  environment: string;
  isPublic: boolean;
  tags: string[];
}

const FormIntegrationDemo = () => {
  const [form] = Form.useForm<ProjectFormData>();
  const [environments, setEnvironments] = useState<EditableSelectOption[]>([
    { value: 'dev', label: '开发环境' },
    { value: 'test', label: '测试环境' },
    { value: 'staging', label: '预发环境' },
    { value: 'prod', label: '生产环境' }
  ]);

  const [tags, setTags] = useState<EditableSelectOption[]>([
    { value: 'frontend', label: '前端' },
    { value: 'backend', label: '后端' },
    { value: 'database', label: '数据库' },
    { value: 'mobile', label: '移动端' }
  ]);

  const [submitLoading, setSubmitLoading] = useState(false);

  const handleAddEnvironment = (name: string) => {
    const newEnv: EditableSelectOption = {
      value: name.toLowerCase().replace(/\s+/g, '_'),
      label: name
    };
    setEnvironments((prev) => [...prev, newEnv]);
    message.success(`添加环境: ${name}`);
  };

  const handleUpdateEnvironment = (updatedEnv: EditableSelectOption) => {
    setEnvironments((prev) =>
      prev.map((env) =>
        env.value === updatedEnv.value
          ? { ...env, label: updatedEnv.label }
          : env
      )
    );
  };

  const handleDeleteEnvironment = (envToDelete: EditableSelectOption) => {
    setEnvironments((prev) =>
      prev.filter((env) => env.value !== envToDelete.value)
    );
    // 清空表单中的选择
    const currentEnv = form.getFieldValue('environment');
    if (currentEnv === envToDelete.value) {
      form.setFieldValue('environment', undefined);
    }
  };

  const handleAddTag = (name: string) => {
    const newTag: EditableSelectOption = {
      value: name.toLowerCase().replace(/\s+/g, '_'),
      label: name
    };
    setTags((prev) => [...prev, newTag]);
  };

  const handleSubmit = async (values: ProjectFormData) => {
    setSubmitLoading(true);
    try {
      // 模拟提交
      await new Promise((resolve) => setTimeout(resolve, 2000));
      message.success('项目创建成功！');

      // 获取对应的标签名称
      const selectedEnv = environments.find(
        (env) => env.value === values.environment
      );

      console.log('表单数据:', {
        ...values,
        environmentLabel: selectedEnv?.label
      });

      // 重置表单
      form.resetFields();
    } catch (error) {
      message.error('提交失败，请重试');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <ConfigProvider>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
        <Card title="创建新项目" style={{ marginBottom: 24 }}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              isPublic: false
            }}
          >
            <Form.Item
              label="项目名称"
              name="name"
              rules={[{ required: true, message: '请输入项目名称' }]}
            >
              <Input placeholder="请输入项目名称" />
            </Form.Item>

            <Form.Item
              label="项目描述"
              name="description"
              rules={[{ required: true, message: '请输入项目描述' }]}
            >
              <Input.TextArea rows={3} placeholder="请输入项目描述" />
            </Form.Item>

            <Form.Item
              label="部署环境"
              name="environment"
              rules={[{ required: true, message: '请选择部署环境' }]}
            >
              <EditableSelect
                placeholder="选择或创建部署环境"
                options={environments}
                onAdd={handleAddEnvironment}
                onUpdate={handleUpdateEnvironment}
                onDelete={handleDeleteEnvironment}
                addButtonText="添加新环境"
                deletionConfirmTitle="确定要删除这个环境配置吗？"
              />
            </Form.Item>

            <Form.Item
              label="项目标签"
              name="tags"
              extra="选择项目相关的技术标签"
            >
              <EditableSelect
                placeholder="选择项目标签"
                options={tags}
                onAdd={handleAddTag}
                addButtonText="添加标签"
                updatable={false}
                deletable={false}
              />
            </Form.Item>

            <Form.Item label="公开项目" name="isPublic" valuePropName="checked">
              <Switch checkedChildren="公开" unCheckedChildren="私有" />
            </Form.Item>

            <Form.Item>
              <BasicButton
                type="primary"
                htmlType="submit"
                loading={submitLoading}
                style={{ marginRight: 8 }}
              >
                创建项目
              </BasicButton>
              <BasicButton onClick={() => form.resetFields()}>重置</BasicButton>
            </Form.Item>
          </Form>
        </Card>

        <Card title="使用说明" size="small">
          <ul style={{ margin: 0, color: '#666' }}>
            <li>在"部署环境"字段中，你可以添加、编辑和删除环境配置</li>
            <li>在"项目标签"字段中，只允许添加新标签，不能修改或删除</li>
            <li>表单验证会确保必填字段已填写</li>
            <li>提交时会显示完整的表单数据，包括选择的标签名称</li>
          </ul>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default FormIntegrationDemo;
