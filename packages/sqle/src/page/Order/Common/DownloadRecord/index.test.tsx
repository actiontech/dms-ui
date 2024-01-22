import DownloadRecord from '.';
import { DownloadRecordProps } from './index.type';

import { renderWithTheme } from '../../../../testUtils/customRender';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import order from '../../../../testUtils/mockApi/order';

describe('sqle/Order/Common/DownloadRecord', () => {
  let requestDownloadFile: jest.SpyInstance;
  let requestDownloadReport: jest.SpyInstance;
  const customRender = (params: DownloadRecordProps) => {
    return renderWithTheme(<DownloadRecord {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    requestDownloadFile = order.downloadAuditTaskSQLFile();
    requestDownloadReport = order.downloadAuditTaskSQLReport();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap download btn', () => {
    const { baseElement } = customRender({
      taskId: 'task Id',
      duplicate: true
    });
    expect(screen.getByText('下载')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when click down show dropdown', async () => {
    const { baseElement } = customRender({
      taskId: 'task Id',
      duplicate: true
    });

    fireEvent.click(screen.getByText('下载'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('下载审核报告')).toBeInTheDocument();
    expect(screen.getByText('下载SQL语句')).toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });

  it('render snap when click down file', async () => {
    const { baseElement } = customRender({
      taskId: 'task Id',
      duplicate: true
    });
    fireEvent.click(screen.getByText('下载'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('下载SQL语句')).toBeInTheDocument();

    fireEvent.click(screen.getByText('下载SQL语句'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2800));
    expect(requestDownloadFile).toBeCalled();
    expect(requestDownloadFile).toBeCalledWith({ task_id: 'task Id' });
  });

  it('render snap when click down report', async () => {
    const { baseElement } = customRender({
      taskId: 'task Id',
      duplicate: true
    });
    fireEvent.click(screen.getByText('下载'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('下载审核报告')).toBeInTheDocument();

    fireEvent.click(screen.getByText('下载审核报告'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(baseElement).toMatchSnapshot();
    await act(async () => jest.advanceTimersByTime(2800));
    expect(requestDownloadReport).toBeCalled();
    expect(requestDownloadReport).toBeCalledWith({
      task_id: 'task Id',
      no_duplicate: true
    });
  });
});
