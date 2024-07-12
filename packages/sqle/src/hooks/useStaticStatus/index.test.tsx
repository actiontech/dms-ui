import { renderHook } from '@testing-library/react-hooks';
import {
  render,
  fireEvent,
  screen,
  act as reactAct
} from '@testing-library/react';

import { Select } from 'antd';
import useStaticStatus from '.';

describe('useRuleTemplate', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should render static option for audit status', async () => {
    const { result } = renderHook(() => useStaticStatus());

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateAuditStatusSelectOption()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('准备审核');
    expect(baseElementWithOptions).toMatchSnapshot();
  });

  test('should render static option for exec status', async () => {
    const { result } = renderHook(() => useStaticStatus());

    const { baseElement: baseElementWithOptions } = render(
      <Select data-testid="testId" value="value1">
        {result.current.generateExecStatusSelectOption()}
      </Select>
    );
    expect(baseElementWithOptions).toMatchSnapshot();

    reactAct(() => {
      fireEvent.mouseDown(screen.getByText('value1'));
      jest.runAllTimers();
    });

    await screen.findAllByText('准备执行');
    expect(baseElementWithOptions).toMatchSnapshot();
  });
});
