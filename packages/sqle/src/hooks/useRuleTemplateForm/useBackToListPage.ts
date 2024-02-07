import { useNavigate } from 'react-router-dom';

const useBackToListPage = (projectID?: string) => {
  const navigate = useNavigate();

  const onGoToGlobalRuleTemplateList = () => {
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
