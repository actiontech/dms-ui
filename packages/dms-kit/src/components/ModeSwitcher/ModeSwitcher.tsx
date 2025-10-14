import { useControllableValue } from 'ahooks';
import { ModeSwitcherProps } from './ModeSwitcher.types';
import { ModeSwitcherItemStyleWrapper } from './style';
import classNames from 'classnames';
import { Col, Row } from 'antd';
import EmptyBox from '../EmptyBox/EmptyBox';
import { forwardRef } from 'react';

// forwardRef: https://ant.design/components/tooltip-cn#%E4%B8%BA%E4%BD%95%E5%9C%A8%E4%B8%A5%E6%A0%BC%E6%A8%A1%E5%BC%8F%E4%B8%AD%E6%9C%89%E6%97%B6%E5%80%99%E4%BC%9A%E5%87%BA%E7%8E%B0-finddomnode-is-deprecated-%E8%BF%99%E4%B8%AA%E8%AD%A6%E5%91%8A
const ModeSwitcher = <V extends string | number = string>(
  {
    className,
    options,
    value,
    onChange,
    rowProps,
    disabled,
    defaultValue,
    ...props
  }: ModeSwitcherProps<V>,
  ref: React.ForwardedRef<HTMLDivElement>
) => {
  const [internalValue, setInternalValue] = useControllableValue<V>(
    typeof value !== 'undefined' && onChange
      ? {
          value,
          onChange,
          defaultValue
        }
      : {
          onChange,
          defaultValue
        }
  );

  return (
    <Row
      ref={ref}
      {...rowProps}
      // https://github.com/ant-design/ant-design/issues/15909 为了保证能在 tooltip 下正常工作，需要透传额外的 props
      {...props}
      className={classNames(
        'actiontech-mode-switcher',
        className,
        rowProps?.className
      )}
    >
      {options.map((item) => {
        const label = typeof item === 'string' ? item : item.label;
        const itemValue = (typeof item === 'string' ? item : item.value) as V;
        const active = internalValue === itemValue;
        const icon = typeof item === 'string' ? null : item.icon;
        const colProps = typeof item === 'string' ? undefined : item.colProps;
        return (
          <Col {...colProps} key={itemValue}>
            <ModeSwitcherItemStyleWrapper
              className={classNames('actiontech-mode-switcher-item', {
                'actiontech-mode-switcher-item-active': active,
                'actiontech-mode-switcher-item-disabled': disabled
              })}
              onClick={() => {
                if (disabled) {
                  return;
                }

                setInternalValue(itemValue);
              }}
            >
              <EmptyBox if={!!icon}>
                <span className="actiontech-mode-switcher-item-icon">
                  {icon}
                </span>
              </EmptyBox>
              <span
                className={classNames('actiontech-mode-switcher-item-text', {
                  'only-text': !icon
                })}
              >
                {label}
              </span>
              <div className="active-icon-wrapper" hidden={!active}>
                <span
                  className={classNames(
                    'icon-mode-switcher-checked active-icon',
                    className
                  )}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="Frame">
                      <path
                        id="Vector"
                        d="M3.88879 7.00002L6.22213 9.33335L10.8888 4.66669"
                        stroke="#FCFBF9"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </span>
              </div>
            </ModeSwitcherItemStyleWrapper>
          </Col>
        );
      })}
    </Row>
  );
};

ModeSwitcher.displayName = 'ModeSwitcher';

export default forwardRef(ModeSwitcher) as unknown as <
  V extends string | number = string
>(
  props: React.PropsWithChildren<ModeSwitcherProps<V>> &
    React.RefAttributes<HTMLDivElement>
) => React.ReactElement;
