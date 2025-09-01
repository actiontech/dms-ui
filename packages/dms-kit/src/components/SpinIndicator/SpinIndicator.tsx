import { CommonIconStyleWrapper } from '../../styleWrapper/element';
import classNames from 'classnames';
import { SpinIndicatorProps } from './SpinIndicator.types';

const SpinIndicator: React.FC<SpinIndicatorProps> = ({
  width = 24,
  height = 30,
  className
}) => {
  return (
    <CommonIconStyleWrapper
      className={classNames('custom-icon-spin-dot', className)}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="currentColor"
      >
        <rect
          x="0"
          y="10"
          width="4"
          height="10"
          fill="currentColor"
          opacity="0.2"
        >
          <animate
            attributeName="opacity"
            attributeType="XML"
            values="0.2; 1; .2"
            begin="0s"
            dur="0.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="height"
            attributeType="XML"
            values="10; 20; 10"
            begin="0s"
            dur="0.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            attributeType="XML"
            values="10; 5; 10"
            begin="0s"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </rect>
        <rect
          x="8"
          y="10"
          width="4"
          height="10"
          fill="currentColor"
          opacity="0.2"
        >
          <animate
            attributeName="opacity"
            attributeType="XML"
            values="0.2; 1; .2"
            begin="0.15s"
            dur="0.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="height"
            attributeType="XML"
            values="10; 20; 10"
            begin="0.15s"
            dur="0.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            attributeType="XML"
            values="10; 5; 10"
            begin="0.15s"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </rect>
        <rect
          x="16"
          y="10"
          width="4"
          height="10"
          fill="currentColor"
          opacity="0.2"
        >
          <animate
            attributeName="opacity"
            attributeType="XML"
            values="0.2; 1; .2"
            begin="0.3s"
            dur="0.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="height"
            attributeType="XML"
            values="10; 20; 10"
            begin="0.3s"
            dur="0.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="y"
            attributeType="XML"
            values="10; 5; 10"
            begin="0.3s"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>
    </CommonIconStyleWrapper>
  );
};

export default SpinIndicator;
