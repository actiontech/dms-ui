import SqlAuditTags from '.';
import { superRender } from '@actiontech/shared/lib/testUtil/superRender';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { cleanup, screen, act, fireEvent } from '@testing-library/react';
import sqlAuditRecord from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlAuditRecord';
import { sqlAuditRecordTagTipsMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/sqlAuditRecord/data';
import {
  queryBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';

describe('sqle/SqlAudit/SqlAuditTags', () => {
  const updateTagsSpy = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
  });

  beforeAll(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = () => {
    return superRender(
      <SqlAuditTags
        projectName={mockProjectInfo.projectName}
        defaultTags={[sqlAuditRecordTagTipsMockData[0]]}
        updateTags={(tags: string[]) => Promise.resolve().then(updateTagsSpy)}
      />
    );
  };

  it('should match snap shot', async () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('delete tag', async () => {
    customRender();
    fireEvent.click(
      queryBySelector(
        '.anticon-close.ant-tag-close-icon',
        screen.getByText('test').parentElement!
      )!
    );
    await act(async () => jest.advanceTimersByTime(1000));
    expect(updateTagsSpy).toHaveBeenCalledTimes(1);
  });

  it('add tag', async () => {
    const getSQLAuditRecordTagTipsSpy =
      sqlAuditRecord.getSQLAuditRecordTagTips();
    const { baseElement } = customRender();
    fireEvent.click(queryBySelector('.add-tag-focus-btn', baseElement)!);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSQLAuditRecordTagTipsSpy).toHaveBeenCalledTimes(1);
    expect(getSQLAuditRecordTagTipsSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('新增业务标签')).toBeInTheDocument();
    fireEvent.click(screen.getByText(sqlAuditRecordTagTipsMockData[1]));
    await act(async () => jest.advanceTimersByTime(300));
    expect(updateTagsSpy).toHaveBeenCalledTimes(1);
  });

  it('add repetitive tag', async () => {
    const getSQLAuditRecordTagTipsSpy =
      sqlAuditRecord.getSQLAuditRecordTagTips();
    const { baseElement } = customRender();
    fireEvent.click(queryBySelector('.add-tag-focus-btn', baseElement)!);
    await act(async () => jest.advanceTimersByTime(3000));
    expect(getSQLAuditRecordTagTipsSpy).toHaveBeenCalledTimes(1);
    expect(getSQLAuditRecordTagTipsSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName
    });
    expect(screen.getByText('新增业务标签')).toBeInTheDocument();
    fireEvent.click(
      screen.getByText(sqlAuditRecordTagTipsMockData[0], {
        selector: '.custom-tag-item .basic-small-tag-wrapper'
      })
    );
    expect(screen.getByText('当前标签已存在')).toBeInTheDocument();
  });

  it('create tag', async () => {
    sqlAuditRecord.getSQLAuditRecordTagTips();
    const { baseElement } = customRender();
    fireEvent.click(queryBySelector('.add-tag-focus-btn', baseElement)!);
    await act(async () => jest.advanceTimersByTime(3000));

    const searchInputEle = getBySelector('#extraTag', baseElement);
    await act(async () => {
      fireEvent.input(searchInputEle, {
        target: { value: 'test2' }
      });
      await jest.advanceTimersByTime(300);
    });
    fireEvent.click(screen.getByText('新增业务标签'));
    await act(async () => jest.advanceTimersByTime(300));
    expect(updateTagsSpy).toHaveBeenCalledTimes(1);
  });
});
