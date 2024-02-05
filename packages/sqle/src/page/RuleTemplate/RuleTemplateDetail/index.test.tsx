import { act, cleanup } from '@testing-library/react';
import { renderWithThemeAndRedux } from '../../../testUtils/customRender';
import RuleTemplateDetail from '.';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import rule_template from '../../../testUtils/mockApi/rule_template';
import { useParams } from 'react-router-dom';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
    useParams: jest.fn()
  };
});

describe('sqle/RuleTemplate/RuleTemplateDetail', () => {
  let requestGetProjectRule: jest.SpyInstance;
  let requestGetAllRule: jest.SpyInstance;
  const useParamsMock: jest.Mock = useParams as jest.Mock;
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
    mockUseCurrentProject();
    requestGetProjectRule = rule_template.getProjectRuleTemplate();
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
    const { baseElement } = renderWithThemeAndRedux(<RuleTemplateDetail />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(requestGetProjectRule).toBeCalledTimes(1);
    expect(requestGetAllRule).toBeCalledTimes(1);
  });
});
