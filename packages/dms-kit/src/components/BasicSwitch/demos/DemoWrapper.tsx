import React from 'react';
import { styled } from '@mui/material/styles';

/**
 * Demo 环境样式包裹器
 *
 * 问题说明：
 * - Demo 环境：Ant Design 使用 :where() 伪类包裹样式，选择器权重为 0
 *   例如：:where(.css-xxx).ant-switch.ant-switch-checked { background: #1677ff; }
 *
 * - 实际环境：Ant Design 使用正常选择器，权重正常
 *   例如：.css-xxx.ant-switch.ant-switch-checked { background: #4583ff; }
 *
 * 导致在 demo 环境中，BasicSwitch 的自定义样式权重高于 Ant Design 的选中样式，
 * 覆盖了选中状态的背景色。
 *
 * 解决方案：
 * 通过 styled wrapper 提高 demo 环境中 Switch 选中状态的样式权重，
 * 确保选中样式不被覆盖。
 */
const StyledDemoWrapper = styled('div')`
  .ant-switch.ant-switch-checked {
    background: ${({ theme }) =>
      theme.sharedTheme.uiToken.colorPrimary} !important;
  }
`;

interface DemoWrapperProps {
  children: React.ReactNode;
}

const DemoWrapper: React.FC<DemoWrapperProps> = ({ children }) => {
  return <StyledDemoWrapper>{children}</StyledDemoWrapper>;
};

export default DemoWrapper;
