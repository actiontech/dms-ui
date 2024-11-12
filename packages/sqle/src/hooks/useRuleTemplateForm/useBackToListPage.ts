import { useTypedNavigate } from '@actiontech/shared';
import { ROUTE_PATHS } from '@actiontech/shared/lib/data/routePaths';

const useBackToListPage = (projectID?: string) => {
  const navigate = useTypedNavigate();

  const onGoToGlobalRuleTemplateList = () => {
    navigate(ROUTE_PATHS.SQLE.RULE_MANAGEMENT.index);
  };

  const onGotoRuleTemplateList = () => {
    navigate(ROUTE_PATHS.SQLE.RULE_TEMPLATE.index, {
      params: { projectID: projectID ?? '' }
    });
  };

  return {
    onGoToGlobalRuleTemplateList,
    onGotoRuleTemplateList
  };
};

export default useBackToListPage;
