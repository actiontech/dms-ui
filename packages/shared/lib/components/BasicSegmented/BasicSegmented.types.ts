import { SegmentedProps } from 'antd';

/**
 * 排除as属性，因为这里的as属性非antd支持属性 并且会和MUI styled 组件期望的 as 属性类型冲突
 * as属性来源：SegmentedProps继承自AllHTMLAttributes，as定义在AllHTMLAttributes中
 */
export type BasicSegmentedProps = Omit<SegmentedProps, 'as'>;
