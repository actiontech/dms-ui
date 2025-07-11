import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { act, cleanup } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import {
  superRender,
  superRenderHook
} from '@actiontech/shared/lib/testUtil/superRender';
import RuleTemplateForm from '.';
import { ruleListMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template/data';
import configuration from '@actiontech/shared/lib/testUtil/mockApi/sqle/configuration';
import { Form } from 'antd';
import { RuleTemplateBaseInfoFields } from './BaseInfoForm/index.type';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import { RuleFilterFieldsType } from '../../../components/RuleList';
import rule_template from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('sqle/RuleTemplate/RuleTemplateForm', () => {
  const dispatchSpy = jest.fn();
  let getDriversSpy: jest.SpyInstance;
  let getRuleVersionTipsSpy: jest.SpyInstance;
  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    mockUsePermission(undefined, {
      useSpyOnMockHooks: true
    });
    getRuleVersionTipsSpy = rule_template.mockGetDriverRuleVersionTips();
    getDriversSpy = configuration.getDrivers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should match snap shot', async () => {
    const { result } = superRenderHook(() =>
      Form.useForm<RuleTemplateBaseInfoFields>()
    );
    const { result: filterResult } = superRenderHook(() =>
      Form.useForm<RuleFilterFieldsType>()
    );
    const { baseElement } = superRender(
      <RuleTemplateForm
        mode="create"
        title="test"
        step={0}
        form={result.current[0]}
        dbType="MySQL"
        projectName={mockProjectInfo.projectName}
        ruleListLoading={false}
        activeRule={ruleListMockData}
        allRules={ruleListMockData}
        updateActiveRule={jest.fn()}
        submitLoading={false}
        baseInfoFormSubmitLoading={false}
        baseInfoSubmit={jest.fn()}
        submit={jest.fn()}
        filteredRule={ruleListMockData}
        updateFilteredRule={jest.fn()}
        ruleFilterForm={filterResult.current[0]}
        filterCategoryTags="table,dcl,online"
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });
});
