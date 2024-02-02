import { act, cleanup } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import RuleTemplateForm from '.';
import { ruleListMockData } from '../../../../testUtils/mockApi/rule_template/data';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('sqle/RuleTemplate/RuleTemplateForm', () => {
  const dispatchSpy = jest.fn();
  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should match snap shot', async () => {
    const { baseElement } = renderWithReduxAndTheme(
      <RuleTemplateForm
        dbType="MySQL"
        activeRule={ruleListMockData}
        allRules={ruleListMockData}
        updateActiveRule={jest.fn()}
        listLoading={false}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });
});