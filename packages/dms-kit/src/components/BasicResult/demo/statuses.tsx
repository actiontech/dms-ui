import React from 'react';
import { BasicResult, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Row, Col, Divider } from 'antd';

/**
 * 不同状态
 * - 支持 success、error、info、warning 等操作结果状态
 * - 支持 404、403、500 等错误页面状态
 */
const BasicResultStatusesDemo = () => {
  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <h4>操作结果状态</h4>
          <Row>
            <Col span={12}>
              <BasicResult
                status="success"
                title="操作成功"
                subTitle="您的操作已成功完成"
              />
            </Col>
            <Col span={12}>
              <BasicResult
                status="error"
                title="操作失败"
                subTitle="很抱歉，操作未能完成"
              />
            </Col>
            <Col span={12}>
              <BasicResult
                status="info"
                title="信息提示"
                subTitle="这是一条信息提示"
              />
            </Col>
            <Col span={12}>
              <BasicResult
                status="warning"
                title="警告提示"
                subTitle="请注意操作风险"
              />
            </Col>
          </Row>
        </div>

        <Divider />

        <div>
          <h4>错误页面状态</h4>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <BasicResult status="404" title="404" subTitle="页面不存在" />
            </Col>
            <Col span={8}>
              <BasicResult status="403" title="403" subTitle="无权限访问" />
            </Col>
            <Col span={8}>
              <BasicResult status="500" title="500" subTitle="服务器错误" />
            </Col>
          </Row>
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default BasicResultStatusesDemo;
