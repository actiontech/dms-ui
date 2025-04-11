import useDataSourceSelectorTree from '../hooks/useDataSourceSelectorTree';
import instance from '../../../../testUtils/mockApi/instance';
import { renderHooksWithTheme } from '@actiontech/shared/lib/testUtil/customRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import { mockDatabaseType } from '../../../../testUtils/mockHooks/mockDatabaseType';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';
import { getInstanceTipListV2FunctionalModuleEnum } from '@actiontech/shared/lib/api/sqle/service/instance/index.enum';
import { instanceTipsMockData } from '../../../../testUtils/mockApi/instance/data';
import { act } from '@testing-library/react';

describe('useDataSourceSelectorTree', () => {
  let getInstanceTipsSpy: jest.SpyInstance;
  let getInstanceSchemaTipsSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    getInstanceTipsSpy = instance.getInstanceTipList();
    getInstanceSchemaTipsSpy = instance.getInstanceSchemas();
    jest.useFakeTimers();
    mockUseCurrentProject();
    mockDatabaseType();
    mockUseCurrentUser();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('should initialize data correctly', async () => {
    const { result } = renderHooksWithTheme(() => useDataSourceSelectorTree());

    expect(getInstanceTipsSpy).toHaveBeenCalledTimes(1);
    expect(getInstanceTipsSpy).toHaveBeenCalledWith({
      project_name: mockProjectInfo.projectName,
      functional_module:
        getInstanceTipListV2FunctionalModuleEnum.create_workflow
    });

    expect(result.current.getTreeDataPending).toBeTruthy();

    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.getTreeDataPending).toBeFalsy();

    expect(result.current.treeData).toHaveLength(
      instanceTipsMockData.length + 2
    ); // 2 db type +  instance
    expect(result.current.treeData).toMatchSnapshot();

    expect(result.current.treeExpandedKeys).toEqual(['MySQL', 'PostgreSQL']);
    expect(result.current.treeLoadedKeys).toEqual(['MySQL', 'PostgreSQL']);
    expect(result.current.selectedBaselineInstanceValue).toBeUndefined();
    expect(result.current.selectedComparisonInstanceValue).toBeUndefined();
  });

  it('should parse database comparison object correctly', () => {
    const { result } = renderHooksWithTheme(() => useDataSourceSelectorTree());

    expect(result.current.parse2DatabaseCompareObject(undefined)).toEqual({});

    expect(
      result.current.parse2DatabaseCompareObject(
        'instance1_INSTANCE_SCHEMA_SEPARATOR_schema1'
      )
    ).toEqual({
      instance_id: 'instance1',
      schema_name: 'schema1'
    });

    expect(result.current.parse2DatabaseCompareObject('instance1')).toEqual({
      instance_id: 'instance1'
    });
  });

  it('should get instance info by selected value', async () => {
    const { result } = renderHooksWithTheme(() => useDataSourceSelectorTree());
    await act(async () => jest.advanceTimersByTime(3000));

    expect(
      result.current.getInstanceInfoBySelectedValue(undefined)
    ).toBeUndefined();

    expect(
      result.current.getInstanceInfoBySelectedValue(
        `${instanceTipsMockData[0].instance_id}_INSTANCE_SCHEMA_SEPARATOR_schema1`
      )
    ).toEqual({
      instanceId: instanceTipsMockData[0].instance_id,
      schemaName: 'schema1',
      instanceName: instanceTipsMockData[0].instance_name,
      instanceType: instanceTipsMockData[0].instance_type
    });

    expect(
      result.current.getInstanceInfoBySelectedValue(
        instanceTipsMockData[1].instance_id
      )
    ).toEqual({
      instanceId: instanceTipsMockData[1].instance_id,
      instanceName: instanceTipsMockData[1].instance_name,
      instanceType: instanceTipsMockData[1].instance_type
    });
  });

  it('should disable tree nodes based on selection', async () => {
    const { result } = renderHooksWithTheme(() => useDataSourceSelectorTree());
    await act(async () => jest.advanceTimersByTime(3000));

    expect(result.current.disableTreeNodesBasedOnSelection()).toEqual(
      result.current.treeData
    );

    expect(
      result.current.disableTreeNodesBasedOnSelection('mockValue')
    ).toEqual(result.current.treeData);

    expect(
      result.current.disableTreeNodesBasedOnSelection(
        result.current.treeData[4].value
      )?.[4].disabled
    ).toBeTruthy();

    expect(
      result.current.disableTreeNodesBasedOnSelection(
        result.current.treeData[4].value
      )?.[3].disabled
    ).toBeFalsy();

    expect(
      result.current.disableTreeNodesBasedOnSelection(
        result.current.treeData[5].value
      )?.[5].disabled
    ).toBeTruthy();

    expect(
      result.current.disableTreeNodesBasedOnSelection(
        result.current.treeData[5].value
      )?.[4].disabled
    ).toBeTruthy();
  });
});
