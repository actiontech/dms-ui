import { act, cleanup, renderHook } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import RuleSelect from '.';
import { ruleListMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template/data';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { Form } from 'antd';
import { RuleFilterFieldsType } from '../../../../components/RuleList';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('sqle/RuleTemplate/RuleSelect', () => {
  const dispatchSpy = jest.fn();
  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    jest.useFakeTimers();
    mockUsePermission(undefined, {
      useSpyOnMockHooks: true
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should match snap shot', async () => {
    const { result } = renderHook(() => Form.useForm<RuleFilterFieldsType>());
    const { baseElement } = superRender(
      <RuleSelect
        dbType="MySQL"
        activeRule={ruleListMockData}
        filteredRule={ruleListMockData}
        allRules={ruleListMockData}
        updateActiveRule={jest.fn()}
        updateFilteredRule={jest.fn()}
        listLoading={false}
        ruleFilterForm={result.current[0]}
        filterCategoryTags="table,dcl,online"
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });
});
