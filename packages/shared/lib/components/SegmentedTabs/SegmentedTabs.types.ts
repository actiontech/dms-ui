import { ReactNode } from 'react';
import { LazyLoadComponentProps } from '../LazyLoadComponent/LazyLoadComponent.types';

type ItemsType<T extends string | number = string> = {
  /**
   * 被隐藏时是否销毁 DOM 结构
   * default value : false
   */
  destroyInactivePane?: LazyLoadComponentProps['destroyOnClose'];

  /**
   * 被隐藏时是否渲染 DOM 结构
   * default value : false
   */
  forceRender?: LazyLoadComponentProps['forceRender'];

  /**
   * 当前 segmented 标签下对应的内容
   */
  children?: ReactNode;

  /**
   * segmented option label
   */
  label: ReactNode;

  /**
   * segmented option value
   */
  value: T;

  /**
   * segmented option icon
   */
  icon?: ReactNode;

  /**
   * segmented options className
   */
  className?: string;
};

export type SegmentedTabsProps<T extends string | number = string> = {
  /**
   * 配置选项卡内容, 除了 children、forceRender、destroyInactivePane 外的属性将会传递给 segmented 的 options
   */
  items: Array<ItemsType>;

  /**
   * 当前选中的标签页，传递后组件将会成为受控模式
   */
  activeKey?: T;

  /**
   *  切换标签页的回调
   */
  onChange?: (key: T) => void;

  /**
   * 默人选中的标签页
   */
  defaultActiveKey?: T;

  /**
   * 标签页内容出现、隐藏的动画效果
   */
  animated?: LazyLoadComponentProps['animation'];

  /**
   * 最外层 className
   */
  rootClassName?: string;

  /**
   * segmented row className
   */
  segmentedRowClassName?: string;

  /**
   * segmented row  额外内容
   */
  segmentedRowExtraContent?: ReactNode;
};
