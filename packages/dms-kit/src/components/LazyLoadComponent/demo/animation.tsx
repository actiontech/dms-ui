import React, { useState } from 'react';
import { ConfigProvider, BasicButton } from '@actiontech/dms-kit';
import LazyLoadComponent from '../LazyLoadComponent';
import { styled } from '@mui/material';

// 定义自定义动画样式
const AnimationDemoWrapper = styled('div')`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
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
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }
`;

/**
 * Animation Demo
 * 演示不同的动画效果
 */
export default function AnimationDemo() {
  const [fadeVisible, setFadeVisible] = useState(false);
  const [slideVisible, setSlideVisible] = useState(false);
  const [bounceVisible, setBounceVisible] = useState(false);
  const [noAnimVisible, setNoAnimVisible] = useState(false);

  const contentStyle = {
    padding: '20px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    marginTop: '10px',
    backgroundColor: '#f0f0f0'
  };

  return (
    <ConfigProvider>
      <AnimationDemoWrapper>
        {/* 淡入动画 */}
        <div style={{ marginBottom: '30px' }}>
          <BasicButton onClick={() => setFadeVisible((v) => !v)}>
            {fadeVisible ? '隐藏' : '显示'} - 淡入缩放动画
          </BasicButton>
          <LazyLoadComponent
            open={fadeVisible}
            animation="fadeIn 0.3s ease-out"
          >
            <div style={contentStyle}>
              <strong>淡入缩放动画</strong>
              <p>使用 animation="fadeIn 0.3s ease-out"</p>
            </div>
          </LazyLoadComponent>
        </div>

        {/* 下滑动画 */}
        <div style={{ marginBottom: '30px' }}>
          <BasicButton onClick={() => setSlideVisible((v) => !v)}>
            {slideVisible ? '隐藏' : '显示'} - 下滑动画
          </BasicButton>
          <LazyLoadComponent
            open={slideVisible}
            animation="slideDown 0.4s ease-out"
          >
            <div style={contentStyle}>
              <strong>下滑动画</strong>
              <p>使用 animation="slideDown 0.4s ease-out"</p>
            </div>
          </LazyLoadComponent>
        </div>

        {/* 弹跳动画 */}
        <div style={{ marginBottom: '30px' }}>
          <BasicButton onClick={() => setBounceVisible((v) => !v)}>
            {bounceVisible ? '隐藏' : '显示'} - 弹跳动画
          </BasicButton>
          <LazyLoadComponent
            open={bounceVisible}
            animation="bounceIn 0.5s ease-out"
          >
            <div style={contentStyle}>
              <strong>弹跳动画</strong>
              <p>使用 animation="bounceIn 0.5s ease-out"</p>
            </div>
          </LazyLoadComponent>
        </div>

        {/* 无动画 */}
        <div style={{ marginBottom: '30px' }}>
          <BasicButton onClick={() => setNoAnimVisible((v) => !v)}>
            {noAnimVisible ? '隐藏' : '显示'} - 无动画
          </BasicButton>
          <LazyLoadComponent open={noAnimVisible} animation={false}>
            <div style={contentStyle}>
              <strong>无动画</strong>
              <p>使用 animation={'{false}'} 禁用动画，立即显示/隐藏</p>
            </div>
          </LazyLoadComponent>
        </div>
      </AnimationDemoWrapper>
    </ConfigProvider>
  );
}
