import { cleanup, act, fireEvent, screen } from '@testing-library/react';
import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import { useDispatch, useSelector } from 'react-redux';
import { ModalName } from '../../../../data/ModalName';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import AddWhitelist from '../AddWhitelist';
import auditWhiteList from '../../../../testUtils/mockApi/auditWhiteList';
import { MatchConditionReqV1TypeEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import EventEmitter from '../../../../utils/EventEmitter';
import EmitterKey from '../../../../data/EmitterKey';
import {
  queryBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import instance from '../../../../testUtils/mockApi/instance';
import configuration from '../../../../testUtils/mockApi/configuration';
import ruleTemplate from '../../../../testUtils/mockApi/rule_template';

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

jest.mock(
  '../../../../components/RuleExceptionMatchConditions/hooks/useAuditTaskSelectOptions',
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

describe('slqe/Whitelist/AddWhitelist', () => {
  const dispatchSpy = jest.fn();
  let addWhitelistSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: true } },
        database: { driverMeta: [] }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    addWhitelistSpy = auditWhiteList.addAuthWhitelist();
    instance.getInstanceTipList();
    configuration.getDrivers();
    ruleTemplate.getRuleList();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const fillSqlContentInModal = async (value: string) => {
    fireEvent.click(getBySelector('.match-row-sql-trigger'));
    await act(async () => jest.advanceTimersByTime(300));
    fireEvent.change(getBySelector('.match-row-sql-modal-textarea'), {
      target: { value }
    });
    fireEvent.click(getBySelector('.ant-modal-footer .ant-btn-primary'));
    await act(async () => jest.advanceTimersByTime(0));
  };

  it('should send add whitelist request when click submit button', async () => {
    const mockCreated = jest.fn();
    const eventEmitSpy = jest.spyOn(EventEmitter, 'emit');
    const { baseElement } = superRender(
      <AddWhitelist onCreated={mockCreated} />
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    fireEvent.input(screen.getByLabelText('添加备注'), {
      target: { value: 'test desc' }
    });
    await fillSqlContentInModal('SELECT 1;');
    fireEvent.click(screen.getByText('提 交'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(addWhitelistSpy).toHaveBeenCalledTimes(1);
    expect(addWhitelistSpy).toHaveBeenCalledWith({
      desc: 'test desc',
      match_conditions: [
        {
          type: MatchConditionReqV1TypeEnum.sql,
          content: 'SELECT 1;'
        }
      ],
      rule_scope: 'ALL',
      project_name: mockProjectInfo.projectName
    });
    await act(async () => jest.advanceTimersByTime(3300));
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'whitelist/updateModalStatus',
      payload: {
        modalName: ModalName.Add_Whitelist,
        status: false
      }
    });
    expect(eventEmitSpy).toHaveBeenCalledWith(
      EmitterKey.Refresh_Whitelist_List
    );
    expect(mockCreated).toHaveBeenCalledTimes(1);
  });

  it('should close modal when click close button', async () => {
    const { baseElement } = superRender(<AddWhitelist />);
    fireEvent.click(queryBySelector('.closed-icon-custom', baseElement)!);
    await act(async () => jest.advanceTimersByTime(1000));
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: 'whitelist/updateModalStatus',
      payload: {
        modalName: ModalName.Add_Whitelist,
        status: false
      }
    });
  });
});
