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
  hideAction: () => void
) => {
  document.addEventListener('mousedown', (e) => {
    if (!inputNodeVisible) return;
    if (!e.target) return;

    const allParentNodes = findAllParentNodes(e.target as HTMLElement);
    const isInConfigItem = allParentNodes.some((node) =>
      (node as HTMLElement)?.classList?.contains('config-item-filed')
    );
    if (!isInConfigItem) {
      hideAction();
    }
  });
};

export default useHideConfigInputNode;
