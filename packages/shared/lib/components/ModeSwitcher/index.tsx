import { useControllableValue } from 'ahooks';
import { ModeSwitcherProps } from './index.type';
import { ModeSwitcherItemStyleWrapper } from './style';
import classNames from 'classnames';
import { Col, Row } from 'antd';
import EmptyBox from '../EmptyBox';

const ModeSwitcher = <V extends string | number = string>({
  className,
  options,
  value,
  onChange,
  rowProps,
  disabled,
  defaultValue
}: ModeSwitcherProps<V>) => {
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
      {...rowProps}
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
                if (!disabled) {
                  setInternalValue(itemValue);
                }
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

export default ModeSwitcher;
