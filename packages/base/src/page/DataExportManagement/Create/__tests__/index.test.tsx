import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import CreateDataExport from '..';
import { CreateDataExportPageEnum } from '../../../../store/dataExport';
import { superRender } from '../../../../testUtils/customRender';
import { mockUseCreateDataExportReduxManage } from '../testUtils/mockUseCreateDataExportReduxManage';
import { cleanup } from '@testing-library/react';
import { ModalName } from 'sqle/src/data/ModalName';
import { useDispatch, useSelector } from 'react-redux';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseDbServiceDriver } from '@actiontech/shared/lib/testUtil/mockHook/mockUseDbServiceDriver';

jest.mock('react-redux', () => {
  return {
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
    useDispatch: jest.fn()
  };
});

describe('first', () => {
  const dispatchSpy = jest.fn();
  beforeEach(() => {
    mockUseCurrentProject();
    mockUseCurrentUser();
    mockUseDbServiceDriver();
    mockUseCreateDataExportReduxManage();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        whitelist: { modalStatus: { [ModalName.Add_Whitelist]: false } }
      })
    );
    (useDispatch as jest.Mock).mockImplementation(() => dispatchSpy);
  });
  ignoreConsoleErrors([UtilsConsoleErrorStringsEnum.INVALID_CSS_VALUE]);

  it('should match snapshot when pageState is equal CREATE_TASK', () => {
    mockUseCreateDataExportReduxManage();

    const { container } = superRender(<CreateDataExport />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when pageState is equal SUBMIT_WORKFLOW', () => {
    mockUseCreateDataExportReduxManage({
      pageState: CreateDataExportPageEnum.SUBMIT_WORKFLOW
    });

    const { container } = superRender(<CreateDataExport />);

    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when pageState is equal SUBMIT_RESULT', () => {
    mockUseCreateDataExportReduxManage({
      pageState: CreateDataExportPageEnum.SUBMIT_RESULT
    });

    const { container } = superRender(<CreateDataExport />);

    expect(container).toMatchSnapshot();

    jest.clearAllMocks();
    cleanup();
    mockUseCreateDataExportReduxManage({
      pageState: null as any
    });

    expect(superRender(<CreateDataExport />).container).toMatchSnapshot();
  });

  it('component unmount', () => {
    const clearAllStateSpy = jest.fn();
    mockUseCreateDataExportReduxManage({
      clearAllState: clearAllStateSpy
    });
    const { unmount } = superRender(<CreateDataExport />);
    unmount();

    expect(clearAllStateSpy).toHaveBeenCalledTimes(1);
  });
});
