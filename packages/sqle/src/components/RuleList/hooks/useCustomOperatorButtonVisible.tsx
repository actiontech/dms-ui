import { findAllParentNodes } from '@actiontech/shared/lib/components/ConfigItem/hooks/useHideConfigInputNode';

/**
 * 此hook暂时保留，具体原因见 http://10.186.18.11/jira/browse/DMS-603 备注
 */

const useCustomOperatorButtonVisible = (
  confirmPopupVisible: boolean,
  setButtonVisible: (visible: boolean) => void
) => {
  document.addEventListener('mouseover', (e) => {
    if (!e.target) return;

    const allParentNodes = findAllParentNodes(e.target as HTMLElement);
    const isInRuleItem = allParentNodes.some((node) =>
      (node as HTMLElement)?.classList?.contains('has-top-margin')
    );

    setButtonVisible(isInRuleItem || confirmPopupVisible);
  });
};

export default useCustomOperatorButtonVisible;
