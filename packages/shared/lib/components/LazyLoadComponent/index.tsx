import { useEffect, useState } from 'react';
import { LazyLoadComponentProps } from './index.type';
import { LazyLoadComponentStyleWrapper } from './style';
import classnames from 'classnames';

// todo export animation
const LazyLoadComponent: React.FC<LazyLoadComponentProps> = ({
  open,
  destroyOnClose,
  forceRender,
  className,
  children,
  animation
}) => {
  const [status, setStatus] = useState<'show' | 'none' | 'hidden'>();

  /**
   * 由于严格模式下会执行两次 useEffect, 初始依旧会渲染该组件。。
   */
  useEffect(() => {
    if (open) {
      setStatus('show');
    } else if (forceRender && !open) {
      setStatus('hidden');
    } else {
      if (destroyOnClose) {
        setStatus('none');
      } else {
        setStatus((v) => {
          if (!v) {
            return 'none';
          }
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
        'lazy-load-wrapper-show': status === 'show'
      })}
    >
      {children}
    </LazyLoadComponentStyleWrapper>
  ) : null;
};

export default LazyLoadComponent;
