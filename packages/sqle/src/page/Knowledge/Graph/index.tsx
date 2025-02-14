import {
  ControlsContainer,
  FullScreenControl,
  SigmaContainer,
  ZoomControl
} from '@react-sigma/core';
import '@react-sigma/core/lib/style.css';
import { GraphSearch, GraphSearchOption } from '@react-sigma/graph-search';
import '@react-sigma/graph-search/lib/style.css';
import FocusOnNode from './common/FocusOnNode';
import LoadGraph from './common/LoadGraph';
import '@react-sigma/core/lib/style.css';
import { sigmaSettings } from './common/data';
import { useCallback, useEffect, useState } from 'react';
import { KnowledgeGraphStyleWrapper } from './style';
import { KnowledgeGraphProp } from './index.type';
import classNames from 'classnames';
import NodePopover from './common/NodePopover';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';

const KnowledgeGraph: React.FC<KnowledgeGraphProp> = ({ graphData }) => {
  const { t } = useTranslation();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [focusNode, setFocusNode] = useState<string | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const onFocus = useCallback((value: GraphSearchOption | null) => {
    if (value === null) setFocusNode(null);
    else if (value.type === 'nodes') setFocusNode(value.id);
  }, []);

  const onChange = useCallback((value: GraphSearchOption | null) => {
    if (value === null) setSelectedNode(null);
    else if (value.type === 'nodes') setSelectedNode(value.id);
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
