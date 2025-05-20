import useCustomRuleTemplateForm from '../../hooks/useCustomRuleTemplateForm';
import { superRenderHook } from '@actiontech/shared/lib/testUtil/superRender';
import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import { sqleSuperRender } from '../../../../testUtils/superRender';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import configuration from '@actiontech/shared/lib/testUtil/mockApi/sqle/configuration';
import rule_template from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template';
import CustomRuleForm from '../CustomRuleForm';
import { customRuleDetailMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/rule_template/data';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';
import {
  UtilsConsoleErrorStringsEnum,
  ignoreConsoleErrors
} from '@actiontech/shared/lib/testUtil/common';

jest.mock('react-router-dom', () => {
  return {
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
  };
});

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

describe('sqle/CustomRule/Form', () => {
  let getDriversSpy: jest.SpyInstance;
  let getCategoryStatisticsSpy: jest.SpyInstance;
  beforeEach(() => {
    mockUseDbServiceDriver();
    mockUsePermission(
      {
        moduleFeatureSupport: { sqlOptimization: true, knowledge: false }
      },
      {
        useSpyOnMockHooks: true
      }
    );
    getDriversSpy = configuration.getDrivers();
    getCategoryStatisticsSpy = rule_template.getCategoryStatistics();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER]);

  it('should match snap', async () => {
    const { result } = superRenderHook(useCustomRuleTemplateForm, {});
    const { baseElement } = sqleSuperRender(
      <CustomRuleForm
        title="创建"
        submit={jest.fn()}
        baseInfoSubmit={jest.fn()}
        submitLoading={false}
        {...result.current}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snap when provide defaultData', async () => {
    const { result } = superRenderHook(useCustomRuleTemplateForm, {});
    const { baseElement } = sqleSuperRender(
      <CustomRuleForm
        title="编辑"
        submit={jest.fn()}
        baseInfoSubmit={jest.fn()}
        submitLoading={false}
        {...result.current}
        defaultData={customRuleDetailMockData}
      />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getCategoryStatisticsSpy).toHaveBeenCalledTimes(1);
    expect(getDriversSpy).toHaveBeenCalledTimes(1);
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(screen.getByText('下一步'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });
});
