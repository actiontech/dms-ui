import { screen, cleanup } from '@testing-library/react';
import { renderWithReduxAndTheme } from '@actiontech/shared/lib/testUtil/customRender';
import operationRecord from '../../testUtils/mockApi/operationRecord';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import OperationRecord from '.';

describe('slqe/OperationRecord', () => {
  let operationRecordListSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    operationRecordListSpy = operationRecord.getOperationRecordList();
    mockUseCurrentProject();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  test('should render operation record list', async () => {
    const { baseElement } = renderWithReduxAndTheme(<OperationRecord />);
    expect(baseElement).toMatchSnapshot();
    expect(operationRecordListSpy).toBeCalledTimes(1);
    expect(screen.getByText('导出')).toBeInTheDocument();
  });
});
