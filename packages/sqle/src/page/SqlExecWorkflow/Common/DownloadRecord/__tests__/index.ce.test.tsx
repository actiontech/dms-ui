/**
 * @test_version ce
 */
import DownloadRecord from '..';
import { superRender } from '../../../../../testUtils/customRender';
import { DownloadRecordProps } from '../index.type';
import { fireEvent, act, cleanup, screen } from '@testing-library/react';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';

describe('sqle/ExecWorkflow/Common/DownloadRecord ce', () => {
  const customRender = (params: DownloadRecordProps) => {
    return superRender(<DownloadRecord {...params} />);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render snap when click down show dropdown', async () => {
    const { baseElement } = customRender({
      taskId: 'task Id',
      noDuplicate: true
    });

    fireEvent.click(screen.getByText('下载'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(screen.getByText('下载审核报告')).toBeInTheDocument();
    expect(screen.getByText('下载SQL语句')).toBeInTheDocument();
    expect(screen.queryByText('下载回滚语句')).not.toBeInTheDocument();
    expect(baseElement).toMatchSnapshot();
  });
});
