import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import {
  FormItemBigTitle,
  FormItemSubTitle,
  FormItemLabel,
  FormItemNoLabel,
  FormInputBotBorder,
  CustomLabelContent
} from '@actiontech/dms-kit';
import {
  Form,
  Input,
  Button,
  Card,
  Space,
  Row,
  Col,
  Select,
  Switch,
  DatePicker,
  Divider
} from 'antd';

const ComplexLayoutDemo: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('表单数据:', values);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>复杂表单布局</h3>

        <Card title="企业用户注册表单" style={{ marginBottom: '20px' }}>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <FormItemBigTitle>企业用户注册</FormItemBigTitle>

            <FormItemSubTitle>企业基本信息</FormItemSubTitle>
            <Row gutter={16}>
              <Col span={12}>
                <FormItemLabel
                  label="企业名称"
                  name="companyName"
                  rules={[{ required: true, message: '请输入企业名称' }]}
                >
                  <Input placeholder="请输入企业名称" />
                </FormItemLabel>
              </Col>
              <Col span={12}>
                <FormItemLabel
                  label="企业类型"
                  name="companyType"
                  rules={[{ required: true, message: '请选择企业类型' }]}
                >
                  <Select
                    placeholder="请选择企业类型"
                    options={[
                      { label: '科技公司', value: 'tech' },
                      { label: '制造企业', value: 'manufacturing' },
                      { label: '服务企业', value: 'service' },
                      { label: '其他', value: 'other' }
                    ]}
                  />
                </FormItemLabel>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <FormItemLabel
                  label="统一社会信用代码"
                  name="creditCode"
                  rules={[
                    { required: true, message: '请输入统一社会信用代码' }
                  ]}
                >
                  <Input placeholder="请输入统一社会信用代码" />
                </FormItemLabel>
              </Col>
              <Col span={12}>
                <FormItemLabel
                  label="成立日期"
                  name="establishDate"
                  rules={[{ required: true, message: '请选择成立日期' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="请选择成立日期"
                  />
                </FormItemLabel>
              </Col>
            </Row>

            <FormItemLabel label="企业地址" name="companyAddress">
              <Input placeholder="请输入企业详细地址" />
            </FormItemLabel>

            <FormItemLabel label="企业简介" name="companyDescription">
              <Input.TextArea placeholder="请输入企业简介" rows={3} />
            </FormItemLabel>

            <Divider />

            <FormItemSubTitle>联系人信息</FormItemSubTitle>
            <Row gutter={16}>
              <Col span={8}>
                <FormItemLabel
                  label="联系人姓名"
                  name="contactName"
                  rules={[{ required: true, message: '请输入联系人姓名' }]}
                >
                  <Input placeholder="请输入联系人姓名" />
                </FormItemLabel>
              </Col>
              <Col span={8}>
                <FormItemLabel
                  label="联系电话"
                  name="contactPhone"
                  rules={[{ required: true, message: '请输入联系电话' }]}
                >
                  <Input placeholder="请输入联系电话" />
                </FormItemLabel>
              </Col>
              <Col span={8}>
                <FormItemLabel
                  label="联系邮箱"
                  name="contactEmail"
                  rules={[
                    { required: true, message: '请输入联系邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input placeholder="请输入联系邮箱" />
                </FormItemLabel>
              </Col>
            </Row>

            <Divider />

            <FormItemSubTitle>系统配置</FormItemSubTitle>
            <Form.Item
              label={
                <CustomLabelContent
                  title="数据库配置"
                  tips="配置企业数据库连接信息"
                />
              }
              name="databaseConfig"
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Input placeholder="数据库主机地址" />
                </Col>
                <Col span={12}>
                  <Input placeholder="数据库端口" />
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: '8px' }}>
                <Col span={12}>
                  <Input placeholder="数据库名称" />
                </Col>
                <Col span={12}>
                  <Input.Password placeholder="数据库密码" />
                </Col>
              </Row>
            </Form.Item>

            <Form.Item
              label={
                <CustomLabelContent
                  title="功能开关"
                  tips="配置系统功能模块的启用状态"
                />
              }
              name="featureSwitches"
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <span style={{ marginRight: '8px' }}>用户管理:</span>
                  <Switch defaultChecked />
                </div>
                <div>
                  <span style={{ marginRight: '8px' }}>权限管理:</span>
                  <Switch defaultChecked />
                </div>
                <div>
                  <span style={{ marginRight: '8px' }}>数据备份:</span>
                  <Switch />
                </div>
                <div>
                  <span style={{ marginRight: '8px' }}>日志记录:</span>
                  <Switch defaultChecked />
                </div>
              </Space>
            </Form.Item>

            <Divider />

            <FormItemSubTitle>高级设置</FormItemSubTitle>
            <FormItemNoLabel name="advancedSettings">
              <Input.TextArea placeholder="高级配置参数（JSON格式）" rows={4} />
            </FormItemNoLabel>

            <FormItemLabel label="备注信息" name="remarks">
              <FormInputBotBorder placeholder="其他需要说明的信息" />
            </FormItemLabel>

            <Divider />

            <Form.Item>
              <Space size="large">
                <Button type="primary" htmlType="submit" size="large">
                  提交注册
                </Button>
                <Button size="large" onClick={() => form.resetFields()}>
                  重置表单
                </Button>
                <Button size="large">保存草稿</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <Card title="布局特点说明">
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              <strong>标题层级</strong>: 使用 FormItemBigTitle 和
              FormItemSubTitle 创建清晰的表单结构
            </li>
            <li>
              <strong>栅格布局</strong>: 使用 Row 和 Col 组件实现响应式布局
            </li>
            <li>
              <strong>分组显示</strong>: 使用 Divider 分隔不同的表单区域
            </li>
            <li>
              <strong>组件组合</strong>: 混合使用各种表单组件满足不同需求
            </li>
            <li>
              <strong>验证规则</strong>: 为必填字段添加验证规则
            </li>
            <li>
              <strong>操作按钮</strong>: 提供多种操作选项
            </li>
          </ul>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default ComplexLayoutDemo;
