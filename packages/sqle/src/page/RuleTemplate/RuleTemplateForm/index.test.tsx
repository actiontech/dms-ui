import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { act, cleanup } from '@testing-library/react';
import { useDispatch } from 'react-redux';
import {
  renderWithReduxAndTheme,
  renderHooksWithTheme
} from '@actiontech/shared/lib/testUtil/customRender';
import RuleTemplateForm from '.';
import { ruleListMockData } from '../../../testUtils/mockApi/rule_template/data';
import configuration from '../../../testUtils/mockApi/configuration';
import { Form } from 'antd';
import { RuleTemplateBaseInfoFields } from './BaseInfoForm/index.type';
import { mockUseCurrentPermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentPermission';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('sqle/RuleTemplate/RuleTemplateForm', () => {
  const dispatchSpy = jest.fn();
  let getDriversSpy: jest.SpyInstance;
  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    mockUseCurrentPermission();
    getDriversSpy = configuration.getDrivers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('should match snap shot', async () => {
    const { result } = renderHooksWithTheme(() =>
      Form.useForm<RuleTemplateBaseInfoFields>()
    );
    const { baseElement } = renderWithReduxAndTheme(
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
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });
});
