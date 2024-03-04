import { fireEvent, screen, act, cleanup } from '@testing-library/react';
import sqlAuditRecord from '../../testUtils/mockApi/sqlAuditRecord';
import { sqlAuditRecordTagTipsMockData } from '../../testUtils/mockApi/sqlAuditRecord/data';
import useSQLAuditRecordTag from '.';
import {
  renderHooksWithRedux,
  renderWithTheme
} from '@actiontech/shared/lib/testUtil/customRender';
import { Select } from 'antd';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import {
  createSpyErrorResponse,
  createSpyFailResponse
} from '@actiontech/shared/lib/testUtil/mockApi';

describe('sqle/hooks/useSQLAuditRecordTag', () => {
  let getSQLAuditRecordTagTipsSpy: jest.SpyInstance;
  beforeEach(() => {
    jest.useFakeTimers();
    getSQLAuditRecordTagTipsSpy = sqlAuditRecord.getSQLAuditRecordTagTips();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  test('should get tags data from request', async () => {
    const { result } = renderHooksWithRedux(() => useSQLAuditRecordTag(), {});
    expect(result.current.loading).toBe(false);
    expect(result.current.auditRecordTags).toEqual([]);
    expect(result.current.auditRecordTagsOptions).toEqual([]);
    const { baseElement } = renderWithTheme(
      <Select>{result.current.generateSQLAuditRecordSelectOptions()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    act(() => {
      result.current.updateSQLAuditRecordTag(mockProjectInfo.projectName);
    });

    expect(result.current.loading).toBe(true);
    expect(getSQLAuditRecordTagTipsSpy).toHaveBeenCalledTimes(1);
    expect(result.current.auditRecordTags).toEqual([]);
    expect(result.current.auditRecordTagsOptions).toEqual([]);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.loading).toBe(false);
    expect(getSQLAuditRecordTagTipsSpy).toHaveBeenCalledTimes(1);
    expect(result.current.auditRecordTags).toEqual(
      sqlAuditRecordTagTipsMockData
    );
    expect(result.current.auditRecordTagsOptions).toEqual(
      sqlAuditRecordTagTipsMockData.map((item) => ({
        label: item,
        value: item
      }))
    );
    cleanup();

    const { baseElement: baseElementWithOptions } = renderWithTheme(
      <Select data-testid="testId" value="test">
        {result.current.generateSQLAuditRecordSelectOptions()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    act(() => {
      fireEvent.mouseDown(screen.getByText('test'));
      jest.runAllTimers();
    });
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should set list to empty array when response code is not equal success code', async () => {
    getSQLAuditRecordTagTipsSpy.mockClear();
    getSQLAuditRecordTagTipsSpy.mockImplementation(() =>
      createSpyErrorResponse({ data: [] })
    );
    const { result } = renderHooksWithRedux(() => useSQLAuditRecordTag(), {});
    expect(result.current.loading).toBe(false);
    expect(result.current.auditRecordTags).toEqual([]);
    expect(result.current.auditRecordTagsOptions).toEqual([]);

    act(() => {
      result.current.updateSQLAuditRecordTag(mockProjectInfo.projectName);
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.auditRecordTags).toEqual([]);
    expect(result.current.auditRecordTagsOptions).toEqual([]);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.loading).toBe(false);
    expect(getSQLAuditRecordTagTipsSpy).toHaveBeenCalledTimes(1);
    expect(result.current.auditRecordTags).toEqual([]);
    expect(result.current.auditRecordTagsOptions).toEqual([]);
  });

  test('should set list to empty array when response throw error', async () => {
    getSQLAuditRecordTagTipsSpy.mockClear();
    getSQLAuditRecordTagTipsSpy.mockImplementation(() =>
      createSpyFailResponse({ data: sqlAuditRecordTagTipsMockData })
    );
    const { result } = renderHooksWithRedux(() => useSQLAuditRecordTag(), {});
    expect(result.current.loading).toBe(false);
    expect(result.current.auditRecordTags).toEqual([]);
    expect(result.current.auditRecordTagsOptions).toEqual([]);

    act(() => {
      result.current.updateSQLAuditRecordTag(mockProjectInfo.projectName);
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.auditRecordTags).toEqual([]);
    expect(result.current.auditRecordTagsOptions).toEqual([]);

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.loading).toBe(false);
    expect(getSQLAuditRecordTagTipsSpy).toHaveBeenCalledTimes(1);
    expect(result.current.auditRecordTags).toEqual([]);
    expect(result.current.auditRecordTagsOptions).toEqual([]);
  });
});
