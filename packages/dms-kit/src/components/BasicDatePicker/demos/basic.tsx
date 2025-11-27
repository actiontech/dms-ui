import React from 'react';
import { BasicDatePicker, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Typography } from 'antd';
import dayjs from 'dayjs';

const { Title } = Typography;

/**
 * 基础用法
 * - 默认用法
 * - 不同尺寸：small、middle、large
 * - 自定义日期格式
 * - 禁用状态
 * - 显示年份/月份快速跳转按钮
 */
const BasicDatePickerBasicDemo: React.FC = () => {
  return (
    <ConfigProvider>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5}>默认用法</Title>
          <BasicDatePicker placeholder="请选择日期" style={{ width: 200 }} />
        </div>

        <div>
          <Title level={5}>不同尺寸</Title>
          <Space>
            <BasicDatePicker
              size="small"
              placeholder="Small"
              style={{ width: 150 }}
            />
            <BasicDatePicker
              size="middle"
              placeholder="Middle"
              style={{ width: 200 }}
            />
            <BasicDatePicker
              size="large"
              placeholder="Large"
              style={{ width: 250 }}
            />
          </Space>
        </div>

        <div>
          <Title level={5}>自定义日期格式</Title>
          <Space direction="vertical">
            <BasicDatePicker
              format="YYYY-MM-DD"
              placeholder="YYYY-MM-DD"
              style={{ width: 200 }}
            />
            <BasicDatePicker
              format="YYYY/MM/DD"
              placeholder="YYYY/MM/DD"
              style={{ width: 200 }}
            />
            <BasicDatePicker
              format="DD-MM-YYYY"
              placeholder="DD-MM-YYYY"
              style={{ width: 200 }}
            />
          </Space>
        </div>

        <div>
          <Title level={5}>禁用状态</Title>
          <BasicDatePicker
            disabled
            defaultValue={dayjs()}
            placeholder="已禁用"
            style={{ width: 200 }}
          />
        </div>

        <div>
          <Title level={5}>显示年份/月份快速跳转按钮</Title>
          <BasicDatePicker
            hideSuperIcon={false}
            placeholder="显示快速跳转按钮"
            style={{ width: 200 }}
          />
        </div>

        <div>
          <Title level={5}>带默认值</Title>
          <BasicDatePicker
            defaultValue={dayjs()}
            placeholder="请选择日期"
            style={{ width: 200 }}
          />
        </div>
      </Space>
    </ConfigProvider>
  );
};

export default BasicDatePickerBasicDemo;
