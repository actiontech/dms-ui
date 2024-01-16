import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import StatusDrawer from '.';
import { superRender } from '../../../../../../testUtils/customRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { ModalName } from '../../../../../../data/ModalName';
import { sqlManageListData } from '../../../../../../testUtils/mockApi/sqlManage/data';
import sqlManage from '../../../../../../testUtils/mockApi/sqlManage';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import EventEmitter from '../../../../../../utils/EventEmitter';
import { useDispatch } from 'react-redux';
import EmitterKey from '../../../../../../data/EmitterKey';
import { BatchUpdateSqlManageReqStatusEnum } from '@actiontech/shared/lib/api/sqle/service/common.enum';
import rule_template from '../../../../../../testUtils/mockApi/rule_template';
import { ISqlManage } from '@actiontech/shared/lib/api/sqle/service/common';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn()
}));

describe('page/SqlManagement/StatusDrawer', () => {
  const dispatchSpy = jest.fn();

  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    rule_template.mockAllApi();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  const customRender = (open?: boolean, selectData?: ISqlManage) => {
    return superRender(<StatusDrawer />, undefined, {
      initStore: {
        sqleManagement: {
          modalStatus: {
            [ModalName.View_Audit_Result_Drawer]: open ?? true
          },
          selectSqleManagement: selectData ?? sqlManageListData.data[0]
        }
      }
    });
  };

  it('render modal when not open', () => {
    const { baseElement } = customRender(false);
    expect(baseElement).toMatchSnapshot();
  });

  it('render empty status drawer info', async () => {
    const { baseElement } = customRender(
      true,
      sqlManageListData.data[1] as ISqlManage
    );
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
  });

  it('render status drawer info', async () => {
    const request = rule_template.getRuleList();
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    const ruleNames = (sqlManageListData.data[0].audit_result ?? [])
      .map((v) => v.rule_name ?? '')
      .filter((v) => !!v);
    expect(request).toBeCalledWith({
      filter_rule_names: ruleNames.join(',')
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('SQL审核结果')).toBeInTheDocument();
    expect(screen.getByText('审核结果')).toBeInTheDocument();
    expect(screen.getByText('SQL语句')).toBeInTheDocument();
  });

  it('close modal by click close button', async () => {
    const { baseElement } = customRender();
    await act(async () => jest.advanceTimersByTime(3000));
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(getBySelector('.closed-icon-custom'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(dispatchSpy).toBeCalledTimes(2);
    expect(dispatchSpy).toBeCalledWith({
      type: 'sqleManagement/updateModalStatus',
      payload: {
        modalName: ModalName.View_Audit_Result_Drawer,
        status: false
      }
    });
    expect(dispatchSpy).toBeCalledWith({
      type: 'sqleManagement/updateSqleManagement',
      payload: null
    });
  });
});
