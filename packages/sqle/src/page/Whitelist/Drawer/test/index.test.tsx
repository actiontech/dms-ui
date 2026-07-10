import { cleanup, act } from '@testing-library/react';
import WhitelistDrawer from '../index';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

jest.mock('../../../../hooks/useInstance', () => ({
  __esModule: true,
  default: () => ({
    updateInstanceList: jest.fn(),
    instanceIDOptions: [],
    loading: false
  })
}));

jest.mock('../../../../components/RuleExceptionMatchConditions/hooks/useAuditTaskSelectOptions', () => ({
  __esModule: true,
  default: () => ({
    auditTaskTypeOptions: [],
    getAuditTaskIdOptions: () => [],
    auditTaskTypeLoading: false,
    auditTaskIdLoading: false
  })
}));

describe('slqe/Whitelist/Drawer', () => {
  const dispatchSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
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
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  test('should dispatch init modal status action', async () => {
    superRender(<WhitelistDrawer />);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'whitelist/initModalStatus',
      payload: {
        modalStatus: {
          [ModalName.Add_Whitelist]: false,
          [ModalName.Update_Whitelist]: false
        }
      }
    });
  });
});
