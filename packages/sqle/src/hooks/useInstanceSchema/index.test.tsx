import { act, renderHook } from '@testing-library/react-hooks';
import {
  render,
  fireEvent,
  screen,
  act as reactAct,
  cleanup
} from '@testing-library/react';
import { resolveThreeSecond } from '../../testUtils/mockRequest';
import { Select } from 'antd';
import useInstanceSchema from '.';
import instance from '@actiontech/shared/lib/api/sqle/service/instance';

describe('useInstanceSchema', () => {
  const projectName = 'default';
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockRequest = () => {
    const spy = jest.spyOn(instance, 'getInstanceSchemasV1');
    return spy;
  };

  test('should get instance schema data from request', async () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond({ schema_name_list: ['schema1'] })
    );
    const { result, waitForNextUpdate } = renderHook(() =>
      useInstanceSchema(projectName, 'instanceId')
    );
    expect(result.current.loading).toBe(true);
    expect(result.current.schemaList).toEqual([]);
    const { baseElement } = render(
      <Select>{result.current.generateInstanceSchemaSelectOption()}</Select>
    );
    expect(baseElement).toMatchSnapshot();

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith({
      project_name: projectName,
      instance_name: 'instanceId'
    });
    expect(result.current.schemaList).toEqual([]);

    jest.advanceTimersByTime(3000);
    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(result.current.schemaList).toEqual(['schema1']);
    cleanup();

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateInstanceSchemaSelectOption()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('schema1');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should not request when use hooks without params', () => {
    const requestSpy = mockRequest();
    requestSpy.mockImplementation(() =>
      resolveThreeSecond({ schema_name_list: ['schema1'] })
    );
    const { result } = renderHook(() => useInstanceSchema(projectName));
    expect(result.current.loading).toBe(false);
    expect(requestSpy).not.toHaveBeenCalled();

    act(() => {
      result.current.updateSchemaList();
    });

    expect(result.current.loading).toBe(false);
    expect(requestSpy).not.toHaveBeenCalled();
  });
});
