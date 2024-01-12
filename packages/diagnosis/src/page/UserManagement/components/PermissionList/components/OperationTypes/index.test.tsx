import { act, cleanup, fireEvent, screen } from '@testing-library/react';
import { superRender } from '../../../../../../testUtils/customRender';
import OperationTypes, { ALL_Operation } from './index';

describe('diagnosis/OperationTypes', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    cleanup();
  });

  it('render normal type filter', async () => {
    const clickMock = jest.fn();
    const { container } = superRender(
      <OperationTypes
        typeData={['1', '2', '3']}
        currentType={ALL_Operation}
        setOperationType={clickMock}
      />
    );
    await act(async () => jest.advanceTimersByTime(1000));
    expect(container).toMatchSnapshot();
    expect(screen.getByText('ALL')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    fireEvent.click(screen.getByText('1'));
    expect(clickMock).toBeCalled();
    fireEvent.click(screen.getByText('ALL'));
    expect(clickMock).toBeCalled();
  });
});
