import DatabaseSelectionItems from '..';
import { MockSharedStepDetail } from '../../../../../../hooks/mockData';
import { superRender } from '../../../../../../../../../testUtils/customRender';
import { mockUseCurrentProject } from '@actiontech/shared/lib/testUtil/mockHook/mockUseCurrentProject';
import instance from '../../../../../../../../../testUtils/mockApi/instance';
import system from '../../../../../../../../../testUtils/mockApi/system';
import { act, fireEvent, renderHook, screen } from '@testing-library/react';
import {
  getAllBySelector,
  getBySelector
} from '@actiontech/shared/lib/testUtil/customQuery';
import { instanceTipsMockData } from '../../../../../../../../../testUtils/mockApi/instance/data';
import { mockDatabaseType } from '../../../../../../../../../testUtils/mockHooks/mockDatabaseType';
import { Form } from 'antd';

describe('test DatabaseSelectionItems', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockUseCurrentProject();
    instance.getInstanceSchemas();
    instance.getInstance();
    instance.getInstanceTipList();
    system.getSystemModuleStatus();
    mockDatabaseType();
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  it('should match snapshot', async () => {
    const handleInstanceNameChangeSpy = jest.fn();
    const { result } = renderHook(() => Form.useForm());
    const { container, baseElement } = superRender(
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
});
