import React from 'react';
import { ConfigProvider } from '@actiontech/dms-kit';
import {
  FormItemBigTitle,
  FormItemSubTitle,
  FormItemLabel,
  FormItemNoLabel,
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

const ResponsiveFormDemo: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('表单数据:', values);
  };

  return (
    <ConfigProvider>
      <div style={{ padding: '20px' }}>
        <h3>响应式表单布局</h3>

        <Card title="响应式用户信息表单" style={{ marginBottom: '20px' }}>
          <Form form={form} onFinish={onFinish} layout="vertical">
            <FormItemBigTitle>用户信息管理</FormItemBigTitle>

            <FormItemSubTitle>基本信息</FormItemSubTitle>
            {/* 大屏幕：2列布局，小屏幕：1列布局 */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <FormItemLabel
                  label="姓名"
                  name="firstName"
                  rules={[{ required: true, message: '请输入姓名' }]}
                >
                  <Input placeholder="请输入姓名" />
                </FormItemLabel>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <FormItemLabel
                  label="姓氏"
                  name="lastName"
                  rules={[{ required: true, message: '请输入姓氏' }]}
                >
                  <Input placeholder="请输入姓氏" />
                </FormItemLabel>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <FormItemLabel
                  label="邮箱"
                  name="email"
                  rules={[
                    { required: true, message: '请输入邮箱' },
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input placeholder="请输入邮箱" />
                </FormItemLabel>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <FormItemLabel
                  label="手机号"
                  name="phone"
                  rules={[{ required: true, message: '请输入手机号' }]}
                >
                  <Input placeholder="请输入手机号" />
                </FormItemLabel>
              </Col>
            </Row>

            {/* 大屏幕：3列布局，小屏幕：1列布局 */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <FormItemLabel
                  label="性别"
                  name="gender"
                  rules={[{ required: true, message: '请选择性别' }]}
                >
                  <Select
                    placeholder="请选择性别"
                    options={[
                      { label: '男', value: 'male' },
                      { label: '女', value: 'female' },
                      { label: '其他', value: 'other' }
                    ]}
                  />
                </FormItemLabel>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <FormItemLabel
                  label="年龄"
                  name="age"
                  rules={[{ required: true, message: '请输入年龄' }]}
                >
                  <Input placeholder="请输入年龄" />
                </FormItemLabel>
              </Col>
              <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                <FormItemLabel label="生日" name="birthday">
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="请选择生日"
                  />
                </FormItemLabel>
              </Col>
            </Row>

            <Divider />

            <FormItemSubTitle>地址信息</FormItemSubTitle>
            {/* 大屏幕：2列布局，小屏幕：1列布局 */}
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <FormItemLabel
                  label="国家"
                  name="country"
                  rules={[{ required: true, message: '请选择国家' }]}
                >
                  <Select
                    placeholder="请选择国家"
                    options={[
                      { label: '中国', value: 'china' },
                      { label: '美国', value: 'usa' },
                      { label: '日本', value: 'japan' },
                      { label: '韩国', value: 'korea' }
                    ]}
                  />
                </FormItemLabel>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <FormItemLabel
                  label="省份"
                  name="province"
                  rules={[{ required: true, message: '请选择省份' }]}
                >
                  <Select
                    placeholder="请选择省份"
                    options={[
                      { label: '北京', value: 'beijing' },
                      { label: '上海', value: 'shanghai' },
                      { label: '广东', value: 'guangdong' },
                      { label: '江苏', value: 'jiangsu' }
                    ]}
                  />
                </FormItemLabel>
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <FormItemLabel
                  label="城市"
                  name="city"
                  rules={[{ required: true, message: '请输入城市' }]}
                >
                  <Input placeholder="请输入城市" />
                </FormItemLabel>
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                <FormItemLabel label="邮编" name="postcode">
                  <Input placeholder="请输入邮编" />
                </FormItemLabel>
              </Col>
            </Row>

            <FormItemLabel label="详细地址" name="address">
              <Input.TextArea placeholder="请输入详细地址" rows={3} />
            </FormItemLabel>

            <Divider />

            <FormItemSubTitle>偏好设置</FormItemSubTitle>
            {/* 大屏幕：4列布局，小屏幕：2列布局 */}
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                <FormItemLabel label="邮件通知" name="emailNotification">
                  <Switch defaultChecked />
                </FormItemLabel>
              </Col>
              <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                <FormItemLabel label="短信通知" name="smsNotification">
                  <Switch />
                </FormItemLabel>
              </Col>
              <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                <FormItemLabel label="推送通知" name="pushNotification">
                  <Switch defaultChecked />
                </FormItemLabel>
              </Col>
              <Col xs={12} sm={12} md={6} lg={6} xl={6}>
                <FormItemLabel label="隐私保护" name="privacyProtection">
                  <Switch defaultChecked />
                </FormItemLabel>
              </Col>
            </Row>

            <Form.Item
              label={
                <CustomLabelContent
                  title="兴趣爱好"
                  tips="选择您感兴趣的内容类型"
                />
              }
              name="interests"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                  <div>
                    <span style={{ marginRight: '8px' }}>技术:</span>
                    <Switch defaultChecked />
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                  <div>
                    <span style={{ marginRight: '8px' }}>体育:</span>
                    <Switch />
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                  <div>
                    <span style={{ marginRight: '8px' }}>音乐:</span>
                    <Switch defaultChecked />
                  </div>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                  <div>
                    <span style={{ marginRight: '8px' }}>电影:</span>
                    <Switch />
                  </div>
                </Col>
              </Row>
            </Form.Item>

            <Divider />

            <FormItemSubTitle>其他信息</FormItemSubTitle>
            <FormItemNoLabel name="notes">
              <Input.TextArea
                placeholder="其他需要说明的信息（无标签）"
                rows={3}
              />
            </FormItemNoLabel>

            <Form.Item>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: '100%' }}
                  >
                    提交
                  </Button>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                  <Button
                    onClick={() => form.resetFields()}
                    style={{ width: '100%' }}
                  >
                    重置
                  </Button>
                </Col>
                <Col xs={24} sm={24} md={8} lg={12} xl={12}>
                  <Button style={{ width: '100%' }}>保存草稿</Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Card>

        <Card title="响应式断点说明">
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              <strong>xs (≤576px)</strong>: 超小屏幕，手机竖屏
            </li>
            <li>
              <strong>sm (≥576px)</strong>: 小屏幕，手机横屏
            </li>
            <li>
              <strong>md (≥768px)</strong>: 中等屏幕，平板
            </li>
            <li>
              <strong>lg (≥992px)</strong>: 大屏幕，桌面
            </li>
            <li>
              <strong>xl (≥1200px)</strong>: 超大屏幕，大桌面
            </li>
            <li>
              <strong>xxl (≥1600px)</strong>: 超超大屏幕
            </li>
          </ul>
        </Card>

        <Card title="响应式布局特点">
          <ul style={{ paddingLeft: '20px' }}>
            <li>
              <strong>自适应列数</strong>: 大屏幕显示多列，小屏幕自动调整为单列
            </li>
            <li>
              <strong>栅格系统</strong>: 使用 Ant Design 的 Row 和 Col 组件
            </li>
            <li>
              <strong>间距控制</strong>: 使用 gutter 属性控制列间距
            </li>
            <li>
              <strong>按钮响应式</strong>: 按钮在不同屏幕尺寸下自适应宽度
            </li>
            <li>
              <strong>表单验证</strong>: 验证规则在所有屏幕尺寸下保持一致
            </li>
          </ul>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default ResponsiveFormDemo;
