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
    expect(requestDownloadFile).toHaveBeenCalled();
    expect(requestDownloadFile).toHaveBeenCalledWith(
      { task_id: 'task Id' },
      { responseType: 'blob' }
    );
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
    expect(requestDownloadReport).toHaveBeenCalled();
    expect(requestDownloadReport).toHaveBeenCalledWith(
      {
        task_id: 'task Id',
        no_duplicate: true
      },
      { responseType: 'blob' }
    );
  });

  it('render down report when duplicate is false', async () => {
    customRender({
      taskId: 'task Id',
      duplicate: false
    });
    fireEvent.click(screen.getByText('下载'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('下载审核报告')).toBeInTheDocument();

    fireEvent.click(screen.getByText('下载审核报告'));
    await act(async () => jest.advanceTimersByTime(3000));
    expect(requestDownloadReport).toHaveBeenCalled();
    expect(requestDownloadReport).toHaveBeenCalledWith(
      {
        task_id: 'task Id',
        no_duplicate: false
      },
      { responseType: 'blob' }
    );
  });
});
