import { useCallback, useEffect } from 'react';

export const findAllParentNodes = (element: HTMLElement) => {
  const parentNodes: Node[] = [];
  let currentNode: Node | null = element?.parentNode;

  while (currentNode !== null) {
    parentNodes.push(currentNode);
    currentNode = currentNode.parentNode;
  }

  return parentNodes;
};

// 点击空白处，使表单元素隐藏
const useHideConfigInputNode = (
  inputNodeVisible: boolean,
  hideAction?: () => void
) => {
  const hideConfigInput = useCallback(
    (event: MouseEvent) => {
      if (!inputNodeVisible) return;
      if (!event.target) return;

      const allParentNodes = findAllParentNodes(event.target as HTMLElement);
      const isInConfigItem = allParentNodes.some((node) =>
        (node as HTMLElement)?.classList?.contains('config-item-filed')
      );
      if (!isInConfigItem) {
        hideAction?.();
      }
    },
    [hideAction, inputNodeVisible]
  );

  useEffect(() => {
    document.addEventListener('mousedown', hideConfigInput);

    return () => {
      document.removeEventListener('mousedown', hideConfigInput);
    };
  }, [hideConfigInput]);
};

export default useHideConfigInputNode;
