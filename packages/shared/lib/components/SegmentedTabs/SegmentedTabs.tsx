import { SegmentedTabsProps } from './SegmentedTabs.types';
import { SegmentedProps } from 'antd';
import { useMemo } from 'react';
import { useControllableValue } from 'ahooks';
import LazyLoadComponent from '../LazyLoadComponent/LazyLoadComponent';
import classNames from 'classnames';
import { SegmentedRowStyleWrapper } from '../../styleWrapper/element';
import { BasicSegmented } from '../BasicSegmented';

const SegmentedTabs = <T extends string | number = string>({
  items,
  animated = false,
  rootClassName,
  segmentedRowClassName,
  segmentedRowExtraContent,
  ...props
}: SegmentedTabsProps<T>) => {
  const defaultActiveKey = props.defaultActiveKey ?? items[0]?.value;

  const [activeKey, onChange] = useControllableValue(
    typeof props.activeKey !== 'undefined'
      ? {
          value: props.activeKey,
          onChange: props.onChange,
          defaultValue: defaultActiveKey
        }
      : {
          onChange: props.onChange,
          defaultValue: defaultActiveKey
        }
  );

  const segmentedOptions: SegmentedProps['options'] = useMemo(() => {
    return items.map((item) => {
      const { forceRender, destroyInactivePane, children, ...option } = item;
      return option;
    });
  }, [items]);

  return (
    <div className={classNames('segmented-tabs-wrapper', rootClassName)}>
      <SegmentedRowStyleWrapper
        className={classNames('segmented-row-wrapper', segmentedRowClassName)}
      >
        <BasicSegmented
          options={segmentedOptions}
          onChange={onChange}
          value={activeKey}
          defaultValue={defaultActiveKey}
        />

        {!!segmentedRowExtraContent && segmentedRowExtraContent}
      </SegmentedRowStyleWrapper>

      {items.map((item) => {
        return (
          <LazyLoadComponent
            className="segmented-item-content"
            key={item.value}
            open={item.value === activeKey}
            animation={animated}
            destroyOnClose={item.destroyInactivePane}
            forceRender={item.forceRender}
          >
            {item.children}
          </LazyLoadComponent>
        );
      })}
    </div>
  );
};

export default SegmentedTabs;
