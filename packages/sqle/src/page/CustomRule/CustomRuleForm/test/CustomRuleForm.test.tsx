import useCustomRuleTemplateForm from '../../hooks/useCustomRuleTemplateForm';
import { renderHooksWithRedux } from '@actiontech/shared/lib/testUtil/customRender';
import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import { renderWithThemeAndRedux } from '../../../../testUtils/customRender';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import configuration from '../../../../testUtils/mockApi/configuration';
import rule_template from '../../../../testUtils/mockApi/rule_template';
import CustomRuleForm from '../CustomRuleForm';
import { customRuleDetailMockData } from '../../../../testUtils/mockApi/rule_template/data';
import { mockUsePermission } from '@actiontech/shared/lib/testUtil/mockHook/mockUsePermission';

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

  it('should match snap', async () => {
    const { result } = renderHooksWithRedux(useCustomRuleTemplateForm, {});
    const { baseElement } = renderWithThemeAndRedux(
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
    const { result } = renderHooksWithRedux(useCustomRuleTemplateForm, {});
    const { baseElement } = renderWithThemeAndRedux(
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
