import React, { useState } from 'react';
import { BasicDrawer, BasicButton, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Timeline, Tag, Avatar, List } from 'antd';

const BasicDrawerContentDemo = () => {
  const [timelineVisible, setTimelineVisible] = useState(false);
  const [listVisible, setListVisible] = useState(false);

  const timelineData = [
    {
      color: 'green',
      children: '创建项目 2024-01-15 10:00:00'
    },
    {
      color: 'blue',
      children: '项目初始化 2024-01-15 14:30:00'
    },
    {
      color: 'blue',
      children: '数据库设计 2024-01-16 09:00:00'
    },
    {
      color: 'orange',
      children: '开发阶段 2024-01-17 开始'
    },
    {
      color: 'red',
      children: '测试阶段 2024-01-20 开始'
    }
  ];

  const listData = [
    {
      title: '张三',
      description: '前端开发工程师',
      avatar: 'https://joeschmoe.io/api/v1/random',
      tags: ['React', 'TypeScript', 'UI/UX']
    },
    {
      title: '李四',
      description: '后端开发工程师',
      avatar: 'https://joeschmoe.io/api/v1/random',
      tags: ['Java', 'Spring Boot', 'MySQL']
    },
    {
      title: '王五',
      description: '测试工程师',
      avatar: 'https://joeschmoe.io/api/v1/random',
      tags: ['自动化测试', '性能测试', '安全测试']
    },
    {
      title: '赵六',
      description: '产品经理',
      avatar: 'https://joeschmoe.io/api/v1/random',
      tags: ['产品设计', '需求分析', '项目管理']
    }
  ];

  return (
    <ConfigProvider>
      <Space>
        <BasicButton type="primary" onClick={() => setTimelineVisible(true)}>
          时间线抽屉
        </BasicButton>
        <BasicButton type="primary" onClick={() => setListVisible(true)}>
          列表抽屉
        </BasicButton>
      </Space>

      <BasicDrawer
        title="项目进度时间线"
        placement="right"
        visible={timelineVisible}
        size="default"
        onClose={() => setTimelineVisible(false)}
      >
        <div style={{ padding: '16px 0' }}>
          <h3>项目开发进度</h3>
          <p>以下是项目的关键节点和进度情况：</p>

          <Timeline items={timelineData} style={{ marginTop: 24 }} />

          <div
            style={{
              marginTop: 24,
              padding: '16px',
              backgroundColor: '#f6ffed',
              borderRadius: 6
            }}
          >
            <h4>当前状态</h4>
            <p>
              项目目前处于开发阶段，预计 2024-01-25 完成开发，2024-01-30 上线。
            </p>
          </div>
        </div>
      </BasicDrawer>

      <BasicDrawer
        title="团队成员列表"
        placement="right"
        visible={listVisible}
        size="large"
        onClose={() => setListVisible(false)}
      >
        <div style={{ padding: '16px 0' }}>
          <h3>项目团队</h3>
          <p>以下是参与项目开发的团队成员：</p>

          <List
            itemLayout="horizontal"
            dataSource={listData}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
                  title={item.title}
                  description={item.description}
                />
                <div>
                  {item.tags.map((tag) => (
                    <Tag key={tag} color="blue" style={{ marginBottom: 4 }}>
                      {tag}
                    </Tag>
                  ))}
                </div>
              </List.Item>
            )}
            style={{ marginTop: 24 }}
          />

          <div
            style={{
              marginTop: 24,
              padding: '16px',
              backgroundColor: '#e6f7ff',
              borderRadius: 6
            }}
          >
            <h4>团队统计</h4>
            <p>团队总人数：4 人</p>
            <p>开发人员：2 人</p>
            <p>测试人员：1 人</p>
            <p>产品人员：1 人</p>
          </div>
        </div>
      </BasicDrawer>
    </ConfigProvider>
  );
};

export default BasicDrawerContentDemo;
