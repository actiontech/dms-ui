import { useEffect, useState } from 'react';
import { LazyLoadComponentProps } from './LazyLoadComponent.types';
import { LazyLoadComponentStyleWrapper } from './style';
import classnames from 'classnames';

/**
 * todo
 * 1. 提供更多的默认动画效果
 * 2. 挂载的父节点
 */
const LazyLoadComponent: React.FC<LazyLoadComponentProps> = ({
  open,
  destroyOnClose,
  forceRender,
  className,
  children,
  animation
}) => {
  const [status, setStatus] = useState<'show' | 'none' | 'hidden'>();

  useEffect(() => {
    if (open) {
      // 显示组件
      setStatus('show');
    } else if (forceRender && !open) {
      // 初次强制渲染组件
      setStatus('hidden');
    } else if (!open) {
      if (destroyOnClose) {
        // 关闭组件时强制销毁
        setStatus('none');
      } else {
        setStatus((v) => {
          // 初次不进行组件渲染
          if (!v || v === 'none') {
            return 'none';
          }
          // 第一次打开组件后关闭组件时通过 css 隐藏组件，而不是销毁
          return 'hidden';
        });
      }
    }
  }, [destroyOnClose, forceRender, open]);

  return status === 'show' || status === 'hidden' ? (
    <LazyLoadComponentStyleWrapper
      animation={animation}
      className={classnames('lazy-load-wrapper', className, {
        'lazy-load-wrapper-hidden': status === 'hidden',
        'lazy-load-wrapper-show': status === 'show',
        'lazy-load-wrapper-animation': animation !== false
      })}
    >
      {children}
    </LazyLoadComponentStyleWrapper>
  ) : null;
};

export default LazyLoadComponent;
