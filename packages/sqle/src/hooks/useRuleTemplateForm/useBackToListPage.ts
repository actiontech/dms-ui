import useRuleManagerSegmented from '../../page/RuleManager/useRuleManagerSegmented';
import { RuleManagerSegmentedKey } from '../../page/RuleManager/index.type';
import { useNavigate } from 'react-router-dom';

const useBackToListPage = (projectID?: string) => {
  const navigate = useNavigate();

  const { updateActiveSegmentedKey } = useRuleManagerSegmented();

  const onGoToGlobalRuleTemplateList = () => {
    updateActiveSegmentedKey(RuleManagerSegmentedKey.GlobalRuleTemplate);
    navigate('/sqle/ruleManager');
  };

  const onGotoRuleTemplateList = () => {
    navigate(`/sqle/project/${projectID}/rule/template`);
  };

  return {
    onGoToGlobalRuleTemplateList,
    onGotoRuleTemplateList
  };
};

export default useBackToListPage;
