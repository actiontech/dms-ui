import { Popover, Typography } from 'antd';
import { useSigma } from '@react-sigma/core';
import { useState, useEffect, useCallback, useRef } from 'react';
import { EdgeType, NodeType } from '../index.type';
import debounce from 'lodash/debounce';
import { parse2ReactRouterPath } from '@actiontech/shared';
import { useTranslation } from 'react-i18next';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

interface NodePopoverProps {
  nodeId: string | null;
}

const NodePopover: React.FC<NodePopoverProps> = ({ nodeId }) => {
  const { t } = useTranslation();
  const sigma = useSigma<NodeType, EdgeType>();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [nodeData, setNodeData] = useState<NodeType | null>(null);
  const [isPositionReady, setIsPositionReady] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const hidePopover = useCallback(() => {
    hideTimeoutRef.current = setTimeout(() => {
      setVisible(false);
      setIsPositionReady(false);
    }, 300);
  }, []);

  const clearHideTimeout = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  }, []);

  const updatePosition = useCallback(() => {
    if (!nodeId) {
      hidePopover();
      return;
    }

    clearHideTimeout();
    // 避免不必要的状态重置，只在真正需要时设置
    if (visible) {
      setIsPositionReady(false); // 重置位置状态
    }
    const node = sigma.getGraph().getNodeAttributes(nodeId);
    const displayData = sigma.getNodeDisplayData(nodeId);

    if (node && displayData) {
      const containerRect = sigma.getContainer().getBoundingClientRect();
      const viewportPos = sigma.framedGraphToViewport(displayData);

      // 直接使用容器相对位置，不再硬编码菜单和头部偏移 这样更灵活，适应不同布局情况
      const finalPosition = {
        x: viewportPos.x,
        y: viewportPos.y
      };

      // 调整 Popover 位置，考虑节点大小
      const nodeSize = displayData.size || 5;

      // 将弹出框定位在节点上方，距离为节点大小的 1.5 倍
      finalPosition.y -= nodeSize * 1.5;

      // 确保不超出图谱容器边界
      const graphWidth = containerRect.width;
      const graphHeight = containerRect.height;

      const POPOVER_WIDTH = 200;
      const POPOVER_HEIGHT = 100;

      if (finalPosition.x - POPOVER_WIDTH / 2 < 0) {
        finalPosition.x = POPOVER_WIDTH / 2;
      } else if (finalPosition.x + POPOVER_WIDTH / 2 > graphWidth) {
        finalPosition.x = graphWidth - POPOVER_WIDTH / 2;
      }

      if (finalPosition.y < 0) {
        // 如果上方放不下，则放在节点下方
        finalPosition.y = viewportPos.y + nodeSize * 1.5;

        // 如果下方也放不下，则尽量靠近顶部但不超出
        if (finalPosition.y + POPOVER_HEIGHT > graphHeight) {
          finalPosition.y = Math.min(5, graphHeight - POPOVER_HEIGHT);
        }
      }

      setPosition(finalPosition);
      setNodeData(node);

      // 使用 requestAnimationFrame 确保位置更新后再显示
      requestAnimationFrame(() => {
        setIsPositionReady(true);
        setVisible(true);
      });
    }
  }, [nodeId, sigma, hidePopover, clearHideTimeout, visible]);

  useEffect(() => {
    if (!nodeId) {
      hidePopover();
      return;
    }
    clearHideTimeout();
    // 使用防抖处理位置更新
    const createDebouncedUpdate = (updateFn: () => void) =>
      debounce(updateFn, 50, { leading: true, trailing: true });

    const debouncedUpdatePosition = createDebouncedUpdate(updatePosition);

    // 立即更新一次位置
    updatePosition();

    // 监听相关事件
    sigma.on('afterRender', debouncedUpdatePosition);
    window.addEventListener('scroll', debouncedUpdatePosition);
    window.addEventListener('resize', debouncedUpdatePosition);

    return () => {
      sigma.off('afterRender', debouncedUpdatePosition);
      window.removeEventListener('scroll', debouncedUpdatePosition);
      window.removeEventListener('resize', debouncedUpdatePosition);
      debouncedUpdatePosition.cancel();
    };
  }, [nodeId, sigma, updatePosition, hidePopover, clearHideTimeout]);

  if (!visible || !nodeData || !isPositionReady) return null;

  return (
    <div
      className="node-popover-container"
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000
      }}
    >
      <div
        className="node-popover-content"
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'auto',
          opacity: 1,
          transition: 'opacity 0.2s'
        }}
        onMouseEnter={clearHideTimeout}
        onMouseLeave={hidePopover}
      >
        <Popover
          open={true}
          content={
            <Typography.Link
              href={parse2ReactRouterPath(ROUTE_PATHS.SQLE.KNOWLEDGE.refined, {
                queries: {
                  tags: nodeData.label
                }
              })}
              target="__blank"
            >
              {t('knowledgeBase.graph.viewRelatedRules')}
            </Typography.Link>
          }
        />
      </div>
    </div>
  );
};

export default NodePopover;
