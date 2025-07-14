import { act, cleanup } from '@testing-library/react';
import { sqleSuperRender } from '../../../testUtils/superRender';
import RuleTemplateDetail from '.';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import rule_template from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template';
import { useParams } from 'react-router-dom';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn()
  };
});

describe('sqle/GlobalRuleTemplate/RuleTemplateDetail', () => {
  let requestGetGlobalRule: jest.SpyInstance;
  let requestGetAllRule: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
    mockUsePermission(
      {
        moduleFeatureSupport: { sqlOptimization: true, knowledge: false }
      },
      {
        useSpyOnMockHooks: true
      }
    );
    requestGetGlobalRule = rule_template.getRuleTemplate();
    requestGetAllRule = rule_template.getRuleList();
    useParamsMock.mockReturnValue({
      templateName: 'template-a',
      dbType: 'mysql'
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should match snap shot', async () => {
    const { baseElement } = sqleSuperRender(<RuleTemplateDetail />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(requestGetGlobalRule).toHaveBeenCalledTimes(1);
    expect(requestGetAllRule).toHaveBeenCalledTimes(1);
  });
});
