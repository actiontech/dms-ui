import {
  act,
  cleanup,
  fireEvent,
  renderHook,
  screen
} from '@testing-library/react';
import { mockUseCreateDataExportReduxManage } from '../../../testUtils/mockUseCreateDataExportReduxManage';
import { mockUseCreateExportTaskForm } from '../../../testUtils/mockUseCreateExportTaskForm';
import { baseSuperRender } from '../../../../../../testUtils/superRender';
import CreateExportTask from '..';
import { useForm } from 'antd/es/form/Form';
import {
  ignoreConsoleErrors,
  UtilsConsoleErrorStringsEnum
} from '@actiontech/shared/lib/testUtil/common';
import { CreateDataExportPageEnum } from '../../../../../../store/dataExport';
import dbServices from '@actiontech/shared/lib/testUtil/mockApi/base/dbServices';

describe('test base/DataExport/Create/CreateExportTask', () => {
  ignoreConsoleErrors([
    UtilsConsoleErrorStringsEnum.INVALID_CSS_VALUE,
    UtilsConsoleErrorStringsEnum.UNKNOWN_EVENT_HANDLER
  ]);

  const customRender = (
    mockCreateExportTaskForm?: Parameters<
      typeof mockUseCreateExportTaskForm
    >[0],
    mockRedux?: Parameters<typeof mockUseCreateDataExportReduxManage>[0]
  ) => {
    mockUseCreateDataExportReduxManage({ ...mockRedux });
    mockUseCreateExportTaskForm();
    const { result: baseForm } = renderHook(() => useForm());
    const { result: sourceForm } = renderHook(() => useForm());
    const { result: methodForm } = renderHook(() => useForm());

    mockUseCreateExportTaskForm({
      baseForm: baseForm.current[0],
      sourceForm: sourceForm.current[0],
      methodForm: methodForm.current[0],
      ...mockCreateExportTaskForm
    });

    return baseSuperRender(<CreateExportTask />);
  };

  beforeEach(() => {
    dbServices.ListDBServicesTips();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useRealTimers();
    cleanup();
  });

  it('should match snapshot when auditLoading is equal false', () => {
    const { container } = customRender({ auditLoading: false });
    expect(container).toMatchSnapshot();
  });

  it('should match snapshot when audit loading is equal true', () => {
    const { container } = customRender({ auditLoading: true });
    expect(container).toMatchSnapshot();
    expect(screen.getByText('重 置').closest('button')).toBeDisabled();
  });

  it('should execute "resetAllForms" when clicked reset button', () => {
    const resetAllFormsSpy = jest.fn();
    customRender({ resetAllForms: resetAllFormsSpy });
    fireEvent.click(screen.getByText('重 置'));
    expect(resetAllFormsSpy).toHaveBeenCalledTimes(1);
  });

  it('should execute "auditAction" and "formatSQLAction" when clicked audit and format button', async () => {
    const formatSQLActionSpy = jest.fn();
    const auditActionSpy = jest.fn();
    const updatePageStateSpy = jest.fn();

    customRender(
      {
        formatSQLAction: formatSQLActionSpy,
        auditAction: auditActionSpy
      },
      { updatePageState: updatePageStateSpy }
    );

    auditActionSpy.mockImplementation(() => Promise.resolve(true));
    fireEvent.click(screen.getByText('审 核'));
    expect(auditActionSpy).toHaveBeenCalledTimes(1);
    await act(async () => jest.advanceTimersByTime(0));
    expect(updatePageStateSpy).toHaveBeenCalledTimes(1);
    expect(updatePageStateSpy).toHaveBeenCalledWith(
      CreateDataExportPageEnum.SUBMIT_WORKFLOW
    );

    auditActionSpy.mockImplementation(() => Promise.resolve(false));
    fireEvent.click(screen.getByText('审 核'));
    expect(auditActionSpy).toHaveBeenCalledTimes(2);
    await act(async () => jest.advanceTimersByTime(0));
    expect(updatePageStateSpy).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('SQL美化'));
    expect(formatSQLActionSpy).toHaveBeenCalledTimes(1);
  });
});
