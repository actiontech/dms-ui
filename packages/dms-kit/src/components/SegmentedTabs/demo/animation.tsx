import React, { useState } from 'react';
import { SegmentedTabs, ConfigProvider } from '@actiontech/dms-kit';
import { Space, Tag, Switch } from 'antd';
import { styled } from '@mui/material';

// 定义自定义动画样式
const AnimationDemoWrapper = styled('div')`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.95);
    }
    100% {
      transform: scale(1);
    }
  }
`;

/**
 * 面板内容组件
 */
function PanelContent({
  title,
  emoji,
  color,
  description
}: {
  title: string;
  emoji: string;
  color: string;
  description: string;
}) {
  return (
    <div style={{ padding: '30px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '20px' }}>{emoji}</div>
      <h3 style={{ color, marginBottom: '12px' }}>{title}</h3>
      <p style={{ color: '#666', fontSize: '14px' }}>{description}</p>
    </div>
  );
}

/**
 * Animation Demo
 * 演示不同的动画效果
 */
const AnimationDemo: React.FC = () => {
  const [activeKey1, setActiveKey1] = useState<string>('fade');
  const [activeKey2, setActiveKey2] = useState<string>('content1');
  const [enableAnimation, setEnableAnimation] = useState(true);

  // 动画类型对比
  const animationTypes = [
    {
      label: '淡入效果',
      value: 'fade',
      children: (
        <PanelContent
          title="淡入动画"
          emoji="✨"
          color="#1890ff"
          description="内容以淡入方式平滑出现，适合优雅的过渡效果"
        />
      )
    },
    {
      label: '滑入效果',
      value: 'slide',
      children: (
        <PanelContent
          title="滑入动画"
          emoji="🚀"
          color="#52c41a"
          description="内容从左侧滑入，适合方向性强的场景"
        />
      )
    },
    {
      label: '弹跳效果',
      value: 'bounce',
      children: (
        <PanelContent
          title="弹跳动画"
          emoji="🎈"
          color="#faad14"
          description="内容以弹跳方式出现，适合活泼的交互场景"
        />
      )
    },
    {
      label: '无动画',
      value: 'none',
      children: (
        <PanelContent
          title="无动画"
          emoji="⚡"
          color="#8c8c8c"
          description="内容立即切换，适合性能敏感的场景"
        />
      )
    }
  ];

  // 实际应用示例
  const contentItems = [
    {
      label: '用户管理',
      value: 'content1',
      children: (
        <div style={{ padding: '20px' }}>
          <h4>👥 用户管理</h4>
          <div style={{ marginTop: '15px' }}>
            <Space wrap>
              <Tag color="blue">新增用户</Tag>
              <Tag color="green">编辑用户</Tag>
              <Tag color="orange">删除用户</Tag>
              <Tag color="purple">权限管理</Tag>
            </Space>
          </div>
          <p style={{ marginTop: '15px', color: '#666', fontSize: '13px' }}>
            管理系统用户账户、权限分配和角色设置
          </p>
        </div>
      )
    },
    {
      label: '系统设置',
      value: 'content2',
      children: (
        <div style={{ padding: '20px' }}>
          <h4>⚙️ 系统设置</h4>
          <div style={{ marginTop: '15px' }}>
            <Space wrap>
              <Tag color="blue">基础配置</Tag>
              <Tag color="green">安全设置</Tag>
              <Tag color="orange">通知配置</Tag>
              <Tag color="purple">主题切换</Tag>
            </Space>
          </div>
          <p style={{ marginTop: '15px', color: '#666', fontSize: '13px' }}>
            配置系统参数、安全选项和个性化设置
          </p>
        </div>
      )
    },
    {
      label: '数据报表',
      value: 'content3',
      children: (
        <div style={{ padding: '20px' }}>
          <h4>📊 数据报表</h4>
          <div style={{ marginTop: '15px' }}>
            <Space wrap>
              <Tag color="blue">用户统计</Tag>
              <Tag color="green">访问分析</Tag>
              <Tag color="orange">性能监控</Tag>
              <Tag color="purple">导出报表</Tag>
            </Space>
          </div>
          <p style={{ marginTop: '15px', color: '#666', fontSize: '13px' }}>
            查看各类统计数据、分析报表和性能指标
          </p>
        </div>
      )
    }
  ];

  // 获取动画配置
  const getAnimation = (): string | false => {
    if (!enableAnimation) return false;
    const animationMap: Record<string, string | false> = {
      fade: 'fadeIn 0.3s ease-out',
      slide: 'slideIn 0.3s ease-out',
      bounce: 'bounceIn 0.5s ease-out',
      none: false
    };
    return animationMap[activeKey1] ?? false;
  };

  return (
    <ConfigProvider>
      <AnimationDemoWrapper>
        {/* 动画开关 */}
        <div
          style={{
            marginBottom: '20px',
            padding: '12px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span style={{ fontWeight: 500 }}>
            💡 全局动画开关（影响所有示例）:
          </span>
          <Switch
            checked={enableAnimation}
            onChange={setEnableAnimation}
            checkedChildren="开启"
            unCheckedChildren="关闭"
          />
        </div>

        {/* 动画类型对比 */}
        <div style={{ marginBottom: '30px' }}>
          <h4 style={{ marginBottom: '15px' }}>🎨 动画类型对比</h4>
          <div
            style={{
              padding: '15px',
              backgroundColor: '#fafafa',
              borderRadius: '4px',
              marginBottom: '15px'
            }}
          >
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              切换标签页观察不同动画效果的差异
            </p>
          </div>
          <SegmentedTabs
            items={animationTypes.map((item) => ({
              ...item,
              // 根据选择的动画类型应用对应动画
              children: <div key={item.value}>{item.children}</div>
            }))}
            activeKey={activeKey1}
            onChange={setActiveKey1}
            animated={getAnimation()}
          />
        </div>

        {/* 实际应用示例 */}
        <div>
          <h4 style={{ marginBottom: '15px' }}>📝 实际应用示例</h4>
          <div
            style={{
              padding: '15px',
              backgroundColor: '#e6f7ff',
              borderRadius: '4px',
              marginBottom: '15px'
            }}
          >
            <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
              <strong>当前动画：</strong>
              {enableAnimation
                ? activeKey1 === 'fade'
                  ? ' 淡入效果 (fadeIn 0.3s)'
                  : activeKey1 === 'slide'
                  ? ' 滑入效果 (slideIn 0.3s)'
                  : activeKey1 === 'bounce'
                  ? ' 弹跳效果 (bounceIn 0.5s)'
                  : ' 无动画'
                : ' 已禁用'}
            </p>
          </div>
          <SegmentedTabs
            items={contentItems}
            activeKey={activeKey2}
            onChange={setActiveKey2}
            animated={getAnimation()}
          />
        </div>
      </AnimationDemoWrapper>
    </ConfigProvider>
  );
};

export default AnimationDemo;
