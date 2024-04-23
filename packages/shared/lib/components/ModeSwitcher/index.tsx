import { useControllableValue } from 'ahooks';
import { ModeSwitcherProps } from './index.type';
import { ModeSwitcherItemStyleWrapper } from './style';
import classNames from 'classnames';
import { IconModeSwitcherChecked } from '../../Icon/common';
import { Col, Row } from 'antd';

const ModeSwitcher = <V extends string | number = string>({
  className,
  options,
  value,
  onChange,
  rowProps
}: ModeSwitcherProps) => {
  const [internalValue, setInternalValue] = useControllableValue<V>(
    typeof value !== 'undefined' && onChange
      ? {
          value,
          onChange
        }
      : {
          onChange
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
              active={active}
              className={classNames('actiontech-mode-switcher-item', {
                'actiontech-mode-switcher-item-active': active
              })}
              onClick={() => {
                setInternalValue(itemValue);
              }}
            >
              <span className="actiontech-mode-switcher-item-icon">{icon}</span>
              <span className="actiontech-mode-switcher-item-text">
                {label}
              </span>
              <div className="active-icon-wrapper" hidden={!active}>
                <IconModeSwitcherChecked className="active-icon" />
              </div>
            </ModeSwitcherItemStyleWrapper>
          </Col>
        );
      })}
    </Row>
  );
};

export default ModeSwitcher;