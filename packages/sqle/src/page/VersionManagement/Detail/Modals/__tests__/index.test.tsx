import { cleanup, act } from '@testing-library/react';
import { useSelector, useDispatch } from 'react-redux';
import VersionDetailDrawer from '../index';
import { sqleSuperRender } from '../../../../../testUtils/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';
import { ModalName } from '../../../../../data/ModalName';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('sqle/VersionManagement/Detail/Drawer', () => {
  const dispatchSpy = jest.fn();
  beforeEach(() => {
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
    (useSelector as jest.Mock).mockImplementation((selector) => {
      return selector({
        versionManagement: {
          modalStatus: {},
          currentStageWorkflowList: []
        }
      });
    });
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  it('render init snap shot', async () => {
    const { baseElement } = sqleSuperRender(<VersionDetailDrawer />);
    await act(async () => jest.advanceTimersByTime(0));
    expect(baseElement).toMatchSnapshot();
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenNthCalledWith(1, {
      type: 'versionManagement/initModalStatus',
      payload: {
        modalStatus: {
          [ModalName.Version_Management_Execute_Modal]: false,
          [ModalName.Version_Management_Release_Modal]: false,
          [ModalName.Version_Management_Associate_Workflow_Modal]: false,
          [ModalName.Version_Management_Offline_Execute_Modal]: false
        }
      }
    });
  });
});
