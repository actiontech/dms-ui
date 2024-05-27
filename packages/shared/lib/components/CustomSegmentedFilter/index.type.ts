import { CSSProperties, ReactNode } from 'react';

export type CustomSegmentedFilterDefaultOptionsType<
  V extends string | number | undefined = string
> = Array<{ label: ReactNode; value: V }>;

export type CustomSegmentedFilterProps<
  V extends string | number | undefined = string
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
   * 是否自动添加 “全部” 项作为筛选项
   * 默认值： false
   *
   * 当为 true 时，默认添加的 “全部” 筛选项对应的 option 为 {label:'全部', value: undefined}
   * 当为 string 类型数据 时，默认添加的 “全部” 筛选项对应的 option 为 {label: `${withAll}`, value: `${withAll}`}
   * 当为 Record 时，会将该对象合并进入 options
   */
  withAll?: boolean | CustomSegmentedFilterDefaultOptionsType<V>[0] | string;

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
