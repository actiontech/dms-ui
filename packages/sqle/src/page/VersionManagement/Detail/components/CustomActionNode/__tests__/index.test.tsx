import { cleanup, act, screen, fireEvent } from '@testing-library/react';
import { superRender } from '../../../../../..//testUtils/customRender';
import CustomActionNode from '../index';

describe('sqle/VersionManagement/Detail/CustomActionNode', () => {
  const mockExecute = jest.fn();
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    cleanup();
  });

  const customRender = (allowExecute = false) => {
    return superRender(
      <CustomActionNode
        id="test-custom-action-node"
        type="action-node"
        dragging
        selectable
        deletable
        draggable
        selected
        isConnectable={false}
        positionAbsoluteX={0}
        positionAbsoluteY={0}
        zIndex={0}
        data={{
          allowExecute,
          onExecute: mockExecute,
          stageId: 1
        }}
      />
    );
  };

  it('render allowExecute is false', async () => {
    const { baseElement } = customRender();
    expect(screen.getByText('上线').closest('button')).toBeDisabled();
    await act(async () => {
      fireEvent.mouseOver(screen.getByText('上线'));
      await jest.advanceTimersByTime(300);
    });
    expect(baseElement).toMatchSnapshot();
    expect(
      screen.getByText(
        '工单将按顺序依次上线，请确保下一个工单已具备上线条件后再尝试上线操作。'
      )
    ).toBeInTheDocument();
  });

  it('render allowExecute is true', async () => {
    const { baseElement } = customRender(true);
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('上线').closest('button')).not.toBeDisabled();
    fireEvent.click(screen.getByText('上线'));
    await act(async () => jest.advanceTimersByTime(0));
    expect(mockExecute).toHaveBeenCalledTimes(1);
  });
});
