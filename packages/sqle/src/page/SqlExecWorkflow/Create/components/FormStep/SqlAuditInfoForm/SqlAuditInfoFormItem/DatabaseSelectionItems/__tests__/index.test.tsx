import DatabaseSelectionItems from '..';
import { MockSharedStepDetail } from '../../../../../../hooks/mockData';
import { sqleSuperRender } from '../../../../../../../../../testUtils/superRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import instance from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance';
import system from '@actiontech/shared/lib/testUtil/mockApi/sqle/system';
import { act, fireEvent, renderHook, screen } from '@testing-library/react';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { instanceTipsMockData } from '@actiontech/shared/lib/testUtil/mockApi/sqle/instance/data';
import { mockDatabaseType } from '../../../../../../../../../testUtils/mockHooks/mockDatabaseType';
import { Form } from 'antd';
import { mockUseCurrentUser } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentUser';
import { useSelector } from 'react-redux';
import { TRANSIT_FROM_CONSTANT } from '@actiontech/shared/lib/data/common';
import { decompressFromEncodedURIComponent } from 'lz-string';
import { mockProjectInfo } from '@actiontech/shared/lib/testUtil/mockHook/data';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn()
}));

jest.mock('lz-string', () => ({
  ...jest.requireActual('lz-string'),
  decompressFromEncodedURIComponent: jest.fn()
}));

describe('test DatabaseSelectionItems', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentUser();
    mockUseCurrentProject();
    instance.getInstanceSchemas();
    instance.getInstance();
    instance.getInstanceTipList();
    system.getSystemModuleStatus();
    mockDatabaseType();
    (useSelector as jest.Mock).mockImplementation((e) =>
      e({
        sqlExecWorkflow: {
          versionFirstStageInstances: [
            {
              instances_name: instanceTipsMockData[1].instance_name,
              instances_id: instanceTipsMockData[1].instance_id
            }
          ]
        }
      })
    );
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('should match snapshot', async () => {
    const handleInstanceNameChangeSpy = jest.fn();
    const { result } = renderHook(() => Form.useForm());
    const { container, baseElement } = sqleSuperRender(
      <Form form={result.current[0]}>
        <DatabaseSelectionItems
          handleInstanceNameChange={handleInstanceNameChangeSpy}
          {...MockSharedStepDetail}
        />
      </Form>
    );

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();

    // select instance
    const instanceNameEle = getAllBySelector(
      '#databaseInfo_0_instanceName',
      baseElement
    )[0];
    fireEvent.mouseDown(instanceNameEle);
    const instanceNameLabel = `${instanceTipsMockData[0].instance_name}(${instanceTipsMockData[0].host}:${instanceTipsMockData[0].port})`;
    expect(screen.getByText(instanceNameLabel)).toBeInTheDocument();
    fireEvent.click(getBySelector(`div[title="${instanceNameLabel}"]`));
    await act(() => jest.advanceTimersByTime(0));

    expect(handleInstanceNameChangeSpy).toHaveBeenCalledTimes(1);
    expect(handleInstanceNameChangeSpy).toHaveBeenCalledWith('mysql-1');
  });

  it('should match snapshot when isAssociationVersionMode is truth', async () => {
    const handleInstanceNameChangeSpy = jest.fn();
    const { result } = renderHook(() => Form.useForm());
    const { container, baseElement } = sqleSuperRender(
      <Form form={result.current[0]}>
        <DatabaseSelectionItems
          handleInstanceNameChange={handleInstanceNameChangeSpy}
          {...MockSharedStepDetail}
        />
      </Form>,
      undefined,
      {
        routerProps: {
          initialEntries: [
            `/sqle/project/700300/exec-workflow/create?versionName=v1-test&versionId=1`
          ]
        }
      }
    );

    await act(async () => jest.advanceTimersByTime(3000));

    expect(container).toMatchSnapshot();

    const instanceNameEle = getAllBySelector(
      '#databaseInfo_0_instanceName',
      baseElement
    )[0];
    fireEvent.mouseDown(instanceNameEle);
    const notVersionInstanceNameLabel = `${instanceTipsMockData[0].instance_name}(${instanceTipsMockData[0].host}:${instanceTipsMockData[0].port})`;
    expect(
      screen.queryByText(notVersionInstanceNameLabel)
    ).not.toBeInTheDocument();
    const instanceNameLabel = `${instanceTipsMockData[1].instance_name}(${instanceTipsMockData[1].host}:${instanceTipsMockData[1].port})`;
    expect(screen.getByText(instanceNameLabel)).toBeInTheDocument();
    fireEvent.click(getBySelector(`div[title="${instanceNameLabel}"]`));
    await act(() => jest.advanceTimersByTime(0));

    expect(handleInstanceNameChangeSpy).toHaveBeenCalledTimes(1);
    expect(handleInstanceNameChangeSpy).toHaveBeenCalledWith(
      instanceTipsMockData[1].instance_name
    );
  });

  describe('cloudbeaver navigate', () => {
    it('should decompress compressionData from searchParams and populate form fields when cloud_beaver redirects to create a work order page', async () => {
      const getInstanceSpy = instance.getInstance();
      const getInstanceSchemaSpy = instance.getInstanceSchemas();
      const handleInstanceNameChangeSpy = jest.fn();
      const decompressDataSpy = decompressFromEncodedURIComponent as jest.Mock;
      const instanceName = 'mysql-1';
      const schema = 'dev';
      const sql = 'select * form t1 where id = 1';

      decompressDataSpy.mockReturnValue(
        JSON.stringify({ instanceName, schema, sql })
      );
      const { result } = renderHook(() => Form.useForm());
      const { container } = sqleSuperRender(
        <Form form={result.current[0]}>
          <DatabaseSelectionItems
            handleInstanceNameChange={handleInstanceNameChangeSpy}
            {...MockSharedStepDetail}
          />
        </Form>,
        undefined,
        {
          routerProps: {
            initialEntries: [
              `/exec-workflow?from=${TRANSIT_FROM_CONSTANT.cloudbeaver}&compression_data=data`
            ]
          }
        }
      );
      expect(getInstanceSpy).toHaveBeenCalledTimes(1);
      expect(getInstanceSpy).toHaveBeenCalledWith({
        instance_name: instanceName,
        project_name: mockProjectInfo.projectName
      });
      expect(decompressDataSpy).toHaveBeenCalledTimes(1);
      expect(decompressDataSpy).toHaveBeenCalledWith('data');
      expect(handleInstanceNameChangeSpy).toHaveBeenCalledTimes(1);
      expect(handleInstanceNameChangeSpy).toHaveBeenCalledWith(instanceName);
      expect(getInstanceSchemaSpy).toHaveBeenCalledTimes(1);
      expect(getInstanceSchemaSpy).toHaveBeenCalledWith({
        instance_name: instanceName,
        project_name: mockProjectInfo.projectName
      });

      expect(container).toMatchSnapshot();
    });

    it('should not perform any action if compressionData is not found in searchParams', () => {
      const handleInstanceNameChangeSpy = jest.fn();

      const { result } = renderHook(() => Form.useForm());
      sqleSuperRender(
        <Form form={result.current[0]}>
          <DatabaseSelectionItems
            handleInstanceNameChange={handleInstanceNameChangeSpy}
            {...MockSharedStepDetail}
          />
        </Form>,
        undefined,
        {
          routerProps: {
            initialEntries: [
              `/exec-workflow?from=${TRANSIT_FROM_CONSTANT.cloudbeaver}`
            ]
          }
        }
      );

      expect(handleInstanceNameChangeSpy).toHaveBeenCalledTimes(0);
    });

    it('should not perform any action if from is not  in TRANSIT_FROM_CONSTANT', () => {
      const handleInstanceNameChangeSpy = jest.fn();

      const { result } = renderHook(() => Form.useForm());
      sqleSuperRender(
        <Form form={result.current[0]}>
          <DatabaseSelectionItems
            handleInstanceNameChange={handleInstanceNameChangeSpy}
            {...MockSharedStepDetail}
          />
        </Form>,
        undefined,
        {
          routerProps: {
            initialEntries: [
              `/exec-workflow?from=${TRANSIT_FROM_CONSTANT.cloudbeaver}1&compression_data=data`
            ]
          }
        }
      );

      expect(handleInstanceNameChangeSpy).toHaveBeenCalledTimes(0);
    });
  });
});
