import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import FileExecuteMode from '.';
import { superRender } from '../../../../../../testUtils/customRender';
import task from '../../../../../../testUtils/mockApi/task';
import { FileExecuteModeProps } from './index.type';
import { act, cleanup } from '@testing-library/react';
import { ListLayoutEnum } from '../../../../Common/ListLayoutSelector/index.types';
import { OVERVIEW_TAB_KEY } from '../../../index.data';

describe('test WaterfallList/FileExecuteMode', () => {
  const customRender = (params?: Partial<FileExecuteModeProps>) => {
    const _params: FileExecuteModeProps = {
      taskId: '123',
      currentListLayout: ListLayoutEnum.scroll,
      auditResultActiveKey: '123',
      duplicate: false,
      auditLevelFilterValue: 'all'
    };
    return superRender(<FileExecuteMode {...{ ..._params, ...params }} />);
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

  it('should match snapshot', async () => {
    const getAuditTaskFileOverviewSpy = task.getAuditFileList();

    const { container } = customRender();

    expect(container).toMatchSnapshot();

    expect(getAuditTaskFileOverviewSpy).toHaveBeenCalledTimes(1);
    expect(getAuditTaskFileOverviewSpy).toHaveBeenCalledWith({
      task_id: '123',
      page_index: '1',
      page_size: '20'
    });

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();
  });

  it('render currentListLayout is equal pagination', async () => {
    const getAuditTaskFileOverviewSpy = task.getAuditTaskSQLs();

    customRender({ currentListLayout: ListLayoutEnum.pagination });

    expect(getAuditTaskFileOverviewSpy).toHaveBeenCalledTimes(0);

    await act(async () => jest.advanceTimersByTime(0));
  });

  it('render auditResultActiveKey is equal OVERVIEW_TAB_KEY', async () => {
    const getAuditTaskFileOverviewSpy = task.getAuditTaskSQLs();

    customRender({ auditResultActiveKey: OVERVIEW_TAB_KEY });

    expect(getAuditTaskFileOverviewSpy).toHaveBeenCalledTimes(0);

    await act(async () => jest.advanceTimersByTime(0));
  });
});
