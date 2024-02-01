import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import {
  mockCreateDataExportRedux,
  mockUseCreateDataExportReduxManage
} from '../../../testUtils/mockUseCreateDataExportReduxManage';
import {
  mockUseCreateExportTaskForm,
  mockUseCreateExportTaskFormReturn
} from '../../../testUtils/mockUseCreateExportTaskForm';
import { superRender } from '../../../../../../testUtils/customRender';
import UpdateInfoDrawer from '.';
import { act, fireEvent, renderHook, screen } from '@testing-library/react';
import { useForm } from 'antd/es/form/Form';
import { ignoreInvalidValueForCSSStyleProperty } from '@actiontech/shared/lib/testUtil/common';
import { getBySelector } from '@actiontech/shared/lib/testUtil/customQuery';
import { ModalName } from '../../../../../../data/ModalName';

describe('test base/DataExport/Create/UpdateInfoDrawer', () => {
  ignoreInvalidValueForCSSStyleProperty();

  const customRender = (
    mockCreateExportTaskForm?: Parameters<
      typeof mockUseCreateExportTaskForm
    >[0],
    mockRedux?: Parameters<typeof mockUseCreateDataExportReduxManage>[0]
  ) => {
    mockUseCreateDataExportReduxManage({
      ...mockRedux,
      updateDataExportInfoOpen: true
    });
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

    return superRender(<UpdateInfoDrawer />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
    mockUseCurrentProject();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should match snapshot', () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('should match snapshot when auditLoading is equal true', () => {
    const { baseElement } = customRender({ auditLoading: true });
    expect(baseElement).toMatchSnapshot();
    fireEvent.click(getBySelector('.closed-icon-custom'));
    expect(mockCreateDataExportRedux.updateModalStatus).not.toBeCalled();
  });

  it('should execute updateModalStatus when closed drawer', () => {
    customRender();

    fireEvent.click(getBySelector('.closed-icon-custom'));
    expect(mockCreateDataExportRedux.updateModalStatus).toBeCalledTimes(1);
    expect(mockCreateDataExportRedux.updateModalStatus).toBeCalledWith({
      modalName: ModalName.DMS_UPDATE_EXPORT_TASK_INFO,
      status: false
    });
  });

  it('should close drawer when after audited success', async () => {
    mockUseCreateExportTaskFormReturn.auditAction.mockImplementation(() =>
      Promise.resolve(true)
    );
    customRender();

    fireEvent.click(screen.getByText('审 核'));

    expect(mockUseCreateExportTaskFormReturn.auditAction).toBeCalledTimes(1);

    await act(async () => jest.advanceTimersByTime(0));

    expect(mockCreateDataExportRedux.updateModalStatus).toBeCalledTimes(1);
    expect(mockCreateDataExportRedux.updateModalStatus).toBeCalledWith({
      modalName: ModalName.DMS_UPDATE_EXPORT_TASK_INFO,
      status: false
    });

    jest.clearAllMocks();
    mockUseCreateExportTaskFormReturn.auditAction.mockImplementation(() =>
      Promise.resolve(false)
    );

    fireEvent.click(screen.getByText('审 核'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(mockCreateDataExportRedux.updateModalStatus).toBeCalledTimes(0);
  });
});
