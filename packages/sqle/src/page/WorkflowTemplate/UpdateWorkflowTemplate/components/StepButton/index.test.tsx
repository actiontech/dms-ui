import { superRender } from '@actiontech/shared/lib/testUtil/customRender';
import StepButton from '.';
import { fireEvent, screen } from '@testing-library/react';

describe('page/WorkflowTemplate/StepButton', () => {
  const prevMock = jest.fn();
  const nextMock = jest.fn();
  const customRender = (data?: { [key: string]: number | (() => void) }) => {
    return superRender(
      <StepButton
        currentStep={0}
        totalStep={0}
        prevStep={prevMock}
        nextStep={nextMock}
        {...(data ?? {})}
      />
    );
  };

  it('render step button with no button', async () => {
    const { baseElement } = customRender();
    expect(baseElement).toMatchSnapshot();
  });

  it('render step button with no prev button', async () => {
    const { baseElement } = customRender({ totalStep: 1 });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('下一步')).toBeInTheDocument();
    fireEvent.click(screen.getByText('下一步'));
    expect(nextMock).toBeCalled();
  });

  it('render step button with prev button and next button', async () => {
    const { baseElement } = customRender({ currentStep: 1, totalStep: 3 });
    expect(baseElement).toMatchSnapshot();
    expect(screen.getByText('上一步')).toBeInTheDocument();
    expect(screen.getByText('下一步')).toBeInTheDocument();
    fireEvent.click(screen.getByText('上一步'));
    expect(prevMock).toBeCalled();
  });
});
