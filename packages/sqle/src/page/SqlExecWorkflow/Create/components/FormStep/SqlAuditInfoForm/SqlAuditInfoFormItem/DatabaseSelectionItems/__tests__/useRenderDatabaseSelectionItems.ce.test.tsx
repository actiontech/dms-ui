/**
 * @test_version ce
 */

import { act, fireEvent, renderHook } from '@testing-library/react';
import useRenderDatabaseSelectionItems from '../hooks/useRenderDatabaseSelectionItems';
import { MockSharedStepDetail } from '../../../../../../hooks/mockData';
import instance from '../../../../../../../../../testUtils/mockApi/instance';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import {
  instanceInfoMockData,
  instanceSchemasMockData
} from '../../../../../../../../../testUtils/mockApi/instance/data';
import system from '../../../../../../../../../testUtils/mockApi/system';

describe('test useRenderDatabaseSelectionItems ce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('should handle instance change and update states correctly', async () => {
    const mockGetInstanceSchemas = instance.getInstanceSchemas();
    const mockGetInstance = instance.getInstance();
    const mockGetSystemModuleStatus = system.getSystemModuleStatus();

    const { result } = renderHook(() =>
      useRenderDatabaseSelectionItems({
        dbSourceInfoCollection: MockSharedStepDetail.dbSourceInfoCollection,
        sqlStatementTabActiveKey: MockSharedStepDetail.sqlStatementTabActiveKey
      })
    );

    await act(async () => {
      result.current.handleInstanceChange('key1', 'instance1');
    });

    expect(mockGetInstanceSchemas).toHaveBeenCalledTimes(1);
    expect(mockGetInstanceSchemas).toHaveBeenCalledWith({
      instance_name: 'instance1',
      project_name: mockProjectInfo.projectName
    });

    expect(mockGetInstance).toHaveBeenCalledTimes(1);
    expect(mockGetInstance).toHaveBeenCalledWith({
      instance_name: 'instance1',
      project_name: mockProjectInfo.projectName
    });

    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenCalledTimes(1);
    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenCalledWith('key1', {
      instanceName: 'instance1',
      schemaName: undefined,
      getSchemaLoading: true,
      schemaList: [],
      ruleTemplate: undefined,
      dbType: undefined,
      testConnectResult: undefined,
      isSupportFileModeExecuteSql: false
    });

    await act(() => jest.advanceTimersByTime(3000));

    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenCalledTimes(4);
    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenCalledWith('key1', {
      getSchemaLoading: false
    });
    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenCalledWith('key1', {
      dbType: instanceInfoMockData.db_type,
      ruleTemplate: instanceInfoMockData.rule_template
    });
    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenCalledWith('key1', {
      schemaList: instanceSchemasMockData
    });

    expect(
      MockSharedStepDetail.sqlStatementTabActiveKey.set
    ).toHaveBeenCalledTimes(1);
    expect(
      MockSharedStepDetail.sqlStatementTabActiveKey.set
    ).toHaveBeenCalledWith('key1');

    expect(mockGetSystemModuleStatus).not.toHaveBeenCalled();

    await act(() => jest.advanceTimersByTime(3000));
    expect(
      MockSharedStepDetail.dbSourceInfoCollection.set
    ).toHaveBeenCalledTimes(4);
  });
});
