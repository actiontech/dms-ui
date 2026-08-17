import { act, cleanup } from '@testing-library/react';
import { superRenderHook } from '@actiontech/shared/lib/testUtil/superRender';
import {
  createSpyFailResponse,
  createSpySuccessResponse
} from '@actiontech/shared/lib/testUtil/mockApi';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import Project from '@actiontech/shared/lib/api/base/service/Project';
import DataExportWorkflows from '@actiontech/shared/lib/api/base/service/DataExportWorkflows';
import workflow from '@actiontech/shared/lib/api/sqle/service/workflow';
import useOpsType, {
  OPS_TYPE_DELETE_REFERENCED_MESSAGE,
  checkOpsTypeReferences,
  shouldBlockOpsTypeDelete
} from '..';

const mockOpsTypes = [
  { uid: 'ops-1', name: '数据修改' },
  { uid: 'ops-2', name: '数据提取' }
];

describe('sqle/hooks/useOpsType', () => {
  let listOpsTypesSpy: jest.SpyInstance;
  let createOpsTypeSpy: jest.SpyInstance;
  let updateOpsTypeSpy: jest.SpyInstance;
  let deleteOpsTypeSpy: jest.SpyInstance;
  let getWorkflowsSpy: jest.SpyInstance;
  let listDataExportSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.useFakeTimers();
    listOpsTypesSpy = jest
      .spyOn(Project, 'ListOpsTypes')
      .mockImplementation(() =>
        createSpySuccessResponse({ data: mockOpsTypes })
      );
    createOpsTypeSpy = jest
      .spyOn(Project, 'CreateOpsType')
      .mockImplementation(() => createSpySuccessResponse({}));
    updateOpsTypeSpy = jest
      .spyOn(Project, 'UpdateOpsType')
      .mockImplementation(() => createSpySuccessResponse({}));
    deleteOpsTypeSpy = jest
      .spyOn(Project, 'DeleteOpsType')
      .mockImplementation(() => createSpySuccessResponse({}));
    getWorkflowsSpy = jest
      .spyOn(workflow, 'getWorkflowsV1')
      .mockImplementation(() =>
        createSpySuccessResponse({ data: [], total_nums: 0 })
      );
    listDataExportSpy = jest
      .spyOn(DataExportWorkflows, 'ListDataExportWorkflows')
      .mockImplementation(() =>
        createSpySuccessResponse({ data: [], total_nums: 0 })
      );
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    cleanup();
  });

  it('shouldBlockOpsTypeDelete gate', () => {
    expect(shouldBlockOpsTypeDelete(0, 0)).toBe(false);
    expect(shouldBlockOpsTypeDelete(1, 0)).toBe(true);
    expect(shouldBlockOpsTypeDelete(0, 2)).toBe(true);
    expect(shouldBlockOpsTypeDelete(3, 4)).toBe(true);
  });

  it('should load ops type options from ListOpsTypes', async () => {
    const { result } = superRenderHook(useOpsType, {});

    expect(result.current.opsTypeList).toEqual([]);
    expect(result.current.opsTypeOptions).toEqual([]);

    act(() => {
      result.current.updateOpsTypeList(mockProjectInfo.projectID);
    });

    expect(listOpsTypesSpy).toHaveBeenCalledWith({
      page_size: 1000,
      project_uid: mockProjectInfo.projectID
    });

    await act(async () => {
      await jest.advanceTimersByTimeAsync(3000);
    });

    expect(result.current.opsTypeList).toEqual(mockOpsTypes);
    expect(result.current.opsTypeOptions).toEqual([
      { label: '数据修改', value: 'ops-1' },
      { label: '数据提取', value: 'ops-2' }
    ]);
  });

  it('should set empty list when ListOpsTypes fails', async () => {
    listOpsTypesSpy.mockImplementation(() =>
      createSpyFailResponse({ data: [] })
    );
    const { result } = superRenderHook(useOpsType, {});
    act(() => {
      result.current.updateOpsTypeList(mockProjectInfo.projectID);
    });
    await act(async () => {
      await jest.advanceTimersByTimeAsync(3000);
    });
    expect(result.current.opsTypeList).toEqual([]);
  });

  it('createOpsType / updateOpsType should call Project APIs', async () => {
    const { result } = superRenderHook(useOpsType, {});

    let createOk = false;
    await act(async () => {
      const p = result.current.createOpsType(
        mockProjectInfo.projectID,
        '服务维护'
      );
      await jest.advanceTimersByTimeAsync(6000);
      createOk = await p;
    });
    expect(createOk).toBe(true);
    expect(createOpsTypeSpy).toHaveBeenCalledWith({
      project_uid: mockProjectInfo.projectID,
      ops_type_name: '服务维护'
    });

    let updateOk = false;
    await act(async () => {
      const p = result.current.updateOpsType(
        mockProjectInfo.projectID,
        'ops-1',
        '配置修改'
      );
      await jest.advanceTimersByTimeAsync(6000);
      updateOk = await p;
    });
    expect(updateOk).toBe(true);
    expect(updateOpsTypeSpy).toHaveBeenCalledWith({
      project_uid: mockProjectInfo.projectID,
      ops_type_uid: 'ops-1',
      ops_type_name: '配置修改'
    });
  });

  it('checkOpsTypeReferences should return both totals', async () => {
    getWorkflowsSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [], total_nums: 2 })
    );
    listDataExportSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [], total_nums: 3 })
    );

    let totals!: Awaited<ReturnType<typeof checkOpsTypeReferences>>;
    await act(async () => {
      const p = checkOpsTypeReferences(
        mockProjectInfo.projectID,
        mockProjectInfo.projectName,
        'ops-1'
      );
      await jest.advanceTimersByTimeAsync(3000);
      totals = await p;
    });

    expect(getWorkflowsSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      filter_by_ops_type_uid: 'ops-1',
      page_index: 1,
      page_size: 1
    });
    expect(listDataExportSpy).toHaveBeenCalledWith({
      project_uid: mockProjectInfo.projectID,
      filter_by_ops_type_uid: 'ops-1',
      page_index: 1,
      page_size: 1
    });
    expect(totals).toEqual({
      sqlWorkflowTotal: 2,
      dataExportWorkflowTotal: 3
    });
  });

  it('deleteOpsType should block when SQL workflow total > 0 and not call DeleteOpsType', async () => {
    getWorkflowsSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [], total_nums: 1 })
    );
    listDataExportSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [], total_nums: 0 })
    );

    const { result } = superRenderHook(useOpsType, {});
    let deleteResult!: Awaited<ReturnType<typeof result.current.deleteOpsType>>;

    await act(async () => {
      const p = result.current.deleteOpsType(
        mockProjectInfo.projectID,
        mockProjectInfo.projectName,
        'ops-1'
      );
      await jest.advanceTimersByTimeAsync(3000);
      deleteResult = await p;
    });

    expect(deleteOpsTypeSpy).not.toHaveBeenCalled();
    expect(deleteResult).toEqual({
      ok: false,
      errorMessage: OPS_TYPE_DELETE_REFERENCED_MESSAGE,
      sqlWorkflowTotal: 1,
      dataExportWorkflowTotal: 0
    });
    expect(result.current.deleteErrorMessage).toBe(
      OPS_TYPE_DELETE_REFERENCED_MESSAGE
    );
  });

  it('deleteOpsType should block when data export total > 0 and not call DeleteOpsType', async () => {
    getWorkflowsSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [], total_nums: 0 })
    );
    listDataExportSpy.mockImplementation(() =>
      createSpySuccessResponse({ data: [], total_nums: 5 })
    );

    const { result } = superRenderHook(useOpsType, {});
    let deleteResult!: Awaited<ReturnType<typeof result.current.deleteOpsType>>;

    await act(async () => {
      const p = result.current.deleteOpsType(
        mockProjectInfo.projectID,
        mockProjectInfo.projectName,
        'ops-2'
      );
      await jest.advanceTimersByTimeAsync(3000);
      deleteResult = await p;
    });

    expect(deleteOpsTypeSpy).not.toHaveBeenCalled();
    expect(deleteResult).toMatchObject({
      ok: false,
      errorMessage: OPS_TYPE_DELETE_REFERENCED_MESSAGE,
      dataExportWorkflowTotal: 5
    });
  });

  it('deleteOpsType should call DeleteOpsType when both totals are 0', async () => {
    const { result } = superRenderHook(useOpsType, {});
    let deleteResult!: Awaited<ReturnType<typeof result.current.deleteOpsType>>;

    await act(async () => {
      const p = result.current.deleteOpsType(
        mockProjectInfo.projectID,
        mockProjectInfo.projectName,
        'ops-1'
      );
      await jest.advanceTimersByTimeAsync(9000);
      deleteResult = await p;
    });

    expect(deleteOpsTypeSpy).toHaveBeenCalledWith({
      project_uid: mockProjectInfo.projectID,
      ops_type_uid: 'ops-1'
    });
    expect(deleteResult).toEqual({ ok: true });
    expect(result.current.deleteErrorMessage).toBeUndefined();
  });
});
