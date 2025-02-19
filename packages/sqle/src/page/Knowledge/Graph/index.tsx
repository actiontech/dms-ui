import {
  ControlsContainer,
  FullScreenControl,
  SigmaContainer,
  SigmaContainerProps,
  ZoomControl
} from '@react-sigma/core';
import '@react-sigma/core/lib/style.css';
import { GraphSearch, GraphSearchOption } from '@react-sigma/graph-search';
import '@react-sigma/graph-search/lib/style.css';
import FocusOnNode from './components/FocusOnNode';
import LoadGraph from './components/LoadGraph';
import '@react-sigma/core/lib/style.css';
import { Attributes, useCallback, useEffect, useState } from 'react';
import { KnowledgeGraphStyleWrapper } from './style';
import { EdgeType, KnowledgeGraphProp, NodeType } from './index.type';
import classNames from 'classnames';
import NodePopover from './components/NodePopover';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import Fa2 from './components/Fa2';

const sigmaSettings: SigmaContainerProps<
  NodeType,
  EdgeType,
  Attributes
>['settings'] = {
  // 允许在无效容器中渲染 (默认值: false)
  allowInvalidContainer: true,
  defaultNodeType: 'circle',
  // 设置边的默认类型 (默认值: 'line')
  defaultEdgeType: 'line',

  // 节点渲染程序类 (默认值: {})
  nodeProgramClasses: {},

  // 渲染性能优化
  hideEdgesOnMove: false, // 移动时隐藏边 (默认值: false)
  hideLabelsOnMove: false, // 移动时隐藏标签 (默认值: false)
  renderLabels: true, // 是否渲染标签 (默认值: true)
  renderEdgeLabels: false, // 是否渲染边标签 (默认值: false)

  labelFont: `'PlusJakartaSans Medium', -apple-system, 'Microsoft YaHei',
  BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
  sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
  'Noto Color Emoji`,
  labelSize: 14,

  // 交互体验优化
  zoomToSizeRatioFunction: (x: number) => x, // 缩放比例函数 (默认值: Math.pow)

  // 调整缩放比例限制
  minCameraRatio: 0.1,
  maxCameraRatio: 10,

  // 调整标签渲染
  labelDensity: 0.1, // 增加标签密度
  labelGridCellSize: 150, // 增加标签网格大小
  labelRenderedSizeThreshold: 8 // 标签大小阈值 (默认值: 6)
};

const KnowledgeGraph: React.FC<KnowledgeGraphProp> = ({ graphData }) => {
  const { t } = useTranslation();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [focusNode, setFocusNode] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const onFocus = useCallback((value: GraphSearchOption | null) => {
    if (value === null) {
      setFocusNode(null);
    } else if (value.type === 'nodes') {
      setFocusNode(value.id);
    }
  }, []);

  const onChange = useCallback((value: GraphSearchOption | null) => {
    if (value === null) {
      setSelectedNode(null);
    } else if (value.type === 'nodes') {
      setSelectedNode(value.id);
    }
  }, []);

  const handleGraphLoaded = useCallback(() => {
    setIsLoading(false);
  }, []);

  const postSearchResult = useCallback(
    (options: GraphSearchOption[]): GraphSearchOption[] => {
      return options.length <= 10
        ? options
        : [
            ...options.slice(0, 10),
            {
              type: 'message',
              message: (
                <span className="text-center text-muted">
                  And {options.length - 10} others
                </span>
              )
            }
          ];
    },
    []
  );

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  return (
    <KnowledgeGraphStyleWrapper>
      <Spin spinning={isLoading} tip={t('knowledgeBase.graph.loadingTips')}>
        <SigmaContainer
          className={classNames('sigma-container', {
            'sigma-container-full-screen': isFullScreen
          })}
          settings={sigmaSettings}
        >
          <Fa2 />
          <LoadGraph
            graphData={graphData}
            hoveredNode={hoveredNode}
            setHoveredNode={setHoveredNode}
            onLoaded={handleGraphLoaded}
          />
          <FocusOnNode
            node={focusNode ?? selectedNode}
            move={focusNode ? false : true}
          />
          <ControlsContainer
            className="graph-control-container"
            position={'bottom-right'}
          >
            <ZoomControl />
            <FullScreenControl />
          </ControlsContainer>
          <ControlsContainer
            className="graph-control-container"
            position={'top-right'}
          >
            <GraphSearch
              type="nodes"
              value={selectedNode ? { type: 'nodes', id: selectedNode } : null}
              onFocus={onFocus}
              onChange={onChange}
              postSearchResult={postSearchResult}
            />
          </ControlsContainer>
          <NodePopover nodeId={hoveredNode} />
        </SigmaContainer>
      </Spin>
    </KnowledgeGraphStyleWrapper>
  );
};

export default KnowledgeGraph;
