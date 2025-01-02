import { CSSProperties, ReactNode } from 'react';

export type CustomSegmentedFilterBaseValue = string | number | null;

export type CustomSegmentedFilterWithAllConfig<
  V extends CustomSegmentedFilterBaseValue = string
> = {
  label: ReactNode;
  value: V;
};

export type CustomSegmentedFilterDefaultOptionsType<
  V extends CustomSegmentedFilterBaseValue = string
> = Array<{ label: ReactNode; value: V }>;

export type CustomSegmentedFilterProps<
  V extends CustomSegmentedFilterBaseValue = string
> = {
  value?: V;

  onChange?: (val: V) => void;

  defaultValue?: V;

  /**
   * 当 options 类型为 string[] 时，会自动通过该字典数据进行 label to value
   * eg:
   * options: ['failed', 'finished']
   * dictionary:{
   *     failed: '执行失败',
   *     finished: '执行结束'
   * }
   *
   * 最终会自动渲染成 [
   *   {
   *     label: '执行失败',
   *     value: 'failed'
   *   },
   *   {
   *     label: '执行结束',
   *     value: 'finished'
   *   }
   * ]
   */
  labelDictionary?: Record<string, string>;

  /**
   * 生成 Segmented Options 的集合
   */
  options: CustomSegmentedFilterDefaultOptionsType<V> | string[];

  /**
   * 是否添加"全部"选项
   * - true: 使用默认配置，label为"全部"，value为 null
   * - WithAllConfig: 自定义配置
   * - false: 不显示全部选项
   */
  withAll?: boolean | CustomSegmentedFilterWithAllConfig<V>;

  /**
   * 是否清空样式
   * 默认值： false
   * 组件默认使用 BasicSegmented 的样式作为包裹
   * 当设置为 true 时，清空样式，用户可执行使用 StyleWrapper 进行包裹或自行添加 Class 来处理样式
   */

  noStyle?: boolean;

  className?: string;
  style?: CSSProperties;
};
