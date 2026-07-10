import { screen, cleanup, act } from '@testing-library/react';
import WhitelistList from './List';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import auditWhiteList from '../../testUtils/mockApi/auditWhiteList';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { useSelector, useDispatch } from 'react-redux';
import { ModalName } from '../../data/ModalName';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import configuration from '../../testUtils/mockApi/configuration';
import ruleTemplate from '../../testUtils/mockApi/rule_template';

jest.mock('../../hooks/useInstance', () => ({
  __esModule: true,
  default: () => ({
    updateInstanceList: jest.fn(),
    instanceIDOptions: [],
    loading: false
  })
}));

jest.mock(
  '../../components/RuleExceptionMatchConditions/hooks/useAuditTaskSelectOptions',
  () => ({
    __esModule: true,
    default: () => ({
      auditTaskTypeOptions: [],
      getAuditTaskIdOptions: () => [],
      auditTaskTypeLoading: false,
      auditTaskIdLoading: false
    })
  })
);

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('slqe/Whitelist', () => {
  let whiteListSpy: jest.SpyInstance;
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    whiteListSpy = auditWhiteList.getAuditWhitelist();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: false } },
        database: { driverMeta: [] }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    configuration.getDrivers();
    ruleTemplate.getRuleList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  test('should render white list', async () => {
    const { baseElement } = superRender(<WhitelistList />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    expect(whiteListSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('添加审核SQL例外')).toBeInTheDocument();
    expect(
      getBySelector('.custom-icon-refresh', baseElement)
    ).toBeInTheDocument();
  });
});
