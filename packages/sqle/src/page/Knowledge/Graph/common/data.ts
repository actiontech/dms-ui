import { SigmaContainerProps } from '@react-sigma/core';
import { EdgeType, NodeType } from '../index.type';
import { Attributes } from 'graphology-types';
import { NodeProgramType } from 'sigma/rendering';
import { NodeImageProgram } from '@sigma/node-image';

export const sigmaSettings: SigmaContainerProps<
  NodeType,
  EdgeType,
  Attributes
>['settings'] = {
  // 允许在无效容器中渲染 (默认值: false)
  allowInvalidContainer: true,
  defaultNodeType: 'image',
  // 设置边的默认类型 (默认值: 'line')
  defaultEdgeType: 'line',

  // 相机缩放比例限制 (默认值: min: 0.1, max: 32)
  minCameraRatio: 0.2,
  maxCameraRatio: 5,

  // 节点渲染程序类 (默认值: {})
  nodeProgramClasses: {
    image: NodeImageProgram as unknown as NodeProgramType<
      NodeType,
      EdgeType,
      Attributes
    >
  },

  // 渲染性能优化
  hideEdgesOnMove: true, // 移动时隐藏边 (默认值: false)
  hideLabelsOnMove: false, // 移动时隐藏标签 (默认值: false)
  renderLabels: true, // 是否渲染标签 (默认值: true)
  renderEdgeLabels: false, // 是否渲染边标签 (默认值: false)

  labelFont: `'PlusJakartaSans Medium', -apple-system, 'Microsoft YaHei',
    BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
    sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
    'Noto Color Emoji`,
  labelSize: 14,
  // 标签渲染优化
  labelDensity: 0.07, // 标签密度 (默认值: 0.03)
  labelGridCellSize: 100, // 标签网格大小 (默认值: 100)
  labelRenderedSizeThreshold: 8, // 标签大小阈值 (默认值: 6)

  // 默认样式
  defaultNodeColor: '#1a73e8', // 节点颜色 (默认值: '#999')
  defaultEdgeColor: '#ccc', // 边颜色 (默认值: '#ccc')

  // 交互体验优化
  zoomToSizeRatioFunction: (x: number) => x // 缩放比例函数 (默认值: Math.pow)
};
